import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { WeatherService } from '@/lib/services/weather-service'
import { WeatherAlert, WeatherData, WeatherForecast } from '@/types/dashboard'

interface WeatherStats {
  total: number
  averageTemperature: number
  averageHumidity: number
  totalAlerts: number
  activeAlerts: number
}

interface WeatherMutationData {
  timestamp: number
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
  source: 'api' | 'manual' | 'sensor'
}

interface WeatherAlertData {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  type: 'storm' | 'heat' | 'cold' | 'flood' | 'wind' | 'other'
  startTime: number
  endTime: number
  areas: string[]
  instructions: string
}

interface WeatherForecastData {
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
  location: string
  source: 'api' | 'manual'
}

interface UseWeatherDataReturn {
  weatherData: WeatherData | null
  forecast: WeatherForecast[] | null
  alerts: WeatherAlert[] | null
  loading: boolean
  error: string | null
  stats: WeatherStats | null
  // Mutations
  addWeatherData: (data: WeatherMutationData) => Promise<string>
  updateWeatherData: (id: string, updates: Partial<WeatherMutationData>) => Promise<void>
  deleteWeatherData: (id: string) => Promise<void>
  createAlert: (alert: WeatherAlertData) => Promise<string>
  updateAlert: (id: string, updates: Partial<WeatherAlertData>) => Promise<void>
  deleteAlert: (id: string) => Promise<void>
  addForecast: (forecast: WeatherForecastData) => Promise<string>
  updateForecast: (id: string, updates: Partial<WeatherForecastData>) => Promise<void>
  deleteForecast: (id: string) => Promise<void>
}

export function useWeatherData(location = 'Pinto Los Pellines, Ñuble'): UseWeatherDataReturn {
  const [realWeatherData, setRealWeatherData] = useState<WeatherData | null>(null)
  const [realForecast, setRealForecast] = useState<WeatherForecast[] | null>(null)
  const [isLoadingRealData, setIsLoadingRealData] = useState(false)

  // Queries for stored data
  const storedWeatherData = useQuery(api.weather.getCurrentWeather, { location })
  const storedForecast = useQuery(api.weather.getWeatherForecasts, {
    location,
    days: 7
  })
  const alerts = useQuery(api.weather.getWeatherAlerts, {
    activeOnly: true,
    limit: 10
  })
  const stats = useQuery(api.weather.getWeatherStats, {
    location,
    days: 30
  })

  // Mutations
  const addWeatherDataMutation = useMutation(api.weather.addWeatherData)
  const updateWeatherDataMutation = useMutation(api.weather.updateWeatherData)
  const deleteWeatherDataMutation = useMutation(api.weather.deleteWeatherData)

  const createAlertMutation = useMutation(api.weather.createWeatherAlert)
  const updateAlertMutation = useMutation(api.weather.updateWeatherAlert)
  const deleteAlertMutation = useMutation(api.weather.deleteWeatherAlert)

  const addForecastMutation = useMutation(api.weather.addWeatherForecast)
  const updateForecastMutation = useMutation(api.weather.updateWeatherForecast)
  const deleteForecastMutation = useMutation(api.weather.deleteWeatherForecast)

  // Use real data if available, otherwise fallback to stored data
  const weatherData = realWeatherData || storedWeatherData
  const forecast = realForecast || storedForecast

  // Calculate stats from current data
  const calculatedStats: WeatherStats | null = weatherData && forecast && alerts ? {
    total: 1,
    averageTemperature: weatherData.temperature,
    averageHumidity: weatherData.humidity,
    totalAlerts: alerts.length,
    activeAlerts: alerts.filter(alert => alert.isActive).length,
  } : null

  // Fetch real weather data on mount
  useEffect(() => {
    const fetchRealWeatherData = async () => {
      if (!WeatherService.isConfigured()) return

      setIsLoadingRealData(true)
      try {
        const [currentWeather, forecastData] = await Promise.all([
          WeatherService.getCurrentWeather(location),
          WeatherService.getWeatherForecast(location)
        ])

        if (currentWeather) {
          setRealWeatherData({
            id: 'real-time',
            timestamp: currentWeather.lastUpdated,
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity,
            pressure: currentWeather.pressure,
            windSpeed: currentWeather.windSpeed,
            windDirection: currentWeather.windDirection,
            precipitation: currentWeather.precipitation,
            uvIndex: currentWeather.uvIndex,
            visibility: currentWeather.visibility,
            description: currentWeather.description,
            icon: currentWeather.icon,
            feelsLike: currentWeather.feelsLike,
            dewPoint: currentWeather.dewPoint,
            cloudCover: currentWeather.cloudCover,
            location: currentWeather.location,
            source: 'api',
            isHistorical: false
          })

          // Store in database for caching
          await addWeatherDataMutation({
            timestamp: Date.now(),
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity,
            pressure: currentWeather.pressure,
            windSpeed: currentWeather.windSpeed,
            windDirection: currentWeather.windDirection,
            precipitation: currentWeather.precipitation,
            uvIndex: currentWeather.uvIndex,
            visibility: currentWeather.visibility,
            description: currentWeather.description,
            icon: currentWeather.icon,
            feelsLike: currentWeather.feelsLike,
            dewPoint: currentWeather.dewPoint,
            cloudCover: currentWeather.cloudCover,
            location: currentWeather.location,
            source: 'api'
          })
        }

        if (forecastData && forecastData.length > 0) {
          const forecastArray: WeatherForecast[] = forecastData.map((item, index) => ({
            id: `forecast-${index}`,
            date: item.date,
            tempMin: item.tempMin,
            tempMax: item.tempMax,
            humidity: item.humidity,
            precipitation: item.precipitation,
            precipitationProbability: item.precipitationProbability,
            windSpeed: item.windSpeed,
            windDirection: item.windDirection,
            description: item.description,
            icon: item.icon,
            uvIndex: item.uvIndex,
            sunrise: item.sunrise,
            sunset: item.sunset,
            location: location,
            source: 'api',
            updatedAt: new Date().toISOString()
          }))

          setRealForecast(forecastArray)

          // Store forecast data in database
          for (const forecast of forecastData) {
            await addForecastMutation({
              date: forecast.date,
              tempMin: forecast.tempMin,
              tempMax: forecast.tempMax,
              humidity: forecast.humidity,
              precipitation: forecast.precipitation,
              precipitationProbability: forecast.precipitationProbability,
              windSpeed: forecast.windSpeed,
              windDirection: forecast.windDirection,
              description: forecast.description,
              icon: forecast.icon,
              uvIndex: forecast.uvIndex,
              sunrise: forecast.sunrise,
              sunset: forecast.sunset,
              location: location,
              source: 'api'
            })
          }
        }
      } catch (error) {
        console.error('Error fetching real weather data:', error)
      } finally {
        setIsLoadingRealData(false)
      }
    }

    fetchRealWeatherData()

    // Refresh data every 30 minutes
    const interval = setInterval(fetchRealWeatherData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location, addWeatherDataMutation, addForecastMutation])

  // Loading states
  const loading = (!weatherData && !storedWeatherData) ||
                  (!forecast && !storedForecast) ||
                  !alerts ||
                  !stats ||
                  isLoadingRealData

  // Error handling
  const error = null // Could be enhanced with proper error handling

  return { // Type assertions to handle Convex query result types
    weatherData: weatherData ? { ...weatherData, id: (weatherData as any)._id?.toString(), timestamp: new Date((weatherData as any).timestamp || (weatherData as any).createdAt).toISOString() } : null,
    forecast: forecast ? forecast.map(f => ({ ...f, id: (f as any)._id, updatedAt: new Date((f as any).updatedAt || (f as any).createdAt).toISOString() })) : null,
    alerts: alerts ? alerts.map(a => ({ ...a, id: (a as any)._id, startTime: new Date((a as any).startTime || (a as any).createdAt).toISOString(), endTime: new Date((a as any).endTime || (a as any).createdAt).toISOString(), createdAt: new Date((a as any).createdAt).toISOString() })) : null,
    loading,
    error: null,
    stats: calculatedStats,
    // Mutations with proper typing
    addWeatherData: addWeatherDataMutation,
    updateWeatherData: async (id: string, updates: Partial<WeatherMutationData>) => {
      await updateWeatherDataMutation({ id: id as any, updates })
    },
    deleteWeatherData: async (id: string) => {
      await deleteWeatherDataMutation({ id: id as any })
    },
    createAlert: createAlertMutation,
    updateAlert: async (id: string, updates: Partial<WeatherAlertData>) => {
      await updateAlertMutation({ id: id as any, updates })
    },
    deleteAlert: async (id: string) => {
      await deleteAlertMutation({ id: id as any })
    },
    addForecast: addForecastMutation,
    updateForecast: async (id: string, updates: Partial<WeatherForecastData>) => {
      await updateForecastMutation({ id: id as any, updates })
    },
    deleteForecast: async (id: string) => {
      await deleteForecastMutation({ id: id as any })
    },
  }
}