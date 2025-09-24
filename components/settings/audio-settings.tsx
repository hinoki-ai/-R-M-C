'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Settings, RotateCcw } from 'lucide-react';
import { useAudioSystem } from '@/hooks/use-audio-system';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AudioSettingsProps {
  className?: string;
}

export function AudioSettings({ className }: AudioSettingsProps) {
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    playWelcome,
    playEmergency,
    playSuccess,
    playError,
  } = useAudioSystem();
  const [testPlaying, setTestPlaying] = useState<string | null>(null);

  const handleTestSound = async (soundType: string) => {
    setTestPlaying(soundType);
    try {
      switch (soundType) {
        case 'welcome':
          playWelcome();
          break;
        case 'emergency':
          playEmergency();
          break;
        case 'success':
          playSuccess();
          break;
        case 'error':
          playError();
          break;
      }
    } catch (error) {
      console.error('Error testing sound:', error);
    } finally {
      setTimeout(() => setTestPlaying(null), 2000);
    }
  };

  const updateMasterVolume = (value: number[]) => {
    updatePreferences({ masterVolume: value[0] });
  };

  const updateCategoryVolume = (
    category: 'ui' | 'voice' | 'alerts',
    value: number[]
  ) => {
    updatePreferences({
      categoryVolumes: {
        ...preferences.categoryVolumes,
        [category]: value[0],
      },
    });
  };

  const toggleCategory = (category: 'ui' | 'voice' | 'alerts') => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: !preferences.categories[category],
      },
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Configuración de Audio
        </CardTitle>
        <CardDescription>
          Personaliza tu experiencia auditiva en la plataforma comunitaria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="test">Probar</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Volumen General</Label>
              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[preferences.masterVolume]}
                  onValueChange={updateMasterVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-12">
                  {Math.round(preferences.masterVolume * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Restablecer Configuración
                </Label>
                <p className="text-xs text-muted-foreground">
                  Vuelve a la configuración de audio predeterminada
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreferences}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restablecer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* UI Sounds */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Sonidos de Interfaz
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Clicks, hovers y transiciones de la interfaz
                    </CardDescription>
                  </div>
                  <Switch
                    checked={preferences.categories.ui}
                    onCheckedChange={() => toggleCategory('ui')}
                  />
                </div>
              </CardHeader>
              {preferences.categories.ui && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Volumen de UI</Label>
                    <Slider
                      value={[preferences.categoryVolumes.ui]}
                      onValueChange={value => updateCategoryVolume('ui', value)}
                      max={1}
                      min={0}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Voice Announcements */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Anuncios de Voz</CardTitle>
                    <CardDescription className="text-sm">
                      Mensajes de voz comunitarios y actualizaciones
                    </CardDescription>
                  </div>
                  <Switch
                    checked={preferences.categories.voice}
                    onCheckedChange={() => toggleCategory('voice')}
                  />
                </div>
              </CardHeader>
              {preferences.categories.voice && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Volumen de Voz</Label>
                    <Slider
                      value={[preferences.categoryVolumes.voice]}
                      onValueChange={value =>
                        updateCategoryVolume('voice', value)
                      }
                      max={1}
                      min={0}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Emergency Alerts */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Alertas de Emergencia
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Notificaciones críticas de seguridad (siempre recomendado
                      activar)
                    </CardDescription>
                  </div>
                  <Switch
                    checked={preferences.categories.alerts}
                    onCheckedChange={() => toggleCategory('alerts')}
                  />
                </div>
              </CardHeader>
              {preferences.categories.alerts && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Volumen de Alertas</Label>
                    <Slider
                      value={[preferences.categoryVolumes.alerts]}
                      onValueChange={value =>
                        updateCategoryVolume('alerts', value)
                      }
                      max={1}
                      min={0}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Haz clic en los botones para probar diferentes tipos de audio
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleTestSound('welcome')}
                disabled={testPlaying === 'welcome'}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {testPlaying === 'welcome'
                  ? 'Reproduciendo...'
                  : 'Mensaje de Bienvenida'}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleTestSound('emergency')}
                disabled={testPlaying === 'emergency'}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {testPlaying === 'emergency'
                  ? 'Reproduciendo...'
                  : 'Alerta de Emergencia'}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleTestSound('success')}
                disabled={testPlaying === 'success'}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {testPlaying === 'success'
                  ? 'Reproduciendo...'
                  : 'Sonido de Éxito'}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleTestSound('error')}
                disabled={testPlaying === 'error'}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {testPlaying === 'error'
                  ? 'Reproduciendo...'
                  : 'Sonido de Error'}
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Consejo:</strong> Las alertas de emergencia tienen el
                volumen más alto para asegurar que sean audibles en situaciones
                críticas.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
