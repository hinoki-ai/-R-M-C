'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Cloud, Edit, Eye, Filter, MapPin, Plus, Trash2, Wind } from 'lucide-react'
import { useState } from 'react'

import { WeatherAlertForm } from '@/components/dashboard/admin/weather-alert-form'
import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'

interface WeatherAlert {
  _id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  type: 'storm' | 'heat' | 'cold' | 'flood' | 'wind' | 'other'
  startTime: number
  endTime: number
  areas: string[]
  instructions: string
  isActive: boolean
  createdBy: string
  createdAt: number
  updatedAt: number
}

const severityConfig = {
  low: { color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20', borderColor: 'border-blue-500', label: 'Baja' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20', borderColor: 'border-yellow-500', label: 'Media' },
  high: { color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950/20', borderColor: 'border-orange-500', label: 'Alta' },
  extreme: { color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950/20', borderColor: 'border-red-500', label: 'Extrema' }
}

const typeConfig = {
  storm: { emoji: '⛈️', color: 'text-purple-600', label: 'Tormenta' },
  heat: { emoji: '🔥', color: 'text-red-600', label: 'Calor' },
  cold: { emoji: '❄️', color: 'text-blue-600', label: 'Frío' },
  flood: { emoji: '🌊', color: 'text-blue-500', label: 'Inundación' },
  wind: { emoji: '💨', color: 'text-gray-600', label: 'Viento' },
  other: { emoji: '⚠️', color: 'text-gray-600', label: 'Otro' }
}

function AdminWeatherContent() {
  const { user } = useUser()
  const allAlerts = useQuery(api.weather.getAllWeatherAlerts) || []
  const deleteAlert = useMutation(api.weather.deleteWeatherAlert)
  const loading = allAlerts === undefined
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'extreme'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | keyof typeof typeConfig>('all')
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin'

  if (!isAdmin) {
    return (
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='admin'>
        <div className='text-center py-12'>
          <AlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Acceso Denegado
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Solo los administradores pueden acceder a esta sección.
          </p>
        </div>
      </DocumentDashboardLayout>
    )
  }

  const filteredAlerts = allAlerts.filter((alert: any) => {
    const matchesStatus = filter === 'all' ||
      (filter === 'active' && alert.isActive) ||
      (filter === 'inactive' && !alert.isActive)

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesType = typeFilter === 'all' || alert.type === typeFilter

    return matchesStatus && matchesSeverity && matchesType
  })

  const handleCreateAlert = () => {
    setSelectedAlert(null)
    setIsCreateDialogOpen(true)
  }

  const handleEditAlert = (alert: WeatherAlert) => {
    setSelectedAlert(alert)
    setIsEditDialogOpen(true)
  }

  const handleViewAlert = (alert: WeatherAlert) => {
    setSelectedAlert(alert)
    setIsViewDialogOpen(true)
  }

  const handleDeleteAlert = async (alertId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta alerta meteorológica? Esta acción no se puede deshacer.')) {
      try {
        await deleteAlert({ id: alertId as any })
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting weather alert:', error)
        alert('Error al eliminar la alerta meteorológica. Por favor, inténtalo de nuevo.')
      }
    }
  }

  return (
    <DocumentDashboardLayout
      user={{
        id: user.id,
        name: user.firstName || user.username || 'Administrador',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: 'admin',
        isAdmin: true
      }}
      currentSection='admin'
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
              Gestión de Alertas Meteorológicas
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Administra todas las alertas y avisos meteorológicos para la comunidad
            </p>
          </div>
          <Button onClick={handleCreateAlert} className='flex items-center space-x-2'>
            <Plus className='w-4 h-4' />
            <span>Nueva Alerta</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
        >
          <div className='flex items-center space-x-4 flex-wrap gap-2'>
            <div className='flex items-center space-x-2'>
              <Filter className='w-4 h-4 text-gray-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Filtros:</span>
            </div>

            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas</SelectItem>
                <SelectItem value='active'>Activas</SelectItem>
                <SelectItem value='inactive'>Inactivas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Severidades</SelectItem>
                <SelectItem value='low'>Baja</SelectItem>
                <SelectItem value='medium'>Media</SelectItem>
                <SelectItem value='high'>Alta</SelectItem>
                <SelectItem value='extreme'>Extrema</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos los Tipos</SelectItem>
                <SelectItem value='storm'>Tormenta</SelectItem>
                <SelectItem value='heat'>Calor</SelectItem>
                <SelectItem value='cold'>Frío</SelectItem>
                <SelectItem value='flood'>Inundación</SelectItem>
                <SelectItem value='wind'>Viento</SelectItem>
                <SelectItem value='other'>Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 md:grid-cols-5 gap-4'
        >
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Alertas</CardTitle>
              <Cloud className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{allAlerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Activas</CardTitle>
              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {allAlerts.filter((a: any) => a.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Severidad Alta</CardTitle>
              <Wind className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {allAlerts.filter((a: any) => a.severity === 'high' || a.severity === 'extreme').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tormentas</CardTitle>
              <Cloud className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-purple-600'>
                {allAlerts.filter((a: any) => a.type === 'storm').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Esta Semana</CardTitle>
              <MapPin className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {allAlerts.filter((a: any) => {
                  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
                  return a.createdAt > weekAgo
                }).length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='h-24 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
                </div>
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className='text-center py-12'>
              <Cloud className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No hay alertas meteorológicas
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                {filter === 'all' ? 'Crea tu primera alerta meteorológica para comenzar.' : 'No hay alertas que coincidan con los filtros seleccionados.'}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreateAlert}>
                  <Plus className='w-4 h-4 mr-2' />
                  Crear Primera Alerta
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredAlerts.map((alert: any, index: number) => {
                const severity = severityConfig[alert.severity as keyof typeof severityConfig]
                const type = typeConfig[alert.type as keyof typeof typeConfig]
                const isExpired = alert.endTime < Date.now()

                return (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${severity.borderColor} ${severity.bgColor} hover:shadow-lg transition-shadow ${isExpired ? 'opacity-75' : ''}`}>
                      <CardHeader className='pb-3'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center space-x-3'>
                            <span className={`text-2xl ${type.color}`}>{type.emoji}</span>
                            <div>
                              <CardTitle className='text-lg flex items-center space-x-2'>
                                <span>{alert.title}</span>
                                <span className={severity.color}>{severity.label}</span>
                              </CardTitle>
                              <CardDescription className='text-base'>
                                {alert.description.length > 150
                                  ? `${alert.description.substring(0, 150)}...`
                                  : alert.description
                                }
                              </CardDescription>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                              {alert.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                            {isExpired && (
                              <Badge variant='outline' className='text-red-600'>
                                Expirada
                              </Badge>
                            )}
                            <Badge variant='outline' className={severity.color}>
                              {type.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400'>
                            <span className='flex items-center space-x-1'>
                              <MapPin className='w-4 h-4' />
                              <span>{alert.areas.length} áreas</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <span>Inicio:</span>
                              <span>{new Date(alert.startTime).toLocaleDateString('es-CL')}</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <span>Fin:</span>
                              <span>{new Date(alert.endTime).toLocaleDateString('es-CL')}</span>
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {type.label}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleViewAlert(alert as any)}
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEditAlert(alert as any)}
                            >
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDeleteAlert(alert._id)}
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Alert Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Crear Nueva Alerta Meteorológica</DialogTitle>
            <DialogDescription>
              Crea una nueva alerta meteorológica con sus instrucciones de seguridad.
            </DialogDescription>
          </DialogHeader>
          <WeatherAlertForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Editar Alerta Meteorológica</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la alerta meteorológica seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <WeatherAlertForm
              alert={selectedAlert}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Alert Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Vista de la Alerta Meteorológica</DialogTitle>
            <DialogDescription>
              Vista previa completa de la alerta meteorológica.
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className='space-y-4'>
              <div>
                <h3 className='text-xl font-semibold'>{selectedAlert.title}</h3>
                <div className='flex items-center space-x-2 mt-2'>
                  <Badge variant={selectedAlert.severity === 'extreme' || selectedAlert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {severityConfig[selectedAlert.severity].label}
                  </Badge>
                  <Badge variant='outline'>
                    {typeConfig[selectedAlert.type].label}
                  </Badge>
                  <Badge variant={selectedAlert.isActive ? 'default' : 'secondary'}>
                    {selectedAlert.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium'>Descripción</label>
                <p className='text-gray-600 dark:text-gray-400 mt-1'>{selectedAlert.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Fecha de Inicio</label>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {new Date(selectedAlert.startTime).toLocaleString('es-CL')}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium'>Fecha de Fin</label>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {new Date(selectedAlert.endTime).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium'>Áreas Afectadas</label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {selectedAlert.areas.map((area, index) => (
                    <Badge key={index} variant='outline'>{area}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className='text-sm font-medium'>Instrucciones de Seguridad</label>
                <p className='text-gray-600 dark:text-gray-400 mt-1'>{selectedAlert.instructions}</p>
              </div>

              <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center space-x-4'>
                  <span>Creada: {new Date(selectedAlert.createdAt).toLocaleDateString('es-CL')}</span>
                  <span>Actualizada: {new Date(selectedAlert.updatedAt).toLocaleDateString('es-CL')}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DocumentDashboardLayout>
  )
}

export default function AdminWeatherPage() {
  return <AdminWeatherContent />
}