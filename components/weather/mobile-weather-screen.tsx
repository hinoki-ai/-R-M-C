'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sun,
  Wind
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WeatherAlert, WeatherData, WeatherForecast } from '@/types/dashboard'

interface MobileWeatherScreenProps {
  onBack?: () => void
  weatherData?: WeatherData | null
  forecast?: WeatherForecast[]
  alerts?: WeatherAlert[]
}

export function MobileWeatherScreen({ onBack, weatherData, forecast = [], alerts = [] }: MobileWeatherScreenProps) {
  const [activeTab, setActiveTab] = useState('current')

  // Weather data will be fetched from real sources
  // For now, showing empty state until real weather data is available
  const currentWeather = weatherData

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
      {/* Mobile Header */}
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-3'>
            {onBack && (
              <Button variant='ghost' size='sm' onClick={onBack}>
                <ArrowLeft className='w-5 h-5' />
              </Button>
            )}
            <div>
              <h1 className='text-xl font-bold text-gray-900'>🌤️ Clima</h1>
              <p className='text-sm text-gray-600'>{currentWeather.location}</p>
            </div>
          </div>
          <Badge variant='outline' className='text-xs'>
            <MapPin className='w-3 h-3 mr-1' />
            Ñuble
          </Badge>
        </div>
      </div>

      <div className='p-4 space-y-4'>
        {/* Current Weather Card */}
        {currentWeather ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'>
              <CardContent className='p-6'>
                <div className='text-center'>
                  <div className='text-6xl mb-3'>
                    {getWeatherIcon(currentWeather.icon, 16)}
                  </div>
                  <div className='text-4xl font-bold text-gray-900 mb-1'>
                    {currentWeather.temperature.toFixed(1)}°C
                  </div>
                  <p className='text-gray-600 capitalize mb-4'>
                    {currentWeather.description}
                  </p>

                  {/* Weather Details Grid */}
                  <div className='grid grid-cols-2 gap-4 mt-4'>
                    <div className='text-center p-3 bg-white/60 rounded-lg'>
                      <Droplets className='w-5 h-5 text-blue-500 mx-auto mb-1' />
                      <div className='text-lg font-semibold'>{currentWeather.humidity}%</div>
                      <div className='text-xs text-gray-600'>Humedad</div>
                    </div>
                    <div className='text-center p-3 bg-white/60 rounded-lg'>
                      <Wind className='w-5 h-5 text-green-500 mx-auto mb-1' />
                      <div className='text-lg font-semibold'>{currentWeather.windSpeed.toFixed(1)}</div>
                      <div className='text-xs text-gray-600'>km/h</div>
                    </div>
                    <div className='text-center p-3 bg-white/60 rounded-lg'>
                      <Gauge className='w-5 h-5 text-purple-500 mx-auto mb-1' />
                      <div className='text-lg font-semibold'>{currentWeather.pressure.toFixed(1)}</div>
                      <div className='text-xs text-gray-600'>hPa</div>
                    </div>
                    <div className='text-center p-3 bg-white/60 rounded-lg'>
                      <Eye className='w-5 h-5 text-indigo-500 mx-auto mb-1' />
                      <div className='text-lg font-semibold'>{currentWeather.visibility}</div>
                      <div className='text-xs text-gray-600'>km</div>
                    </div>
                  </div>

                  <p className='text-xs text-gray-500 mt-4'>
                    Última actualización: {currentWeather.lastUpdated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'>
              <CardContent className='p-6'>
                <div className='text-center py-8'>
                  <div className='text-6xl mb-4'>🌤️</div>
                  <h3 className='text-xl font-semibold mb-2 text-gray-700'>Clima no disponible</h3>
                  <p className='text-gray-600'>
                    Los datos meteorológicos se cargarán próximamente desde fuentes oficiales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className='border-red-200 bg-red-50'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center space-x-2 text-red-800 text-base'>
                  <AlertTriangle className='w-4 h-4' />
                  <span>Alertas Meteorológicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {alerts.map((alert, index) => (
                    <div key={index} className='p-3 bg-white rounded-lg border border-red-200'>
                      <h4 className='font-medium text-gray-900 mb-1'>{alert.title}</h4>
                      <p className='text-sm text-gray-600'>{alert.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs for additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='current' className='text-sm'>Actual</TabsTrigger>
              <TabsTrigger value='forecast' className='text-sm'>Pronóstico</TabsTrigger>
            </TabsList>

            <TabsContent value='current' className='mt-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>🌱 Impacto Comunitario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                      <p className='text-sm'>Rondas vecinales nocturnas (condiciones favorables)</p>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                      <p className='text-sm'>Riego de huertos comunitarios (recomendado)</p>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2'></div>
                      <p className='text-sm'>Monitorear niveles de ríos cercanos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='forecast' className='mt-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <Calendar className='w-5 h-5' />
                    <span>Pronóstico 5 días</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {forecast.length > 0 ? (
                    <div className='space-y-3'>
                      {forecast.map((day, index) => (
                        <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                          <div className='flex items-center space-x-3'>
                            {getWeatherIcon(day.icon, 8)}
                            <div>
                              <p className='font-medium'>{new Date(day.date).toLocaleDateString('es-CL', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                              <p className='text-sm text-gray-600 capitalize'>{day.description}</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-lg font-bold'>{day.tempMax}°C</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8'>
                      <div className='text-4xl mb-4'>📅</div>
                      <p className='text-gray-600'>
                        El pronóstico meteorológico estará disponible próximamente.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}