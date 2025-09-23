'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Edit, Eye, Filter, Plus, Trash2, Wrench } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { MaintenanceForm } from '@/components/dashboard/admin/maintenance-form'
import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'

interface MaintenanceRequest {
  _id: string
  title: string
  description: string
  location: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  category: 'roads' | 'lighting' | 'water' | 'sewage' | 'buildings' | 'other'
  reportedBy: string
  reportedAt: number
  assignedTo?: string
  assignedAt?: number
  completedAt?: number
  estimatedCost?: number
  actualCost?: number
  photos: string[]
  notes?: string
  createdAt: number
  updatedAt: number
}

const priorityConfig = {
  critical: { color: 'border-red-500 bg-red-50 dark:bg-red-950/20', icon: AlertTriangle, badge: 'Crítico' },
  high: { color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20', icon: AlertTriangle, badge: 'Alto' },
  medium: { color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20', icon: Wrench, badge: 'Medio' },
  low: { color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20', icon: Wrench, badge: 'Bajo' }
}

const categoryConfig = {
  roads: { emoji: '🛣️', color: 'text-gray-600', label: 'Carreteras' },
  lighting: { emoji: '💡', color: 'text-yellow-600', label: 'Alumbrado' },
  water: { emoji: '🚰', color: 'text-blue-600', label: 'Agua' },
  sewage: { emoji: '🚽', color: 'text-green-600', label: 'Alcantarillado' },
  buildings: { emoji: '🏢', color: 'text-slate-600', label: 'Edificios' },
  other: { emoji: '🔧', color: 'text-gray-600', label: 'Otro' }
}

const statusConfig = {
  pending: { color: 'border-gray-500 bg-gray-50 dark:bg-gray-950/20', badge: 'Pendiente' },
  'in-progress': { color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20', badge: 'En Progreso' },
  completed: { color: 'border-green-500 bg-green-50 dark:bg-green-950/20', badge: 'Completado' },
  cancelled: { color: 'border-red-500 bg-red-50 dark:bg-red-950/20', badge: 'Cancelado' }
}

function AdminMaintenanceContent() {
  const { user } = useUser()
  const allRequests = useQuery(api.maintenance.getAllMaintenanceRequests) || []
  const deleteRequest = useMutation(api.maintenance.deleteMaintenanceRequest)
  const loading = allRequests === undefined

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'cancelled'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | keyof typeof categoryConfig>('all')
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
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

  const filteredRequests = allRequests.filter((request: any) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter

    return matchesStatus && matchesPriority && matchesCategory
  })

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta solicitud de mantenimiento? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await deleteRequest({ requestId: requestId as any })
      toast.success('Solicitud de mantenimiento eliminada exitosamente.')
    } catch (error) {
      console.error('Error deleting maintenance request:', error)
      toast.error('Error al eliminar la solicitud de mantenimiento.')
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Mantenimiento</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las solicitudes de mantenimiento comunitario
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridad</label>
              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {Object.entries(categoryConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.emoji} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">Cargando solicitudes...</div>
            </CardContent>
          </Card>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                No se encontraron solicitudes de mantenimiento.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request: MaintenanceRequest) => {
            const PriorityIcon = priorityConfig[request.priority].icon
            const categoryInfo = categoryConfig[request.category]

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className={`border-l-4 ${priorityConfig[request.priority].color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <PriorityIcon className="w-4 h-4" />
                          <Badge variant="outline" className="text-xs">
                            {priorityConfig[request.priority].badge}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${statusConfig[request.status].color}`}>
                            {statusConfig[request.status].badge}
                          </Badge>
                          <span className={`text-sm ${categoryInfo.color}`}>
                            {categoryInfo.emoji} {categoryInfo.label}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          📍 {request.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRequest(request._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div>
                        Reportado: {formatDate(request.reportedAt)}
                      </div>
                      <div className="flex gap-4">
                        {request.estimatedCost && (
                          <span>Est. {formatCurrency(request.estimatedCost)}</span>
                        )}
                        {request.actualCost && (
                          <span>Real {formatCurrency(request.actualCost)}</span>
                        )}
                      </div>
                    </div>

                    {request.photos.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">
                          📷 {request.photos.length} foto{request.photos.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de mantenimiento
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <p className="text-sm text-gray-600">{selectedRequest.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ubicación</label>
                  <p className="text-sm text-gray-600">{selectedRequest.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <p className="text-sm text-gray-600">
                    {categoryConfig[selectedRequest.category].emoji} {categoryConfig[selectedRequest.category].label}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <p className="text-sm text-gray-600">{priorityConfig[selectedRequest.priority].badge}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <p className="text-sm text-gray-600">{statusConfig[selectedRequest.status].badge}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reportado</label>
                  <p className="text-sm text-gray-600">{formatDate(selectedRequest.reportedAt)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
              </div>

              {(selectedRequest.estimatedCost || selectedRequest.actualCost) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedRequest.estimatedCost && (
                    <div>
                      <label className="text-sm font-medium">Costo Estimado</label>
                      <p className="text-sm text-gray-600">{formatCurrency(selectedRequest.estimatedCost)}</p>
                    </div>
                  )}
                  {selectedRequest.actualCost && (
                    <div>
                      <label className="text-sm font-medium">Costo Real</label>
                      <p className="text-sm text-gray-600">{formatCurrency(selectedRequest.actualCost)}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.notes && (
                <div>
                  <label className="text-sm font-medium">Notas</label>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.photos.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Fotos</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedRequest.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Solicitud de Mantenimiento</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la solicitud de mantenimiento
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <MaintenanceForm
              request={selectedRequest}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedRequest(null)
              }}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedRequest(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminMaintenancePage() {
  return (
    <DocumentDashboardLayout user={{ id: '', name: 'Admin', email: '', role: 'admin', isAdmin: true }} currentSection='admin'>
      <AdminMaintenanceContent />
    </DocumentDashboardLayout>
  )
}