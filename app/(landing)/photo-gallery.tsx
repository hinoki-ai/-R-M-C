'use client'

import { Calendar, Camera, MapPin, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const galleryItems = [
  {
    title: 'Feria Artesanal Ñublensina',
    description: 'Artesanías típicas de Ñuble, tejidos mapuches, cerámica local y gastronomía tradicional chilena. Un espacio donde nuestras manos crean arte y nuestros corazones se conectan.',
    location: 'Plaza Pinto Los Pellines',
    date: 'Cada último sábado del mes',
    type: 'Evento Comunitario',
    highlight: 'Más de 50 artesanos locales',
    color: 'green'
  },
  {
    title: 'Rondas Vecinales Nocturnas',
    description: 'Sistema de seguridad comunitaria que mantiene segura nuestra querida tierra ñublensina. Vecinos protegiendo vecinos bajo el cielo estrellado de Ñuble.',
    location: 'Barrio completo',
    date: 'Miércoles y sábados',
    type: 'Seguridad Comunitaria',
    highlight: '25 años de tradición',
    color: 'blue'
  },
  {
    title: 'Fiestas Patrias Chilenas 🇨🇱',
    description: 'Celebración de la independencia con ramadas, cueca y orgullo nacional. El corazón de Chile late fuerte en Pinto Los Pellines.',
    location: 'Estadio Municipal',
    date: '18 y 19 de septiembre',
    type: 'Celebración Nacional',
    highlight: 'Tradición centenaria',
    color: 'red'
  },
  {
    title: 'Reuniones Ciudadanas Participativas',
    description: 'Espacios democráticos donde forjamos el futuro de nuestra comunidad ñublensina. Cada voz cuenta, cada idea importa.',
    location: 'Salón Municipal',
    date: 'Primer lunes del mes',
    type: 'Gobierno Participativo',
    highlight: '89% participación activa',
    color: 'purple'
  },
  {
    title: 'Torneos Deportivos Regionales',
    description: 'Actividades recreativas que fortalecen los lazos comunitarios y el espíritu ñublensino. Deporte, amistad y sana competencia.',
    location: 'Canchas municipales',
    date: 'Fines de semana',
    type: 'Deporte y Recreación',
    highlight: '8 equipos participantes',
    color: 'orange'
  },
  {
    title: 'Educación con Identidad Ñublensina',
    description: 'Colaboración con la escuela local preservando nuestras tradiciones y cultura ñublensina. Formando a las futuras generaciones.',
    location: 'Escuela de Pinto',
    date: 'Durante el año escolar',
    type: 'Educación Comunitaria',
    highlight: '120 estudiantes beneficiados',
    color: 'teal'
  }
]

export default function PhotoGallery() {
  return (
    <section className='relative py-16 md:py-24'>
      {/* Semi-transparent overlay for better contrast */}
      <div className='absolute inset-0 bg-white/85 backdrop-blur-sm -z-10'></div>
      <div className='relative mx-auto max-w-7xl px-6'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 mb-4'>
            <Camera className='w-6 h-6 text-gray-600' />
            <span className='text-sm text-gray-600 font-medium'>GALERÍA COMUNITARIA</span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900'>
            🇨🇱 Orgullo Ñublensino
          </h2>
          <p className='text-gray-700 text-lg max-w-2xl mx-auto'>
            Descubre las actividades, tradiciones y momentos que hacen de nuestra querida tierra ñublensina
            un lugar especial para vivir, crecer y sentirnos orgullosos de nuestras raíces chilenas.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {galleryItems.map((item, index) => {
            const getIconColor = (color: string) => {
              const colors = {
                green: 'text-green-700',
                blue: 'text-blue-700',
                red: 'text-red-700',
                purple: 'text-purple-700',
                orange: 'text-orange-700',
                teal: 'text-teal-700'
              }
              return colors[color as keyof typeof colors] || 'text-gray-700'
            }

            const getBackgroundColor = (color: string) => {
              const colors = {
                green: 'from-green-100 to-emerald-100',
                blue: 'from-blue-100 to-indigo-100',
                red: 'from-red-100 to-rose-100',
                purple: 'from-purple-100 to-violet-100',
                orange: 'from-orange-100 to-amber-100',
                teal: 'from-teal-100 to-cyan-100'
              }
              return colors[color as keyof typeof colors] || 'from-gray-100 to-gray-200'
            }

            return (
              <Card key={index} className='group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/95 backdrop-blur-sm border-white/20 shadow-lg hover:-translate-y-2'>
                <div className={`aspect-video bg-gradient-to-br ${getBackgroundColor(item.color)} flex items-center justify-center relative overflow-hidden`}>
                  {/* Chilean flag inspired background pattern */}
                  <div className='absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30'></div>
                  <div className='text-center p-6'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      {item.type.includes('Comunitario') && <Users className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                      {item.type.includes('Seguridad') && <MapPin className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                      {item.type.includes('Celebración') && <Calendar className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                      {item.type.includes('Participativo') && <Users className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                      {item.type.includes('Deporte') && <MapPin className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                      {item.type.includes('Educación') && <Calendar className={`w-8 h-8 ${getIconColor(item.color)}`} />}
                    </div>
                    <Badge variant='secondary' className='mb-2 bg-white/80 text-gray-800 shadow-sm'>
                      {item.type}
                    </Badge>
                    <div className='text-sm font-semibold text-gray-700 bg-white/70 px-3 py-1 rounded-full inline-block'>
                      {item.highlight}
                    </div>
                  </div>
                </div>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors'>
                    {item.title}
                  </h3>
                  <p className='text-gray-700 text-sm mb-4 leading-relaxed'>
                    {item.description}
                  </p>
                  <div className='space-y-2 text-xs text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      <span>{item.location}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
