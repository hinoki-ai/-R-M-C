/**
 * Weather Service Integration
 * Provides real weather data integration for the Junta de Vecinos app
 */

import axios from 'axios'

export interface WeatherAPIResponse {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  precipitation: number
  uvIndex: number
  visibility: number
  description: string
  icon: string
  feelsLike: number
  dewPoint: number
  cloudCover: number
  location: string
  lastUpdated: string
}

export interface ForecastAPIResponse {
  date: string
  tempMin: number
  tempMax: number
  humidity: number
  precipitation: number
  precipitationProbability: number
  windSpeed: number
  windDirection: number
  description: string
  icon: string
  uvIndex: number
  sunrise: string
  sunset: string
}

export class WeatherService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5'
  private static readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0'

  /**
   * Get current weather for a location
   */
  static async getCurrentWeather(location: string): Promise<WeatherAPIResponse | null> {
    try {
      // First, get coordinates for the location
      const coords = await this.getCoordinates(location)
      if (!coords) return null

      const response = await axios.get(`${this.BASE_URL}/weather`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.API_KEY,
          units: 'metric',
          lang: 'es'
        }
      })

      return this.transformCurrentWeatherData(response.data, location)
    } catch (error) {
      console.error('Error fetching current weather:', error)
      return null
    }
  }

  /**
   * Get 7-day weather forecast
   */
  static async getWeatherForecast(location: string): Promise<ForecastAPIResponse[]> {
    try {
      const coords = await this.getCoordinates(location)
      if (!coords) return []

      const response = await axios.get(`${this.BASE_URL}/forecast`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.API_KEY,
          units: 'metric',
          lang: 'es',
          cnt: 40 // Get 5-day forecast with 3-hour intervals
        }
      })

      return this.transformForecastData(response.data.list, location)
    } catch (error) {
      console.error('Error fetching weather forecast:', error)
      return []
    }
  }

  /**
   * Get coordinates for a location name
   */
  private static async getCoordinates(location: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await axios.get(`${this.GEO_URL}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: this.API_KEY
        }
      })

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0]
        return { lat, lon }
      }

      return null
    } catch (error) {
      console.error('Error getting coordinates:', error)
      return null
    }
  }

  /**
   * Transform OpenWeather API response to our format
   */
  private static transformCurrentWeatherData(data: any, location: string): WeatherAPIResponse {
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg || 0,
      precipitation: data.rain?.['1h'] || 0,
      uvIndex: 0, // UV index not available in current weather endpoint
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
      description: data.weather[0].description,
      icon: this.mapWeatherIcon(data.weather[0].icon),
      feelsLike: Math.round(data.main.feels_like),
      dewPoint: this.calculateDewPoint(data.main.temp, data.main.humidity),
      cloudCover: data.clouds?.all || 0,
      location,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Transform forecast data
   */
  private static transformForecastData(data: any[], location: string): ForecastAPIResponse[] {
    const dailyForecasts: { [key: string]: any[] } = {}

    // Group by date
    data.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = []
      }
      dailyForecasts[date].push(item)
    })

    // Process each day's data
    return Object.entries(dailyForecasts)
      .slice(0, 7) // Limit to 7 days
      .map(([date, items]) => {
        const temps = items.map(item => item.main.temp)
        const humidities = items.map(item => item.main.humidity)
        const windSpeeds = items.map(item => item.wind.speed)
        const precipitations = items.map(item => item.rain?.['3h'] || 0)
        const weatherDescriptions = items.map(item => item.weather[0])

        // Use midday weather for the day (around 12:00)
        const middayWeather = items.find(item => {
          const hour = new Date(item.dt * 1000).getHours()
          return hour >= 11 && hour <= 13
        }) || items[0]

        return {
          date,
          tempMin: Math.round(Math.min(...temps)),
          tempMax: Math.round(Math.max(...temps)),
          humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
          precipitation: Math.round(precipitations.reduce((a, b) => a + b, 0) * 100) / 100,
          precipitationProbability: Math.round(
            (weatherDescriptions.filter(w => w.main === 'Rain').length / weatherDescriptions.length) * 100
          ),
          windSpeed: Math.round((windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length) * 3.6),
          windDirection: middayWeather.wind.deg || 0,
          description: middayWeather.weather[0].description,
          icon: this.mapWeatherIcon(middayWeather.weather[0].icon),
          uvIndex: 5, // Default UV index
          sunrise: '07:00', // Would need separate API call for accurate sunrise/sunset
          sunset: '19:00'
        }
      })
  }

  /**
   * Map OpenWeather icons to our icon format
   */
  private static mapWeatherIcon(openWeatherIcon: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'sunny',
      '01n': 'clear',
      '02d': 'partly-cloudy',
      '02n': 'partly-cloudy',
      '03d': 'partly-cloudy',
      '03n': 'partly-cloudy',
      '04d': 'cloudy',
      '04n': 'cloudy',
      '09d': 'rain',
      '09n': 'rain',
      '10d': 'rain',
      '10n': 'rain',
      '11d': 'heavy-rain',
      '11n': 'heavy-rain',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'fog',
      '50n': 'fog'
    }

    return iconMap[openWeatherIcon] || 'partly-cloudy'
  }

  /**
   * Calculate dew point
   */
  private static calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27
    const b = 237.7
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100)
    return Math.round((b * alpha) / (a - alpha))
  }

  /**
   * Check if API key is configured
   */
  static isConfigured(): boolean {
    return Boolean(this.API_KEY)
  }
}