'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/shared/back-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const mapLocations = [
  {
    id: 1,
    name: 'Plaza de Armas',
    description:
      'Centro cívico de Pinto con municipalidad, iglesia y comercio local',
    coordinates: '-36.6975, -71.8908',
    category: 'public',
    address: 'Centro de Pinto',
    icon: '🏛️',
  },
  {
    id: 2,
    name: 'Municipalidad de Pinto',
    description: 'Oficina central del gobierno local y atención al público',
    coordinates: '-36.6972, -71.8910',
    category: 'government',
    address: 'Plaza de Armas 123',
    icon: '🏢',
  },
  {
    id: 3,
    name: 'Centro de Salud',
    description: 'Atención primaria de salud, CESFAM Pinto',
    coordinates: '-36.6968, -71.8925',
    category: 'health',
    address: 'Calle Salud 456',
    icon: '🏥',
  },
  {
    id: 4,
    name: 'Escuela Básica Pinto',
    description: 'Educación básica pública para la comunidad',
    coordinates: '-36.6985, -71.8895',
    category: 'education',
    address: 'Calle Educación 789',
    icon: '🏫',
  },
  {
    id: 5,
    name: 'Salón Comunal',
    description: 'Espacio para reuniones comunitarias y eventos sociales',
    coordinates: '-36.6992, -71.8880',
    category: 'community',
    address: 'Calle Principal s/n',
    icon: '🏛️',
  },
  {
    id: 6,
    name: 'Biblioteca Municipal',
    description:
      'Centro cultural con libros, computadoras y actividades educativas',
    coordinates: '-36.6978, -71.8902',
    category: 'culture',
    address: 'Plaza de Armas 45',
    icon: '📚',
  },
  {
    id: 7,
    name: 'Estadio Municipal',
    description:
      'Instalaciones deportivas para fútbol y actividades recreativas',
    coordinates: '-36.7005, -71.8875',
    category: 'sports',
    address: 'Calle Deportiva 321',
    icon: '⚽',
  },
  {
    id: 8,
    name: 'Mercado Municipal',
    description: 'Comercio local con productos frescos y artesanías',
    coordinates: '-36.6988, -71.8898',
    category: 'commerce',
    address: 'Calle Comercio 654',
    icon: '🏪',
  },
];

const mapCategories = [
  { id: 'all', name: 'Todos', color: 'bg-gray-500' },
  { id: 'government', name: 'Gobierno', color: 'bg-blue-500' },
  { id: 'health', name: 'Salud', color: 'bg-green-500' },
  { id: 'education', name: 'Educación', color: 'bg-purple-500' },
  { id: 'community', name: 'Comunidad', color: 'bg-orange-500' },
  { id: 'culture', name: 'Cultura', color: 'bg-pink-500' },
  { id: 'sports', name: 'Deportes', color: 'bg-red-500' },
  { id: 'commerce', name: 'Comercio', color: 'bg-yellow-500' },
  { id: 'public', name: 'Espacios Públicos', color: 'bg-teal-500' },
];

function MapsContent() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredLocations =
    selectedCategory === 'all'
      ? mapLocations
      : mapLocations.filter(location => location.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const cat = mapCategories.find(c => c.id === category);
    return cat?.color || 'bg-gray-500';
  };

  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Mapa de Pinto Los Pellines
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explora los lugares importantes de nuestra comunidad. Encuentra
              servicios, comercios, espacios públicos y puntos de interés.
            </p>
          </motion.div>
        </div>

        {/* Map Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {mapCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="capitalize"
            >
              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Mapa Interactivo
              </CardTitle>
              <CardDescription>
                Haz clic en los puntos del mapa para obtener más información
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Map Placeholder - In a real app, this would be an interactive map */}
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🗺️</div>
                  <div className="text-xl font-semibold text-muted-foreground">
                    Mapa Interactivo de Pinto Los Pellines
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Aquí se mostraría un mapa interactivo con todos los puntos
                    de interés. En una implementación real, usaríamos Google
                    Maps, OpenStreetMap o Mapbox.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline">
                      <ZoomIn className="w-4 h-4 mr-1" />
                      Acercar
                    </Button>
                    <Button size="sm" variant="outline">
                      <ZoomOut className="w-4 h-4 mr-1" />
                      Alejar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="w-4 h-4 mr-1" />
                      Mi Ubicación
                    </Button>
                  </div>
                </div>

                {/* Map Markers Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Sample markers positioned around the map */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Locations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Puntos de Interés</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map(location => (
              <Card
                key={location.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={`${getCategoryColor(location.category)} text-white`}
                    >
                      {mapCategories.find(c => c.id === location.category)
                        ?.name || 'General'}
                    </Badge>
                    <span className="text-2xl">{location.icon}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {location.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {location.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    {location.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      📍 {location.coordinates}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Navigation className="w-3 h-3 mr-1" />
                      Cómo Llegar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Map Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Características del Mapa
              </CardTitle>
              <CardDescription>
                Herramientas y funcionalidades disponibles en nuestro mapa
                comunitario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-semibold mb-1">Búsqueda</h3>
                  <p className="text-sm text-muted-foreground">
                    Encuentra lugares por nombre o dirección
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="font-semibold mb-1">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">
                    Ve tu ubicación actual en el mapa
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🚗</div>
                  <h3 className="font-semibold mb-1">Rutas</h3>
                  <p className="text-sm text-muted-foreground">
                    Obtén direcciones para llegar a cualquier lugar
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold mb-1">Offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Descarga mapas para usar sin conexión
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                ¿Conoces un Lugar Importante?
              </CardTitle>
              <CardDescription>
                Ayúdanos a mantener el mapa actualizado con lugares de interés
                comunitario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl">📍</div>
                <p className="text-muted-foreground">
                  Si conoces un negocio, servicio público o lugar de interés que
                  no está en el mapa, ayúdanos a agregarlo para beneficio de
                  toda la comunidad.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Sugerir Ubicación
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default function MapsPage() {
  return <MapsContent />;
}
