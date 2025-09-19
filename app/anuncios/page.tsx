'use client'

import { motion } from 'framer-motion'
import { Bell, Calendar, MapPin, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const announcements = [
  {
    id: 1,
    title: 'Cortes de Agua Programados - Sector Sur',
    content: 'Este jueves 18 de octubre, entre 09:00 y 14:00 hrs, se realizarán trabajos de mantenimiento en la red de agua potable del sector sur. Se recomienda almacenar agua potable para consumo durante el corte programado.',
    type: 'urgent',
    date: '2025-10-15',
    author: 'Junta de Vecinos',
    location: 'Sector Sur - Pinto Los Pellines'
  },
  {
    id: 2,
    title: 'Campaña de Recolección de Semillas Tradicionales',
    content: 'Invitamos a todos los agricultores del sector a participar en la preservación de semillas nativas. Punto de acopio: Casa de la Cultura los días jueves. ¡Mantengamos viva nuestra agricultura tradicional!',
    type: 'community',
    date: '2025-10-12',
    author: 'Comisión Agrícola',
    location: 'Casa de la Cultura'
  },
  {
    id: 3,
    title: 'Proyecto Completa: Mejoramiento Camino a La Laja',
    content: 'Culminaron los trabajos de ripiado y señalización del camino rural. Agradecemos la colaboración de todos los vecinos en el proyecto participativo. El camino ahora es transitable durante todo el año.',
    type: 'success',
    date: '2025-10-10',
    author: 'Secretaría de Obras',
    location: 'Camino a La Laja'
  },
  {
    id: 4,
    title: 'Taller de Huertos Familiares',
    content: 'Próximo sábado 26 de octubre, taller gratuito sobre agricultura orgánica y huertos urbanos. Cupos limitados. Inscripciones en secretaría de la Junta hasta el viernes.',
    type: 'event',
    date: '2025-10-08',
    author: 'Comisión de Medio Ambiente',
    location: 'Salón Comunal'
  },
  {
    id: 5,
    title: 'Vacunación Antirrábica Mascotas',
    content: 'Este fin de semana 19-20 octubre, brigada veterinaria gratuita en el salón comunal. Es obligatorio vacunar a todos los perros y gatos. Evitemos brotes de rabia en nuestro sector rural.',
    type: 'health',
    date: '2025-10-05',
    author: 'Comisión de Salud Animal',
    location: 'Salón Comunal'
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'community':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'event':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'health':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'urgent':
      return '🚨'
    case 'community':
      return '🤝'
    case 'success':
      return '✅'
    case 'event':
      return '📅'
    case 'health':
      return '🏥'
    default:
      return '📢'
  }
}

export default function AnunciosPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-green-950 dark:via-blue-950 dark:to-yellow-950'>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className='absolute top-20 left-12 text-6xl'>🏔️</div>
        <div className='absolute top-32 left-16 text-4xl'>🌽</div>
        <div className='absolute top-60 right-16 text-5xl'>🇨🇱</div>
        <div className='absolute top-80 left-8 text-3xl'>🌻</div>
        <div className='absolute bottom-32 left-20 text-4xl'>🏞️</div>
        <div className='absolute bottom-40 right-12 text-3xl'>🌽</div>
        <div className='absolute bottom-60 left-32 text-3xl'>🐑</div>
        <div className='absolute bottom-20 right-24 text-4xl'>🏘️</div>
        <div className='absolute top-40 right-8 text-3xl'>🌾</div>
        <div className='absolute bottom-80 right-40 text-2xl'>🇨🇱</div>
      </div>

      <div className='relative container mx-auto px-6 py-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <div className='text-6xl mb-6'>📢🇨🇱</div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Anuncios Comunidad
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Mantente informado sobre las últimas noticias, eventos y anuncios importantes
            de la Junta de Vecinos Pinto Los Pellines, Ñuble
          </p>
        </motion.div>

        {/* Announcements Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className='h-full hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-start justify-between mb-4'>
                    <Badge className={`${getTypeColor(announcement.type)} border`}>
                      <span className='mr-1'>{getTypeIcon(announcement.type)}</span>
                      {announcement.type === 'urgent' ? 'Urgente' :
                       announcement.type === 'community' ? 'Comunidad' :
                       announcement.type === 'success' ? 'Completado' :
                       announcement.type === 'event' ? 'Evento' : 'Salud'}
                    </Badge>
                    <span className='text-sm text-gray-500'>
                      {new Date(announcement.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <CardTitle className='text-xl mb-2'>
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className='text-base'>
                    {announcement.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <User className='w-4 h-4 mr-2' />
                      <span>{announcement.author}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <MapPin className='w-4 h-4 mr-2' />
                      <span>{announcement.location}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <Calendar className='w-4 h-4 mr-2' />
                      <span>Publicado: {new Date(announcement.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  {announcement.type === 'event' && (
                    <div className='mt-4 pt-4 border-t'>
                      <Button className='w-full bg-green-600 hover:bg-green-700'>
                        📝 Inscribirme al Evento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            ¿Quieres publicar un anuncio?
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'>
            Si eres parte de la directiva o tienes información importante para compartir
            con la comunidad, contacta a la secretaría de la Junta de Vecinos.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              <Bell className='w-4 h-4 mr-2' />
              Contactar Secretaría
            </Button>
            <Button variant='outline'>
              📞 Llamar Directiva
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}