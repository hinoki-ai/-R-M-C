'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface User {
  name: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
}

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-green-950 dark:via-blue-950 dark:to-yellow-950 relative min-h-screen">
      {/* Chilean Cultural Background Pattern - Pinto Los Pellines Theme */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-12 text-6xl">🇨🇱</div>
        <div className="absolute top-32 left-16 text-4xl">🚜</div>
        <div className="absolute top-60 right-16 text-5xl">🌾</div>
        <div className="absolute bottom-32 left-20 text-4xl">🏞️</div>
        <div className="absolute bottom-20 right-24 text-4xl">🏘️</div>
      </div>

      {/* User Badge */}
      <div className="flex justify-end mb-6 pt-6 px-6">
        <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
          {user.isAdmin ? 'Directiva' : 'Vecino'} - {user.name}
        </Badge>
      </div>

      <div className="w-full space-y-8 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Usuario
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Junta de Vecinos Pinto Los Pellines - Comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📢 Anuncios</CardTitle>
              <CardDescription>
                Comunicaciones y noticias de la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Anuncios nuevos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📅 Eventos</CardTitle>
              <CardDescription>
                Próximas actividades comunitarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-sm text-gray-600">Eventos esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📄 Documentos</CardTitle>
              <CardDescription>Documentos oficiales y actas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">28</p>
              <p className="text-sm text-gray-600">Documentos disponibles</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🏘️ Comunidad Pinto Los Pellines</CardTitle>
            <CardDescription>
              Información sobre nuestra comunidad agrícola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Ubicación</h4>
                <p className="text-sm text-gray-600">Ñuble Region, Chile 🇨🇱</p>
                <p className="text-sm text-gray-600">
                  Población: ~350 familias
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Actividades</h4>
                <p className="text-sm text-green-600">🌾 Agricultura</p>
                <p className="text-sm text-blue-600">🏘️ Comunidad</p>
                <p className="text-sm text-orange-600">🎨 Cultura</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
