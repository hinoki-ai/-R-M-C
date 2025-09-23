'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, Edit, Eye, Filter, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'

import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/convex/_generated/api'

interface Event {
  _id: string
  title: string
  description?: string
  categoryId: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  location?: string
  isAllDay: boolean
  isRecurring: boolean
  maxAttendees?: number
  isPublic: boolean
  requiresApproval: boolean
  organizerId: string
  createdAt: number
  updatedAt: number
}

interface EventCategory {
  _id: string
  name: string
  description?: string
  color: string
  icon: string
  isActive: boolean
  createdBy: string
  createdAt: number
  updatedAt: number
}

function AdminCalendarContent() {
  const { user } = useUser()
  const allEvents = useQuery(api.calendar.getAllEvents) || []
  const allCategories = useQuery(api.calendar.getAllEventCategories) || []
  const deleteEvent = useMutation(api.calendar.deleteEvent)
  const deleteCategory = useMutation(api.calendar.deleteEventCategory)
  const loading = allEvents === undefined || allCategories === undefined

  const [activeTab, setActiveTab] = useState('events')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false)
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false)
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)

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

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (endDate < now) return 'past'
    if (startDate <= now && endDate >= now) return 'current'
    return 'upcoming'
  }

  const filteredEvents = allEvents.filter((event: any) => {
    const eventStatus = getEventStatus(event)
    const matchesFilter = filter === 'all' ||
      (filter === 'upcoming' && eventStatus === 'upcoming') ||
      (filter === 'past' && eventStatus === 'past') ||
      (filter === 'today' && eventStatus === 'current')

    const matchesCategory = categoryFilter === 'all' || event.categoryId === categoryFilter

    return matchesFilter && matchesCategory
  })

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setIsCreateEventDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEditEventDialogOpen(true)
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsViewEventDialogOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')) {
      try {
        await deleteEvent({ eventId: eventId as any })
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Error al eliminar el evento. Por favor, inténtalo de nuevo.')
      }
    }
  }

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsCreateCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: EventCategory) => {
    setSelectedCategory(category)
    setIsEditCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Los eventos asociados pueden verse afectados.')) {
      try {
        await deleteCategory({ categoryId: categoryId as any })
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error al eliminar la categoría. Por favor, inténtalo de nuevo.')
      }
    }
  }

  const formatEventDate = (event: Event) => {
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (event.isAllDay) {
      if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
      return `${startDate.toLocaleDateString('es-ES')} - ${endDate.toLocaleDateString('es-ES')}`
    }

    // For timed events
    const startTime = event.startTime ? ` ${event.startTime}` : ''
    const endTime = event.endTime ? ` - ${event.endTime}` : ''

    if (startDate.toDateString() === endDate.toDateString()) {
      return `${startDate.toLocaleDateString('es-ES')}${startTime}${endTime}`
    }

    return `${startDate.toLocaleDateString('es-ES')}${startTime} - ${endDate.toLocaleDateString('es-ES')}${endTime}`
  }

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event)
    const statusConfig = {
      past: { label: 'Pasado', variant: 'secondary' as const },
      current: { label: 'En Curso', variant: 'default' as const },
      upcoming: { label: 'Próximo', variant: 'outline' as const }
    }
    return statusConfig[status]
  }

  const getCategoryName = (categoryId: string) => {
    const category = allCategories.find((cat: any) => cat._id === categoryId)
    return category?.name || 'Sin Categoría'
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
              Gestión de Calendario
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Administra eventos y categorías del calendario comunitario
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-4'
        >
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Eventos</p>
                  <p className='text-2xl font-bold'>{loading ? '...' : allEvents.length}</p>
                </div>
                <Calendar className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Próximos</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {loading ? '...' : allEvents.filter((e: any) => getEventStatus(e) === 'upcoming').length}
                  </p>
                </div>
                <Users className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>En Curso</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {loading ? '...' : allEvents.filter((e: any) => getEventStatus(e) === 'current').length}
                  </p>
                </div>
                <Eye className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Categorías</p>
                  <p className='text-2xl font-bold text-purple-600'>
                    {loading ? '...' : allCategories.length}
                  </p>
                </div>
                <Filter className='h-8 w-8 text-purple-500' />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='events'>Eventos</TabsTrigger>
            <TabsTrigger value='categories'>Categorías</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value='events' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <Button onClick={handleCreateEvent} className='flex items-center space-x-2'>
                <Plus className='w-4 h-4' />
                <span>Nuevo Evento</span>
              </Button>
            </div>

            {/* Events Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
            >
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                  <Filter className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Filtros:</span>
                </div>

                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todos</SelectItem>
                    <SelectItem value='upcoming'>Próximos</SelectItem>
                    <SelectItem value='current'>En Curso</SelectItem>
                    <SelectItem value='past'>Pasados</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
                  <SelectTrigger className='w-40'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todas las Categorías</SelectItem>
                    {allCategories.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Events Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className='animate-pulse'>
                      <CardHeader>
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                      </CardHeader>
                      <CardContent>
                        <div className='h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
                        <div className='flex justify-between'>
                          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold mb-2'>No se encontraron eventos</h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-6'>
                    {filter === 'all' && categoryFilter === 'all'
                      ? 'No hay eventos registrados en el sistema'
                      : 'No hay eventos que coincidan con los filtros seleccionados'
                    }
                  </p>
                  <Button onClick={handleCreateEvent}>
                    <Plus className='h-4 w-4 mr-2' />
                    Crear Primer Evento
                  </Button>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredEvents.map((event: any, index: number) => {
                    const statusBadge = getStatusBadge(event)

                    return (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className='hover:shadow-lg transition-shadow'>
                          <CardHeader>
                            <div className='flex items-center justify-between'>
                              <CardTitle className='text-lg'>{event.title}</CardTitle>
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                            <CardDescription>
                              {event.description || 'Sin descripción'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className='space-y-2 mb-4'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-600 dark:text-gray-400'>Categoría:</span>
                                <span>{getCategoryName(event.categoryId)}</span>
                              </div>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-600 dark:text-gray-400'>Fecha:</span>
                                <span className='text-right'>{formatEventDate(event)}</span>
                              </div>
                              {event.location && (
                                <div className='flex justify-between text-sm'>
                                  <span className='text-gray-600 dark:text-gray-400'>Ubicación:</span>
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.maxAttendees && (
                                <div className='flex justify-between text-sm'>
                                  <span className='text-gray-600 dark:text-gray-400'>Capacidad:</span>
                                  <span>{event.maxAttendees} personas</span>
                                </div>
                              )}
                            </div>

                            <div className='flex space-x-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleViewEvent(event)}
                                className='flex-1'
                              >
                                <Eye className='w-4 h-4 mr-2' />
                                Ver
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleEditEvent(event)}
                                className='flex-1'
                              >
                                <Edit className='w-4 h-4 mr-2' />
                                Editar
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleDeleteEvent(event._id)}
                                className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20'
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value='categories' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <Button onClick={handleCreateCategory} className='flex items-center space-x-2'>
                <Plus className='w-4 h-4' />
                <span>Nueva Categoría</span>
              </Button>
            </div>

            {/* Categories Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className='animate-pulse'>
                      <CardHeader>
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                      </CardHeader>
                      <CardContent>
                        <div className='flex justify-between'>
                          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : allCategories.length === 0 ? (
                <div className='text-center py-12'>
                  <Filter className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold mb-2'>No se encontraron categorías</h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-6'>
                    No hay categorías de eventos registradas en el sistema
                  </p>
                  <Button onClick={handleCreateCategory}>
                    <Plus className='h-4 w-4 mr-2' />
                    Crear Primera Categoría
                  </Button>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {allCategories.map((category: any, index: number) => (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className='hover:shadow-lg transition-shadow'>
                        <CardHeader>
                          <div className='flex items-center justify-between'>
                            <CardTitle className='text-lg flex items-center gap-2'>
                              <div
                                className={`w-4 h-4 rounded-full bg-[${category.color}]`}
                              />
                              {category.name}
                            </CardTitle>
                            <Badge variant={category.isActive ? 'default' : 'secondary'}>
                              {category.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {category.description || 'Sin descripción'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='flex space-x-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEditCategory(category)}
                              className='flex-1'
                            >
                              <Edit className='w-4 h-4 mr-2' />
                              Editar
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDeleteCategory(category._id)}
                              className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Event Dialogs - TODO: Implement event and category forms */}
        <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
              <DialogDescription>
                Agrega un nuevo evento al calendario comunitario.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <p className='text-center text-gray-600 dark:text-gray-400'>
                Formulario de creación de eventos próximamente...
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Evento</DialogTitle>
              <DialogDescription>
                Información completa del evento seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              {selectedEvent && (
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-semibold'>Título:</h4>
                    <p>{selectedEvent.title}</p>
                  </div>
                  <div>
                    <h4 className='font-semibold'>Descripción:</h4>
                    <p>{selectedEvent.description || 'Sin descripción'}</p>
                  </div>
                  <div>
                    <h4 className='font-semibold'>Fecha:</h4>
                    <p>{formatEventDate(selectedEvent)}</p>
                  </div>
                  <div>
                    <h4 className='font-semibold'>Ubicación:</h4>
                    <p>{selectedEvent.location || 'No especificada'}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Category Dialogs - TODO: Implement category forms */}
        <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>
                Agrega una nueva categoría de eventos.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <p className='text-center text-gray-600 dark:text-gray-400'>
                Formulario de creación de categorías próximamente...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DocumentDashboardLayout>
  )
}

export default function AdminCalendarPage() {
  return <AdminCalendarContent />
}