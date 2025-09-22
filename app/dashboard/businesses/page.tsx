'use client'

import { MapPin, Phone, Star, Clock, ShoppingCart, Utensils, Store } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
  },
  {
    id: '7',
    name: 'Carnicería San Antonio',
    category: 'otros',
    description: 'Carnes frescas de ganado criado en la zona. Cortes tradicionales chilenos preparados por expertos carniceros.',
    address: 'Calle Mercado 89, Pinto',
    phone: '+56 9 7890 1234',
    hours: 'Martes a Domingo: 7:00 - 19:00',
    rating: 4
  },
  {
    id: '8',
    name: 'Librería y Papelería Pinto',
    category: 'otros',
    description: 'Libros, material escolar y artículos de oficina. Punto de encuentro cultural de la comunidad.',
    address: 'Plaza de Armas 45, Pinto',
    phone: '+56 9 8901 2345',
    hours: 'Lunes a Viernes: 9:00 - 18:00, Sábado: 9:00 - 13:00',
    rating: 4
  }
]

const categoryLabels = {
  supermercado: 'Supermercado',
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  farmacia: 'Farmacia',
  ferreteria: 'Ferretería',
  otros: 'Otros'
}

const categoryIcons = {
  supermercado: <ShoppingCart className='w-5 h-5' />,
  panaderia: <Store className='w-5 h-5' />,
  restaurante: <Utensils className='w-5 h-5' />,
  farmacia: <Store className='w-5 h-5' />,
  ferreteria: <Store className='w-5 h-5' />,
  otros: <Store className='w-5 h-5' />
}

function BusinessesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredBusinesses = selectedCategory === 'all'
    ? businesses
    : businesses.filter(business => business.category === selectedCategory)

  const categories = ['all', ...Object.keys(categoryLabels)] as const

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold tracking-tight'>Comercios Locales</h1>
        <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
          Descubre y apoya los negocios locales de Pinto Los Pellines.
          Productos frescos, servicios de calidad y emprendimiento comunitario.
        </p>
      </div>

      {/* Category Filter */}
      <div className='flex flex-wrap justify-center gap-2'>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className='capitalize'
          >
            {category === 'all' ? 'Todos' : categoryLabels[category as keyof typeof categoryLabels]}
          </Button>
        ))}
      </div>

      {/* Featured Businesses */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold'>Negocios Destacados</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredBusinesses.filter(business => business.featured).map((business) => (
            <Card key={business.id} className='hover:shadow-lg transition-all duration-300 hover:scale-105 group'>
              <CardHeader>
                <div className='flex items-center justify-between mb-4'>
                  <Badge className='bg-green-500/20 text-green-300'>
                    {categoryIcons[business.category]}
                    <span className='ml-1'>
                      {categoryLabels[business.category]}
                    </span>
                  </Badge>
                  <div className='flex text-yellow-400'>
                    {'⭐'.repeat(business.rating)}
                  </div>
                </div>
                <CardTitle className='text-2xl text-foreground group-hover:text-amber-100 transition-colors'>
                  {business.name}
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  {business.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4'>
                  {business.description}
                </p>
                <div className='space-y-2 mb-4'>
                  {business.phone && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='w-4 h-4 text-blue-500' />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-2 text-sm'>
                    <Clock className='w-4 h-4 text-green-500' />
                    <span>{business.hours}</span>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='text-muted-foreground/60 text-sm'>⭐ {business.rating}/5</div>
                  <Button size='sm' variant='outline' className='bg-card border-border text-foreground hover:bg-card/80'>
                    <MapPin className='w-4 h-4 mr-1' />
                    Ver Ubicación
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Businesses */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold'>Todos los Comercios</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className='hover:shadow-md transition-all duration-300 hover:scale-102'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='text-2xl mt-1'>
                    {categoryIcons[business.category]}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='font-semibold text-lg'>{business.name}</h3>
                      <div className='flex text-yellow-400 text-sm'>
                        {'⭐'.repeat(business.rating)}
                      </div>
                    </div>
                    <p className='text-muted-foreground text-sm mb-3'>
                      {business.description}
                    </p>
                    <div className='space-y-1 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-3 h-3' />
                        <span>{business.address}</span>
                      </div>
                      {business.phone && (
                        <div className='flex items-center gap-2'>
                          <Phone className='w-3 h-3' />
                          <span>{business.phone}</span>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        <Clock className='w-3 h-3' />
                        <span>{business.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Business Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Store className='w-5 h-5' />
            ¿Tienes un Negocio?
          </CardTitle>
          <CardDescription>
            Registra tu comercio en nuestro directorio comunitario y llega a más clientes locales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center space-y-4'>
            <div className='text-6xl'>🏪</div>
            <p className='text-muted-foreground'>
              Únete a la red de comercios locales de Pinto Los Pellines.
              Es gratis registrarse y llegar a cientos de potenciales clientes.
            </p>
            <Button className='bg-green-600 hover:bg-green-700'>
              <Store className='w-4 h-4 mr-2' />
              Registrar Comercio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BusinessesPage() {
  return (
    <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='businesses'>
      <BusinessesContent />
    </DocumentDashboardLayout>
  )
}