'use client'

import { motion } from 'framer-motion'
import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sun,
  Thermometer,
  Wind
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeatherData } from '@/types/dashboard'

interface WeatherWidgetProps {
  compact?: boolean
  showDetails?: boolean
  weatherData?: WeatherData | null
}

export function WeatherWidget({ compact = false, showDetails = true, weatherData }: WeatherWidgetProps) {
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

  if (compact) {
    return (
      <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'>
        <CardContent className='p-4'>
          {currentWeather ? (
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                {getWeatherIcon(currentWeather.icon, 6)}
                <div>
                  <div className='text-lg font-bold'>{currentWeather.temperature.toFixed(1)}°C</div>
                  <div className='text-xs text-gray-600'>{currentWeather.description}</div>
                </div>
              </div>
              <div className='text-right text-xs text-gray-500'>
                <div>💨 {currentWeather.windSpeed.toFixed(1)} km/h</div>
                <div>💧 {currentWeather.humidity}%</div>
              </div>
            </div>
          ) : (
            <div className='text-center py-4'>
              <div className='text-2xl mb-2'>🌤️</div>
              <div className='text-sm text-gray-600'>Clima no disponible</div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full'
    >
      <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center space-x-2 text-lg'>
            <Thermometer className='w-5 h-5 text-blue-600' />
            <span>Clima Actual</span>
            {currentWeather && (
              <>
                <MapPin className='w-4 h-4 text-gray-500' />
                <span className='text-sm font-normal text-gray-600'>{currentWeather.location}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentWeather ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Main Weather */}
              <div className='text-center md:col-span-1'>
                <div className='text-5xl mb-2'>
                  {getWeatherIcon(currentWeather.icon, 12)}
                </div>
                <div className='text-3xl font-bold text-gray-900 dark:text-white mb-1'>
                  {currentWeather.temperature.toFixed(1)}°C
                </div>
                <p className='text-gray-600 dark:text-gray-400 capitalize text-sm'>
                  {currentWeather.description}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  Actualizado: {currentWeather.lastUpdated}
                </p>
              </div>

              {/* Weather Details */}
              {showDetails && (
                <div className='grid grid-cols-2 gap-3 md:col-span-2'>
                  <div className='text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                    <Droplets className='w-5 h-5 text-blue-500 mx-auto mb-1' />
                    <div className='text-lg font-semibold'>{currentWeather.humidity}%</div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>Humedad</div>
                  </div>
                  <div className='text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                    <Wind className='w-5 h-5 text-green-500 mx-auto mb-1' />
                    <div className='text-lg font-semibold'>{currentWeather.windSpeed.toFixed(1)}</div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>km/h</div>
                  </div>
                  <div className='text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                    <Gauge className='w-5 h-5 text-purple-500 mx-auto mb-1' />
                    <div className='text-lg font-semibold'>{currentWeather.pressure.toFixed(1)}</div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>hPa</div>
                  </div>
                  <div className='text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg'>
                    <Eye className='w-5 h-5 text-indigo-500 mx-auto mb-1' />
                    <div className='text-lg font-semibold'>{currentWeather.visibility}</div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>km</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-4xl mb-4'>🌤️</div>
              <h3 className='text-lg font-semibold mb-2 text-gray-700'>Datos meteorológicos no disponibles</h3>
              <p className='text-gray-600 text-sm'>
                La información del clima se cargará desde fuentes oficiales próximamente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}