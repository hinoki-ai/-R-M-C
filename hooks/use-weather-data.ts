import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { WeatherService } from '@/lib/services/weather-service'
import { WeatherAlert, WeatherData, WeatherForecast } from '@/types/dashboard'
import { useConvexErrorHandler } from './use-convex-error-handler'

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

  // Use comprehensive error handling for all Convex operations
  const weatherDataQuery = useConvexErrorHandler(api.weather.getCurrentWeather, {
    args: { location },
    maxRetries: 3,
    retryDelay: 1000
  })

  const forecastQuery = useConvexErrorHandler(api.weather.getWeatherForecasts, {
    args: { location, days: 7 },
    maxRetries: 3,
    retryDelay: 1000
  })

  const alertsQuery = useConvexErrorHandler(api.weather.getWeatherAlerts, {
    args: { activeOnly: true, limit: 10 },
    maxRetries: 3,
    retryDelay: 1000
  })

  const statsQuery = useConvexErrorHandler(api.weather.getWeatherStats, {
    args: { location, days: 30 },
    maxRetries: 3,
    retryDelay: 1000
  })

  // Extract data and errors from queries
  const storedWeatherData = weatherDataQuery.data
  const storedForecast = forecastQuery.data
  const alerts = alertsQuery.data
  const stats = statsQuery.data

  // Combine errors from all queries
  const hasQueryErrors = weatherDataQuery.isError || forecastQuery.isError ||
                         alertsQuery.isError || statsQuery.isError
  const queryError = weatherDataQuery.error || forecastQuery.error ||
                    alertsQuery.error || statsQuery.error

  // Mutations with error handling
  const addWeatherDataMutation = useConvexErrorHandler(api.weather.addWeatherData, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to add weather data:', error)
  })

  const updateWeatherDataMutation = useConvexErrorHandler(api.weather.updateWeatherData, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to update weather data:', error)
  })

  const deleteWeatherDataMutation = useConvexErrorHandler(api.weather.deleteWeatherData, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to delete weather data:', error)
  })

  const createAlertMutation = useConvexErrorHandler(api.weather.createWeatherAlert, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to create weather alert:', error)
  })

  const updateAlertMutation = useConvexErrorHandler(api.weather.updateWeatherAlert, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to update weather alert:', error)
  })

  const deleteAlertMutation = useConvexErrorHandler(api.weather.deleteWeatherAlert, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to delete weather alert:', error)
  })

  const addForecastMutation = useConvexErrorHandler(api.weather.addWeatherForecast, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to add forecast:', error)
  })

  const updateForecastMutation = useConvexErrorHandler(api.weather.updateWeatherForecast, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to update forecast:', error)
  })

  const deleteForecastMutation = useConvexErrorHandler(api.weather.deleteWeatherForecast, {
    maxRetries: 2,
    onError: (error) => console.error('Failed to delete forecast:', error)
  })

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
            humidity: currentWeather.humidity ?? 0,
            pressure: currentWeather.pressure ?? 1013,
            windSpeed: currentWeather.windSpeed ?? 0,
            windDirection: currentWeather.windDirection ?? 0,
            precipitation: currentWeather.precipitation,
            uvIndex: currentWeather.uvIndex ?? 0,
            visibility: currentWeather.visibility ?? 10000,
            description: currentWeather.description ?? '',
            icon: currentWeather.icon ?? '',
            feelsLike: currentWeather.feelsLike ?? currentWeather.temperature,
            dewPoint: currentWeather.dewPoint ?? currentWeather.temperature,
            cloudCover: currentWeather.cloudCover ?? 0,
            location: currentWeather.location,
            source: 'api',
            isHistorical: false
          })

          // Store in database for caching
          await addWeatherDataMutation({
            timestamp: Date.now(),
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity ?? 0,
            pressure: currentWeather.pressure ?? 1013,
            windSpeed: currentWeather.windSpeed ?? 0,
            windDirection: currentWeather.windDirection ?? 0,
            precipitation: currentWeather.precipitation,
            uvIndex: currentWeather.uvIndex ?? 0,
            visibility: currentWeather.visibility ?? 10000,
            description: currentWeather.description ?? '',
            icon: currentWeather.icon ?? '',
            feelsLike: currentWeather.feelsLike ?? currentWeather.temperature,
            dewPoint: currentWeather.dewPoint ?? currentWeather.temperature,
            cloudCover: currentWeather.cloudCover ?? 0,
            location: currentWeather.location,
            source: 'api'
          })
        }

        if (forecastData && forecastData.length > 0) {
          const forecastArray: WeatherForecast[] = forecastData.map((item, index) => ({
            id: `forecast-${index}`,
            date: item.date,
            tempMin: item.tempMin ?? 0,
            tempMax: item.tempMax ?? 0,
            humidity: item.humidity ?? 0,
            precipitation: item.precipitation,
            precipitationProbability: item.precipitationProbability,
            windSpeed: item.windSpeed ?? 0,
            windDirection: item.windDirection ?? 0,
            description: item.description ?? '',
            icon: item.icon ?? '',
            uvIndex: item.uvIndex ?? 0,
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
              tempMin: forecast.tempMin ?? 0,
              tempMax: forecast.tempMax ?? 0,
              humidity: forecast.humidity ?? 0,
              precipitation: forecast.precipitation,
              precipitationProbability: forecast.precipitationProbability,
              windSpeed: forecast.windSpeed ?? 0,
              windDirection: forecast.windDirection ?? 0,
              description: forecast.description ?? '',
              icon: forecast.icon ?? '',
              uvIndex: forecast.uvIndex ?? 0,
              sunrise: forecast.sunrise,
              sunset: forecast.sunset,
              location: location,
              source: 'api'
            })
          }
        }
      } catch (error) {
        console.error('Error fetching real weather data:', error)
        // Could set an error state here if needed
        // setWeatherError('Failed to fetch real-time weather data')
      } finally {
        setIsLoadingRealData(false)
      }
    }

    fetchRealWeatherData()

    // Refresh data every 30 minutes
    const interval = setInterval(fetchRealWeatherData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location])

  // Loading states - include query loading states
  const queryLoading = weatherDataQuery.isLoading || forecastQuery.isLoading ||
                      alertsQuery.isLoading || statsQuery.isLoading

  const loading = (!weatherData && !storedWeatherData) ||
                  (!forecast && !storedForecast) ||
                  !alerts ||
                  !stats ||
                  isLoadingRealData ||
                  queryLoading

  // Combine all errors
  const error = hasQueryErrors ? queryError?.message || 'Error loading weather data' : null

  return { // Type assertions to handle Convex query result types
    weatherData: weatherData ? { ...weatherData, id: (weatherData as any)._id?.toString(), timestamp: new Date((weatherData as any).timestamp || (weatherData as any).createdAt).toISOString() } : null,
    forecast: forecast ? forecast.map(f => ({ ...f, id: (f as any)._id, updatedAt: new Date((f as any).updatedAt || (f as any).createdAt).toISOString() })) : null,
    alerts: alerts ? alerts.map(a => ({ ...a, id: (a as any)._id, startTime: new Date((a as any).startTime || (a as any).createdAt).toISOString(), endTime: new Date((a as any).endTime || (a as any).createdAt).toISOString(), createdAt: new Date((a as any).createdAt).toISOString() })) : null,
    loading,
    error,
    stats: calculatedStats,
    // Mutations with proper error handling
    addWeatherData: async (data: WeatherMutationData) => {
      try {
        return await addWeatherDataMutation.mutateAsync(data)
      } catch (error) {
        throw new Error(`Failed to add weather data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    updateWeatherData: async (id: string, updates: Partial<WeatherMutationData>) => {
      try {
        await updateWeatherDataMutation.mutateAsync({ id: id as any, updates })
      } catch (error) {
        throw new Error(`Failed to update weather data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    deleteWeatherData: async (id: string) => {
      try {
        await deleteWeatherDataMutation.mutateAsync({ id: id as any })
      } catch (error) {
        throw new Error(`Failed to delete weather data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    createAlert: async (alert: WeatherAlertData) => {
      try {
        return await createAlertMutation.mutateAsync(alert)
      } catch (error) {
        throw new Error(`Failed to create alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    updateAlert: async (id: string, updates: Partial<WeatherAlertData>) => {
      try {
        await updateAlertMutation.mutateAsync({ id: id as any, updates })
      } catch (error) {
        throw new Error(`Failed to update alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    deleteAlert: async (id: string) => {
      try {
        await deleteAlertMutation.mutateAsync({ id: id as any })
      } catch (error) {
        throw new Error(`Failed to delete alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    addForecast: async (forecast: WeatherForecastData) => {
      try {
        return await addForecastMutation.mutateAsync(forecast)
      } catch (error) {
        throw new Error(`Failed to add forecast: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    updateForecast: async (id: string, updates: Partial<WeatherForecastData>) => {
      try {
        await updateForecastMutation.mutateAsync({ id: id as any, updates })
      } catch (error) {
        throw new Error(`Failed to update forecast: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    deleteForecast: async (id: string) => {
      try {
        await deleteForecastMutation.mutateAsync({ id: id as any })
      } catch (error) {
        throw new Error(`Failed to delete forecast: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
  }
}