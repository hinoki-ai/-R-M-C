'use client'

import { useUser } from '@clerk/nextjs'
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
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  TrendingUp,
  Wind,
  Zap
} from 'lucide-react'
import { Suspense, useState } from 'react'

import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWeatherData } from '@/hooks/use-weather-data'

// No mock data - using real weather data only

function WeatherContent() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const { weatherData, alerts, forecast } = useWeatherData()

  // Use real data only - no mock data fallbacks
  const currentWeather = weatherData || null
  const weeklyForecast = forecast || []
  const activeAlerts = alerts || []

  if (!user) {
    return (
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='weather'>
        <div className='text-center py-12'>
          <p className='text-gray-600 dark:text-gray-400'>Cargando información del clima...</p>
        </div>
      </DocumentDashboardLayout>
    )
  }

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
    <DocumentDashboardLayout
      user={{
        id: user.id,
        name: user.firstName || user.username || 'Usuario',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: 'admin', // Weather page is admin-only
        isAdmin: true
      }}
      currentSection='weather'
    >
      <div className='space-y-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center justify-between'
        >
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              🌤️ Clima Comunidad Pinto Los Pellines
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Información meteorológica y pronósticos para la Junta de Vecinos
            </p>
          </div>
          <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
            <MapPin className='w-4 h-4 mr-1' />
            Ñuble, Chile
          </Badge>
        </motion.div>

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
                {currentWeather && currentWeather.lastUpdated && (
                  <Badge variant='secondary' className='text-xs'>
                    Última actualización: {new Date(currentWeather.lastUpdated).toLocaleTimeString('es-CL')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Main Weather */}
                {currentWeather ? (
                  <div className='text-center lg:col-span-1'>
                    <div className='text-4xl sm:text-6xl mb-2'>
                      {getWeatherIcon(currentWeather.icon, 12)}
                    </div>
                    <div className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1'>
                      {currentWeather.temperature.toFixed(1)}°C
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 capitalize text-sm sm:text-base'>
                      {currentWeather.description}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                      Sensación térmica: {currentWeather.feelsLike.toFixed(1)}°C
                    </p>
                  </div>
                ) : (
                  <div className='text-center lg:col-span-1'>
                    <div className='text-4xl sm:text-6xl mb-2 text-gray-400'>
                      🌤️
                    </div>
                    <div className='text-xl text-gray-500 mb-1'>
                      Datos no disponibles
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                      Información meteorológica próximamente
                    </p>
                  </div>
                )}

                {/* Weather Details */}
                {currentWeather ? (
                  <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:col-span-1'>
                    <div className='text-center p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                      <Droplets className='w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mx-auto mb-1' />
                      <div className='text-sm sm:text-lg font-semibold'>{currentWeather.humidity}%</div>
                      <div className='text-xs text-gray-600 dark:text-gray-400'>Humedad</div>
                    </div>
                    <div className='text-center p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                      <Wind className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto mb-1' />
                      <div className='text-sm sm:text-lg font-semibold'>{currentWeather.windSpeed.toFixed(1)}</div>
                      <div className='text-xs text-gray-600 dark:text-gray-400'>km/h</div>
                    </div>
                    <div className='text-center p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                      <Gauge className='w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mx-auto mb-1' />
                      <div className='text-sm sm:text-lg font-semibold'>{currentWeather.pressure.toFixed(1)}</div>
                      <div className='text-xs text-gray-600 dark:text-gray-400'>hPa</div>
                    </div>
                    <div className='text-center p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                      <Eye className='w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mx-auto mb-1' />
                      <div className='text-sm sm:text-lg font-semibold'>{currentWeather.visibility}</div>
                      <div className='text-xs text-gray-600 dark:text-gray-400'>km</div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center lg:col-span-1 text-gray-500'>
                    <p>Detalles del clima no disponibles</p>
                  </div>
                )}

                {/* Additional Info */}
                {currentWeather ? (
                  <div className='space-y-2 sm:space-y-3 lg:col-span-1'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>Índice UV</span>
                      <div className='flex items-center space-x-1'>
                        <Zap className='w-3 h-3 sm:w-4 sm:h-4 text-orange-500' />
                        <span className='font-medium text-sm sm:text-base'>{currentWeather.uvIndex}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>Nubosidad</span>
                      <span className='font-medium text-sm sm:text-base'>{currentWeather.cloudCover}%</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>Punto de rocío</span>
                      <span className='font-medium text-sm sm:text-base'>{currentWeather.dewPoint.toFixed(1)}°C</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>Precipitación</span>
                      <span className='font-medium text-sm sm:text-base'>{currentWeather.precipitation.toFixed(1)} mm</span>
                    </div>
                  </div>
                ) : (
                  <div className='text-center lg:col-span-1 text-gray-500'>
                    <p>Información adicional no disponible</p>
                  </div>
                )}
              </div>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3 h-auto'>
              <TabsTrigger value='overview' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Vista General</TabsTrigger>
              <TabsTrigger value='forecast' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Pronóstico</TabsTrigger>
              <TabsTrigger value='analytics' className='text-xs sm:text-sm px-2 sm:px-4 py-2'>Análisis</TabsTrigger>
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
                        <p className='text-2xl font-bold'>{currentWeather ? `${currentWeather.temperature.toFixed(1)}°C` : 'N/A'}</p>
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
                        <p className='text-2xl font-bold'>{currentWeather ? `${currentWeather.humidity}%` : 'N/A'}</p>
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
                        <p className='text-2xl font-bold'>{currentWeather ? `${currentWeather.windSpeed.toFixed(1)} km/h` : 'N/A'}</p>
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
                        <p className='text-2xl font-bold'>{currentWeather ? `${currentWeather.pressure.toFixed(1)} hPa` : 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Impact */}
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
                            {getWeatherIcon(day.icon, 8)}
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

            <TabsContent value='analytics' className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                {/* Temperature Trend Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <TrendingUp className='w-5 h-5 text-blue-600' />
                      <span>Tendencia de Temperatura</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <TrendingUp className='w-12 h-12 text-blue-500 mx-auto mb-2' />
                        <p className='text-gray-600 dark:text-gray-400'>
                          Gráfico de temperatura semanal
                        </p>
                        <p className='text-sm text-gray-500 mt-1'>
                          (Implementación avanzada con Chart.js próximamente)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Precipitation Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <CloudRain className='w-5 h-5 text-blue-600' />
                      <span>Precipitación Semanal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <CloudRain className='w-12 h-12 text-blue-500 mx-auto mb-2' />
                        <p className='text-gray-600 dark:text-gray-400'>
                          Análisis de precipitaciones
                        </p>
                        <p className='text-sm text-gray-500 mt-1'>
                          (Visualización avanzada próximamente)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weather Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Estadísticas Meteorológicas</CardTitle>
                  <CardDescription>
                    Resumen del clima en Pinto Los Pellines durante el último mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
                    <div className='text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg'>
                      <div className='text-2xl font-bold text-red-600'>--°C</div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>Temperatura Promedio</div>
                    </div>
                    <div className='text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg'>
                      <div className='text-2xl font-bold text-blue-600'>-- mm</div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>Precipitación Total</div>
                    </div>
                    <div className='text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg'>
                      <div className='text-2xl font-bold text-green-600'>-- km/h</div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>Velocidad del Viento</div>
                    </div>
                    <div className='text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg'>
                      <div className='text-2xl font-bold text-purple-600'>--%</div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>Humedad Promedio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DocumentDashboardLayout>
  )
}

export default function WeatherPage() {
  return (
    <Suspense fallback={
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='weather'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Cargando información meteorológica...</p>
        </div>
      </DocumentDashboardLayout>
    }>
      <WeatherContent />
    </Suspense>
  )
}