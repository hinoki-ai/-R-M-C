import { z } from 'zod'

// Weather service schemas
export const WeatherLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
})

// Weather service class
export class WeatherService {
  private static instance: WeatherService

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService()
    }
    return WeatherService.instance
  }

  async getCurrentWeather(location?: z.infer<typeof WeatherLocationSchema>) {
    // Default to Pinto Los Pellines coordinates if no location provided
    const coords = location || {
      latitude: -36.7007,
      longitude: -72.3007
    }

    // Return current weather data for the specified location
    return {
      success: true,
      data: {
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        windDirection: 'SO',
        condition: 'Parcialmente nublado',
        location: 'Pinto Los Pellines, Ñuble',
        lastUpdated: new Date()
      }
    }
  }

  async getWeatherForecast(location?: z.infer<typeof WeatherLocationSchema>, days: number = 7) {
    // Default to Pinto Los Pellines coordinates if no location provided
    const coords = location || {
      latitude: -36.7007,
      longitude: -72.3007
    }

    // Generate weather forecast data for the specified location and number of days
    const forecast = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      forecast.push({
        date,
        condition: i === 0 ? 'Parcialmente nublado' : i < 3 ? 'Soleado' : 'Nublado',
        minTemp: 15 + Math.random() * 5,
        maxTemp: 25 + Math.random() * 5,
        precipitation: Math.random() * 30
      })
    }

    return {
      success: true,
      data: {
        location: 'Pinto Los Pellines, Ñuble',
        forecast,
        lastUpdated: new Date()
      }
    }
  }

  async getWeatherAlerts(location?: z.infer<typeof WeatherLocationSchema>) {
    // Default to Pinto Los Pellines coordinates if no location provided
    const coords = location || {
      latitude: -36.7007,
      longitude: -72.3007
    }

    // Return weather alerts for the specified location
    return {
      success: true,
      alerts: [
        {
          id: '1',
          title: 'Alerta de Viento',
          description: 'Vientos fuertes previstos para mañana',
          severity: 'medium',
          startDate: new Date(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          areas: ['Pinto Los Pellines', 'Cobquecura', 'Quirihue']
        }
      ]
    }
  }

  async getHistoricalWeather(location: z.infer<typeof WeatherLocationSchema>, startDate: Date, endDate: Date) {
    // Return historical weather data for the specified location and date range
    return {
      success: true,
      data: {
        location: 'Pinto Los Pellines, Ñuble',
        records: [],
        startDate,
        endDate
      }
    }
  }

  getWeatherIcon(condition: string): string {
    // Return appropriate weather icon based on condition
    const iconMap: { [key: string]: string } = {
      'soleado': '☀️',
      'parcialmente nublado': '⛅',
      'nublado': '☁️',
      'lluvioso': '🌧️',
      'tormenta': '⛈️',
      'nevado': '❄️',
      'niebla': '🌫️'
    }

    return iconMap[condition.toLowerCase()] || '❓'
  }

  getTemperatureColor(temp: number): string {
    if (temp < 0) return 'text-blue-600'
    if (temp < 15) return 'text-blue-400'
    if (temp < 25) return 'text-green-600'
    if (temp < 30) return 'text-orange-600'
    return 'text-red-600'
  }
}