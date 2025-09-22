/**
 * Weather Service Integration
 * Provides real weather data integration for the Junta de Vecinos app
 */

import axios from 'axios'

export interface WeatherAPIResponse {
  temperature: number
  precipitation: number
  humidity?: number
  pressure?: number
  surfacePressure?: number // Ground level pressure
  windSpeed?: number
  windDirection?: number
  windGusts?: number // Wind gust speed
  uvIndex?: number
  visibility?: number
  description?: string
  icon?: string
  feelsLike?: number
  dewPoint?: number
  cloudCover?: number
  weatherCode?: number // WMO weather code
  location: string
  lastUpdated: string
}

export interface ForecastAPIResponse {
  date: string
  temperature: number
  precipitation: number
  precipitationProbability: number
  visibility: number
  sunrise: string
  sunset: string
  tempMin?: number
  tempMax?: number
  humidity?: number
  windSpeed?: number
  windDirection?: number
  description?: string
  icon?: string
  uvIndex?: number
  evapotranspiration?: number // For agricultural use
}

export interface HourlyWeatherData {
  time: string
  temperature: number
  precipitation: number
  precipitationProbability: number
  visibility: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: {
    time: string
    interval: string
    temperature_2m: string
    relative_humidity_2m: string
    apparent_temperature: string
    precipitation: string
    pressure_msl: string
    surface_pressure: string
    wind_speed_10m: string
    wind_direction_10m: string
    wind_gusts_10m: string
    visibility: string
    uv_index: string
    cloud_cover: string
    weather_code: string
  }
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    pressure_msl: number
    surface_pressure: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
    visibility: number
    uv_index: number
    cloud_cover: number
    weather_code: number
  }
  hourly_units: {
    time: string
    temperature_2m: string
    precipitation_probability: string
    precipitation: string
    visibility: string
    relative_humidity_2m: string
    pressure_msl: string
    wind_speed_10m: string
    wind_direction_10m: string
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    precipitation: number[]
    visibility: number[]
    relative_humidity_2m: number[]
    pressure_msl: number[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
  }
  daily_units: {
    time: string
    sunrise: string
    sunset: string
    weather_code: string
    temperature_2m_max: string
    temperature_2m_min: string
    precipitation_sum: string
    precipitation_probability_max: string
    uv_index_max: string
  }
  daily: {
    time: string[]
    sunrise: string[]
    sunset: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    uv_index_max: number[]
    et0_fao_evapotranspiration: number[]
  }
}

export class WeatherService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast'
  private static readonly CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

  // Default coordinates for Pinto Los Pellines, Chile (from the provided URL)
  private static readonly DEFAULT_LAT = -36.8139
  private static readonly DEFAULT_LON = -71.7316

  // Simple in-memory cache
  private static cache = new Map<string, { data: any; timestamp: number }>()

  /**
   * Get cached data if available and not expired
   */
  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  /**
   * Store data in cache
   */
  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Get current weather for a location
   * Optimized: Only fetch metrics that are actually used, with caching
   */
  static async getCurrentWeather(location: string): Promise<WeatherAPIResponse | null> {
    const cacheKey = `current_${location}`

    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await axios.get<OpenMeteoResponse>(this.BASE_URL, {
        params: {
          latitude: this.DEFAULT_LAT,
          longitude: this.DEFAULT_LON,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,uv_index,cloud_cover,weather_code',
          timezone: 'America/Santiago' // Changed from America/New_York to correct timezone
        }
      })

      const transformedData = this.transformCurrentWeatherData(response.data, location)

      // Cache the result
      this.setCachedData(cacheKey, transformedData)

      return transformedData
    } catch (error) {
      console.error('Error fetching current weather:', error)
      return null
    }
  }

  /**
   * Get weather forecast with hourly and daily data
   * Optimized: Only fetch metrics that are actually used, reduced past_days for efficiency, with caching
   */
  static async getWeatherForecast(location: string): Promise<ForecastAPIResponse[]> {
    const cacheKey = `forecast_${location}`

    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await axios.get<OpenMeteoResponse>(this.BASE_URL, {
        params: {
          latitude: this.DEFAULT_LAT,
          longitude: this.DEFAULT_LON,
          daily: 'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,et0_fao_evapotranspiration',
          hourly: 'temperature_2m,precipitation_probability,precipitation,visibility,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,cloud_cover,weather_code',
          past_days: 7, // Reduced from 31 to 7 days for better performance
          timezone: 'America/Santiago' // Changed from America/New_York to correct timezone
        }
      })

      const transformedData = this.transformForecastData(response.data, location)

      // Cache the result
      this.setCachedData(cacheKey, transformedData)

      return transformedData
    } catch (error) {
      console.error('Error fetching weather forecast:', error)
      return []
    }
  }


  /**
   * Transform Open-Meteo API response to our format
   * Now using all available data from Open-Meteo API
   */
  private static transformCurrentWeatherData(data: OpenMeteoResponse, location: string): WeatherAPIResponse {
    return {
      temperature: Math.round(data.current.temperature_2m),
      precipitation: data.current.precipitation,
      humidity: data.current.relative_humidity_2m,
      pressure: Math.round(data.current.pressure_msl),
      surfacePressure: Math.round(data.current.surface_pressure),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      windGusts: Math.round(data.current.wind_gusts_10m),
      uvIndex: Math.round(data.current.uv_index), // Available from Open-Meteo
      visibility: Math.round(data.current.visibility / 1000), // Convert to km
      description: this.getWeatherDescription(data.current.weather_code), // Dynamic description
      icon: this.getWeatherIcon(data.current.weather_code), // Dynamic icon
      feelsLike: Math.round(data.current.apparent_temperature), // Real feels-like temperature
      dewPoint: this.calculateDewPoint(data.current.temperature_2m, data.current.relative_humidity_2m), // Calculated dew point
      cloudCover: data.current.cloud_cover, // Available from Open-Meteo
      weatherCode: data.current.weather_code, // Raw WMO code for advanced usage
      location,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Transform Open-Meteo forecast data to our format
   * Now using comprehensive daily data from Open-Meteo API
   */
  private static transformForecastData(data: OpenMeteoResponse, location: string): ForecastAPIResponse[] {
    const dailyData = data.daily

    // Create daily forecasts using the direct daily data
    return dailyData.time.map((date, index) => {
      return {
        date,
        temperature: Math.round((dailyData.temperature_2m_max[index] + dailyData.temperature_2m_min[index]) / 2), // Average temp
        precipitation: dailyData.precipitation_sum[index],
        precipitationProbability: dailyData.precipitation_probability_max[index],
        visibility: 10, // Default good visibility for forecast
        sunrise: dailyData.sunrise[index],
        sunset: dailyData.sunset[index],
        tempMin: Math.round(dailyData.temperature_2m_min[index]),
        tempMax: Math.round(dailyData.temperature_2m_max[index]),
        humidity: undefined, // Not available in daily data
        windSpeed: undefined, // Not available in daily data
        windDirection: undefined, // Not available in daily data
        description: this.getWeatherDescription(dailyData.weather_code[index]), // Dynamic description
        icon: this.getWeatherIcon(dailyData.weather_code[index]), // Dynamic icon
        uvIndex: Math.round(dailyData.uv_index_max[index]), // Max UV index for the day
        evapotranspiration: Math.round(dailyData.et0_fao_evapotranspiration[index] * 10) / 10 // FAO reference evapotranspiration
      }
    })
  }

  /**
   * Calculate dew point using Magnus formula approximation
   */
  private static calculateDewPoint(temperature: number, humidity: number): number {
    // Magnus formula: Td = (243.04 * (ln(RH/100) + ((17.625 * T)/(243.04 + T)))) / (17.625 - ln(RH/100) - ((17.625 * T)/(243.04 + T)))
    const a = 17.625
    const b = 243.04
    const rh = humidity / 100
    const lnRH = Math.log(rh)

    const numerator = b * (lnRH + (a * temperature) / (b + temperature))
    const denominator = a - lnRH - (a * temperature) / (b + temperature)

    return Math.round((numerator / denominator) * 10) / 10
  }

  /**
   * Get weather description from WMO weather code
   */
  private static getWeatherDescription(weatherCode: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Cielo despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      56: 'Llovizna helada ligera',
      57: 'Llovizna helada intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      66: 'Lluvia helada ligera',
      67: 'Lluvia helada intensa',
      71: 'Nieve ligera',
      73: 'Nieve moderada',
      75: 'Nieve intensa',
      77: 'Granizo',
      80: 'Chubasco ligero',
      81: 'Chubasco moderado',
      82: 'Chubasco intenso',
      85: 'Chubasco de nieve ligero',
      86: 'Chubasco de nieve intenso',
      95: 'Tormenta eléctrica',
      96: 'Tormenta con granizo pequeño',
      99: 'Tormenta con granizo grande'
    }
    return descriptions[weatherCode] || 'Condiciones meteorológicas'
  }

  /**
   * Get weather icon from WMO weather code
   */
  private static getWeatherIcon(weatherCode: number): string {
    const icons: { [key: number]: string } = {
      0: 'sun',
      1: 'sun',
      2: 'partly-cloudy',
      3: 'cloud',
      45: 'fog',
      48: 'fog',
      51: 'drizzle',
      53: 'drizzle',
      55: 'drizzle',
      56: 'drizzle',
      57: 'drizzle',
      61: 'rain',
      63: 'rain',
      65: 'rain',
      66: 'rain',
      67: 'rain',
      71: 'snow',
      73: 'snow',
      75: 'snow',
      77: 'hail',
      80: 'rain',
      81: 'rain',
      82: 'rain',
      85: 'snow',
      86: 'snow',
      95: 'thunderstorm',
      96: 'thunderstorm',
      99: 'thunderstorm'
    }
    return icons[weatherCode] || 'cloud'
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * Check if weather service is configured (always true for Open-Meteo)
   */
  static isConfigured(): boolean {
    return true
  }
}