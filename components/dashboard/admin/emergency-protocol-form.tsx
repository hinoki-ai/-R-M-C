'use client';

import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { FileText, Minus, Plus, Upload, X } from 'lucide-react';
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

interface EmergencyContact {
  name: string;
  phone: string;
  role: string;
}

interface EmergencyProtocol {
  _id: string;
  title: string;
  description: string;
  category:
    | 'fire'
    | 'medical'
    | 'police'
    | 'natural_disaster'
    | 'security'
    | 'evacuation'
    | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  pdfUrl: string;
  thumbnailUrl?: string;
  emergencyContacts: EmergencyContact[];
  steps: string[];
  isActive: boolean;
  offlineAvailable: boolean;
  downloadCount: number;
  lastDownloaded?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface EmergencyProtocolFormProps {
  protocol?: EmergencyProtocol;
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: 'fire', label: '🚒 Incendio' },
  { value: 'medical', label: '🚑 Médico' },
  { value: 'police', label: '🚔 Policial' },
  { value: 'natural_disaster', label: '🌪️ Desastre Natural' },
  { value: 'security', label: '🔒 Seguridad' },
  { value: 'evacuation', label: '🏃‍♂️ Evacuación' },
  { value: 'general', label: '📋 General' },
];

const priorityOptions = [
  { value: 'critical', label: 'Crítico - Emergencia máxima' },
  { value: 'high', label: 'Alto - Requiere atención inmediata' },
  { value: 'medium', label: 'Medio - Importante' },
  { value: 'low', label: 'Bajo - Información general' },
];

export function EmergencyProtocolForm({
  protocol,
  onSuccess,
  onCancel,
}: EmergencyProtocolFormProps) {
  const [formData, setFormData] = useState({
    title: protocol?.title || '',
    description: protocol?.description || '',
    category: protocol?.category || ('general' as const),
    priority: protocol?.priority || ('medium' as const),
    pdfUrl: protocol?.pdfUrl || '',
    thumbnailUrl: protocol?.thumbnailUrl || '',
    emergencyContacts: protocol?.emergencyContacts || [
      { name: '', phone: '', role: '' },
    ],
    steps: protocol?.steps || [''],
    isActive: protocol?.isActive ?? true,
    offlineAvailable: protocol?.offlineAvailable ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createProtocol = useMutation(
    api.emergency_protocols.createEmergencyProtocol
  );
  const updateProtocol = useMutation(
    api.emergency_protocols.updateEmergencyProtocol
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.pdfUrl.trim()
    ) {
      toast.error('El título, descripción y URL del PDF son obligatorios.');
      return;
    }

    // Validate emergency contacts
    const validContacts = formData.emergencyContacts.filter(
      contact =>
        contact.name.trim() && contact.phone.trim() && contact.role.trim()
    );
    if (validContacts.length === 0) {
      toast.error('Debe incluir al menos un contacto de emergencia.');
      return;
    }

    // Validate steps
    const validSteps = formData.steps.filter(step => step.trim());
    if (validSteps.length === 0) {
      toast.error('Debe incluir al menos un paso en las instrucciones.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (protocol) {
        // Update existing protocol
        await updateProtocol({
          protocolId: protocol._id as Id<'emergencyProtocols'>,
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
          pdfUrl: formData.pdfUrl.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
          emergencyContacts: validContacts,
          steps: validSteps,
          isActive: formData.isActive,
          offlineAvailable: formData.offlineAvailable,
        });

        toast.success('Protocolo de emergencia actualizado exitosamente.');
      } else {
        // Create new protocol
        // Note: We'll need to get the current user ID from Clerk in the actual implementation
        // For now, this assumes we have access to the user ID
        await createProtocol({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
          pdfUrl: formData.pdfUrl.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
          emergencyContacts: validContacts,
          steps: validSteps,
          offlineAvailable: formData.offlineAvailable,
          createdBy: 'temp-user-id' as Id<'users'>, // This needs to be replaced with actual user ID
        });

        toast.success('Protocolo de emergencia creado exitosamente.');
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting protocol:', error);
      toast.error(
        'Hubo un error al guardar el protocolo. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: '', phone: '', role: '' },
      ],
    }));
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ''],
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (file: File, type: 'pdf' | 'thumbnail') => {
    setIsUploading(true);
    try {
      // This is a placeholder for file upload logic
      // In a real implementation, you'd upload to Convex storage
      const mockUrl = `https://storage.example.com/${file.name}`;
      if (type === 'pdf') {
        setFormData(prev => ({ ...prev, pdfUrl: mockUrl }));
      } else {
        setFormData(prev => ({ ...prev, thumbnailUrl: mockUrl }));
      }
      toast.success(
        `${type === 'pdf' ? 'PDF' : 'Miniatura'} subida exitosamente.`
      );
    } catch (error) {
      toast.error(
        `Error al subir el ${type === 'pdf' ? 'PDF' : 'archivo de miniatura'}.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del Protocolo *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => handleInputChange('title', e.target.value)}
          placeholder="Ej: Protocolo de Incendio en Edificios"
          required
          maxLength={200}
        />
        <p className="text-xs text-gray-500">
          {formData.title.length}/200 caracteres
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          placeholder="Describe brevemente el protocolo y cuándo aplicarlo"
          required
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500">
          {formData.description.length}/1000 caracteres
        </p>
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value: string) =>
              handleInputChange('category', value)
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
            onValueChange={(value: string) =>
              handleInputChange('priority', value)
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
      </div>

      {/* PDF Upload */}
      <div className="space-y-2">
        <Label htmlFor="pdf">Documento PDF *</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="pdf"
            value={formData.pdfUrl}
            onChange={e => handleInputChange('pdfUrl', e.target.value)}
            placeholder="URL del documento PDF"
            required
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf';
              input.onchange = e => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(file, 'pdf');
              };
              input.click();
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Subir PDF'}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Sube un documento PDF con el protocolo completo o ingresa la URL.
        </p>
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Imagen de Miniatura (Opcional)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="thumbnail"
            value={formData.thumbnailUrl}
            onChange={e => handleInputChange('thumbnailUrl', e.target.value)}
            placeholder="URL de la imagen de miniatura"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = e => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(file, 'thumbnail');
              };
              input.click();
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Contactos de Emergencia *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmergencyContact}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Contacto
          </Button>
        </div>

        {formData.emergencyContacts.map((contact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 border rounded-lg"
          >
            <div>
              <Label className="text-xs">Nombre</Label>
              <Input
                value={contact.name}
                onChange={e =>
                  updateEmergencyContact(index, 'name', e.target.value)
                }
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Teléfono</Label>
              <Input
                value={contact.phone}
                onChange={e =>
                  updateEmergencyContact(index, 'phone', e.target.value)
                }
                placeholder="+56912345678"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Rol</Label>
              <Input
                value={contact.role}
                onChange={e =>
                  updateEmergencyContact(index, 'role', e.target.value)
                }
                placeholder="Bombero, Médico, etc."
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeEmergencyContact(index)}
                disabled={formData.emergencyContacts.length === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Instrucciones Paso a Paso *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Paso
          </Button>
        </div>

        {formData.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-2"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
              {index + 1}
            </div>
            <Textarea
              value={step}
              onChange={e => updateStep(index, e.target.value)}
              placeholder={`Describe el paso ${index + 1} del protocolo`}
              rows={2}
              className="flex-1"
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeStep(index)}
              disabled={formData.steps.length === 1}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={checked => handleInputChange('isActive', checked)}
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Protocolo Activo
          </Label>
        </div>
        <p className="text-xs text-gray-500">
          Los protocolos inactivos no serán visibles para los usuarios.
        </p>

        <div className="flex items-center space-x-2">
          <Switch
            id="offlineAvailable"
            checked={formData.offlineAvailable}
            onCheckedChange={checked =>
              handleInputChange('offlineAvailable', checked)
            }
          />
          <Label htmlFor="offlineAvailable" className="text-sm font-medium">
            Disponible sin conexión
          </Label>
        </div>
        <p className="text-xs text-gray-500">
          Permite que el protocolo se descargue para acceso sin conexión.
        </p>
      </div>

      {/* Priority Warning */}
      {(formData.priority === 'high' || formData.priority === 'critical') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              Protocolo de Alta Prioridad
            </p>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
            Este protocolo aparecerá destacado y será prioritario en situaciones
            de emergencia.
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.pdfUrl.trim()
          }
        >
          {isSubmitting
            ? 'Guardando...'
            : protocol
              ? 'Actualizar Protocolo'
              : 'Crear Protocolo'}
        </Button>
      </div>
    </motion.form>
  );
}
