'use client'

import { motion } from 'framer-motion'
import { Calendar, Camera, Heart, MapPin, Share2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const photoAlbums = [
  {
    id: 1,
    title: 'Feria Artesanal 2025',
    description: 'Muestra y venta de productos locales, música folclórica y gastronomía tradicional',
    date: '2025-10-18',
    location: 'Plaza de Armas',
    photos: 45,
    coverImage: '🎪',
    category: 'events'
  },
  {
    id: 2,
    title: 'Día del Campesino',
    description: 'Celebración de nuestra identidad agrícola con concurso ganadero y exposición de maquinaria',
    date: '2025-11-15',
    location: 'Salón Comunal',
    photos: 67,
    coverImage: '🌾',
    category: 'cultural'
  },
  {
    id: 3,
    title: 'Mejoramiento Calle Real',
    description: 'Proceso de construcción y resultado final del proyecto de pavimentación',
    date: '2024-08-20',
    location: 'Calle Real',
    photos: 23,
    coverImage: '🏗️',
    category: 'projects'
  },
  {
    id: 4,
    title: 'Halloween Rural Comunitario',
    description: 'Feria de disfraces tradicionales chilenos y juegos infantiles',
    date: '2024-10-31',
    location: 'Plaza de Armas',
    photos: 38,
    coverImage: '🎃',
    category: 'cultural'
  },
  {
    id: 5,
    title: 'Ronda Vecinal Nocturna',
    description: 'Actividades de seguridad comunitaria y patrullas preventivas',
    date: '2024-09-15',
    location: 'Sectores rurales',
    photos: 12,
    coverImage: '🛡️',
    category: 'security'
  },
  {
    id: 6,
    title: 'Taller de Huertos Familiares',
    description: 'Capacitación en agricultura orgánica y técnicas de cultivo sostenible',
    date: '2024-11-26',
    location: 'Centro Comunitario',
    photos: 31,
    coverImage: '🌱',
    category: 'education'
  }
]

const featuredPhotos = [
  {
    id: 1,
    title: 'Vista Panorámica de Pinto Los Pellines',
    description: 'Hermoso paisaje rural con las montañas al fondo',
    album: 'Naturaleza Local',
    likes: 45,
    date: '2024-10-15',
    image: '🏔️'
  },
  {
    id: 2,
    title: 'Asamblea General 2025',
    description: 'Directiva y vecinos participando en la reunión mensual',
    album: 'Eventos Comunitarios',
    likes: 32,
    date: '2025-01-20',
    image: '🏛️'
  },
  {
    id: 3,
    title: 'Cosecha de Trigo 2024',
    description: 'Agricultores locales cosechando el tradicional trigo chileno',
    album: 'Agricultura',
    likes: 67,
    date: '2024-12-10',
    image: '🌾'
  },
  {
    id: 4,
    title: 'Inauguración Salón Comunal',
    description: 'Momento emotivo de la inauguración de las nuevas instalaciones',
    album: 'Infraestructura',
    likes: 89,
    date: '2024-06-15',
    image: '🏘️'
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'events':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'cultural':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'projects':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'security':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'education':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function FotosPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-950 dark:via-rose-950 dark:to-orange-950'>
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
          <div className='text-6xl mb-6'>📸🇨🇱</div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Galería Comunitaria
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Recuerdos visuales de nuestra comunidad rural. Eventos, proyectos,
            celebraciones y la vida cotidiana de Pinto Los Pellines.
          </p>
        </motion.div>

        {/* Featured Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            ⭐ Fotos Destacadas
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader className='p-0'>
                    <div className='aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg flex items-center justify-center text-6xl'>
                      {photo.image}
                    </div>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <CardTitle className='text-lg mb-2'>
                      {photo.title}
                    </CardTitle>
                    <CardDescription className='text-sm mb-3'>
                      {photo.description}
                    </CardDescription>
                    <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3'>
                      <span>{photo.album}</span>
                      <div className='flex items-center'>
                        <Heart className='w-4 h-4 mr-1' />
                        <span>{photo.likes}</span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button size='sm' variant='outline' className='flex-1'>
                        <Heart className='w-4 h-4 mr-1' />
                        Like
                      </Button>
                      <Button size='sm' variant='outline'>
                        <Share2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Albums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            📂 Álbumes Fotográficos
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {photoAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow cursor-pointer'>
                  <CardHeader>
                    <div className='flex items-start justify-between mb-4'>
                      <Badge className={`${getCategoryColor(album.category)} border`}>
                        {album.category === 'events' ? '📅 Eventos' :
                         album.category === 'cultural' ? '🎭 Cultural' :
                         album.category === 'projects' ? '🚧 Proyectos' :
                         album.category === 'security' ? '🛡️ Seguridad' : '🎓 Educación'}
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        {album.photos} fotos
                      </Badge>
                    </div>
                    <div className='text-6xl mb-4 text-center'>
                      {album.coverImage}
                    </div>
                    <CardTitle className='text-xl mb-2'>
                      {album.title}
                    </CardTitle>
                    <CardDescription className='text-base'>
                      {album.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <Calendar className='w-4 h-4 mr-2' />
                        <span>{new Date(album.date).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <MapPin className='w-4 h-4 mr-2' />
                        <span>{album.location}</span>
                      </div>
                    </div>
                    <div className='mt-6 pt-4 border-t'>
                      <Button variant='gradientForest' className='w-full'>
                        📸 Ver Álbum Completo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 mb-8'
        >
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            📊 Estadísticas de la Galería
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='text-3xl mb-2'>📸</div>
              <div className='text-2xl font-bold text-blue-600'>1,247</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Fotos totales</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl mb-2'>📂</div>
              <div className='text-2xl font-bold text-green-600'>24</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Álbumes creados</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl mb-2'>❤️</div>
              <div className='text-2xl font-bold text-red-600'>3,456</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Likes totales</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl mb-2'>📅</div>
              <div className='text-2xl font-bold text-purple-600'>18</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Eventos fotografiados</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className='text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            ¿Quieres compartir tus fotos?
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'>
            Si tienes fotos de eventos comunitarios, proyectos o momentos importantes
            de Pinto Los Pellines, puedes compartirlas con la comunidad.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button variant='gradientOcean'>
              <Camera className='w-4 h-4 mr-2' />
              Subir Fotos
            </Button>
            <Button variant='outline'>
              📞 Contactar Moderador
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
