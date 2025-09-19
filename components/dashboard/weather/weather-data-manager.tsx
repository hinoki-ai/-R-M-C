'use client'

import { motion } from 'framer-motion'
import {
  Cloud,
  CloudRain,
  Droplets,
  Edit,
  Eye,
  Gauge,
  Plus,
  Save,
  Thermometer,
  Trash2,
  Wind,
  Zap
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWeatherData } from '@/hooks/use-weather-data'

export function WeatherDataManager() {
  const { weatherData, addWeatherData } = useWeatherData()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    timestamp: '',
    temperature: '',
    humidity: '',
    pressure: '',
    windSpeed: '',
    windDirection: '',
    precipitation: '',
    uvIndex: '',
    visibility: '',
    description: '',
    icon: 'clear',
    source: 'manual' as const,
    location: 'Pinto Los Pellines, Ñuble',
  })

  const handleCreateWeatherData = async () => {
    try {
      await addWeatherData({
        ...formData,
        timestamp: new Date(formData.timestamp).getTime(),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        pressure: parseFloat(formData.pressure),
        windSpeed: parseFloat(formData.windSpeed),
        windDirection: parseFloat(formData.windDirection),
        precipitation: parseFloat(formData.precipitation),
        uvIndex: parseFloat(formData.uvIndex),
        visibility: parseFloat(formData.visibility),
        feelsLike: parseFloat(formData.temperature) + 1, // Simple calculation
        dewPoint: parseFloat(formData.temperature) - 5, // Simple calculation
        cloudCover: 50, // Default
      })

      setFormData({
        timestamp: '',
        temperature: '',
        humidity: '',
        pressure: '',
        windSpeed: '',
        windDirection: '',
        precipitation: '',
        uvIndex: '',
        visibility: '',
        description: '',
        icon: 'clear',
        source: 'manual',
        location: 'Pinto Los Pellines, Ñuble',
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating weather data:', error)
    }
  }

  const weatherDataList = weatherData ? [weatherData] : []

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Gestión de Datos Meteorológicos
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Registrar y gestionar datos del clima manualmente
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              <Plus className='w-4 h-4 mr-2' />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Registrar Datos Meteorológicos</DialogTitle>
              <DialogDescription>
                Ingrese manualmente los datos del clima para Pinto Los Pellines.
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4'>
              <div>
                <Label htmlFor='timestamp'>Fecha y Hora</Label>
                <Input
                  id='timestamp'
                  type='datetime-local'
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='temperature'>Temperatura (°C)</Label>
                <Input
                  id='temperature'
                  type='number'
                  step='0.1'
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder='18.5'
                />
              </div>

              <div>
                <Label htmlFor='humidity'>Humedad (%)</Label>
                <Input
                  id='humidity'
                  type='number'
                  min='0'
                  max='100'
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  placeholder='65'
                />
              </div>

              <div>
                <Label htmlFor='pressure'>Presión (hPa)</Label>
                <Input
                  id='pressure'
                  type='number'
                  step='0.1'
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                  placeholder='1013.2'
                />
              </div>

              <div>
                <Label htmlFor='windSpeed'>Velocidad del Viento (km/h)</Label>
                <Input
                  id='windSpeed'
                  type='number'
                  step='0.1'
                  value={formData.windSpeed}
                  onChange={(e) => setFormData({ ...formData, windSpeed: e.target.value })}
                  placeholder='12.5'
                />
              </div>

              <div>
                <Label htmlFor='windDirection'>Dirección del Viento (°)</Label>
                <Input
                  id='windDirection'
                  type='number'
                  min='0'
                  max='360'
                  value={formData.windDirection}
                  onChange={(e) => setFormData({ ...formData, windDirection: e.target.value })}
                  placeholder='225'
                />
              </div>

              <div>
                <Label htmlFor='precipitation'>Precipitación (mm)</Label>
                <Input
                  id='precipitation'
                  type='number'
                  step='0.1'
                  value={formData.precipitation}
                  onChange={(e) => setFormData({ ...formData, precipitation: e.target.value })}
                  placeholder='0.0'
                />
              </div>

              <div>
                <Label htmlFor='uvIndex'>Índice UV</Label>
                <Input
                  id='uvIndex'
                  type='number'
                  min='0'
                  max='11'
                  value={formData.uvIndex}
                  onChange={(e) => setFormData({ ...formData, uvIndex: e.target.value })}
                  placeholder='6'
                />
              </div>

              <div>
                <Label htmlFor='visibility'>Visibilidad (km)</Label>
                <Input
                  id='visibility'
                  type='number'
                  step='0.1'
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  placeholder='15'
                />
              </div>

              <div>
                <Label htmlFor='icon'>Ícono</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='clear'>Despejado</SelectItem>
                    <SelectItem value='partly-cloudy'>Parcialmente Nublado</SelectItem>
                    <SelectItem value='cloudy'>Nublado</SelectItem>
                    <SelectItem value='rain'>Lluvia</SelectItem>
                    <SelectItem value='heavy-rain'>Lluvia Fuerte</SelectItem>
                    <SelectItem value='storm'>Tormenta</SelectItem>
                    <SelectItem value='snow'>Nieve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='md:col-span-2 lg:col-span-3'>
                <Label htmlFor='description'>Descripción</Label>
                <Input
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Condiciones meteorológicas actuales...'
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateWeatherData} className='bg-blue-600 hover:bg-blue-700'>
                <Save className='w-4 h-4 mr-2' />
                Guardar Datos
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Weather Data */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Cloud className='w-5 h-5' />
              <span>Datos Meteorológicos Actuales</span>
              <Badge variant='outline'>
                {new Date(weatherData.timestamp).toLocaleString('es-CL')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg'>
                <Thermometer className='w-8 h-8 text-red-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-red-600'>{weatherData.temperature.toFixed(1)}°C</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Temperatura</div>
              </div>

              <div className='text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg'>
                <Droplets className='w-8 h-8 text-blue-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-blue-600'>{weatherData.humidity}%</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Humedad</div>
              </div>

              <div className='text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg'>
                <Wind className='w-8 h-8 text-green-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-green-600'>{weatherData.windSpeed.toFixed(1)}</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Viento (km/h)</div>
              </div>

              <div className='text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg'>
                <Gauge className='w-8 h-8 text-purple-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-purple-600'>{weatherData.pressure.toFixed(1)}</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Presión (hPa)</div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='flex items-center space-x-2'>
                  <CloudRain className='w-5 h-5 text-blue-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>Precipitación</span>
                </div>
                <span className='font-medium'>{weatherData.precipitation.toFixed(1)} mm</span>
              </div>

              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='flex items-center space-x-2'>
                  <Eye className='w-5 h-5 text-indigo-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>Visibilidad</span>
                </div>
                <span className='font-medium'>{weatherData.visibility} km</span>
              </div>

              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='flex items-center space-x-2'>
                  <Zap className='w-5 h-5 text-orange-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>Índice UV</span>
                </div>
                <span className='font-medium'>{weatherData.uvIndex}</span>
              </div>
            </div>

            <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <Cloud className='w-5 h-5 text-blue-600' />
                <div>
                  <span className='font-medium text-blue-800 dark:text-blue-200'>{weatherData.description}</span>
                  <span className='text-sm text-blue-600 dark:text-blue-400 ml-2'>
                    Fuente: {weatherData.source}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Datos Meteorológicos</CardTitle>
          <CardDescription>
            Registros recientes de condiciones climáticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weatherDataList.length > 0 ? (
            <div className='space-y-3'>
              {weatherDataList.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='text-center'>
                      <div className='text-lg font-bold text-gray-900 dark:text-white'>
                        {data.temperature.toFixed(1)}°C
                      </div>
                      <div className='text-xs text-gray-500'>
                        {new Date(data.timestamp).toLocaleDateString('es-CL')}
                      </div>
                    </div>
                    <div className='hidden md:block'>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        💧 {data.humidity}% • 🌪️ {data.windSpeed.toFixed(1)} km/h • 📍 {data.pressure.toFixed(1)} hPa
                      </div>
                      <div className='text-sm text-gray-500'>
                        {data.description}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline' className='capitalize'>
                      {data.source}
                    </Badge>
                    <Button variant='ghost' size='sm'>
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700'>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <Cloud className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No hay datos meteorológicos
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Registra datos del clima para mantener un historial completo.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className='bg-blue-600 hover:bg-blue-700'>
                <Plus className='w-4 h-4 mr-2' />
                Registrar Primer Dato
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
