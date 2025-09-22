'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ForecastAPIResponse, WeatherAPIResponse } from '@/lib/weather-service'
import { WeatherAlert } from '@/types/dashboard'

interface WeatherState {
  current: WeatherAPIResponse | null
  forecast: ForecastAPIResponse[]
  alerts: WeatherAlert[]
  loading: boolean
  error: string | null
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherState>({
    current: null,
    forecast: [],
    alerts: [],
    loading: true,
    error: null
  })

  const fetchWeatherData = async () => {
    try {
      setWeather(prev => ({ ...prev, loading: true, error: null }))

      // Fetch current weather
      const currentResponse = await fetch('/api/weather?type=current')
      const currentData = await currentResponse.json()

      // Fetch forecast
      const forecastResponse = await fetch('/api/weather?type=forecast')
      const forecastData = await forecastResponse.json()

      if (currentData.success && forecastData.success) {
        setWeather({
          current: currentData.data,
          forecast: forecastData.data,
          alerts: [], // Could be implemented later
          loading: false,
          error: null
        })
      } else {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: currentData.error || forecastData.error || 'Failed to load weather data'
        }))
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      setWeather(prev => ({
        ...prev,
        loading: false,
        error: 'Network error - please try again'
      }))
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const currentWeather = weather.current
  const weeklyForecast = weather.forecast
  const activeAlerts = weather.alerts

  const getWeatherIcon = (icon: string, size = 24) => {
    const iconClass = `w-${size} h-${size}`
    switch (icon) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-500`} />
      case 'partly-cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-600'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            🌤️ Clima Comunidad Pinto Los Pellines
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Información meteorológica actualizada para la Junta de Vecinos
          </p>
          <div className='flex items-center justify-center gap-4 mt-4'>
            <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
              <MapPin className='w-4 h-4 mr-1' />
              Ñuble, Chile
            </Badge>
            <Button
              variant='outline'
              size='sm'
              onClick={fetchWeatherData}
              disabled={weather.loading}
              className='bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${weather.loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
          {weather.error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
              {weather.error}
            </div>
          )}
        </motion.div>

        <div className='space-y-6 max-w-6xl mx-auto'>
          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800'>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Thermometer className='w-5 h-5 text-blue-600' />
                  <span>Condiciones Actuales</span>
                  {currentWeather && (
                    <Badge variant='outline' className='text-xs'>
                      Actualizado: {new Date(currentWeather.lastUpdated).toLocaleTimeString('es-CL')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather.loading ? (
                  <div className='text-center py-8'>
                    <RefreshCw className='w-8 h-8 animate-spin mx-auto mb-4 text-blue-600' />
                    <p className='text-gray-600'>Cargando datos meteorológicos...</p>
                  </div>
                ) : currentWeather ? (
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Main Weather */}
                    <div className='text-center lg:col-span-1'>
                      <div className='text-4xl sm:text-6xl mb-2'>
                        {getWeatherIcon(currentWeather.icon || '', 12)}
                      </div>
                      <div className='text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-1'>
                        {currentWeather.temperature}°C
                      </div>
                      <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base capitalize'>
                        {currentWeather.description}
                      </p>
                      <p className='text-sm text-gray-500 mt-1'>
                        Sensación térmica: {currentWeather.feelsLike}°C
                      </p>
                    </div>

                    {/* Weather Details */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Droplets className='w-4 h-4 text-blue-500' />
                          <span className='text-sm'>Humedad</span>
                        </div>
                        <span className='font-medium'>{currentWeather.humidity}%</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Wind className='w-4 h-4 text-gray-500' />
                          <span className='text-sm'>Viento</span>
                        </div>
                        <span className='font-medium'>{currentWeather.windSpeed} km/h</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center justify-start space-x-2'>
                          <Gauge className='w-4 h-4 text-green-500' />
                          <span className='text-sm'>Presión</span>
                        </div>
                        <span className='font-medium'>{currentWeather.pressure} hPa</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Eye className='w-4 h-4 text-purple-500' />
                          <span className='text-sm'>Visibilidad</span>
                        </div>
                        <span className='font-medium'>{currentWeather.visibility} km</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Cloud className='w-4 h-4 text-gray-500' />
                          <span className='text-sm'>Nubosidad</span>
                        </div>
                        <span className='font-medium'>{currentWeather.cloudCover}%</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Zap className='w-4 h-4 text-yellow-500' />
                          <span className='text-sm'>Índice UV</span>
                        </div>
                        <span className='font-medium'>{currentWeather.uvIndex || 'N/A'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Gauge className='w-4 h-4 text-blue-500' />
                          <span className='text-sm'>Punto de rocío</span>
                        </div>
                        <span className='font-medium'>{currentWeather.dewPoint}°C</span>
                      </div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        <strong>Ubicación:</strong> {currentWeather.location}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <Cloud className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                    <p className='text-gray-600'>No se pudieron cargar los datos meteorológicos</p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={fetchWeatherData}
                      className='mt-4'
                    >
                      <RefreshCw className='w-4 h-4 mr-2' />
                      Reintentar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2 text-red-800 dark:text-red-200'>
                    <AlertTriangle className='w-5 h-5' />
                    <span>Alertas Meteorológicas Activas</span>
                    <Badge variant='destructive'>{activeAlerts.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {activeAlerts.map((alert) => (
                      <div key={alert.id} className='flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700'>
                        <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2 mb-1'>
                            <h4 className='font-medium text-gray-900 dark:text-white'>{alert.title}</h4>
                            <Badge variant='outline' className='text-xs capitalize'>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{alert.description}</p>
                          <div className='text-xs text-gray-500'>
                            <strong>Instrucciones:</strong> {alert.instructions}
                          </div>
                          <div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
                            <span>🏛️ {alert.areas.join(', ')}</span>
                            <span>⏰ Hasta {new Date(alert.endTime).toLocaleString('es-CL')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue='overview'>
              <TabsList className='grid w-full grid-cols-3 h-auto'>
                <TabsTrigger value='overview' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Vista General</TabsTrigger>
                <TabsTrigger value='forecast' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Pronóstico</TabsTrigger>
                <TabsTrigger value='community' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Comunidad</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                {/* Quick Stats */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center space-x-2'>
                        <Sun className='w-8 h-8 text-yellow-500' />
                        <div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>Temperatura</p>
                          <p className='text-2xl font-bold'>N/A</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center space-x-2'>
                        <Droplets className='w-8 h-8 text-blue-500' />
                        <div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>Humedad</p>
                          <p className='text-2xl font-bold'>N/A</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center space-x-2'>
                        <Wind className='w-8 h-8 text-green-500' />
                        <div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>Viento</p>
                          <p className='text-2xl font-bold'>N/A</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center space-x-2'>
                        <Gauge className='w-8 h-8 text-purple-500' />
                        <div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>Presión</p>
                          <p className='text-2xl font-bold'>N/A</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='forecast' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <Calendar className='w-5 h-5' />
                      <span>Pronóstico Semanal - Pinto Los Pellines</span>
                    </CardTitle>
                    <CardDescription>
                      Pronóstico meteorológico detallado para los próximos 7 días
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeklyForecast.length > 0 ? (
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                        {weeklyForecast.map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className='p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white'>
                                {new Date(day.date).toLocaleDateString('es-CL', {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </h4>
                              <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
                                {day.description}
                              </p>
                            </div>
                            <div className='text-3xl'>
                              {getWeatherIcon(day.icon || '', 8)}
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600 dark:text-gray-400'>Temperatura</span>
                              <div className='flex items-center space-x-1'>
                                <span className='font-medium'>{day.tempMax}°</span>
                                <span className='text-gray-500'>/</span>
                                <span className='text-gray-500'>{day.tempMin}°</span>
                              </div>
                            </div>

                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600 dark:text-gray-400'>Lluvia</span>
                              <div className='flex items-center space-x-1'>
                                <CloudRain className='w-4 h-4 text-blue-500' />
                                <span className='text-sm'>{day.precipitationProbability}%</span>
                              </div>
                            </div>

                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600 dark:text-gray-400'>Viento</span>
                              <div className='flex items-center space-x-1'>
                                <Wind className='w-4 h-4 text-green-500' />
                                <span className='text-sm'>{day.windSpeed} km/h</span>
                              </div>
                            </div>

                            <div className='flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700'>
                              <div className='flex items-center space-x-1 text-xs text-gray-500'>
                                <Sunrise className='w-3 h-3' />
                                <span>{day.sunrise}</span>
                              </div>
                              <div className='flex items-center space-x-1 text-xs text-gray-500'>
                                <Sunset className='w-3 h-3' />
                                <span>{day.sunset}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-8 text-gray-500'>
                        <p>Pronóstico no disponible</p>
                        <p className='text-sm mt-2'>La información meteorológica estará disponible próximamente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='community' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>🌱 Impacto en la Comunidad</CardTitle>
                    <CardDescription>
                      Cómo afecta el clima actual a las actividades comunitarias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>Actividades Recomendadas</h4>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2 text-sm'>
                            <div className='w-2 h-2 bg-green-500 rounded-full' />
                            <span>Rondas vecinales nocturnas (condiciones favorables)</span>
                          </div>
                          <div className='flex items-center space-x-2 text-sm'>
                            <div className='w-2 h-2 bg-yellow-500 rounded-full' />
                            <span>Mantenimiento de caminos rurales (moderado)</span>
                          </div>
                          <div className='flex items-center space-x-2 text-sm'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full' />
                            <span>Riego de huertos comunitarios (necesario)</span>
                          </div>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>Consideraciones de Seguridad</h4>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2 text-sm'>
                            <AlertTriangle className='w-4 h-4 text-yellow-500' />
                            <span>Monitorear niveles de ríos cercanos</span>
                          </div>
                          <div className='flex items-center space-x-2 text-sm'>
                            <AlertTriangle className='w-4 h-4 text-green-500' />
                            <span>Condiciones seguras para actividades al aire libre</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
