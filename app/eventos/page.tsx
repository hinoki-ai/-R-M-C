'use client';

import { Calendar as CalendarIcon, Clock, MapPin, Plus, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TextEffect } from '@/components/ui/text-effect';


interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'community' | 'cultural' | 'sports' | 'educational' | 'religious';
  attendees?: number;
  maxAttendees?: number;
  organizer: string;
  featured?: boolean;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Asamblea General de Vecinos',
    date: '2025-01-15',
    time: '19:00',
    location: 'Salón Municipal Pinto',
    description: 'Reunión mensual para discutir temas comunitarios.',
    category: 'community',
    attendees: 45,
    maxAttendees: 100,
    organizer: 'Junta de Vecinos',
    featured: true
  },
  {
    id: '2',
    title: 'Festival de la Chilenidad',
    date: '2025-01-18',
    time: '16:00',
    location: 'Plaza de Armas',
    description: 'Celebración de tradiciones chilenas.',
    category: 'cultural',
    attendees: 200,
    maxAttendees: 500,
    organizer: 'Municipalidad',
    featured: true
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <header className='bg-white/80 backdrop-blur-md border-b border-gray-200'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='text-3xl'>🇨🇱</div>
              <TextEffect preset='fade-in-blur' per='word' as='h1' className='text-2xl font-bold text-gray-800'>
                Calendario de Eventos Comunitarios
              </TextEffect>
            </div>
            <Link href='/' className='text-sm text-gray-600 hover:text-gray-800'>← Volver al Inicio</Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <AnimatedGroup preset='scale' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredEvents.map((event) => (
            <Card key={event.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  {event.title}
                  {event.featured && <Star className='w-5 h-5 text-yellow-500 fill-current' />}
                </CardTitle>
                <Badge className='w-fit'>
                  {event.category === 'community' && 'Comunitario'}
                  {event.category === 'cultural' && 'Cultural'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm text-gray-600 mb-4'>
                  <div className='flex items-center gap-2'>
                    <CalendarIcon className='w-4 h-4' />
                    {event.date}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    {event.time}
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4' />
                    {event.location}
                  </div>
                </div>
                <p className='text-sm text-gray-700 mb-4'>{event.description}</p>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>
                    {event.attendees}/{event.maxAttendees} asistentes
                  </span>
                  <Button size='sm'>
                    <Plus className='w-4 h-4 mr-1' />
                    Inscribirse
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedGroup>
      </div>
    </main>
  );
}