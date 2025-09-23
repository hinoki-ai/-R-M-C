'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Edit, Eye, Filter, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { ProjectForm } from '@/components/dashboard/admin/project-form'
import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'

interface CommunityProject {
  _id: string
  title: string
  description: string
  goal: number
  raised: number
  deadline: string
  category: 'agricultural' | 'infrastructure' | 'education' | 'health' | 'cultural' | 'other'
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  organizerId: string
  isPublic: boolean
  images: string[]
  documents: string[]
  createdAt: number
  updatedAt: number
}

const categoryConfig = {
  agricultural: { emoji: '🌾', color: 'text-green-600', label: 'Agrícola' },
  infrastructure: { emoji: '🏗️', color: 'text-blue-600', label: 'Infraestructura' },
  education: { emoji: '📚', color: 'text-purple-600', label: 'Educación' },
  health: { emoji: '🏥', color: 'text-red-600', label: 'Salud' },
  cultural: { emoji: '🎭', color: 'text-orange-600', label: 'Cultural' },
  other: { emoji: '🔧', color: 'text-gray-600', label: 'Otro' }
}

const statusConfig = {
  planning: { color: 'border-gray-500 bg-gray-50 dark:bg-gray-950/20', badge: 'Planificación' },
  active: { color: 'border-green-500 bg-green-50 dark:bg-green-950/20', badge: 'Activo' },
  completed: { color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20', badge: 'Completado' },
  cancelled: { color: 'border-red-500 bg-red-50 dark:bg-red-950/20', badge: 'Cancelado' }
}

function AdminProjectsContent() {
  const { user } = useUser()
  const allProjects = useQuery(api.community_projects.getAllCommunityProjects) || []
  const deleteProject = useMutation(api.community_projects.deleteCommunityProject)
  const loading = allProjects === undefined

  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'active' | 'completed' | 'cancelled'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | keyof typeof categoryConfig>('all')
  const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null)
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

  const filteredProjects = allProjects.filter((project: any) => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter

    return matchesStatus && matchesCategory
  })

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto comunitario? Esta acción también eliminará todas las contribuciones asociadas y no se puede deshacer.')) {
      return
    }

    try {
      await deleteProject({ projectId: projectId as any })
      toast.success('Proyecto comunitario eliminado exitosamente.')
    } catch (error) {
      console.error('Error deleting community project:', error)
      toast.error('Error al eliminar el proyecto comunitario.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressPercentage = (raised: number, goal: number) => {
    if (goal === 0) return 0
    return Math.min(Math.round((raised / goal) * 100), 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos Comunitarios</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona los proyectos de crowdfunding comunitario
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="planning">Planificación</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
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

      {/* Projects List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">Cargando proyectos...</div>
            </CardContent>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                No se encontraron proyectos comunitarios.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project: CommunityProject) => {
            const categoryInfo = categoryConfig[project.category]
            const progressPercentage = getProgressPercentage(project.raised, project.goal)
            const daysUntilDeadline = getDaysUntilDeadline(project.deadline)

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className={`border-l-4 ${statusConfig[project.status].color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${statusConfig[project.status].color}`}>
                            {statusConfig[project.status].badge}
                          </Badge>
                          <span className={`text-sm ${categoryInfo.color}`}>
                            {categoryInfo.emoji} {categoryInfo.label}
                          </span>
                          {project.isPublic && (
                            <Badge variant="outline" className="text-xs border-green-500 bg-green-50 dark:bg-green-950/20">
                              Público
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Sparkles className="w-4 h-4" />
                          {formatCurrency(project.raised)} de {formatCurrency(project.goal)} recaudado
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-4">
                        <span>📅 {formatDate(project.deadline)}</span>
                        <span className={daysUntilDeadline < 0 ? 'text-red-500' : daysUntilDeadline < 7 ? 'text-orange-500' : ''}>
                          {daysUntilDeadline < 0 ? `${Math.abs(daysUntilDeadline)} días atrasado` :
                           daysUntilDeadline === 0 ? '¡Hoy!' :
                           `${daysUntilDeadline} días restantes`}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        {project.images.length > 0 && (
                          <span>🖼️ {project.images.length}</span>
                        )}
                        {project.documents.length > 0 && (
                          <span>📄 {project.documents.length}</span>
                        )}
                      </div>
                    </div>
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
            <DialogTitle>Detalles del Proyecto</DialogTitle>
            <DialogDescription>
              Información completa del proyecto comunitario
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <p className="text-sm text-gray-600">{selectedProject.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <p className="text-sm text-gray-600">
                    {categoryConfig[selectedProject.category].emoji} {categoryConfig[selectedProject.category].label}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <p className="text-sm text-gray-600">{statusConfig[selectedProject.status].badge}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Público</label>
                  <p className="text-sm text-gray-600">{selectedProject.isPublic ? 'Sí' : 'No'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Meta</label>
                  <p className="text-sm text-gray-600">{formatCurrency(selectedProject.goal)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Recaudado</label>
                  <p className="text-sm text-gray-600">{formatCurrency(selectedProject.raised)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha Límite</label>
                  <p className="text-sm text-gray-600">{formatDate(selectedProject.deadline)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Progreso</label>
                  <p className="text-sm text-gray-600">{getProgressPercentage(selectedProject.raised, selectedProject.goal)}%</p>
                </div>
              </div>

              {selectedProject.images.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Imágenes</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedProject.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.documents.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Documentos</label>
                  <div className="space-y-2 mt-2">
                    {selectedProject.documents.map((document, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="text-sm">📄 Documento {index + 1}</span>
                        <a
                          href={document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm underline"
                        >
                          Ver
                        </a>
                      </div>
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
            <DialogTitle>Editar Proyecto Comunitario</DialogTitle>
            <DialogDescription>
              Modifica los detalles del proyecto comunitario
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm
              project={selectedProject}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedProject(null)
              }}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedProject(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminProjectsPage() {
  return (
    <DocumentDashboardLayout user={{ id: '', name: 'Admin', email: '', role: 'admin', isAdmin: true }} currentSection='admin'>
      <AdminProjectsContent />
    </DocumentDashboardLayout>
  )
}