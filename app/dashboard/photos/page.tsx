'use client';

import { motion } from 'framer-motion';
import { Calendar, Camera, Heart, MapPin, Share2 } from 'lucide-react';

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

const photoAlbums = [
  {
    id: 1,
    title: 'Feria Artesanal 2025',
    description:
      'Muestra y venta de productos locales, música folclórica y gastronomía tradicional',
    date: '2025-10-18',
    location: 'Plaza de Armas',
    photos: 45,
    coverImage: '🎪',
    category: 'events',
  },
  {
    id: 2,
    title: 'Día del Campesino',
    description:
      'Celebración de nuestra identidad agrícola con concurso ganadero y exposición de maquinaria',
    date: '2025-11-15',
    location: 'Salón Comunal',
    photos: 67,
    coverImage: '🌾',
    category: 'cultural',
  },
  {
    id: 3,
    title: 'Mejoramiento Calle Real',
    description:
      'Proceso de construcción y resultado final del proyecto de pavimentación',
    date: '2024-08-20',
    location: 'Calle Real',
    photos: 23,
    coverImage: '🏗️',
    category: 'projects',
  },
  {
    id: 4,
    title: 'Halloween Rural Comunitario',
    description:
      'Feria de disfraces tradicionales chilenos y juegos infantiles',
    date: '2024-10-31',
    location: 'Plaza de Armas',
    photos: 38,
    coverImage: '🎃',
    category: 'cultural',
  },
  {
    id: 5,
    title: 'Ronda Vecinal Nocturna',
    description: 'Actividades de seguridad comunitaria y patrullas preventivas',
    date: '2024-09-15',
    location: 'Sectores rurales',
    photos: 12,
    coverImage: '🛡️',
    category: 'security',
  },
  {
    id: 6,
    title: 'Taller de Huertos Familiares',
    description:
      'Capacitación en agricultura orgánica y técnicas de cultivo sostenible',
    date: '2024-11-26',
    location: 'Centro Comunitario',
    photos: 31,
    coverImage: '🌱',
    category: 'education',
  },
];

const featuredPhotos = [
  {
    id: 1,
    title: 'Vista Panorámica de Pinto Los Pellines',
    description: 'Hermoso paisaje rural con las montañas al fondo',
    album: 'Naturaleza Local',
    likes: 45,
    date: '2024-10-15',
    image: '🏔️',
  },
  {
    id: 2,
    title: 'Asamblea General 2025',
    description: 'Directiva y vecinos participando en la reunión mensual',
    album: 'Eventos Comunitarios',
    likes: 32,
    date: '2025-01-20',
    image: '🏛️',
  },
  {
    id: 3,
    title: 'Cosecha de Trigo 2024',
    description: 'Agricultores locales cosechando el tradicional trigo chileno',
    album: 'Agricultura',
    likes: 67,
    date: '2024-12-10',
    image: '🌾',
  },
  {
    id: 4,
    title: 'Niños en el Parque',
    description: 'Juegos y diversión en el parque comunitario',
    album: 'Actividades Infantiles',
    likes: 28,
    date: '2024-09-22',
    image: '🎡',
  },
  {
    id: 5,
    title: 'Artesanía Local',
    description: 'Productos hechos a mano por artesanos de la zona',
    album: 'Feria Artesanal',
    likes: 53,
    date: '2024-11-05',
    image: '🎨',
  },
  {
    id: 6,
    title: 'Deporte Comunitario',
    description: 'Partido de fútbol entre equipos locales',
    album: 'Deportes',
    likes: 41,
    date: '2024-10-28',
    image: '⚽',
  },
];

function PhotosContent() {
  return (
    <div className="space-y-8">
      <BackButton className="mb-6" />
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Galería de Fotos Comunitaria
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora momentos especiales, eventos y la vida cotidiana de Pinto
            Los Pellines a través de nuestras fotos
          </p>
        </motion.div>
      </div>

      {/* Photo Albums */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Álbumes Fotográficos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoAlbums.map(album => (
            <Card
              key={album.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {album.category === 'events'
                      ? 'Eventos'
                      : album.category === 'cultural'
                        ? 'Cultural'
                        : album.category === 'projects'
                          ? 'Proyectos'
                          : album.category === 'security'
                            ? 'Seguridad'
                            : 'Educación'}
                  </Badge>
                  <span className="text-2xl">{album.coverImage}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {album.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {album.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(album.date).toLocaleDateString('es-CL')}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {album.location}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {album.photos} fotos
                  </span>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    Ver Álbum
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Featured Photos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Fotos Destacadas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPhotos.map(photo => (
            <Card
              key={photo.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{photo.image}</span>
                  <Badge variant="secondary" className="text-xs">
                    {photo.album}
                  </Badge>
                </div>
                <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                  {photo.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {photo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(photo.date).toLocaleDateString('es-CL')}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {photo.likes}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Comparte tus Fotos
            </CardTitle>
            <CardDescription>
              ¿Tienes fotos de eventos comunitarios o momentos especiales?
              Contribuye a nuestra galería
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl">📸</div>
              <p className="text-muted-foreground">
                Sube tus fotos para compartir momentos importantes con la
                comunidad. Todas las fotos pasan por moderación antes de ser
                publicadas.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Camera className="w-4 h-4 mr-2" />
                Subir Fotos
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PhotosPage() {
  return <PhotosContent />;
}
