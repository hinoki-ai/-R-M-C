'use client';

import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { Monitor, Volume2, VolumeX } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface Camera {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  streamUrl: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeen?: number;
  resolution?: string;
  frameRate?: number;
  hasAudio?: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface CameraFormProps {
  camera?: Camera;
  onSuccess: () => void;
  onCancel: () => void;
}

const commonResolutions = [
  { value: '640x480', label: '640x480 (VGA)' },
  { value: '1280x720', label: '1280x720 (HD)' },
  { value: '1920x1080', label: '1920x1080 (Full HD)' },
  { value: '2560x1440', label: '2560x1440 (QHD)' },
  { value: '3840x2160', label: '3840x2160 (4K)' },
];

const commonFrameRates = [
  { value: 15, label: '15 FPS' },
  { value: 24, label: '24 FPS' },
  { value: 30, label: '30 FPS' },
  { value: 60, label: '60 FPS' },
];

export function CameraForm({ camera, onSuccess, onCancel }: CameraFormProps) {
  const [formData, setFormData] = useState({
    name: camera?.name || '',
    description: camera?.description || '',
    location: camera?.location || '',
    streamUrl: camera?.streamUrl || '',
    resolution: camera?.resolution || '',
    frameRate: camera?.frameRate || 30,
    hasAudio: camera?.hasAudio ?? false,
    isActive: camera?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCamera = useMutation(api.cameras.addCamera);
  const updateCamera = useMutation(api.cameras.updateCamera);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.streamUrl.trim()) {
      toast.error('El nombre y URL del stream son obligatorios.');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.streamUrl);
    } catch {
      toast.error('La URL del stream no es válida.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (camera) {
        // Edit existing camera
        await updateCamera({
          cameraId: camera._id as Id<'cameras'>,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          location: formData.location.trim() || undefined,
          streamUrl: formData.streamUrl.trim(),
          resolution: formData.resolution || undefined,
          frameRate: formData.frameRate,
          hasAudio: formData.hasAudio,
          isActive: formData.isActive,
        });

        toast.success('Cámara actualizada exitosamente.');
      } else {
        // Create new camera
        await addCamera({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          location: formData.location.trim() || undefined,
          streamUrl: formData.streamUrl.trim(),
          resolution: formData.resolution || undefined,
          frameRate: formData.frameRate,
          hasAudio: formData.hasAudio,
        });

        toast.success('Cámara creada exitosamente.');
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting camera:', error);
      toast.error(
        'Hubo un error al guardar la cámara. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre de la Cámara *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ej: Cámara Principal Entrada"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Descripción
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Descripción opcional de la cámara..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-sm font-medium">
            Ubicación
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={e =>
              setFormData(prev => ({ ...prev, location: e.target.value }))
            }
            placeholder="Ej: Entrada Principal, Parqueo, etc."
            className="mt-1"
          />
        </div>
      </div>

      {/* Stream Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-medium">Configuración del Stream</h3>
        </div>

        <div>
          <Label htmlFor="streamUrl" className="text-sm font-medium">
            URL del Stream *
          </Label>
          <Input
            id="streamUrl"
            type="url"
            value={formData.streamUrl}
            onChange={e =>
              setFormData(prev => ({ ...prev, streamUrl: e.target.value }))
            }
            placeholder="rtsp:// o http:// stream URL"
            className="mt-1 font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            URL del stream de video (RTSP, HTTP, etc.)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="resolution" className="text-sm font-medium">
              Resolución
            </Label>
            <Select
              value={formData.resolution}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, resolution: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar resolución" />
              </SelectTrigger>
              <SelectContent>
                {commonResolutions.map(res => (
                  <SelectItem key={res.value} value={res.value}>
                    {res.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frameRate" className="text-sm font-medium">
              FPS
            </Label>
            <Select
              value={formData.frameRate.toString()}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, frameRate: parseInt(value) }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {commonFrameRates.map(fps => (
                  <SelectItem key={fps.value} value={fps.value.toString()}>
                    {fps.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Audio and Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formData.hasAudio ? (
              <Volume2 className="w-4 h-4 text-green-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
            <Label htmlFor="hasAudio" className="text-sm font-medium">
              Tiene Audio
            </Label>
          </div>
          <Switch
            id="hasAudio"
            checked={formData.hasAudio}
            onCheckedChange={checked =>
              setFormData(prev => ({ ...prev, hasAudio: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="text-sm font-medium">
            Cámara Activa
          </Label>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={checked =>
              setFormData(prev => ({ ...prev, isActive: checked }))
            }
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </div>
          ) : camera ? (
            'Actualizar'
          ) : (
            'Crear'
          )}
        </Button>
      </div>
    </motion.form>
  );
}
