'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Database,
  Download,
  Mail,
  Palette,
  RefreshCw,
  Save,
  Settings,
  Shield,
  TrendingUp,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useReducer, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getModifiedSettings, hasUnsavedChanges, settingsReducer } from '@/lib/stores/settings-reducer';
import { DEFAULT_SETTINGS, SettingsState, SystemHealth } from '@/types/settings';

import SettingsPanels from './settings-panels';


interface SettingsModalProps {
  children: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
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

  const handleResetSection = useCallback((section: string) => {
    dispatch({ type: 'RESET_SECTION', section });
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    // Show success feedback
    setIsOpen(false);
  }, [settings]);

  const handleClose = useCallback(() => {
    if (unsavedChanges) {
      const confirm = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?');
      if (!confirm) return;
    }
    setIsOpen(false);
  }, [unsavedChanges]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S: Save settings
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSaveSettings();
      }

      // Ctrl+R: Reset current section
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        if (activeSection !== 'overview') {
          handleResetSection(activeSection);
        }
      }

      // Escape: Close modal (with confirmation)
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }

      // Tab navigation between sections
      if (event.key === 'Tab' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        const sections = ['overview', 'system', 'security', 'database', 'notifications', 'performance', 'ui', 'features', 'advanced'];
        const currentIndex = sections.indexOf(activeSection);
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + sections.length) % sections.length
          : (currentIndex + 1) % sections.length;
        setActiveSection(sections[nextIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeSection, unsavedChanges, handleClose, handleSaveSettings, handleResetSection]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-7xl h-[90vh] p-0 gap-0 overflow-hidden'>
        <DialogHeader className='px-6 py-4 border-b border-slate-200 dark:border-slate-800'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30'>
                <Settings className='h-5 w-5 text-white' />
              </div>
              <div>
                <DialogTitle className='text-xl font-semibold'>
                  🌟 Configuración del Sistema - Panel Maestro
                </DialogTitle>
                <p className='text-sm text-muted-foreground'>
                  Control absoluto de JuntaDeVecinos - Arquitecto del Sistema
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4'>

              {/* Export/Import Actions */}
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    dispatch({ type: 'EXPORT_SETTINGS' });
                  }}
                  title='Exportar configuración'
                >
                  <Download className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    // Create a hidden file input for importing
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const importedSettings = JSON.parse(e.target?.result as string);
                            // Validate and apply imported settings
                            dispatch({ type: 'IMPORT_SETTINGS', settings: importedSettings });
                            console.log('Settings imported successfully');
                          } catch {
                            console.error('Invalid settings file');
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                  title='Importar configuración'
                >
                  <Upload className='h-4 w-4' />
                </Button>
              </div>

              {unsavedChanges && (
                <Badge variant='secondary' className='bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 animate-pulse'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  {modifiedSettings.length} cambios
                </Badge>
              )}

              {unsavedChanges && (
                <Button onClick={handleSaveSettings} size='sm' className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'>
                  <Save className='h-4 w-4 mr-2' />
                  Guardar
                </Button>
              )}

              <Button variant='ghost' size='sm' onClick={handleClose} className='hover:bg-red-100 dark:hover:bg-red-900/20'>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex flex-col h-full overflow-hidden'>
          {/* TABS NAVIGATION */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className='flex flex-col h-full'>
            <div className='px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'>
              <TabsList className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 h-auto'>
                <TabsTrigger value='overview' className='text-xs px-2 py-2'>Vista General</TabsTrigger>
                <TabsTrigger value='system' className='text-xs px-2 py-2'>Sistema</TabsTrigger>
                <TabsTrigger value='security' className='text-xs px-2 py-2'>Seguridad</TabsTrigger>
                <TabsTrigger value='database' className='text-xs px-2 py-2'>Base de Datos</TabsTrigger>
                <TabsTrigger value='notifications' className='text-xs px-2 py-2'>Notificaciones</TabsTrigger>
                <TabsTrigger value='performance' className='text-xs px-2 py-2'>Rendimiento</TabsTrigger>
                <TabsTrigger value='ui' className='text-xs px-2 py-2'>Interfaz</TabsTrigger>
                <TabsTrigger value='features' className='text-xs px-2 py-2'>Características</TabsTrigger>
                <TabsTrigger value='advanced' className='text-xs px-2 py-2'>Avanzado</TabsTrigger>
              </TabsList>
            </div>

            {/* MAIN CONTENT */}
            <div className='flex-1 overflow-auto'>
              <TabsContent value='overview' className='h-full m-0'>
                {/* VISUAL ANALYTICS HEADER */}
              <div className='p-6 border-b border-slate-200 dark:border-slate-800'>
                <div className='flex justify-between items-start mb-6'>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold'>Panel de Control del Sistema</h2>
                    <p className='text-muted-foreground'>Monitorea el estado y configuración de tu aplicación</p>
                  </div>

                  {/* System Configuration Analytics Card */}
                  <Card className='w-64'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <BarChart3 className='h-4 w-4' />
                        Configuración del Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-600'>75%</div>
                        <p className='text-xs text-muted-foreground'>Completado</p>
                        <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                          <div className='bg-blue-600 h-2 rounded-full w-3/4'></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Usage Statistics */}
                <div className='grid grid-cols-3 gap-4 mb-6'>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center'>
                          <CheckCircle className='h-5 w-5 text-green-600' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>Activas</p>
                          <p className='text-2xl font-bold'>12</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center'>
                          <Settings className='h-5 w-5 text-blue-600' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>Configuradas</p>
                          <p className='text-2xl font-bold'>8</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-center justify-center'>
                          <AlertTriangle className='h-5 w-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>Inactivas</p>
                          <p className='text-2xl font-bold'>4</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

                {/* CONFIGURATION HUB */}
                <div className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>Centro de Configuración</h3>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <TrendingUp className='h-4 w-4' />
                          Análisis y Reportes
                        </CardTitle>
                        <CardDescription>
                          Gestiona métricas, reportes y análisis del sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Ver Reportes
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <Shield className='h-4 w-4' />
                          Seguridad
                        </CardTitle>
                        <CardDescription>
                          Configura autenticación, permisos y seguridad
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Gestionar Seguridad
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <Database className='h-4 w-4' />
                          Base de Datos
                        </CardTitle>
                        <CardDescription>
                          Optimiza rendimiento y gestiona conexiones
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Configurar DB
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <Mail className='h-4 w-4' />
                          Notificaciones
                        </CardTitle>
                        <CardDescription>
                          Configura correos, alertas y comunicaciones
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Gestionar Correos
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <Zap className='h-4 w-4' />
                          Rendimiento
                        </CardTitle>
                        <CardDescription>
                          Optimiza velocidad y uso de recursos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Optimizar
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          <Palette className='h-4 w-4' />
                          Interfaz
                        </CardTitle>
                        <CardDescription>
                          Personaliza apariencia y experiencia de usuario
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant='outline' size='sm' className='w-full'>
                          Personalizar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='advanced' className='h-full m-0'>
                <div className='p-6'>
                  {/* ADVANCED SYSTEM MONITORING PANEL */}
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-semibold mb-4'>Monitoreo Avanzado del Sistema</h3>
                      <p className='text-muted-foreground mb-6'>
                        Métricas en tiempo real y configuraciones avanzadas del sistema
                      </p>
                    </div>

                    {/* System Health Cards */}
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                      <Card>
                        <CardContent className='p-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center'>
                              <CheckCircle className='h-6 w-6 text-green-600' />
                            </div>
                            <div>
                              <p className='text-sm font-medium'>Estado del Sistema</p>
                              <p className='text-lg font-bold text-green-600'>Excelente</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>


                      <Card>
                        <CardContent className='p-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center'>
                              <Database className='h-6 w-6 text-purple-600' />
                            </div>
                            <div>
                              <p className='text-sm font-medium'>Base de Datos</p>
                              <p className='text-lg font-bold text-purple-600'>{systemHealth.databaseStatus}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className='p-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center'>
                              <Mail className='h-6 w-6 text-orange-600' />
                            </div>
                            <div>
                              <p className='text-sm font-medium'>Correo</p>
                              <p className='text-lg font-bold text-orange-600'>{systemHealth.emailStatus}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Advanced Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Configuraciones Avanzadas</CardTitle>
                        <CardDescription>
                          Opciones avanzadas para desarrolladores y administradores del sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <Label className='text-sm font-medium'>Modo Desarrollador</Label>
                            <p className='text-xs text-muted-foreground'>Habilita características experimentales</p>
                          </div>
                          <Button
                            variant={settings.developerMode ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => handleSettingChange('developerMode', !settings.developerMode)}
                          >
                            {settings.developerMode ? 'Activado' : 'Desactivado'}
                          </Button>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div>
                            <Label className='text-sm font-medium'>Características Experimentales</Label>
                            <p className='text-xs text-muted-foreground'>Acceso a nuevas funcionalidades en desarrollo</p>
                          </div>
                          <Button
                            variant={settings.experimentalFeatures ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => handleSettingChange('experimentalFeatures', !settings.experimentalFeatures)}
                          >
                            {settings.experimentalFeatures ? 'Activado' : 'Desactivado'}
                          </Button>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div>
                            <Label className='text-sm font-medium'>Telemetría</Label>
                            <p className='text-xs text-muted-foreground'>Ayuda a mejorar el sistema enviando datos anónimos</p>
                          </div>
                          <Button
                            variant={settings.telemetryEnabled ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => handleSettingChange('telemetryEnabled', !settings.telemetryEnabled)}
                          >
                            {settings.telemetryEnabled ? 'Activado' : 'Desactivado'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='system' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='system'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='security' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='security'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='database' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='database'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='notifications' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='notifications'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='performance' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='performance'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='ui' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='ui'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value='features' className='h-full m-0'>
                <div className='p-6'>
                  <SettingsPanels
                    activeSection='features'
                    settings={settings}
                    onSettingChange={handleSettingChange}
                    onResetSection={handleResetSection}
                    onSaveSettings={handleSaveSettings}
                    modifiedSettings={modifiedSettings}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* KEYBOARD SHORTCUTS HELP */}
        <div className='px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'>
          <div className='flex items-center justify-between text-xs text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-4'>
              <span><kbd className='px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300'>Ctrl+S</kbd> Guardar</span>
              <span><kbd className='px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300'>Ctrl+R</kbd> Reset</span>
              <span><kbd className='px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300'>Esc</kbd> Cerrar</span>
              <span><kbd className='px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300'>Tab</kbd> Navegar</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span>Sistema Activo</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        {unsavedChanges && (
          <div className='px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-orange-50 dark:bg-orange-950/20'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='h-4 w-4 text-orange-600' />
                <span className='text-sm text-orange-800 dark:text-orange-200'>
                  Tienes cambios sin guardar que se perderán si cierras esta ventana.
                </span>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => dispatch({ type: 'RESET_ALL' })}
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Descartar Cambios
                </Button>
                <Button onClick={handleSaveSettings} size='sm'>
                  <Save className='h-4 w-4 mr-2' />
                  Guardar Todo
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
