'use client'

import { useMutation } from 'convex/react'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'

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

interface AnnouncementFormProps {
  announcement?: Announcement
  onSuccess: () => void
  onCancel: () => void
}

export function AnnouncementForm({ announcement, onSuccess, onCancel }: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    priority: announcement?.priority || 'medium' as const,
    category: announcement?.category || 'general' as const,
    isActive: announcement?.isActive ?? true,
    expiresAt: announcement?.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createAnnouncement = useMutation(api.community.createAnnouncement)
  const updateAnnouncement = useMutation(api.community.updateAnnouncement)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('El título y contenido son obligatorios.')
      return
    }

    setIsSubmitting(true)

    try {
      const expiresAt = formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined

      if (announcement) {
        // Edit existing announcement
        const expiresAt = formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined

        await updateAnnouncement({
          announcementId: announcement.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          priority: formData.priority,
          category: formData.category,
          isActive: formData.isActive,
          expiresAt,
        })

        toast.success('Comunicado actualizado exitosamente.')
      } else {
        // Create new announcement
        await createAnnouncement({
          title: formData.title.trim(),
          content: formData.content.trim(),
          priority: formData.priority,
          category: formData.category,
          expiresAt,
        })

        toast.success('Comunicado creado exitosamente.')
      }

      onSuccess()
    } catch (error) {
      console.error('Error submitting announcement:', error)
      toast.error('Hubo un error al guardar el comunicado. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {/* Title */}
      <div className='space-y-2'>
        <Label htmlFor='title'>Título del Comunicado *</Label>
        <Input
          id='title'
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder='Ingresa el título del comunicado'
          required
          maxLength={200}
        />
        <p className='text-xs text-gray-500'>
          {formData.title.length}/200 caracteres
        </p>
      </div>

      {/* Content */}
      <div className='space-y-2'>
        <Label htmlFor='content'>Contenido *</Label>
        <Textarea
          id='content'
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder='Describe el contenido del comunicado'
          required
          rows={6}
          maxLength={2000}
        />
        <p className='text-xs text-gray-500'>
          {formData.content.length}/2000 caracteres
        </p>
      </div>

      {/* Priority and Category */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='priority'>Prioridad</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: string) => handleInputChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='low'>Baja - Información general</SelectItem>
              <SelectItem value='medium'>Media - Información importante</SelectItem>
              <SelectItem value='high'>Alta - Requiere atención inmediata</SelectItem>
              <SelectItem value='critical'>Crítica - Emergencia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='category'>Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value: string) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>📢 General</SelectItem>
              <SelectItem value='emergency'>🚨 Emergencia</SelectItem>
              <SelectItem value='maintenance'>🔧 Mantenimiento</SelectItem>
              <SelectItem value='event'>📅 Evento</SelectItem>
              <SelectItem value='news'>📰 Noticias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expiration Date */}
      <div className='space-y-2'>
        <Label htmlFor='expiresAt'>Fecha de Expiración (Opcional)</Label>
        <div className='relative'>
          <Input
            id='expiresAt'
            type='date'
            value={formData.expiresAt}
            onChange={(e) => handleInputChange('expiresAt', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <Calendar className='absolute right-3 top-3 h-4 w-4 text-gray-400' />
        </div>
        <p className='text-xs text-gray-500'>
          Si no se especifica, el comunicado permanecerá activo indefinidamente.
        </p>
      </div>

      {/* Active Status */}
      <div className='flex items-center space-x-2'>
        <Switch
          id='isActive'
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
        />
        <Label htmlFor='isActive' className='text-sm font-medium'>
          Comunicado Activo
        </Label>
      </div>
      <p className='text-xs text-gray-500'>
        Los comunicados inactivos no serán visibles para los usuarios.
      </p>

      {/* Priority Warning */}
      {(formData.priority === 'high' || formData.priority === 'critical') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4'
        >
          <div className='flex items-center space-x-2'>
            <Clock className='w-5 h-5 text-red-600' />
            <p className='text-sm text-red-800 dark:text-red-200 font-medium'>
              Comunicado de Alta Prioridad
            </p>
          </div>
          <p className='text-xs text-red-700 dark:text-red-300 mt-1'>
            Este comunicado será destacado y aparecerá primero en la lista para todos los usuarios.
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className='flex items-center justify-end space-x-3 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
        >
          {isSubmitting ? 'Guardando...' : announcement ? 'Actualizar Comunicado' : 'Crear Comunicado'}
        </Button>
      </div>
    </motion.form>
  )
}