'use client';

import {
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Upload,
  X,
  Zap,
  Search,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';
import React, { useCallback, useEffect, useReducer, useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getModifiedSettings, hasUnsavedChanges, settingsReducer } from '@/lib/stores/settings-reducer';
import { DEFAULT_SETTINGS, SettingsState, SystemHealth } from '@/types/settings';

interface SettingsModalProps {
  children: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);
  const [originalSettings] = useState(DEFAULT_SETTINGS);

  const [systemHealth] = useState<SystemHealth>({
    configValid: true,
    lastBackup: '2 horas atrás',
    pendingUpdates: 0,
    securityScore: 95,
    databaseStatus: 'healthy',
    emailStatus: 'connected',
    cacheStatus: 'active',
  });

  const modifiedSettings = getModifiedSettings(settings, originalSettings);
  const unsavedChanges = hasUnsavedChanges(settings, originalSettings);

  const handleSettingChange = (key: keyof SettingsState, value: unknown) => {
    dispatch({ type: 'UPDATE_SETTING', key, value });
  };

  const handleSaveSettings = useCallback(() => {
    console.log('Saving settings:', settings);
    setIsOpen(false);
  }, [settings]);

  const handleClose = useCallback(() => {
    if (unsavedChanges) {
      const confirm = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?');
      if (!confirm) return;
    }
    setIsOpen(false);
  }, [unsavedChanges]);

  // Filter settings based on search
  const filteredSettings = useMemo(() => {
    if (!searchQuery) return settings;
    // Simple search implementation - can be enhanced
    return settings;
  }, [settings, searchQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSaveSettings();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, handleSaveSettings]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-4xl h-[85vh] p-0 gap-0 overflow-hidden'>
        <DialogHeader className='px-6 py-4 border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <Settings className='h-4 w-4 text-white' />
              </div>
              <div>
                <DialogTitle className='text-lg font-semibold'>
                  Configuración del Sistema
                </DialogTitle>
                <p className='text-sm text-muted-foreground'>
                  Gestiona la configuración de JuntaDeVecinos
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {unsavedChanges && (
                <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  {modifiedSettings.length} cambios
                </Badge>
              )}

              {unsavedChanges && (
                <Button onClick={handleSaveSettings} size='sm'>
                  <Save className='h-4 w-4 mr-2' />
                  Guardar
                </Button>
              )}

              <Button variant='ghost' size='sm' onClick={handleClose}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex flex-col h-full overflow-hidden'>
          {/* SEARCH BAR */}
          <div className='px-6 py-4 border-b bg-slate-50/50'>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar configuraciones...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button variant='outline' size='sm'>
                <Filter className='h-4 w-4 mr-2' />
                Filtros
              </Button>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col h-full'>
            <div className='px-6 py-3 border-b'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='general'>General</TabsTrigger>
                <TabsTrigger value='security'>Seguridad</TabsTrigger>
                <TabsTrigger value='performance'>Rendimiento</TabsTrigger>
                <TabsTrigger value='advanced'>Avanzado</TabsTrigger>
              </TabsList>
            </div>

            {/* MAIN CONTENT */}
            <div className='flex-1 overflow-auto p-6'>
              <TabsContent value='general' className='h-full m-0'>
                <div className='space-y-6'>
                  {/* System Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <CheckCircle className='h-5 w-5 text-green-600' />
                        Estado del Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='text-center p-4 bg-green-50 rounded-lg'>
                          <div className='text-2xl font-bold text-green-600'>{systemHealth.securityScore}%</div>
                          <div className='text-sm text-muted-foreground'>Seguridad</div>
                        </div>
                        <div className='text-center p-4 bg-blue-50 rounded-lg'>
                          <div className='text-2xl font-bold text-blue-600'>{systemHealth.databaseStatus}</div>
                          <div className='text-sm text-muted-foreground'>Base de Datos</div>
                        </div>
                        <div className='text-center p-4 bg-purple-50 rounded-lg'>
                          <div className='text-2xl font-bold text-purple-600'>{systemHealth.cacheStatus}</div>
                          <div className='text-sm text-muted-foreground'>Cache</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* General Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración General</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Nombre del Sistema</Label>
                          <p className='text-xs text-muted-foreground'>Nombre público del sistema</p>
                        </div>
                        <Input
                          value={settings.systemName}
                          onChange={(e) => handleSettingChange('systemName', e.target.value)}
                          className='w-48'
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Zona Horaria</Label>
                          <p className='text-xs text-muted-foreground'>Zona horaria del sistema</p>
                        </div>
                        <Select
                          value={settings.systemTimezone}
                          onValueChange={(value) => handleSettingChange('systemTimezone', value)}
                        >
                          <SelectTrigger className='w-48'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='America/Santiago'>America/Santiago</SelectItem>
                            <SelectItem value='UTC'>UTC</SelectItem>
                            <SelectItem value='America/New_York'>America/New_York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Tema</Label>
                          <p className='text-xs text-muted-foreground'>Tema visual del sistema</p>
                        </div>
                        <Select
                          value={settings.systemTheme}
                          onValueChange={(value) => handleSettingChange('systemTheme', value)}
                        >
                          <SelectTrigger className='w-48'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='light'>Claro</SelectItem>
                            <SelectItem value='dark'>Oscuro</SelectItem>
                            <SelectItem value='system'>Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200'>
                        <div>
                          <Label className='text-sm font-medium text-red-800'>Modo Mantenimiento</Label>
                          <p className='text-xs text-red-600'>Activar modo mantenimiento</p>
                        </div>
                        <Switch
                          checked={settings.maintenanceMode}
                          onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='security' className='h-full m-0'>
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Shield className='h-5 w-5 text-blue-600' />
                        Configuración de Seguridad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Autenticación de Dos Factores</Label>
                          <p className='text-xs text-muted-foreground'>Requerir 2FA para todos los usuarios</p>
                        </div>
                        <Switch
                          checked={settings.twoFactorAuth}
                          onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Sesión Timeout (minutos)</Label>
                          <p className='text-xs text-muted-foreground'>Tiempo de inactividad antes de cerrar sesión</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Slider
                            value={[settings.sessionTimeout]}
                            onValueChange={([value]) => handleSettingChange('sessionTimeout', value)}
                            max={480}
                            min={5}
                            step={5}
                            className='w-32'
                          />
                          <span className='text-sm font-medium w-12'>{settings.sessionTimeout}m</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Logs de Seguridad</Label>
                          <p className='text-xs text-muted-foreground'>Registrar eventos de seguridad</p>
                        </div>
                        <Switch
                          checked={settings.securityLogs}
                          onCheckedChange={(checked) => handleSettingChange('securityLogs', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='performance' className='h-full m-0'>
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Zap className='h-5 w-5 text-yellow-600' />
                        Optimización de Rendimiento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Cache TTL (segundos)</Label>
                          <p className='text-xs text-muted-foreground'>Tiempo de vida del cache</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Slider
                            value={[settings.cacheTTL]}
                            onValueChange={([value]) => handleSettingChange('cacheTTL', value)}
                            max={3600}
                            min={60}
                            step={60}
                            className='w-32'
                          />
                          <span className='text-sm font-medium w-12'>{settings.cacheTTL}s</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Compresión de Imágenes</Label>
                          <p className='text-xs text-muted-foreground'>Comprimir imágenes automáticamente</p>
                        </div>
                        <Switch
                          checked={settings.imageCompression}
                          onCheckedChange={(checked) => handleSettingChange('imageCompression', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Lazy Loading</Label>
                          <p className='text-xs text-muted-foreground'>Cargar contenido bajo demanda</p>
                        </div>
                        <Switch
                          checked={settings.lazyLoading}
                          onCheckedChange={(checked) => handleSettingChange('lazyLoading', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='advanced' className='h-full m-0'>
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Settings className='h-5 w-5 text-purple-600' />
                        Configuración Avanzada
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>Debug Mode</Label>
                          <p className='text-xs text-muted-foreground'>Activar logs detallados para desarrollo</p>
                        </div>
                        <Switch
                          checked={settings.debugMode}
                          onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>API Rate Limit (req/min)</Label>
                          <p className='text-xs text-muted-foreground'>Límite de requests por minuto</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Slider
                            value={[settings.apiRateLimit]}
                            onValueChange={([value]) => handleSettingChange('apiRateLimit', value)}
                            max={1000}
                            min={10}
                            step={10}
                            className='w-32'
                          />
                          <span className='text-sm font-medium w-12'>{settings.apiRateLimit}</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                        <div>
                          <Label className='text-sm font-medium text-yellow-800'>Reset Completo</Label>
                          <p className='text-xs text-yellow-600'>Restaurar configuración a valores por defecto</p>
                        </div>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => {
                            if (confirm('¿Estás seguro de resetear toda la configuración?')) {
                              dispatch({ type: 'RESET_ALL' });
                            }
                          }}
                        >
                          <RefreshCw className='h-4 w-4 mr-2' />
                          Resetear
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;