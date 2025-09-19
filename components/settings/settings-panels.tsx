'use client';

import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Save,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { settingSections, SettingsState } from '@/types/settings';

interface SettingsPanelsProps {
  activeSection: string;
  settings: SettingsState;
  onSettingChange: (key: keyof SettingsState, value: any) => void;
  onResetSection: (section: string) => void;
  onSaveSettings: () => void;
  modifiedSettings: string[];
}

const SettingsPanels: React.FC<SettingsPanelsProps> = ({
  activeSection,
  settings,
  onSettingChange,
  onResetSection,
  onSaveSettings,
  modifiedSettings,
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    onSettingChange(key, value);
    setHasUnsavedChanges(true);
  };

  const handleResetSection = (section: string) => {
    onResetSection(section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSaveSettings();
    setHasUnsavedChanges(false);
  };

  const renderSystemPanel = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
        <Button
          onClick={() => handleResetSection('system')}
          variant='outline'
          size='sm'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Resetear
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='systemName'>Nombre del Sistema</Label>
          <Input
            id='systemName'
            value={settings.systemName}
            onChange={(e) => handleSettingChange('systemName', e.target.value)}
            className={modifiedSettings.includes('systemName') ? 'border-orange-500' : ''}
          />
          <p className='text-xs text-muted-foreground'>Nombre público del sistema</p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='systemTimezone'>Zona Horaria</Label>
          <Select
            value={settings.systemTimezone}
            onValueChange={(value) => handleSettingChange('systemTimezone', value)}
          >
            <SelectTrigger className={modifiedSettings.includes('systemTimezone') ? 'border-orange-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='America/Santiago'>America/Santiago</SelectItem>
              <SelectItem value='UTC'>UTC</SelectItem>
              <SelectItem value='America/New_York'>America/New_York</SelectItem>
              <SelectItem value='Europe/London'>Europe/London</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='systemTheme'>Tema por Defecto</Label>
          <Select
            value={settings.systemTheme}
            onValueChange={(value) => handleSettingChange('systemTheme', value)}
          >
            <SelectTrigger className={modifiedSettings.includes('systemTheme') ? 'border-orange-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>Claro</SelectItem>
              <SelectItem value='dark'>Oscuro</SelectItem>
              <SelectItem value='system'>Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800'>
        <div>
          <h4 className='text-sm font-medium text-red-800 dark:text-red-200'>Modo Mantenimiento</h4>
          <p className='text-xs text-red-600 dark:text-red-400'>Activar modo mantenimiento del sistema</p>
        </div>
        <Switch
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
        />
      </div>
    </div>
  );

  const renderSecurityPanel = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
        <div className='flex items-center gap-4 text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Estado:</span>
          <Badge variant='default' className='bg-green-100 text-green-800'>
            <CheckCircle className='h-3 w-3 mr-1' />
            Seguro
          </Badge>
        </div>
        <Button
          onClick={() => handleResetSection('security')}
          variant='outline'
          size='sm'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Resetear
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='sessionTimeout'>Timeout de Sesión (minutos)</Label>
          <Input
            id='sessionTimeout'
            type='number'
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className={modifiedSettings.includes('sessionTimeout') ? 'border-orange-500' : ''}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='passwordMinLength'>Longitud Mínima de Contraseña</Label>
          <Input
            id='passwordMinLength'
            type='number'
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            className={modifiedSettings.includes('passwordMinLength') ? 'border-orange-500' : ''}
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Autenticación de Dos Factores</Label>
            <p className='text-xs text-muted-foreground'>Requerir 2FA para todos los usuarios</p>
          </div>
          <Switch
            checked={settings.twoFactorRequired}
            onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Rate Limiting</Label>
            <p className='text-xs text-muted-foreground'>Habilitar limitación de peticiones</p>
          </div>
          <Switch
            checked={settings.rateLimitingEnabled}
            onCheckedChange={(checked) => handleSettingChange('rateLimitingEnabled', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Alertas de Seguridad</Label>
            <p className='text-xs text-muted-foreground'>Notificar eventos de seguridad</p>
          </div>
          <Switch
            checked={settings.securityAlerts}
            onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderPerformancePanel = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
        <Button
          onClick={() => handleResetSection('performance')}
          variant='outline'
          size='sm'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Resetear
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='maxWorkers'>Máximo de Workers</Label>
          <Input
            id='maxWorkers'
            type='number'
            value={settings.maxWorkers}
            onChange={(e) => handleSettingChange('maxWorkers', parseInt(e.target.value))}
            className={modifiedSettings.includes('maxWorkers') ? 'border-orange-500' : ''}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='memoryLimit'>Límite de Memoria (MB)</Label>
          <Input
            id='memoryLimit'
            type='number'
            value={settings.memoryLimit}
            onChange={(e) => handleSettingChange('memoryLimit', parseInt(e.target.value))}
            className={modifiedSettings.includes('memoryLimit') ? 'border-orange-500' : ''}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Calidad General</Label>
        <div className='px-3'>
          <Slider
            value={[settings.quality === 'low' ? 0 : settings.quality === 'medium' ? 50 : 100]}
            onValueChange={(value) => {
              const quality = value[0] < 33 ? 'low' : value[0] < 66 ? 'medium' : 'high';
              handleSettingChange('quality', quality);
            }}
            max={100}
            step={1}
            className='w-full'
          />
          <div className='flex justify-between text-xs text-muted-foreground mt-1'>
            <span>Baja</span>
            <span>Media</span>
            <span>Alta</span>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Cache Habilitado</Label>
            <p className='text-xs text-muted-foreground'>Mejorar rendimiento con cache</p>
          </div>
          <Switch
            checked={settings.cacheEnabled}
            onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Compresión</Label>
            <p className='text-xs text-muted-foreground'>Comprimir respuestas HTTP</p>
          </div>
          <Switch
            checked={settings.compressionEnabled}
            onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderFeaturesPanel = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
        <div className='flex items-center gap-4 text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Características:</span>
          <span className='text-indigo-600 font-mono'>4/4 activas</span>
        </div>
        <Button
          onClick={() => handleResetSection('features')}
          variant='outline'
          size='sm'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Resetear
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Portal del Cliente</Label>
            <p className='text-xs text-muted-foreground'>Acceso para residentes</p>
          </div>
          <Switch
            checked={settings.clientPortalEnabled}
            onCheckedChange={(checked) => handleSettingChange('clientPortalEnabled', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Analytics Avanzado</Label>
            <p className='text-xs text-muted-foreground'>Métricas detalladas</p>
          </div>
          <Switch
            checked={settings.advancedAnalytics}
            onCheckedChange={(checked) => handleSettingChange('advancedAnalytics', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>Aplicación Móvil</Label>
            <p className='text-xs text-muted-foreground'>Soporte para móviles</p>
          </div>
          <Switch
            checked={settings.mobileAppEnabled}
            onCheckedChange={(checked) => handleSettingChange('mobileAppEnabled', checked)}
          />
        </div>

        <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg'>
          <div>
            <Label className='text-sm font-medium'>API Access</Label>
            <p className='text-xs text-muted-foreground'>Acceso programático</p>
          </div>
          <Switch
            checked={settings.apiAccessEnabled}
            onCheckedChange={(checked) => handleSettingChange('apiAccessEnabled', checked)}
          />
        </div>
      </div>
    </div>
  );

  // Render the appropriate panel based on active section
  const renderActivePanel = () => {
    switch (activeSection) {
      case 'system':
        return renderSystemPanel();
      case 'security':
        return renderSecurityPanel();
      case 'performance':
        return renderPerformancePanel();
      case 'features':
        return renderFeaturesPanel();
      default:
        return renderSystemPanel();
    }
  };

  return (
    <div className='space-y-6'>
      {/* PANEL HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
            {settingSections.find(s => s.id === activeSection)?.title || 'Configuración'}
          </h3>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            {settingSections.find(s => s.id === activeSection)?.description || ''}
          </p>
        </div>

        {hasUnsavedChanges && (
          <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
            Cambios sin guardar
          </Badge>
        )}
      </div>

      {/* ACTIVE PANEL CONTENT */}
      <Card>
        <CardContent className='p-6'>
          {renderActivePanel()}
        </CardContent>
      </Card>

      {/* SAVE ACTIONS */}
      {hasUnsavedChanges && (
        <Card className='border-orange-200 bg-orange-50 dark:bg-orange-950/20'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-orange-600' />
                <div>
                  <p className='text-sm font-medium text-orange-800 dark:text-orange-200'>
                    Cambios Pendientes
                  </p>
                  <p className='text-xs text-orange-700 dark:text-orange-300'>
                    {modifiedSettings.length} configuraciones modificadas
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm'>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Descartar
                </Button>
                <Button onClick={handleSave} size='sm'>
                  <Save className='h-4 w-4 mr-2' />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPanels;