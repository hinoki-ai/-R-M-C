'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminUser {
  name: string
  role: 'admin'
  isAdmin: true
}

interface AdminDashboardProps {
  user: AdminUser
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className='w-full bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-gray-900 dark:to-green-950 relative min-h-screen'>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className='absolute top-20 left-10 text-6xl'>🏔️</div>
        <div className='absolute top-40 right-20 text-4xl'>🌽</div>
        <div className='absolute bottom-32 left-20 text-5xl'>🦙</div>
        <div className='absolute bottom-20 right-10 text-4xl'>🌿</div>
      </div>

      {/* Admin Badge */}
      <div className='flex justify-end mb-6 pt-6 px-6'>
        <Badge variant='destructive' className='bg-gradient-to-r from-purple-500 to-blue-500'>
          Acceso Administrador - {user.name}
        </Badge>
      </div>

      <div className='w-full space-y-8 p-6'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Panel Administrativo
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Junta de Vecinos Pinto Los Pellines - Gestión Comunitaria
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>👥 Gestión de Miembros</CardTitle>
              <CardDescription>
                Administrar vecinos y familias de Pinto Los Pellines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-blue-600'>342</p>
              <p className='text-sm text-gray-600'>Vecinos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📢 Comunicaciones</CardTitle>
              <CardDescription>
                Anuncios y comunicaciones oficiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-green-600'>23</p>
              <p className='text-sm text-gray-600'>Anuncios activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 Finanzas</CardTitle>
              <CardDescription>
                Gestión financiera comunitaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-orange-600'>$247.850</p>
              <p className='text-sm text-gray-600'>Aportes mensuales</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📊 Estado del Sistema</CardTitle>
            <CardDescription>
              Información general del sistema comunitario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-semibold mb-2'>Sistema</h4>
                <p className='text-sm text-green-600'>✅ Operativo</p>
                <p className='text-sm text-gray-600'>Última actualización: {new Date().toLocaleString('es-CL')}</p>
              </div>
              <div>
                <h4 className='font-semibold mb-2'>Base de Datos</h4>
                <p className='text-sm text-green-600'>✅ Conectado</p>
                <p className='text-sm text-gray-600'>Convex - Sincronizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
