'use client';

import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, User } from 'lucide-react';
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

interface Contact {
  _id: string;
  name: string;
  position?: string;
  department?: string;
  phone?: string;
  email?: string;
  address?: string;
  availability?: string;
  hours?: string;
  type:
    | 'directiva'
    | 'seguridad'
    | 'social'
    | 'municipal'
    | 'health'
    | 'police'
    | 'fire'
    | 'service';
  description?: string;
  location?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface ContactFormProps {
  contact?: Contact;
  onSuccess: () => void;
  onCancel: () => void;
}

const contactTypeOptions = [
  {
    value: 'directiva',
    label: '🏛️ Directiva',
    description: 'Miembros de la junta de vecinos',
  },
  {
    value: 'seguridad',
    label: '🛡️ Seguridad',
    description: 'Servicios de seguridad comunitaria',
  },
  {
    value: 'social',
    label: '🤝 Social',
    description: 'Servicios sociales y comunitarios',
  },
  {
    value: 'municipal',
    label: '🏛️ Municipal',
    description: 'Servicios municipales oficiales',
  },
  { value: 'health', label: '🏥 Salud', description: 'Servicios de salud' },
  {
    value: 'police',
    label: '🚔 Policía',
    description: 'Policía y Carabineros',
  },
  { value: 'fire', label: '🚒 Bomberos', description: 'Cuerpo de Bomberos' },
  {
    value: 'service',
    label: '🔧 Servicio',
    description: 'Otros servicios comunitarios',
  },
];

export function ContactForm({
  contact,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    position: contact?.position || '',
    department: contact?.department || '',
    phone: contact?.phone || '',
    email: contact?.email || '',
    address: contact?.address || '',
    availability: contact?.availability || '',
    hours: contact?.hours || '',
    type: contact?.type || ('service' as const),
    description: contact?.description || '',
    location: contact?.location || '',
    isActive: contact?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createContact = useMutation(api.contacts.createContact);
  const updateContact = useMutation(api.contacts.updateContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (contact) {
        // Edit existing contact
        await updateContact({
          contactId: contact._id as Id<'contacts'>,
          name: formData.name.trim(),
          position: formData.position.trim() || undefined,
          department: formData.department.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          address: formData.address.trim() || undefined,
          availability: formData.availability.trim() || undefined,
          hours: formData.hours.trim() || undefined,
          type: formData.type,
          description: formData.description.trim() || undefined,
          location: formData.location.trim() || undefined,
          isActive: formData.isActive,
        });

        toast.success('Contacto actualizado exitosamente.');
      } else {
        // Create new contact
        await createContact({
          name: formData.name.trim(),
          position: formData.position.trim() || undefined,
          department: formData.department.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          address: formData.address.trim() || undefined,
          availability: formData.availability.trim() || undefined,
          hours: formData.hours.trim() || undefined,
          type: formData.type,
          description: formData.description.trim() || undefined,
          location: formData.location.trim() || undefined,
        });

        toast.success('Contacto creado exitosamente.');
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast.error(
        'Hubo un error al guardar el contacto. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Información Básica</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Contacto *</Label>
            <Select
              value={formData.type}
              onValueChange={value => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {contactTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Cargo/Posición</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={e => handleInputChange('position', e.target.value)}
              placeholder="Ej: Presidente, Secretario, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={e => handleInputChange('department', e.target.value)}
              placeholder="Ej: Administración, Servicios"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold">Información de Contacto</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder="+56 9 XXXX XXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="contacto@ejemplo.cl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            placeholder="Dirección completa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder="Ej: Pinto, Ñuble, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilidad</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={e => handleInputChange('availability', e.target.value)}
              placeholder="Ej: Lunes a Viernes, 24/7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hours">Horarios</Label>
          <Input
            id="hours"
            value={formData.hours}
            onChange={e => handleInputChange('hours', e.target.value)}
            placeholder="Horarios de atención detallados"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Información Adicional</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Descripción detallada del contacto o servicio"
            rows={3}
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="isActive" className="text-base font-medium">
              Contacto Activo
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Los contactos inactivos no se muestran en el sitio público
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={checked => handleInputChange('isActive', checked)}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting ? 'Guardando...' : contact ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </motion.form>
  );
}
