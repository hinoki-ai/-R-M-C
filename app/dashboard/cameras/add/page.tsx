'use client';

import { IconEye, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormErrorBoundary } from '@/components/forms/form-error-boundary';
import { useFormErrorHandler } from '@/components/forms/form-error-boundary';
import { BackButton } from '@/components/shared/back-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from '@/hooks/use-toast';

export default function AddCameraPage() {
  const router = useRouter();
  const { toast } = useToast();

  const addCameraMutation = useMutation(api.cameras.addCamera);

  // Use form error handler for validation and error management
  const { handleFormError, handleValidationError, resetError } =
    useFormErrorHandler('camera');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    model: '',
    ipAddress: '',
    location: '',
    streamUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Reset form error
    resetError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!formData.name.trim()) {
      errors.name = 'El nombre de la cámara es obligatorio';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      errors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.ipAddress.trim()) {
      errors.ipAddress = 'La dirección IP es obligatoria';
    } else {
      // Basic IP address validation
      const ipRegex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ipAddress)) {
        errors.ipAddress = 'Formato de dirección IP inválido';
      }
    }

    if (!formData.streamUrl.trim()) {
      errors.streamUrl = 'La URL del stream es obligatoria';
    } else if (
      !formData.streamUrl.startsWith('rtsp://') &&
      !formData.streamUrl.startsWith('http://') &&
      !formData.streamUrl.startsWith('https://')
    ) {
      errors.streamUrl = 'La URL debe comenzar con rtsp://, http:// o https://';
    }

    if (formData.location && formData.location.length > 200) {
      errors.location = 'La ubicación no puede exceder 200 caracteres';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    resetError();
    setFieldErrors({});

    if (!validateForm()) {
      handleValidationError(
        'form',
        'Por favor corrige los errores de validación antes de enviar.'
      );
      return;
    }

    setLoading(true);

    try {
      const cameraData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        location: formData.location.trim() || undefined,
        streamUrl:
          formData.streamUrl.trim() || `rtsp://${formData.ipAddress}/stream`,
        resolution: undefined,
        frameRate: undefined,
        hasAudio: false,
      };

      const cameraId = await addCameraMutation(cameraData);

      toast({
        title: 'Cámara Agregada Exitosamente',
        description: `${formData.name} ha sido agregada a tu red de seguridad.`,
      });

      router.push(`/dashboard/cameras/${cameraId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      handleFormError(errorMessage);
      toast({
        title: 'Error al Agregar Cámara',
        description:
          'No se pudo agregar la cámara. Por favor verifica tu conexión e inténtalo nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormErrorBoundary formName="cámara" showDetailedErrors={true}>
      <BackButton className="mb-6" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <IconPlus className="h-8 w-8" />
              Agregar Cámara IP
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configura una nueva cámara IP para tu red de seguridad
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconEye className="h-5 w-5" />
                Configuración de Cámara IP
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configuración básica de cámara - características complejas han
                sido removidas por simplicidad
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Cámara *</Label>
                    <Input
                      id="name"
                      placeholder="Nombre de la cámara"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className={fieldErrors.name ? 'border-destructive' : ''}
                      required
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      placeholder="Entrada Principal"
                      value={formData.location}
                      onChange={e =>
                        handleInputChange('location', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Camera Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca de Cámara</Label>
                  <Select
                    value={formData.brand}
                    onValueChange={value => handleInputChange('brand', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar marca de cámara" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hikvision">Hikvision</SelectItem>
                      <SelectItem value="dahua">Dahua</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Camera Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de Cámara</Label>
                  <Input
                    id="model"
                    placeholder="Modelo de cámara"
                    value={formData.model}
                    onChange={e => handleInputChange('model', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción opcional de la cámara..."
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={3}
                  />
                </div>

                {/* Network Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Configuración de Red
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress">Dirección IP *</Label>
                      <Input
                        id="ipAddress"
                        placeholder="192.168.1.100"
                        value={formData.ipAddress}
                        onChange={e =>
                          handleInputChange('ipAddress', e.target.value)
                        }
                        className={
                          fieldErrors.ipAddress ? 'border-destructive' : ''
                        }
                        required
                      />
                      {fieldErrors.ipAddress && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.ipAddress}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streamUrl">URL del Stream *</Label>
                      <Input
                        id="streamUrl"
                        placeholder="rtsp://192.168.1.100/stream"
                        value={formData.streamUrl}
                        onChange={e =>
                          handleInputChange('streamUrl', e.target.value)
                        }
                        className={
                          fieldErrors.streamUrl ? 'border-destructive' : ''
                        }
                        required
                      />
                      <p className="text-xs text-gray-500">
                        URL RTSP o HTTP para el feed de la cámara
                      </p>
                      {fieldErrors.streamUrl && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.streamUrl}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Agregando Cámara...' : 'Agregar Cámara'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </FormErrorBoundary>
  );
}
