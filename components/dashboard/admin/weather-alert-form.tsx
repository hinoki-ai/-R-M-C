'use client'

import { useMutation } from 'convex/react'
import { motion } from 'framer-motion'
import { MapPin, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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

interface WeatherAlertFormProps {
  alert?: WeatherAlert
  onSuccess: () => void
  onCancel: () => void
}

export function WeatherAlertForm({ alert, onSuccess, onCancel }: WeatherAlertFormProps) {
  const [formData, setFormData] = useState({
    title: alert?.title || '',
    description: alert?.description || '',
    severity: alert?.severity || 'medium' as const,
    type: alert?.type || 'other' as const,
    startTime: alert?.startTime ? new Date(alert.startTime).toISOString().slice(0, 16) : '',
    endTime: alert?.endTime ? new Date(alert.endTime).toISOString().slice(0, 16) : '',
    areas: alert?.areas || [''],
    instructions: alert?.instructions || '',
    isActive: alert?.isActive ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createAlert = useMutation(api.weather.createWeatherAlert)
  const updateAlert = useMutation(api.weather.updateWeatherAlert)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAreaChange = (index: number, value: string) => {
    const newAreas = [...formData.areas]
    newAreas[index] = value
    setFormData(prev => ({ ...prev, areas: newAreas }))
  }

  const addArea = () => {
    setFormData(prev => ({ ...prev, areas: [...prev.areas, ''] }))
  }

  const removeArea = (index: number) => {
    if (formData.areas.length > 1) {
      const newAreas = formData.areas.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, areas: newAreas }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('El título es obligatorio.')
      return false
    }

    if (!formData.description.trim()) {
      toast.error('La descripción es obligatoria.')
      return false
    }

    if (!formData.startTime) {
      toast.error('La fecha de inicio es obligatoria.')
      return false
    }

    if (!formData.endTime) {
      toast.error('La fecha de fin es obligatoria.')
      return false
    }

    const startTime = new Date(formData.startTime).getTime()
    const endTime = new Date(formData.endTime).getTime()

    if (startTime >= endTime) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio.')
      return false
    }

    const validAreas = formData.areas.filter(area => area.trim())
    if (validAreas.length === 0) {
      toast.error('Debe especificar al menos un área afectada.')
      return false
    }

    if (!formData.instructions.trim()) {
      toast.error('Las instrucciones de seguridad son obligatorias.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const startTime = new Date(formData.startTime).getTime()
      const endTime = new Date(formData.endTime).getTime()
      const validAreas = formData.areas.filter(area => area.trim())

      if (alert) {
        // Edit existing alert
        await updateAlert({
          id: alert._id as any,
          updates: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            severity: formData.severity,
            type: formData.type,
            startTime,
            endTime,
            areas: validAreas,
            instructions: formData.instructions.trim(),
            isActive: formData.isActive,
          },
        })

        toast.success('Alerta meteorológica actualizada exitosamente.')
      } else {
        // Create new alert
        await createAlert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          severity: formData.severity,
          type: formData.type,
          startTime,
          endTime,
          areas: validAreas,
          instructions: formData.instructions.trim(),
        })

        toast.success('Alerta meteorológica creada exitosamente.')
      }

      onSuccess()
    } catch (error) {
      console.error('Error submitting weather alert:', error)
      toast.error('Hubo un error al guardar la alerta meteorológica. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {/* Basic Information */}
      <div className='space-y-4'>
        <div>
          <Label htmlFor='title'>Título de la Alerta *</Label>
          <Input
            id='title'
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder='Ej: Alerta por Tormenta Eléctrica'
            required
          />
        </div>

        <div>
          <Label htmlFor='description'>Descripción *</Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder='Describe la situación meteorológica...'
            rows={3}
            required
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='severity'>Severidad *</Label>
            <Select value={formData.severity} onValueChange={(value: any) => handleInputChange('severity', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>🟢 Baja - Información general</SelectItem>
                <SelectItem value='medium'>🟡 Media - Atención moderada</SelectItem>
                <SelectItem value='high'>🟠 Alta - Acción recomendada</SelectItem>
                <SelectItem value='extreme'>🔴 Extrema - Acción inmediata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='type'>Tipo de Alerta *</Label>
            <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='storm'>⛈️ Tormenta</SelectItem>
                <SelectItem value='heat'>🔥 Ola de Calor</SelectItem>
                <SelectItem value='cold'>❄️ Ola de Frío</SelectItem>
                <SelectItem value='flood'>🌊 Inundación</SelectItem>
                <SelectItem value='wind'>💨 Viento Fuerte</SelectItem>
                <SelectItem value='other'>⚠️ Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Time Information */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Período de Vigencia</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='startTime'>Fecha y Hora de Inicio *</Label>
            <Input
              id='startTime'
              type='datetime-local'
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor='endTime'>Fecha y Hora de Fin *</Label>
            <Input
              id='endTime'
              type='datetime-local'
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Affected Areas */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Áreas Afectadas</h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addArea}
            className='flex items-center space-x-1'
          >
            <Plus className='w-4 h-4' />
            <span>Agregar Área</span>
          </Button>
        </div>

        <div className='space-y-2'>
          {formData.areas.map((area, index) => (
            <div key={index} className='flex items-center space-x-2'>
              <MapPin className='w-4 h-4 text-gray-500 flex-shrink-0' />
              <Input
                value={area}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                placeholder='Ej: Ñuble, Pinto, Recinto'
                className='flex-1'
              />
              {formData.areas.length > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeArea(index)}
                  className='flex-shrink-0'
                >
                  <X className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className='text-sm text-gray-500'>
          Especifica las áreas geográficas afectadas por esta alerta meteorológica.
        </p>
      </div>

      {/* Safety Instructions */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Instrucciones de Seguridad</h3>

        <div>
          <Label htmlFor='instructions'>Instrucciones para la Comunidad *</Label>
          <Textarea
            id='instructions'
            value={formData.instructions}
            onChange={(e) => handleInputChange('instructions', e.target.value)}
            placeholder='Proporciona instrucciones específicas sobre qué hacer durante esta alerta...'
            rows={4}
            required
          />
          <p className='text-sm text-gray-500 mt-1'>
            Incluye medidas preventivas, rutas de evacuación, números de emergencia, etc.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Estado de la Alerta</h3>

        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='isActive'
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            title='Alerta activa'
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
          />
          <Label htmlFor='isActive' className='text-sm font-medium'>
            Alerta activa
          </Label>
        </div>
        <p className='text-sm text-gray-500'>
          Las alertas activas serán visibles para todos los usuarios de la plataforma.
        </p>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-6 border-t'>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : alert ? 'Actualizar Alerta' : 'Crear Alerta'}
        </Button>
      </div>
    </motion.form>
  )
}