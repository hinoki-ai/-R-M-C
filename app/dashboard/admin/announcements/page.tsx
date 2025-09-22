'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Calendar, Edit, Eye, Filter, Info, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { AnnouncementForm } from '@/components/dashboard/admin/announcement-form'
import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import { useAnnouncements } from '@/hooks/use-dashboard-data'

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  publishedAt: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'general' | 'emergency' | 'maintenance' | 'event' | 'news'
  isActive: boolean
  expiresAt?: number
  readBy: string[]
  isRead?: boolean
}

const priorityConfig = {
  critical: { color: 'border-red-500 bg-red-50 dark:bg-red-950/20', icon: AlertTriangle, badge: 'Crítico' },
  high: { color: 'border-red-500 bg-red-50 dark:bg-red-950/20', icon: AlertTriangle, badge: 'Urgente' },
  medium: { color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20', icon: Bell, badge: 'Importante' },
  low: { color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20', icon: Info, badge: 'Información' }
}

const categoryConfig = {
  emergency: { emoji: '🚨', color: 'text-red-600', label: 'Emergencia' },
  event: { emoji: '📅', color: 'text-blue-600', label: 'Evento' },
  maintenance: { emoji: '🔧', color: 'text-orange-600', label: 'Mantenimiento' },
  general: { emoji: '📢', color: 'text-gray-600', label: 'General' },
  news: { emoji: '📰', color: 'text-green-600', label: 'Noticias' }
}

function AdminAnnouncementsContent() {
  const { user } = useUser()
  const allAnnouncements = useQuery(api.community.getAllAnnouncements) || []
  const deleteAnnouncement = useMutation(api.community.deleteAnnouncement)
  const loading = allAnnouncements === undefined
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | keyof typeof categoryConfig>('all')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
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

  const filteredAnnouncements = allAnnouncements.filter((announcement: any) => {
    const matchesStatus = filter === 'all' ||
      (filter === 'active' && announcement.isActive) ||
      (filter === 'inactive' && !announcement.isActive)

    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter

    return matchesStatus && matchesPriority && matchesCategory
  })

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null)
    setIsCreateDialogOpen(true)
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsEditDialogOpen(true)
  }

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsViewDialogOpen(true)
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio? Esta acción no se puede deshacer.')) {
      try {
        await deleteAnnouncement({ announcementId: announcementId as any })
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting announcement:', error)
        alert('Error al eliminar el comunicado. Por favor, inténtalo de nuevo.')
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
              Gestión de Comunicados
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Administra todos los comunicados y anuncios para la comunidad
            </p>
          </div>
          <Button onClick={handleCreateAnnouncement} className='flex items-center space-x-2'>
            <Plus className='w-4 h-4' />
            <span>Nuevo Comunicado</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                <SelectItem value='active'>Activos</SelectItem>
                <SelectItem value='inactive'>Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Prioridades</SelectItem>
                <SelectItem value='critical'>Críticas</SelectItem>
                <SelectItem value='high'>Altas</SelectItem>
                <SelectItem value='medium'>Medias</SelectItem>
                <SelectItem value='low'>Bajas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Categorías</SelectItem>
                <SelectItem value='emergency'>Emergencias</SelectItem>
                <SelectItem value='event'>Eventos</SelectItem>
                <SelectItem value='maintenance'>Mantenimiento</SelectItem>
                <SelectItem value='general'>General</SelectItem>
                <SelectItem value='news'>Noticias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-4'
        >
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Comunicados</CardTitle>
              <Bell className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{allAnnouncements.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Activos</CardTitle>
              <Info className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {allAnnouncements.filter((a: any) => a.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Prioridad Alta</CardTitle>
              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {allAnnouncements.filter((a: any) => a.priority === 'high' || a.priority === 'critical').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Leídos</CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {allAnnouncements.reduce((acc: number, a: any) => acc + a.readBy.length, 0)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements List */}
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
          ) : filteredAnnouncements.length === 0 ? (
            <div className='text-center py-12'>
              <Bell className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No hay comunicados
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                {filter === 'all' ? 'Crea tu primer comunicado para comenzar.' : 'No hay comunicados que coincidan con los filtros seleccionados.'}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreateAnnouncement}>
                  <Plus className='w-4 h-4 mr-2' />
                  Crear Primer Comunicado
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredAnnouncements.map((announcement: any, index: number) => {
                const priority = priorityConfig[announcement.priority]
                const category = categoryConfig[announcement.category]
                const PriorityIcon = priority.icon

                return (
                  <motion.div
                    key={announcement._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${priority.color} hover:shadow-lg transition-shadow`}>
                      <CardHeader className='pb-3'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center space-x-2'>
                            <PriorityIcon className={`w-5 h-5 ${priority.color.includes('red') ? 'text-red-600' : priority.color.includes('yellow') ? 'text-yellow-600' : 'text-blue-600'}`} />
                            <CardTitle className='text-lg flex items-center space-x-2'>
                              <span>{announcement.title}</span>
                              <span className={category.color}>{category.emoji}</span>
                            </CardTitle>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                              {announcement.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                            {announcement.priority === 'high' || announcement.priority === 'critical' ? (
                              <Badge variant='destructive'>
                                {priority.badge}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                        <CardDescription className='text-base'>
                          {announcement.content.length > 200
                            ? `${announcement.content.substring(0, 200)}...`
                            : announcement.content
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400'>
                            <span className='flex items-center space-x-1'>
                              <span>Por:</span>
                              <span className='font-medium'>{announcement.authorId}</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <Calendar className='w-4 h-4' />
                              <span>{new Date(announcement.publishedAt).toLocaleDateString('es-CL')}</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <Eye className='w-4 h-4' />
                              <span>{announcement.readBy.length} leídos</span>
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {category.label}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleViewAnnouncement(announcement as any)}
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEditAnnouncement(announcement as any)}
                            >
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDeleteAnnouncement(announcement._id)}
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

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Comunicado</DialogTitle>
            <DialogDescription>
              Crea un nuevo comunicado para informar a toda la comunidad.
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Editar Comunicado</DialogTitle>
            <DialogDescription>
              Modifica los detalles del comunicado seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <AnnouncementForm
              announcement={selectedAnnouncement}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Announcement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Vista del Comunicado</DialogTitle>
            <DialogDescription>
              Vista previa completa del comunicado.
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold'>{selectedAnnouncement.title}</h3>
                <div className='flex items-center space-x-2 mt-2'>
                  <Badge variant='outline'>
                    {categoryConfig[selectedAnnouncement.category].label}
                  </Badge>
                  <Badge variant={selectedAnnouncement.priority === 'high' || selectedAnnouncement.priority === 'critical' ? 'destructive' : 'secondary'}>
                    {priorityConfig[selectedAnnouncement.priority].badge}
                  </Badge>
                  <Badge variant={selectedAnnouncement.isActive ? 'default' : 'secondary'}>
                    {selectedAnnouncement.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <div className='prose dark:prose-invert max-w-none'>
                <p>{selectedAnnouncement.content}</p>
              </div>
              <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center space-x-4'>
                  <span>Por: {selectedAnnouncement.author}</span>
                  <span>Publicado: {new Date(selectedAnnouncement.publishedAt).toLocaleDateString('es-CL')}</span>
                  <span>Leído por: {selectedAnnouncement.readBy.length} personas</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DocumentDashboardLayout>
  )
}

export default function AdminAnnouncementsPage() {
  return <AdminAnnouncementsContent />
}