'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
  MapPin,
  Phone,
  Star,
  Clock,
  ShoppingCart,
  Utensils,
  Store,
  Edit,
  Plus,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';

import { BackButton } from '@/components/shared/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Business {
  id: string;
  name: string;
  category:
    | 'supermercado'
    | 'panaderia'
    | 'restaurante'
    | 'farmacia'
    | 'ferreteria'
    | 'otros';
  description: string;
  address: string;
  phone?: string;
  hours: string;
  rating: number;
  featured?: boolean;
  verified?: boolean;
  ownerName?: string;
}

// This will be removed as we use Convex queries instead

const categoryLabels = {
  supermercado: 'Supermercado',
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  farmacia: 'Farmacia',
  ferreteria: 'Ferretería',
  otros: 'Otros',
};

const categoryIcons = {
  supermercado: <ShoppingCart className="w-5 h-5" />,
  panaderia: <Store className="w-5 h-5" />,
  restaurante: <Utensils className="w-5 h-5" />,
  farmacia: <Store className="w-5 h-5" />,
  ferreteria: <Store className="w-5 h-5" />,
  otros: <Store className="w-5 h-5" />,
};

function BusinessesContent() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Use Convex query to get businesses
  const allBusinesses = useQuery(api.businesses.getBusinesses, {}) || [];
  const loading = allBusinesses === undefined;

  const filteredBusinesses = selectedCategory === 'all'
    ? allBusinesses
    : allBusinesses.filter((business: any) => business.category === selectedCategory);

  const categories = ['all', ...Object.keys(categoryLabels)] as const;

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6" />
            Directorio de Comercios
          </h1>
          <p className="text-muted-foreground">
            Gestiona y descubre los negocios locales de la comunidad
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all'
                ? 'Todos'
                : categoryLabels[category as keyof typeof categoryLabels]}
            </Button>
          ))}
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Comercio
        </Button>
      </div>

      {/* Featured Businesses */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Negocios Destacados</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses
              .filter((business: any) => business.featured)
              .map((business: any) => (
              <Card
                key={business._id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/20 text-green-300">
                        {categoryIcons[business.category as keyof typeof categoryIcons]}
                        <span className="ml-1">
                          {categoryLabels[business.category as keyof typeof categoryLabels]}
                        </span>
                      </Badge>
                      {business.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex text-yellow-400">
                      {'⭐'.repeat(business.rating)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-foreground group-hover:text-amber-100 transition-colors">
                    {business.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {business.address}
                    {business.ownerName && (
                      <div className="text-sm mt-1 opacity-75">
                        Propietario: {business.ownerName}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {business.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {business.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{business.hours}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-muted-foreground/60 text-sm">
                      ⭐ {business.rating}/5
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-card border-border text-foreground hover:bg-card/80"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-card border-border text-foreground hover:bg-card/80"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Ubicación
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>

      {/* All Businesses */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Todos los Comercios</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay comercios
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedCategory === 'all'
                ? 'No hay comercios registrados aún.'
                : `No hay comercios en la categoría ${categoryLabels[selectedCategory as keyof typeof categoryLabels]}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map((business: any) => (
              <Card
                key={business._id}
              className="hover:shadow-md transition-all duration-300 hover:scale-102"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1">
                    {categoryIcons[business.category as keyof typeof categoryIcons]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        {business.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {'⭐'.repeat(business.rating)}
                      </div>
                    </div>
                    {business.ownerName && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Propietario: {business.ownerName}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm mb-3">
                      {business.description}
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{business.address}</span>
                      </div>
                      {business.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{business.hours}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        Ubicación
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>

      {/* Management Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Store className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{allBusinesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Destacados</p>
                <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => b.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Verificados</p>
                <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => b.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Plus className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => !b.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Gestión de Comercios
          </CardTitle>
          <CardDescription>
            Herramientas para administrar el directorio de comercios locales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus className="w-6 h-6" />
              <span>Agregar Comercio</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <User className="w-6 h-6" />
              <span>Verificar Comercios</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Star className="w-6 h-6" />
              <span>Gestionar Destacados</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BusinessesPage() {
  return <BusinessesContent />;
}
