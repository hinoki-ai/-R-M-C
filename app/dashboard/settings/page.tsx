'use client'

import SettingsModal from '@/components/settings/settings-modal'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center py-8'>
        <div className='text-4xl mb-4'>⚙️🏘️</div>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
          Configuración de Usuario
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Personaliza tu experiencia en la plataforma comunitaria
        </p>
      </div>

      <div className='space-y-4'>
        <div className='p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'>
          <h4 className='font-semibold mb-2'>🔔 Notificaciones</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Configura cómo quieres recibir alertas de la comunidad.</p>
          <div className='space-y-2'>
            <label className='flex items-center justify-between cursor-pointer'>
              <span className='text-sm'>Anuncios importantes</span>
              <input type='checkbox' defaultChecked className='rounded' aria-label='Anuncios importantes' />
            </label>
            <label className='flex items-center justify-between cursor-pointer'>
              <span className='text-sm'>Recordatorios de eventos</span>
              <input type='checkbox' defaultChecked className='rounded' aria-label='Recordatorios de eventos' />
            </label>
            <label className='flex items-center justify-between cursor-pointer'>
              <span className='text-sm'>Alertas de seguridad</span>
              <input type='checkbox' defaultChecked className='rounded' aria-label='Alertas de seguridad' />
            </label>
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'>
          <h4 className='font-semibold mb-2'>👤 Información Personal</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Actualiza tus datos de contacto y dirección.</p>
          <Button variant='outline'>✏️ Editar Perfil</Button>
        </div>

        <div className='p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-purple-950/20'>
          <h4 className='font-semibold mb-2'>🔒 Privacidad y Seguridad</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Configura opciones de privacidad y cambia tu contraseña.</p>
          <Button variant='outline'>🔐 Configurar Seguridad</Button>
        </div>

        <div className='p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20'>
          <h4 className='font-semibold mb-2'>🎨 Tema de la Aplicación</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Elige entre tema claro, oscuro o automático según el sistema.</p>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>☀️ Claro</Button>
            <Button variant='outline' size='sm'>🌙 Oscuro</Button>
            <Button variant='outline' size='sm'>🔄 Automático</Button>
          </div>
        </div>

        {/* Advanced Settings Modal Trigger */}
        <div className='p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20'>
          <h4 className='font-semibold mb-2'>⚡ Configuración Avanzada</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Accede a configuraciones avanzadas del sistema, seguridad, rendimiento y más.</p>
          <SettingsModal>
            <Button>🔧 Abrir Panel Avanzado</Button>
          </SettingsModal>
        </div>
      </div>
    </div>
  )
}