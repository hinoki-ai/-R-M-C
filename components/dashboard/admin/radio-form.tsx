'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'

interface RadioStation {
  _id: string
  name: string
  description?: string
  streamUrl: string
  logoUrl?: string
  frequency?: string
  category: 'news' | 'music' | 'sports' | 'cultural' | 'emergency' | 'community'
  region: string
  isActive: boolean
  isOnline: boolean
  quality: 'low' | 'medium' | 'high'
  backupStreamUrl?: string
  lastChecked?: number
  createdBy: string
  createdAt: number
  updatedAt: number
}

interface RadioFormProps {
  station?: RadioStation
  onSuccess: () => void
  onCancel: () => void
}

export function RadioForm({ station, onSuccess, onCancel }: RadioFormProps) {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    name: station?.name || '',
    description: station?.description || '',
    streamUrl: station?.streamUrl || '',
    logoUrl: station?.logoUrl || '',
    frequency: station?.frequency || '',
    category: station?.category || 'music' as const,
    region: station?.region || 'Ñuble',
    isActive: station?.isActive ?? true,
    quality: station?.quality || 'medium' as const,
    backupStreamUrl: station?.backupStreamUrl || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const createStation = useMutation(api.radio.createRadioStation)
  const updateStation = useMutation(api.radio.updateRadioStation)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB.')
      return
    }

    setIsUploadingLogo(true)
    try {
      // In a real implementation, you would upload to your storage service
      // For now, we'll create a data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleInputChange('logoUrl', result)
        setIsUploadingLogo(false)
        toast.success('Logo subido exitosamente.')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Error al subir el logo. Por favor, inténtalo de nuevo.')
      setIsUploadingLogo(false)
    }
  }

  const validateStreamUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('El nombre de la estación es obligatorio.')
      return
    }

    if (!formData.streamUrl.trim()) {
      toast.error('La URL de streaming es obligatoria.')
      return
    }

    if (!validateStreamUrl(formData.streamUrl)) {
      toast.error('La URL de streaming no es válida.')
      return
    }

    if (formData.backupStreamUrl && !validateStreamUrl(formData.backupStreamUrl)) {
      toast.error('La URL de backup no es válida.')
      return
    }

    setIsSubmitting(true)

    try {
      if (station) {
        // Edit existing station
        await updateStation({
          stationId: station._id as any,
          name: formData.name.trim(),
          description: formData.description.trim(),
          streamUrl: formData.streamUrl.trim(),
          logoUrl: formData.logoUrl || undefined,
          frequency: formData.frequency.trim() || undefined,
          category: formData.category,
          region: formData.region,
          isActive: formData.isActive,
          quality: formData.quality,
          backupStreamUrl: formData.backupStreamUrl.trim() || undefined,
        })

        toast.success('Estación de radio actualizada exitosamente.')
      } else {
        // Create new station
        if (!user?.id) {
          toast.error('Usuario no autenticado.')
          return
        }

        await createStation({
          name: formData.name.trim(),
          description: formData.description.trim(),
          streamUrl: formData.streamUrl.trim(),
          logoUrl: formData.logoUrl || undefined,
          frequency: formData.frequency.trim() || undefined,
          category: formData.category,
          region: formData.region,
          quality: formData.quality,
          backupStreamUrl: formData.backupStreamUrl.trim() || undefined,
          createdBy: user.id as any,
        })

        toast.success('Estación de radio creada exitosamente.')
      }

      onSuccess()
    } catch (error) {
      console.error('Error submitting radio station:', error)
      toast.error('Hubo un error al guardar la estación de radio. Por favor, inténtalo de nuevo.')
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
          <Label htmlFor='name'>Nombre de la Estación *</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder='Ej: Radio Ñuble FM'
            required
          />
        </div>

        <div>
          <Label htmlFor='description'>Descripción</Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder='Describe la estación de radio...'
            rows={3}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='frequency'>Frecuencia</Label>
            <Input
              id='frequency'
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              placeholder='Ej: 96.7 FM'
            />
          </div>

          <div>
            <Label htmlFor='category'>Categoría *</Label>
            <Select value={formData.category} onValueChange={(value: any) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='news'>📰 Noticias</SelectItem>
                <SelectItem value='music'>🎵 Música</SelectItem>
                <SelectItem value='sports'>⚽ Deportes</SelectItem>
                <SelectItem value='cultural'>🎭 Cultural</SelectItem>
                <SelectItem value='emergency'>🚨 Emergencia</SelectItem>
                <SelectItem value='community'>🏘️ Comunidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='region'>Región *</Label>
            <Select value={formData.region} onValueChange={(value: any) => handleInputChange('region', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Ñuble'>Ñuble</SelectItem>
                <SelectItem value='Pinto'>Pinto</SelectItem>
                <SelectItem value='Recinto'>Recinto</SelectItem>
                <SelectItem value='Nacional'>Nacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='quality'>Calidad *</Label>
            <Select value={formData.quality} onValueChange={(value: any) => handleInputChange('quality', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>Baja (32-64 kbps)</SelectItem>
                <SelectItem value='medium'>Media (96-128 kbps)</SelectItem>
                <SelectItem value='high'>Alta (192-320 kbps)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Streaming Configuration */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Configuración de Streaming</h3>

        <div>
          <Label htmlFor='streamUrl'>URL de Streaming Principal *</Label>
          <Input
            id='streamUrl'
            type='url'
            value={formData.streamUrl}
            onChange={(e) => handleInputChange('streamUrl', e.target.value)}
            placeholder='https://streaming.example.com/radio.mp3'
            required
          />
          <p className='text-sm text-gray-500 mt-1'>
            URL del stream principal (MP3, AAC, etc.)
          </p>
        </div>

        <div>
          <Label htmlFor='backupStreamUrl'>URL de Streaming Backup</Label>
          <Input
            id='backupStreamUrl'
            type='url'
            value={formData.backupStreamUrl}
            onChange={(e) => handleInputChange('backupStreamUrl', e.target.value)}
            placeholder='https://backup-streaming.example.com/radio.mp3'
          />
          <p className='text-sm text-gray-500 mt-1'>
            URL alternativa en caso de que el stream principal falle
          </p>
        </div>
      </div>

      {/* Logo Upload */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Logo de la Estación</h3>

        <div className='flex items-center space-x-4'>
          <div className='flex-shrink-0'>
            {formData.logoUrl ? (
              <div className='relative'>
                <img
                  src={formData.logoUrl}
                  alt='Logo preview'
                  className='w-20 h-20 rounded-lg object-cover border'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='absolute -top-2 -right-2 w-6 h-6 p-0'
                  onClick={() => handleInputChange('logoUrl', '')}
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            ) : (
              <div className='w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center'>
                <Upload className='w-8 h-8 text-gray-400' />
              </div>
            )}
          </div>

          <div className='flex-1'>
            <Label htmlFor='logo-upload' className='cursor-pointer'>
              <div className='flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700'>
                <Upload className='w-4 h-4' />
                <span>{formData.logoUrl ? 'Cambiar logo' : 'Subir logo'}</span>
              </div>
            </Label>
            <Input
              id='logo-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleLogoUpload(file)
                }
              }}
              disabled={isUploadingLogo}
            />
            <p className='text-sm text-gray-500 mt-1'>
              {isUploadingLogo ? 'Subiendo...' : 'PNG, JPG o GIF. Máximo 5MB.'}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Estado</h3>

        <div className='flex items-center space-x-2'>
          <Switch
            id='isActive'
            checked={formData.isActive}
            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
          />
          <Label htmlFor='isActive'>Estación activa</Label>
        </div>
        <p className='text-sm text-gray-500'>
          Las estaciones inactivas no serán visibles para los usuarios.
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
          {isSubmitting ? 'Guardando...' : station ? 'Actualizar Estación' : 'Crear Estación'}
        </Button>
      </div>
    </motion.form>
  )
}