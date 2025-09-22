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
  windSpeed?: number
  windDirection?: number
  uvIndex?: number
  visibility?: number
  description?: string
  icon?: string
  feelsLike?: number
  dewPoint?: number
  cloudCover?: number
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
    precipitation: string
    relative_humidity_2m: string
    pressure_msl: string
    wind_speed_10m: string
    wind_direction_10m: string
    visibility: string
  }
  current: {
    time: string
    interval: number
    temperature_2m: number
    precipitation: number
    relative_humidity_2m: number
    pressure_msl: number
    wind_speed_10m: number
    wind_direction_10m: number
    visibility: number
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
  }
  daily: {
    time: string[]
    sunrise: string[]
    sunset: string[]
  }
}

export class WeatherService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast'

  // Default coordinates for Pinto Los Pellines, Chile (from the provided URL)
  private static readonly DEFAULT_LAT = -36.8139
  private static readonly DEFAULT_LON = -71.7316

  /**
   * Get current weather for a location
   */
  static async getCurrentWeather(location: string): Promise<WeatherAPIResponse | null> {
    try {
      const response = await axios.get<OpenMeteoResponse>(this.BASE_URL, {
        params: {
          latitude: this.DEFAULT_LAT,
          longitude: this.DEFAULT_LON,
          current: 'temperature_2m,precipitation,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,visibility',
          timezone: 'America/New_York'
        }
      })

      return this.transformCurrentWeatherData(response.data, location)
    } catch (error) {
      console.error('Error fetching current weather:', error)
      return null
    }
  }

  /**
   * Get weather forecast with hourly and daily data
   */
  static async getWeatherForecast(location: string): Promise<ForecastAPIResponse[]> {
    try {
      const response = await axios.get<OpenMeteoResponse>(this.BASE_URL, {
        params: {
          latitude: this.DEFAULT_LAT,
          longitude: this.DEFAULT_LON,
          daily: 'sunrise,sunset',
          hourly: 'temperature_2m,precipitation_probability,precipitation,visibility,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m',
          past_days: 31,
          timezone: 'America/New_York'
        }
      })

      return this.transformForecastData(response.data, location)
    } catch (error) {
      console.error('Error fetching weather forecast:', error)
      return []
    }
  }


  /**
   * Transform Open-Meteo API response to our format
   */
  private static transformCurrentWeatherData(data: OpenMeteoResponse, location: string): WeatherAPIResponse {
    return {
      temperature: Math.round(data.current.temperature_2m),
      precipitation: data.current.precipitation,
      humidity: data.current.relative_humidity_2m,
      pressure: Math.round(data.current.pressure_msl),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      uvIndex: undefined, // Not available from Open-Meteo
      visibility: Math.round(data.current.visibility / 1000), // Convert to km
      description: 'Current weather', // Generic description
      icon: 'partly-cloudy', // Default icon
      feelsLike: Math.round(data.current.temperature_2m), // Approximate with current temp
      dewPoint: undefined, // Not available
      cloudCover: undefined, // Not available from Open-Meteo
      location,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Transform Open-Meteo forecast data to our format
   */
  private static transformForecastData(data: OpenMeteoResponse, location: string): ForecastAPIResponse[] {
    const dailyData = data.daily
    const hourlyData = data.hourly

    // Group hourly data by date
    const hourlyByDate: { [key: string]: HourlyWeatherData[] } = {}
    hourlyData.time.forEach((timeStr, index) => {
      const date = timeStr.split('T')[0]
      if (!hourlyByDate[date]) {
        hourlyByDate[date] = []
      }
      hourlyByDate[date].push({
        time: timeStr,
        temperature: hourlyData.temperature_2m[index],
        precipitation: hourlyData.precipitation[index],
        precipitationProbability: hourlyData.precipitation_probability[index],
        visibility: hourlyData.visibility[index],
        humidity: hourlyData.relative_humidity_2m[index],
        pressure: hourlyData.pressure_msl[index],
        windSpeed: hourlyData.wind_speed_10m[index],
        windDirection: hourlyData.wind_direction_10m[index]
      })
    })

    // Create daily forecasts
    return dailyData.time.map((date, index) => {
      const dayHourly = hourlyByDate[date] || []

      // Calculate daily aggregates
      const temperatures = dayHourly.map(h => h.temperature)
      const precipitations = dayHourly.map(h => h.precipitation)
      const precipitationProbabilities = dayHourly.map(h => h.precipitationProbability)
      const visibilities = dayHourly.map(h => h.visibility)
      const humidities = dayHourly.map(h => h.humidity)
      const pressures = dayHourly.map(h => h.pressure)
      const windSpeeds = dayHourly.map(h => h.windSpeed)
      const windDirections = dayHourly.map(h => h.windDirection)

      const avgTemperature = temperatures.length > 0
        ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length
        : 0

      const minTemperature = temperatures.length > 0 ? Math.min(...temperatures) : 0
      const maxTemperature = temperatures.length > 0 ? Math.max(...temperatures) : 0

      const totalPrecipitation = precipitations.length > 0
        ? precipitations.reduce((a, b) => a + b, 0)
        : 0

      const maxPrecipitationProbability = precipitationProbabilities.length > 0
        ? Math.max(...precipitationProbabilities)
        : 0

      const avgVisibility = visibilities.length > 0
        ? visibilities.reduce((a, b) => a + b, 0) / visibilities.length
        : 10000

      const avgHumidity = humidities.length > 0
        ? humidities.reduce((a, b) => a + b, 0) / humidities.length
        : undefined

      const avgPressure = pressures.length > 0
        ? pressures.reduce((a, b) => a + b, 0) / pressures.length
        : undefined

      const avgWindSpeed = windSpeeds.length > 0
        ? windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length
        : undefined

      const dominantWindDirection = windDirections.length > 0
        ? windDirections[Math.floor(windDirections.length / 2)] // Use median direction
        : undefined

      return {
        date,
        temperature: Math.round(avgTemperature),
        precipitation: Math.round(totalPrecipitation * 100) / 100,
        precipitationProbability: Math.round(maxPrecipitationProbability),
        visibility: Math.round(avgVisibility / 1000), // Convert to km
        sunrise: dailyData.sunrise[index],
        sunset: dailyData.sunset[index],
        tempMin: Math.round(minTemperature),
        tempMax: Math.round(maxTemperature),
        humidity: avgHumidity ? Math.round(avgHumidity) : undefined,
        windSpeed: avgWindSpeed ? Math.round(avgWindSpeed) : undefined,
        windDirection: dominantWindDirection,
        description: 'Weather forecast', // Generic description
        icon: 'partly-cloudy', // Default icon
        uvIndex: undefined // Not available
      }
    })
  }

  /**
   * Check if weather service is configured (always true for Open-Meteo)
   */
  static isConfigured(): boolean {
    return true
  }
}