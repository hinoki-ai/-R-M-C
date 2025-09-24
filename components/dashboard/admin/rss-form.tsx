'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { Clock, Globe, Rss } from 'lucide-react';
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

interface RssFeed {
  _id: string;
  name: string;
  url: string;
  description?: string;
  category: 'news' | 'sports' | 'local' | 'politics' | 'emergency';
  region: string;
  isActive: boolean;
  fetchInterval: number;
  logoUrl?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface RssFormProps {
  feed?: RssFeed;
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryConfig = {
  news: { emoji: '📰', label: 'Noticias' },
  sports: { emoji: '⚽', label: 'Deportes' },
  local: { emoji: '🏘️', label: 'Local' },
  politics: { emoji: '🏛️', label: 'Política' },
  emergency: { emoji: '🚨', label: 'Emergencia' },
};

const regionConfig = {
  Ñuble: 'Ñuble',
  Biobío: 'Biobío',
  Nacional: 'Nacional',
};

export function RssForm({ feed, onSuccess, onCancel }: RssFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: feed?.name || '',
    url: feed?.url || '',
    description: feed?.description || '',
    category: feed?.category || ('news' as const),
    region: feed?.region || ('Ñuble' as const),
    isActive: feed?.isActive ?? true,
    fetchInterval: feed?.fetchInterval || 60,
    logoUrl: feed?.logoUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRssFeed = useMutation(api.rss.createRssFeed);
  const updateRssFeed = useMutation(api.rss.updateRssFeed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('El nombre y URL son obligatorios.');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      toast.error('La URL proporcionada no es válida.');
      return;
    }

    if (formData.fetchInterval < 5 || formData.fetchInterval > 1440) {
      toast.error('El intervalo de fetch debe estar entre 5 y 1440 minutos.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (feed) {
        // Edit existing feed
        await updateRssFeed({
          feedId: feed._id as Id<'rssFeeds'>,
          name: formData.name.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          region: formData.region,
          isActive: formData.isActive,
          fetchInterval: formData.fetchInterval,
          logoUrl: formData.logoUrl.trim() || undefined,
        });

        toast.success('Feed RSS actualizado exitosamente.');
      } else {
        // Create new feed
        if (!user?.id) {
          toast.error('Usuario no autenticado.');
          return;
        }

        await createRssFeed({
          name: formData.name.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          region: formData.region,
          fetchInterval: formData.fetchInterval,
          logoUrl: formData.logoUrl.trim() || undefined,
          createdBy: user.id as Id<'users'>,
        });

        toast.success('Feed RSS creado exitosamente.');
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting RSS feed:', error);
      toast.error(
        'Hubo un error al guardar el feed RSS. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center space-x-2">
          <Rss className="w-4 h-4" />
          <span>Nombre del Feed</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="Ej: Diario El Centro"
          required
        />
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url" className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>URL del Feed RSS</span>
        </Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={e =>
            setFormData(prev => ({ ...prev, url: e.target.value }))
          }
          placeholder="https://ejemplo.com/feed.xml"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e =>
            setFormData(prev => ({ ...prev, description: e.target.value }))
          }
          placeholder="Descripción opcional del feed RSS..."
          rows={3}
        />
      </div>

      {/* Category and Region */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoría</Label>
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
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center space-x-2">
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Región</Label>
          <Select
            value={formData.region}
            onValueChange={(value: any) =>
              setFormData(prev => ({ ...prev, region: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(regionConfig).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fetch Interval */}
      <div className="space-y-2">
        <Label htmlFor="fetchInterval" className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Intervalo de Fetch (minutos)</span>
        </Label>
        <Input
          id="fetchInterval"
          type="number"
          min={5}
          max={1440}
          value={formData.fetchInterval}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              fetchInterval: parseInt(e.target.value) || 60,
            }))
          }
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Intervalo entre actualizaciones automáticas del feed (5-1440 minutos)
        </p>
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <Label htmlFor="logoUrl">URL del Logo (opcional)</Label>
        <Input
          id="logoUrl"
          type="url"
          value={formData.logoUrl}
          onChange={e =>
            setFormData(prev => ({ ...prev, logoUrl: e.target.value }))
          }
          placeholder="https://ejemplo.com/logo.png"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={checked =>
            setFormData(prev => ({ ...prev, isActive: checked }))
          }
        />
        <Label htmlFor="isActive">Feed activo</Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : feed
              ? 'Actualizar Feed'
              : 'Crear Feed'}
        </Button>
      </div>
    </motion.form>
  );
}
