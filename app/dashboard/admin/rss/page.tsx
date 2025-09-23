'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Edit, Eye, Filter, Globe, Plus, Rss, Trash2, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'

import { RssForm } from '@/components/dashboard/admin/rss-form'
import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'

interface RssFeed {
  _id: string
  name: string
  url: string
  description?: string
  category: 'news' | 'sports' | 'local' | 'politics' | 'emergency'
  region: string
  isActive: boolean
  lastFetched?: number
  fetchInterval: number
  logoUrl?: string
  createdBy: string
  createdAt: number
  updatedAt: number
}

const categoryConfig = {
  news: { emoji: '📰', color: 'text-blue-600', label: 'Noticias' },
  sports: { emoji: '⚽', color: 'text-green-600', label: 'Deportes' },
  local: { emoji: '🏘️', color: 'text-orange-600', label: 'Local' },
  politics: { emoji: '🏛️', color: 'text-purple-600', label: 'Política' },
  emergency: { emoji: '🚨', color: 'text-red-600', label: 'Emergencia' }
}

const regionConfig = {
  'Ñuble': 'Ñuble',
  'Biobío': 'Biobío',
  'Nacional': 'Nacional'
}

function AdminRssContent() {
  const { user } = useUser()
  const allFeeds = useQuery(api.rss.getAllRssFeeds) || []
  const deleteFeed = useMutation(api.rss.deleteRssFeed)
  const loading = allFeeds === undefined
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | keyof typeof categoryConfig>('all')
  const [regionFilter, setRegionFilter] = useState<'all' | keyof typeof regionConfig>('all')
  const [selectedFeed, setSelectedFeed] = useState<RssFeed | null>(null)
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

  const filteredFeeds = allFeeds.filter((feed: any) => {
    const matchesStatus = filter === 'all' ||
      (filter === 'active' && feed.isActive) ||
      (filter === 'inactive' && !feed.isActive)

    const matchesCategory = categoryFilter === 'all' || feed.category === categoryFilter
    const matchesRegion = regionFilter === 'all' || feed.region === regionFilter

    return matchesStatus && matchesCategory && matchesRegion
  })

  const handleCreateFeed = () => {
    setSelectedFeed(null)
    setIsCreateDialogOpen(true)
  }

  const handleEditFeed = (feed: RssFeed) => {
    setSelectedFeed(feed)
    setIsEditDialogOpen(true)
  }

  const handleViewFeed = (feed: RssFeed) => {
    setSelectedFeed(feed)
    setIsViewDialogOpen(true)
  }

  const handleDeleteFeed = async (feedId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este feed RSS? Esta acción no se puede deshacer y eliminará todos los artículos asociados.')) {
      try {
        await deleteFeed({ feedId: feedId as any })
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting RSS feed:', error)
        alert('Error al eliminar el feed RSS. Por favor, inténtalo de nuevo.')
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
              Gestión de Feeds RSS
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Administra todas las fuentes de noticias RSS y su configuración
            </p>
          </div>
          <Button onClick={handleCreateFeed} className='flex items-center space-x-2'>
            <Plus className='w-4 h-4' />
            <span>Nuevo Feed</span>
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
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='active'>Activos</SelectItem>
                <SelectItem value='inactive'>Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Categorías</SelectItem>
                <SelectItem value='news'>Noticias</SelectItem>
                <SelectItem value='sports'>Deportes</SelectItem>
                <SelectItem value='local'>Local</SelectItem>
                <SelectItem value='politics'>Política</SelectItem>
                <SelectItem value='emergency'>Emergencia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={(value: any) => setRegionFilter(value)}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Regiones</SelectItem>
                <SelectItem value='Ñuble'>Ñuble</SelectItem>
                <SelectItem value='Biobío'>Biobío</SelectItem>
                <SelectItem value='Nacional'>Nacional</SelectItem>
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
              <CardTitle className='text-sm font-medium'>Total Feeds</CardTitle>
              <Rss className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{allFeeds.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Activos</CardTitle>
              <Wifi className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {allFeeds.filter((f: any) => f.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Inactivos</CardTitle>
              <WifiOff className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {allFeeds.filter((f: any) => !f.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Noticias</CardTitle>
              <Globe className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {allFeeds.filter((f: any) => f.category === 'news').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Esta Semana</CardTitle>
              <Rss className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-purple-600'>
                {allFeeds.filter((f: any) => {
                  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
                  return f.createdAt > weekAgo
                }).length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feeds List */}
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
          ) : filteredFeeds.length === 0 ? (
            <div className='text-center py-12'>
              <Rss className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No hay feeds RSS
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                {filter === 'all' ? 'Crea tu primer feed RSS para comenzar.' : 'No hay feeds que coincidan con los filtros seleccionados.'}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreateFeed}>
                  <Plus className='w-4 h-4 mr-2' />
                  Crear Primer Feed
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredFeeds.map((feed: any, index: number) => {
                const category = categoryConfig[feed.category as keyof typeof categoryConfig]

                return (
                  <motion.div
                    key={feed._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className='hover:shadow-lg transition-shadow'>
                      <CardHeader className='pb-3'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center space-x-3'>
                            {feed.logoUrl ? (
                              <img
                                src={feed.logoUrl}
                                alt={feed.name}
                                className='w-12 h-12 rounded-lg object-cover'
                              />
                            ) : (
                              <div className='w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                                <Rss className='w-6 h-6 text-gray-500' />
                              </div>
                            )}
                            <div>
                              <CardTitle className='text-lg flex items-center space-x-2'>
                                <span>{feed.name}</span>
                                <span className={category.color}>{category.emoji}</span>
                              </CardTitle>
                              <CardDescription className='text-base'>
                                {feed.description || 'Sin descripción'}
                              </CardDescription>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge variant={feed.isActive ? 'default' : 'secondary'}>
                              {feed.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge variant='outline' className={category.color}>
                              {category.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400'>
                            <span className='flex items-center space-x-1'>
                              <Globe className='w-4 h-4' />
                              <span>{feed.region}</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <span>Intervalo:</span>
                              <span>{feed.fetchInterval} min</span>
                            </span>
                            {feed.lastFetched && (
                              <span className='flex items-center space-x-1'>
                                <span>Último fetch:</span>
                                <span>{new Date(feed.lastFetched).toLocaleDateString('es-CL')}</span>
                              </span>
                            )}
                            <Badge variant='outline' className='text-xs'>
                              {category.label}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleViewFeed(feed as any)}
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEditFeed(feed as any)}
                            >
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDeleteFeed(feed._id)}
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

      {/* Create Feed Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Feed RSS</DialogTitle>
            <DialogDescription>
              Crea una nueva fuente de noticias RSS con su configuración.
            </DialogDescription>
          </DialogHeader>
          <RssForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Feed Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Editar Feed RSS</DialogTitle>
            <DialogDescription>
              Modifica los detalles del feed RSS seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedFeed && (
            <RssForm
              feed={selectedFeed}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Feed Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Vista del Feed RSS</DialogTitle>
            <DialogDescription>
              Vista previa completa de la configuración del feed RSS.
            </DialogDescription>
          </DialogHeader>
          {selectedFeed && (
            <div className='space-y-4'>
              <div className='flex items-center space-x-4'>
                {selectedFeed.logoUrl ? (
                  <img
                    src={selectedFeed.logoUrl}
                    alt={selectedFeed.name}
                    className='w-16 h-16 rounded-lg object-cover'
                  />
                ) : (
                  <div className='w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                    <Rss className='w-8 h-8 text-gray-500' />
                  </div>
                )}
                <div>
                  <h3 className='text-xl font-semibold'>{selectedFeed.name}</h3>
                  <p className='text-gray-600 dark:text-gray-400'>{selectedFeed.region} • {categoryConfig[selectedFeed.category].label}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Categoría</label>
                  <p className='text-gray-600 dark:text-gray-400'>{categoryConfig[selectedFeed.category].label}</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>Región</label>
                  <p className='text-gray-600 dark:text-gray-400'>{selectedFeed.region}</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>Estado</label>
                  <div className='flex items-center space-x-2'>
                    <Badge variant={selectedFeed.isActive ? 'default' : 'secondary'}>
                      {selectedFeed.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium'>Intervalo de Fetch</label>
                  <p className='text-gray-600 dark:text-gray-400'>Cada {selectedFeed.fetchInterval} minutos</p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium'>URL del Feed</label>
                <p className='text-gray-600 dark:text-gray-400 break-all'>{selectedFeed.url}</p>
              </div>

              {selectedFeed.description && (
                <div>
                  <label className='text-sm font-medium'>Descripción</label>
                  <p className='text-gray-600 dark:text-gray-400'>{selectedFeed.description}</p>
                </div>
              )}

              <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center space-x-4'>
                  <span>Creado: {new Date(selectedFeed.createdAt).toLocaleDateString('es-CL')}</span>
                  <span>Actualizado: {new Date(selectedFeed.updatedAt).toLocaleDateString('es-CL')}</span>
                  {selectedFeed.lastFetched && (
                    <span>Último fetch: {new Date(selectedFeed.lastFetched).toLocaleDateString('es-CL')}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DocumentDashboardLayout>
  )
}

export default function AdminRssPage() {
  return <AdminRssContent />
}