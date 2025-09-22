'use client';

import {
  AlertTriangle,
  Building,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShoppingCart,
  Star,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TextEffect } from '@/components/ui/text-effect';

interface Location {
  id: string;
  name: string;
  type: 'residence' | 'business' | 'service' | 'emergency';
  coordinates: [number, number];
  address: string;
  phone?: string;
  description: string;
  category?: string;
  rating?: number;
}

const locations: Location[] = [
  // Emergency Services
  {
    id: '1',
    name: 'Centro de Salud Pinto',
    type: 'emergency',
    coordinates: [-36.698, -71.897],
    address: 'Calle Real 123, Pinto',
    phone: '+56 42 222 0000',
    description: 'Centro médico de urgencias 24/7',
    category: 'Salud'
  },
  {
    id: '2',
    name: 'Bomberos Pinto',
    type: 'emergency',
    coordinates: [-36.695, -71.895],
    address: 'Av. Los Pellines 456',
    phone: '132',
    description: 'Estación de bomberos y rescate',
    category: 'Emergencias'
  },
  {
    id: '3',
    name: 'Carabineros de Chile',
    type: 'emergency',
    coordinates: [-36.700, -71.900],
    address: 'Plaza de Armas 789',
    phone: '133',
    description: 'Policía nacional de Chile',
    category: 'Seguridad'
  },

  // Local Businesses
  {
    id: '4',
    name: 'Supermercado Los Pellines',
    type: 'business',
    coordinates: [-36.702, -71.898],
    address: 'Calle Comercio 321',
    phone: 'Contactar',
    description: 'Alimentos, productos y servicios básicos',
    category: 'Supermercado',
    rating: 4.5
  },
  {
    id: '5',
    name: 'Panadería Doña Carmen',
    type: 'business',
    coordinates: [-36.699, -71.896],
    address: 'Calle Principal 654',
    phone: 'Contactar',
    description: 'Pan artesanal y productos horneados tradicionales',
    category: 'Panadería',
    rating: 4.8
  },
  {
    id: '6',
    name: 'Farmacia Pinto',
    type: 'business',
    coordinates: [-36.698, -71.894],
    address: 'Av. Salud 987',
    phone: 'Contactar',
    description: 'Medicamentos y productos farmacéuticos',
    category: 'Farmacia',
    rating: 4.2
  },
  {
    id: '7',
    name: 'Restaurante El Rincón',
    type: 'business',
    coordinates: [-36.701, -71.899],
    address: 'Calle Gastronomía 147',
    phone: 'Contactar',
    description: 'Comida típica chilena y menú del día',
    category: 'Restaurante',
    rating: 4.6
  },

  // Community Services
  {
    id: '8',
    name: 'Escuela Básica Pinto',
    type: 'service',
    coordinates: [-36.703, -71.901],
    address: 'Calle Educación 258',
    phone: 'Contactar',
    description: 'Educación básica para niños y jóvenes',
    category: 'Educación'
  },
  {
    id: '9',
    name: 'Junta de Vecinos',
    type: 'service',
    coordinates: [-36.700, -71.898],
    address: 'Plaza Comunidad 369',
    phone: '+56 9 8889 6773',
    description: 'Oficina administrativa de la comunidad',
    category: 'Administración'
  },
  {
    id: '10',
    name: 'Iglesia Nuestra Señora',
    type: 'service',
    coordinates: [-36.696, -71.902],
    address: 'Calle Fe 741',
    phone: 'Contactar',
    description: 'Centro espiritual y comunitario',
    category: 'Religión'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'emergency': return AlertTriangle;
    case 'business': return ShoppingCart;
    case 'service': return Building;
    default: return MapPin;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'emergency': return 'text-red-500 bg-red-100';
    case 'business': return 'text-green-500 bg-green-100';
    case 'service': return 'text-blue-500 bg-blue-100';
    default: return 'text-gray-500 bg-gray-100';
  }
};

export default function CommunityMapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Todo', icon: MapPin },
    { id: 'emergency', name: 'Emergencias', icon: AlertTriangle },
    { id: 'business', name: 'Comercios', icon: ShoppingCart },
    { id: 'service', name: 'Servicios', icon: Building }
  ];

  return (
    <main className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-md border-b border-gray-200'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='text-3xl'>🇨🇱</div>
              <TextEffect
                preset='fade-in-blur'
                per='word'
                as='h1'
                className='text-2xl font-bold text-gray-800'
              >
                Mapa Comunitario Pinto Los Pellines
              </TextEffect>
            </div>
            <Link href='/' className='text-sm text-gray-600 hover:text-gray-800'>
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* Map Section */}
          <div className='lg:col-span-2'>
            <Card className='h-[600px]'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='w-5 h-5' />
                  Mapa Interactivo
                </CardTitle>
                <CardDescription>
                  Explora Pinto Los Pellines - Haz clic en los puntos para más información
                </CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                {/* Simplified map representation */}
                <div className='relative h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-b-lg overflow-hidden'>
                  {/* Map background */}
                  <div className='absolute inset-0 opacity-20'>
                    <svg viewBox='0 0 400 300' className='w-full h-full'>
                      {/* Roads */}
                      <path d='M50 150 L350 150' stroke='#666' strokeWidth='8' fill='none'/>
                      <path d='M200 50 L200 250' stroke='#666' strokeWidth='6' fill='none'/>

                      {/* Buildings */}
                      <rect x='180' y='120' width='40' height='60' fill='#8B5CF6' opacity='0.7'/>
                      <rect x='100' y='100' width='30' height='40' fill='#10B981' opacity='0.7'/>
                      <rect x='280' y='140' width='35' height='45' fill='#F59E0B' opacity='0.7'/>
                      <rect x='150' y='180' width='25' height='35' fill='#EF4444' opacity='0.7'/>
                    </svg>
                  </div>

                  {/* Location markers */}
                  {filteredLocations.map((location, index) => {
                    const Icon = getTypeIcon(location.type);
                    const x = 100 + (index * 60) % 200;
                    const y = 100 + (index * 40) % 120;

                    return (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ${getTypeColor(location.type)}`}
                        style={{ left: x, top: y }}
                        aria-label={`Ver detalles de ${location.name}`}
                        title={`Ver detalles de ${location.name}`}
                      >
                        <Icon className='w-4 h-4' />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Buscar en el Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='relative'>
                  <Search className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    placeholder='Buscar lugares...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size='sm'
                        className='w-full justify-start'
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className='w-4 h-4 mr-2' />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            {selectedLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='text-lg'>{selectedLocation.name}</span>
                    <Badge className={getTypeColor(selectedLocation.type)}>
                      {selectedLocation.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-start gap-2'>
                    <MapPin className='w-4 h-4 mt-1 text-gray-500' />
                    <span className='text-sm text-gray-600'>{selectedLocation.address}</span>
                  </div>

                  {selectedLocation.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='w-4 h-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{selectedLocation.phone}</span>
                    </div>
                  )}

                  <p className='text-sm text-gray-700'>{selectedLocation.description}</p>

                  {selectedLocation.rating && (
                    <div className='flex items-center gap-1'>
                      <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-medium'>{selectedLocation.rating}</span>
                    </div>
                  )}

                  <Button className='w-full' size='sm'>
                    <Navigation className='w-4 h-4 mr-2' />
                    Cómo llegar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Estadísticas del Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Total de Lugares</span>
                    <Badge variant='secondary'>{locations.length}</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Emergencias</span>
                    <Badge className='bg-red-100 text-red-700'>
                      {locations.filter(l => l.type === 'emergency').length}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Comercios</span>
                    <Badge className='bg-green-100 text-green-700'>
                      {locations.filter(l => l.type === 'business').length}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Servicios</span>
                    <Badge className='bg-blue-100 text-blue-700'>
                      {locations.filter(l => l.type === 'service').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location List */}
        <div className='mt-12'>
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-3xl font-bold text-center mb-8 text-gray-800'
          >
            Directorio de Lugares
          </TextEffect>

          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {filteredLocations.map((location) => {
              const Icon = getTypeIcon(location.type);
              return (
                <Card key={location.id} className='hover:shadow-lg transition-shadow cursor-pointer'
                      onClick={() => setSelectedLocation(location)}>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg flex items-center gap-2'>
                        <Icon className='w-5 h-5' />
                        {location.name}
                      </CardTitle>
                      <Badge className={getTypeColor(location.type)}>
                        {location.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='mb-3'>{location.description}</CardDescription>
                    <div className='space-y-2 text-sm text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4' />
                        {location.address}
                      </div>
                      {location.phone && (
                        <div className='flex items-center gap-2'>
                          <Phone className='w-4 h-4' />
                          {location.phone}
                        </div>
                      )}
                      {location.rating && (
                        <div className='flex items-center gap-2'>
                          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                          {location.rating} estrellas
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </AnimatedGroup>
        </div>
      </div>
    </main>
  );
}