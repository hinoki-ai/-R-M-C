'use client'

import { useMutation } from 'convex/react'
import { motion } from 'framer-motion'
import { CalendarIcon, DollarSign, Minus, Plus, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface CommunityProject {
  id: string
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

interface ProjectFormProps {
  project?: CommunityProject
  onSuccess: () => void
  onCancel: () => void
}

const categoryOptions = [
  { value: 'agricultural', label: '🌾 Agrícola' },
  { value: 'infrastructure', label: '🏗️ Infraestructura' },
  { value: 'education', label: '📚 Educación' },
  { value: 'health', label: '🏥 Salud' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'other', label: '🔧 Otro' },
]

const statusOptions = [
  { value: 'planning', label: '📋 Planificación' },
  { value: 'active', label: '🚀 Activo' },
  { value: 'completed', label: '✅ Completado' },
  { value: 'cancelled', label: '❌ Cancelado' },
]

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    goal: project?.goal?.toString() || '',
    deadline: project?.deadline || '',
    category: project?.category || 'other' as const,
    status: project?.status || 'planning' as const,
    isPublic: project?.isPublic ?? true,
    images: project?.images || [''],
    documents: project?.documents || [''],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const updateProject = useMutation(api.community_projects.updateCommunityProject)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim() || !formData.goal || !formData.deadline) {
      toast.error('El título, descripción, meta y fecha límite son obligatorios.')
      return
    }

    const goalAmount = parseFloat(formData.goal)
    if (isNaN(goalAmount) || goalAmount <= 0) {
      toast.error('La meta debe ser un número positivo.')
      return
    }

    setIsSubmitting(true)

    try {
      const validImages = formData.images.filter(img => img.trim())
      const validDocuments = formData.documents.filter(doc => doc.trim())

      await updateProject({
        projectId: project!.id as Id<'communityProjects'>,
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal: goalAmount,
        deadline: formData.deadline,
        category: formData.category,
        status: formData.status,
        isPublic: formData.isPublic,
        images: validImages,
        documents: validDocuments,
      })

      toast.success('Proyecto comunitario actualizado exitosamente.')
      onSuccess()
    } catch (error) {
      console.error('Error updating community project:', error)
      toast.error('Error al actualizar el proyecto comunitario.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const addDocumentField = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, '']
    }))
  }

  const removeDocumentField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const updateDocumentField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) => i === index ? value : doc)
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {project ? 'Editar Proyecto Comunitario' : 'Nuevo Proyecto Comunitario'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Proyecto *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Nuevo Parque Comunitario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Meta de Financiamiento (CLP) *</Label>
            <Input
              id="goal"
              type="number"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="Ej: 1000000"
              required
            />
            {formData.goal && (
              <p className="text-sm text-gray-500">
                {formatCurrency(parseFloat(formData.goal) || 0)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción del Proyecto *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe detalladamente el proyecto comunitario..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="deadline">Fecha Límite *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
          />
          <Label htmlFor="isPublic">Proyecto público (visible para todos)</Label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Imágenes del Proyecto</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageField}
              disabled={formData.images.length >= 5}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Imagen
            </Button>
          </div>

          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={image}
                onChange={(e) => updateImageField(index, e.target.value)}
                placeholder="URL de la imagen o subir archivo..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Implement file upload */}}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              {formData.images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImageField(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Documentos del Proyecto</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocumentField}
              disabled={formData.documents.length >= 5}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Documento
            </Button>
          </div>

          {formData.documents.map((document, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={document}
                onChange={(e) => updateDocumentField(index, e.target.value)}
                placeholder="URL del documento o subir archivo..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Implement file upload */}}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              {formData.documents.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDocumentField(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {project && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Información del Proyecto</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Recaudado:</span>
                <span className="ml-2 font-medium">{formatCurrency(project.raised)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Meta:</span>
                <span className="ml-2 font-medium">{formatCurrency(project.goal)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Progreso:</span>
                <span className="ml-2 font-medium">
                  {project.goal > 0 ? Math.round((project.raised / project.goal) * 100) : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                <span className="ml-2 font-medium">
                  {new Date(project.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}