'use client';

import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { Camera, Minus, Plus, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface MaintenanceRequest {
  _id: string;
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  category: 'roads' | 'lighting' | 'water' | 'sewage' | 'buildings' | 'other';
  reportedBy: string;
  reportedAt: number;
  assignedTo?: string;
  assignedAt?: number;
  completedAt?: number;
  estimatedCost?: number;
  actualCost?: number;
  photos: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

interface MaintenanceFormProps {
  request?: MaintenanceRequest;
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: 'roads', label: '🛣️ Carreteras' },
  { value: 'lighting', label: '💡 Alumbrado' },
  { value: 'water', label: '🚰 Agua' },
  { value: 'sewage', label: '🚽 Alcantarillado' },
  { value: 'buildings', label: '🏢 Edificios' },
  { value: 'other', label: '🔧 Otro' },
];

const priorityOptions = [
  { value: 'low', label: 'Bajo - Mantenimiento rutinario' },
  { value: 'medium', label: 'Medio - Requiere atención' },
  { value: 'high', label: 'Alto - Importante' },
  { value: 'critical', label: 'Crítico - Urgente' },
];

const statusOptions = [
  { value: 'pending', label: '⏳ Pendiente' },
  { value: 'in-progress', label: '🔧 En progreso' },
  { value: 'completed', label: '✅ Completado' },
  { value: 'cancelled', label: '❌ Cancelado' },
];

export function MaintenanceForm({
  request,
  onSuccess,
  onCancel,
}: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    title: request?.title || '',
    description: request?.description || '',
    location: request?.location || '',
    category: request?.category || ('other' as const),
    priority: request?.priority || ('medium' as const),
    status: request?.status || ('pending' as const),
    assignedTo: request?.assignedTo || '',
    estimatedCost: request?.estimatedCost?.toString() || '',
    actualCost: request?.actualCost?.toString() || '',
    photos: request?.photos || [''],
    notes: request?.notes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateRequest = useMutation(api.maintenance.updateMaintenanceRequest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
      toast.error('El título, descripción y ubicación son obligatorios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const validPhotos = formData.photos.filter(photo => photo.trim());

      await updateRequest({
        requestId: request!._id as Id<'maintenanceRequests'>,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo.trim()
          ? (formData.assignedTo as Id<'users'>)
          : undefined,
        estimatedCost: formData.estimatedCost
          ? parseFloat(formData.estimatedCost)
          : undefined,
        actualCost: formData.actualCost
          ? parseFloat(formData.actualCost)
          : undefined,
        photos: validPhotos,
        notes: formData.notes.trim() || undefined,
      });

      toast.success('Solicitud de mantenimiento actualizada exitosamente.');
      onSuccess();
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error('Error al actualizar la solicitud de mantenimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPhotoField = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ''],
    }));
  };

  const removePhotoField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const updatePhotoField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? value : photo)),
    }));
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement file upload to Convex storage
      toast.info(
        'Funcionalidad de subida de archivos próximamente disponible.'
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {request
            ? 'Editar Solicitud de Mantenimiento'
            : 'Nueva Solicitud de Mantenimiento'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ej: Reparación de bache en Calle Principal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={e =>
                setFormData(prev => ({ ...prev, location: e.target.value }))
              }
              placeholder="Ej: Calle Principal #123, Ñuble"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe detalladamente el problema de mantenimiento..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData(prev => ({ ...prev, category: value }))
              }
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
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) =>
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
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
              onValueChange={(value: any) =>
                setFormData(prev => ({ ...prev, status: value }))
              }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Costo Estimado (CLP)</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  estimatedCost: e.target.value,
                }))
              }
              placeholder="Ej: 50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualCost">Costo Real (CLP)</Label>
            <Input
              id="actualCost"
              type="number"
              value={formData.actualCost}
              onChange={e =>
                setFormData(prev => ({ ...prev, actualCost: e.target.value }))
              }
              placeholder="Ej: 45000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Asignado a (ID de usuario)</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={e =>
              setFormData(prev => ({ ...prev, assignedTo: e.target.value }))
            }
            placeholder="Ej: user_1234567890"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fotos del problema</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPhotoField}
              disabled={formData.photos.length >= 5}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Foto
            </Button>
          </div>

          {formData.photos.map((photo, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={photo}
                onChange={e => updatePhotoField(index, e.target.value)}
                placeholder="URL de la foto o subir archivo..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  /* TODO: Implement file upload */
                }}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              {formData.photos.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePhotoField(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas adicionales</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={e =>
              setFormData(prev => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Notas adicionales sobre la solicitud..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Guardando...'
              : request
                ? 'Actualizar Solicitud'
                : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
