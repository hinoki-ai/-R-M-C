'use client';

import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Plus, Save, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

interface EventFormProps {
  eventId?: Id<'calendarEvents'>;
  selectedDate?: Date;
  onSave?: (eventId: Id<'calendarEvents'>) => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  categoryId: Id<'eventCategories'>;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
    count?: number;
  } | null;
  maxAttendees: number;
  isPublic: boolean;
  requiresApproval: boolean;
  inviteUserIds: Id<'users'>[];
}

const defaultFormData: FormData = {
  title: '',
  description: '',
  categoryId: '' as Id<'eventCategories'>,
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  isAllDay: false,
  isRecurring: false,
  recurrenceRule: null,
  maxAttendees: 50, // Default reasonable limit
  isPublic: true,
  requiresApproval: false,
  inviteUserIds: [],
};

export function EventForm({
  eventId,
  selectedDate,
  onSave,
  onCancel,
}: EventFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<keyof FormData, string>>(
    {} as Record<keyof FormData, string>
  );

  const categories = useQuery(api.calendar.getEventCategories) || [];

  const createEvent = useMutation(api.calendar.createEvent);
  const updateEvent = useMutation(api.calendar.updateEvent);

  // Always load events data
  const allEvents =
    useQuery(api.calendar.getEvents, { userId: undefined }) || [];

  // If editing existing event, find its data
  const existingEvent = eventId
    ? allEvents.find((event: any) => event._id === eventId)
    : null;

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description || '',
        categoryId: existingEvent.categoryId,
        startDate: existingEvent.startDate,
        endDate: existingEvent.endDate,
        startTime: existingEvent.startTime || '09:00',
        endTime: existingEvent.endTime || '10:00',
        location: existingEvent.location || '',
        isAllDay: existingEvent.isAllDay,
        isRecurring: existingEvent.isRecurring,
        recurrenceRule: existingEvent.recurrenceRule || null,
        maxAttendees: existingEvent.maxAttendees || 0,
        isPublic: existingEvent.isPublic,
        requiresApproval: existingEvent.requiresApproval,
        inviteUserIds: [],
      });
    }
  }, [existingEvent]);

  const validateForm = (): boolean => {
    const newErrors: Record<keyof FormData, string> = {} as Record<
      keyof FormData,
      string
    >;

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }

    if (formData.startDate > formData.endDate) {
      newErrors.endDate =
        'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (!formData.isAllDay && formData.startTime >= formData.endTime) {
      newErrors.endTime =
        'La hora de fin debe ser posterior a la hora de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (eventId) {
        // Update existing event
        await updateEvent({
          eventId,
          title: formData.title,
          description: formData.description || undefined,
          categoryId: formData.categoryId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          location: formData.location || undefined,
          isAllDay: formData.isAllDay,
          maxAttendees: formData.maxAttendees || undefined,
          isPublic: formData.isPublic,
          requiresApproval: formData.requiresApproval,
        });
        onSave?.(eventId);
      } else {
        // Create new event
        const newEventId = await createEvent({
          title: formData.title,
          description: formData.description || undefined,
          categoryId: formData.categoryId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          location: formData.location || undefined,
          isAllDay: formData.isAllDay,
          isRecurring: formData.isRecurring,
          recurrenceRule: formData.recurrenceRule || undefined,
          maxAttendees: formData.maxAttendees || undefined,
          isPublic: formData.isPublic,
          requiresApproval: formData.requiresApproval,
          inviteUserIds:
            formData.inviteUserIds.length > 0
              ? formData.inviteUserIds
              : undefined,
        });
        onSave?.(newEventId);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedCategory = categories.find(
    cat => cat._id === formData.categoryId
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {eventId ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => updateFormData('title', e.target.value)}
                placeholder="Nombre del evento"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => updateFormData('description', e.target.value)}
                placeholder="Descripción del evento"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={value => updateFormData('categoryId', value)}
              >
                <SelectTrigger
                  className={errors.categoryId ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            {selectedCategory && (
              <div className="flex items-center gap-2">
                <Badge
                  style={{
                    backgroundColor: selectedCategory.color + '20',
                    color: selectedCategory.color,
                    borderColor: selectedCategory.color,
                  }}
                  variant="outline"
                >
                  <span className="mr-1">{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAllDay"
                checked={formData.isAllDay}
                onCheckedChange={checked => updateFormData('isAllDay', checked)}
              />
              <Label htmlFor="isAllDay">Todo el día</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha de inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={e => updateFormData('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">Fecha de fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={e => updateFormData('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {!formData.isAllDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={e => updateFormData('startTime', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">Hora de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={e => updateFormData('endTime', e.target.value)}
                    className={errors.endTime ? 'border-red-500' : ''}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Location and Capacity */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={e => updateFormData('location', e.target.value)}
                  placeholder="Lugar del evento"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxAttendees">
                Capacidad máxima (0 = ilimitada)
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="maxAttendees"
                  type="number"
                  min="0"
                  value={formData.maxAttendees}
                  onChange={e =>
                    updateFormData(
                      'maxAttendees',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={checked => updateFormData('isPublic', checked)}
              />
              <Label htmlFor="isPublic">Evento público</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresApproval"
                checked={formData.requiresApproval}
                onCheckedChange={checked =>
                  updateFormData('requiresApproval', checked)
                }
              />
              <Label htmlFor="requiresApproval">
                Requiere aprobación para asistir
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting
                ? 'Guardando...'
                : eventId
                  ? 'Actualizar'
                  : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
