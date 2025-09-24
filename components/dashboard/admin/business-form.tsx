'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Business {
  _id?: string;
  name: string;
  description: string;
  category: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros';
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
  ownerName: string;
  verified: boolean;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface BusinessFormProps {
  business?: Business | null;
  onSave: () => void;
  onCancel: () => void;
}

const categoryLabels = {
  supermercado: 'Supermercado',
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  farmacia: 'Farmacia',
  ferreteria: 'Ferretería',
  otros: 'Otros',
};

export function BusinessForm({ business, onSave, onCancel }: BusinessFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: business?.name || '',
    description: business?.description || '',
    category: business?.category || 'otros',
    address: business?.address || '',
    phone: business?.phone || '',
    email: business?.email || '',
    website: business?.website || '',
    hours: business?.hours || '',
    rating: business?.rating || 3,
    featured: business?.featured || false,
    isActive: business?.isActive ?? true,
    verified: business?.verified || false,
    ownerName: business?.ownerName || '',
    latitude: business?.latitude || '',
    longitude: business?.longitude || '',
    imageUrl: business?.imageUrl || '',
    facebook: business?.socialMedia?.facebook || '',
    instagram: business?.socialMedia?.instagram || '',
    twitter: business?.socialMedia?.twitter || '',
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock save - replace with real mutation
      console.log('Save business:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave();
    } catch (error) {
      console.error('Error saving business:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Información Básica</h3>

          <div>
            <Label htmlFor="name">Nombre del Comercio</Label>
            <Input
              id="name"
              placeholder="Ej: Supermercados Los Pellines"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe los productos y servicios que ofrece..."
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="ownerName">Nombre del Propietario</Label>
            <Input
              id="ownerName"
              placeholder="Ej: Juan Pérez"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Información de Contacto</h3>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Ej: Calle Comercio 321, Pinto"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="Ej: +56 9 1234 5678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contacto@ejemplo.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              placeholder="https://ejemplo.com"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="hours">Horario de Atención</Label>
            <Input
              id="hours"
              placeholder="Ej: Lunes a Domingo: 8:00 - 22:00"
              value={formData.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Adicional</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rating">Rating (1-5 estrellas)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || 3)}
            />
          </div>

          <div>
            <Label htmlFor="latitude">Latitud</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              placeholder="-36.6975"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitud</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              placeholder="-71.8908"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="imageUrl">URL de Imagen</Label>
          <Input
            id="imageUrl"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
          />
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/username"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="@username"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              placeholder="@username"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Status Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Estado y Configuración</h3>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', !!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="featured">Comercio Destacado</Label>
              <p className="text-sm text-muted-foreground">
                Aparece en la sección de destacados
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={formData.verified}
              onCheckedChange={(checked) => handleInputChange('verified', !!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="verified">Verificado</Label>
              <p className="text-sm text-muted-foreground">
                Información verificada por la comunidad
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', !!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="isActive">Activo</Label>
              <p className="text-sm text-muted-foreground">
                Visible en el directorio público
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : business ? 'Actualizar Comercio' : 'Crear Comercio'}
        </Button>
      </div>
    </form>
  );
}