'use client';

import { MapPin, Phone, Star, Clock, ShoppingCart, Utensils, Store } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TextEffect } from '@/components/ui/text-effect';

interface Business {
  id: string;
  name: string;
  category: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros';
  description: string;
  address: string;
  phone?: string;
  hours: string;
  rating: number;
  featured?: boolean;
}

const businesses: Business[] = [
  {
    id: '1',
    name: 'Supermercados Los Pellines',
    category: 'supermercado',
    description: 'Productos frescos locales, abarrotes y artículos del hogar. Especialistas en productos agrícolas de la zona.',
    address: 'Calle Comercio 321, Pinto',
    phone: '+56 9 1234 5678',
    hours: 'Lunes a Domingo: 8:00 - 22:00',
    rating: 5,
    featured: true
  },
  {
    id: '2',
    name: 'Panadería Doña Carmen',
    category: 'panaderia',
    description: 'Pan artesanal, pasteles tradicionales y productos horneados con ingredientes locales de la más alta calidad.',
    address: 'Calle Principal 654, Pinto',
    phone: '+56 9 2345 6789',
    hours: 'Lunes a Sábado: 7:00 - 20:00',
    rating: 5,
    featured: true
  },
  {
    id: '3',
    name: 'Restaurante El Rincón',
    category: 'restaurante',
    description: 'Comida típica chilena con toques modernos. Platos preparados con productos frescos de productores locales.',
    address: 'Calle Gastronomía 147, Pinto',
    phone: '+56 9 3456 7890',
    hours: 'Miércoles a Domingo: 12:00 - 23:00',
    rating: 4,
    featured: true
  },
  {
    id: '4',
    name: 'Farmacia Pinto Centro',
    category: 'farmacia',
    description: 'Servicio farmacéutico completo con medicamentos, productos de higiene y consejos de salud.',
    address: 'Plaza de Armas 89, Pinto',
    phone: '+56 9 4567 8901',
    hours: 'Lunes a Domingo: 9:00 - 21:00',
    rating: 4
  },
  {
    id: '5',
    name: 'Ferretería El Martillo',
    category: 'ferreteria',
    description: 'Herramientas, materiales de construcción y artículos para el hogar. Servicio técnico especializado.',
    address: 'Calle Industrial 256, Pinto',
    phone: '+56 9 5678 9012',
    hours: 'Lunes a Sábado: 8:30 - 19:00',
    rating: 4
  },
  {
    id: '6',
    name: 'Verdulería Don Juan',
    category: 'otros',
    description: 'Verduras y frutas frescas directamente de los productores locales. Compromiso con la agricultura sostenible.',
    address: 'Mercado Municipal, Local 12',
    phone: '+56 9 6789 0123',
    hours: 'Martes a Domingo: 6:00 - 18:00',
    rating: 5
  }
];

const categoryLabels = {
  supermercado: 'Supermercado',
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  farmacia: 'Farmacia',
  ferreteria: 'Ferretería',
  otros: 'Otros'
};

const categoryIcons = {
  supermercado: ShoppingCart,
  panaderia: Store,
  restaurante: Utensils,
  farmacia: Store,
  ferreteria: Store,
  otros: Store
};

export default function ComerciosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBusinesses = selectedCategory === 'all'
    ? businesses
    : businesses.filter(business => business.category === selectedCategory);

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <header className='bg-white/80 backdrop-blur-md border-b border-gray-200'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='text-3xl'>🏪</div>
              <TextEffect preset='fade-in-blur' per='word' as='h1' className='text-2xl font-bold text-gray-800'>
                Comercios Locales
              </TextEffect>
            </div>
            <Link href='/' className='text-sm text-gray-600 hover:text-gray-800'>← Volver al Inicio</Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Category Filter */}
        <div className='flex flex-wrap gap-2 mb-8 justify-center'>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            size='sm'
          >
            Todos
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              size='sm'
            >
              {label}
            </Button>
          ))}
        </div>

        <AnimatedGroup preset='scale' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredBusinesses.map((business) => {
            const IconComponent = categoryIcons[business.category];
            return (
              <Card key={business.id} className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    {business.name}
                    {business.featured && <Star className='w-5 h-5 text-yellow-500 fill-current' />}
                  </CardTitle>
                  <Badge className='w-fit'>
                    <IconComponent className='w-4 h-4 mr-1' />
                    {categoryLabels[business.category]}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-700 mb-4'>{business.description}</p>

                  <div className='space-y-2 text-sm text-gray-600 mb-4'>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      {business.address}
                    </div>
                    {business.phone && (
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4' />
                        {business.phone}
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <Clock className='w-4 h-4' />
                      {business.hours}
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex text-yellow-400'>
                      {'⭐'.repeat(business.rating)}
                    </div>
                    <Button size='sm' variant='outline'>
                      Ver Más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </AnimatedGroup>

        {filteredBusinesses.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No se encontraron comercios en esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
}