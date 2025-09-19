'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Clock,
  Edit,
  MapPin,
  MessageSquare,
  Plus,
  Save,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useWeatherData } from '@/hooks/use-weather-data'
import { WeatherAlert } from '@/types/dashboard'

export function WeatherAlertManager() {
  const { alerts, createAlert, updateAlert, deleteAlert } = useWeatherData()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<WeatherAlert | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    type: 'storm' as const,
    startTime: '',
    endTime: '',
    areas: '',
    instructions: '',
  })

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

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const handleCreateAlert = async () => {
    try {
      await createAlert({
        ...formData,
        areas: formData.areas.split(',').map(a => a.trim()),
        startTime: new Date(formData.startTime).getTime(),
        endTime: new Date(formData.endTime).getTime(),
      })

      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        type: 'storm',
        startTime: '',
        endTime: '',
        areas: '',
        instructions: '',
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating alert:', error)
    }
  }

  const handleUpdateAlert = async () => {
    if (!editingAlert) return

    try {
      await updateAlert(editingAlert.id, {
        ...formData,
        areas: formData.areas.split(',').map(a => a.trim()),
        startTime: new Date(formData.startTime).getTime(),
        endTime: new Date(formData.endTime).getTime(),
      })

      setEditingAlert(null)
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        type: 'storm',
        startTime: '',
        endTime: '',
        areas: '',
        instructions: '',
      })
    } catch (error) {
      console.error('Error updating alert:', error)
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta alerta?')) {
      try {
        await deleteAlert(alertId)
      } catch (error) {
        console.error('Error deleting alert:', error)
      }
    }
  }

  const handleEditAlert = (alert: WeatherAlert) => {
    setEditingAlert(alert)
    setFormData({
      title: alert.title,
      description: alert.description,
      severity: alert.severity as 'medium',
      type: alert.type as 'storm',
      startTime: new Date(alert.startTime).toISOString().slice(0, 16),
      endTime: new Date(alert.endTime).toISOString().slice(0, 16),
      areas: alert.areas.join(', '),
      instructions: alert.instructions,
    })
  }

  const activeAlerts = alerts?.filter(a => a.isActive) || []
  const inactiveAlerts = alerts?.filter(a => !a.isActive) || []

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Gestión de Alertas Meteorológicas
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Crear y gestionar alertas del clima para la comunidad
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-red-600 hover:bg-red-700'>
              <Plus className='w-4 h-4 mr-2' />
              Nueva Alerta
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Crear Nueva Alerta Meteorológica</DialogTitle>
              <DialogDescription>
                Configure una nueva alerta para informar a la comunidad sobre condiciones climáticas peligrosas.
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
              <div className='md:col-span-2'>
                <Label htmlFor='title'>Título de la Alerta</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='Ej: Alerta de Lluvias Intensas'
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='description'>Descripción</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Describa las condiciones meteorológicas y sus posibles impactos...'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor='severity'>Severidad</Label>
                <Select value={formData.severity} onValueChange={(value: string) => setFormData({ ...formData, severity: value as 'medium' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>Baja</SelectItem>
                    <SelectItem value='medium'>Media</SelectItem>
                    <SelectItem value='high'>Alta</SelectItem>
                    <SelectItem value='extreme'>Extrema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='type'>Tipo</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value as 'storm' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='storm'>Tormenta</SelectItem>
                    <SelectItem value='heat'>Calor</SelectItem>
                    <SelectItem value='cold'>Frío</SelectItem>
                    <SelectItem value='flood'>Inundación</SelectItem>
                    <SelectItem value='wind'>Viento</SelectItem>
                    <SelectItem value='other'>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='startTime'>Inicio</Label>
                <Input
                  id='startTime'
                  type='datetime-local'
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='endTime'>Fin</Label>
                <Input
                  id='endTime'
                  type='datetime-local'
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='areas'>Áreas Afectadas</Label>
                <Input
                  id='areas'
                  value={formData.areas}
                  onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                  placeholder='Pinto Los Pellines, Cobquecura, Coelemú'
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='instructions'>Instrucciones de Seguridad</Label>
                <Textarea
                  id='instructions'
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder='Instrucciones específicas para la comunidad...'
                  rows={3}
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAlert} className='bg-red-600 hover:bg-red-700'>
                <Save className='w-4 h-4 mr-2' />
                Crear Alerta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2 text-red-800 dark:text-red-200'>
              <AlertTriangle className='w-5 h-5' />
              <span>Alertas Activas</span>
              <Badge variant='destructive'>{activeAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-start space-x-3'>
                      <div className={`w-4 h-4 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                      <div>
                        <h4 className='font-medium text-gray-900 dark:text-white'>{alert.title}</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{alert.description}</p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge variant={getSeverityBadgeVariant(alert.severity)} className='capitalize'>
                        {alert.severity}
                      </Badge>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEditAlert(alert)}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteAlert(alert.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='w-4 h-4 text-gray-500' />
                        <span className='text-gray-600 dark:text-gray-400'>
                          {new Date(alert.startTime).toLocaleString('es-CL')} - {new Date(alert.endTime).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <MapPin className='w-4 h-4 text-gray-500' />
                        <span className='text-gray-600 dark:text-gray-400'>{alert.areas.join(', ')}</span>
                      </div>
                    </div>
                    <div>
                      <div className='flex items-start space-x-2'>
                        <MessageSquare className='w-4 h-4 text-gray-500 mt-0.5' />
                        <span className='text-gray-600 dark:text-gray-400'>{alert.instructions}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Alert Dialog */}
      {editingAlert && (
        <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Editar Alerta Meteorológica</DialogTitle>
              <DialogDescription>
                Modifique la información de la alerta seleccionada.
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
              <div className='md:col-span-2'>
                <Label htmlFor='edit-title'>Título de la Alerta</Label>
                <Input
                  id='edit-title'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='edit-description'>Descripción</Label>
                <Textarea
                  id='edit-description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor='edit-severity'>Severidad</Label>
                <Select value={formData.severity} onValueChange={(value: string) => setFormData({ ...formData, severity: value as 'medium' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>Baja</SelectItem>
                    <SelectItem value='medium'>Media</SelectItem>
                    <SelectItem value='high'>Alta</SelectItem>
                    <SelectItem value='extreme'>Extrema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='edit-type'>Tipo</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value as 'storm' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='storm'>Tormenta</SelectItem>
                    <SelectItem value='heat'>Calor</SelectItem>
                    <SelectItem value='cold'>Frío</SelectItem>
                    <SelectItem value='flood'>Inundación</SelectItem>
                    <SelectItem value='wind'>Viento</SelectItem>
                    <SelectItem value='other'>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='edit-startTime'>Inicio</Label>
                <Input
                  id='edit-startTime'
                  type='datetime-local'
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='edit-endTime'>Fin</Label>
                <Input
                  id='edit-endTime'
                  type='datetime-local'
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='edit-areas'>Áreas Afectadas</Label>
                <Input
                  id='edit-areas'
                  value={formData.areas}
                  onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='edit-instructions'>Instrucciones de Seguridad</Label>
                <Textarea
                  id='edit-instructions'
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setEditingAlert(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateAlert} className='bg-blue-600 hover:bg-blue-700'>
                <Save className='w-4 h-4 mr-2' />
                Actualizar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Inactive Alerts */}
      {inactiveAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Inactivas</CardTitle>
            <CardDescription>
              Historial de alertas meteorológicas anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {inactiveAlerts.map((alert) => (
                <div key={alert.id} className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='flex items-center space-x-3'>
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>{alert.title}</h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {new Date(alert.startTime).toLocaleDateString('es-CL')} - {alert.areas.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline' className='capitalize'>
                      {alert.severity}
                    </Badge>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteAlert(alert.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!alerts || alerts.length === 0) && (
        <Card>
          <CardContent className='text-center py-12'>
            <AlertTriangle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No hay alertas meteorológicas
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Crea alertas para mantener informada a la comunidad sobre condiciones climáticas peligrosas.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className='bg-red-600 hover:bg-red-700'>
              <Plus className='w-4 h-4 mr-2' />
              Crear Primera Alerta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
