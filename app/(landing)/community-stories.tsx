import { BookOpen, Grape, Heart, Mountain, Star, TreePine, Users } from 'lucide-react'

import PixelCard from '@/components/react-bits/pixel-card'

const communityStories = [
  {
    title: 'Las Viñas de Don Pedro',
    excerpt: 'Hace más de 80 años, Don Pedro plantó las primeras vides en estas tierras fértiles. Hoy, sus nietos continúan la tradición familiar, produciendo vinos que cuentan la historia de Ñuble en cada copa.',
    author: 'Familia Hernández',
    category: 'Herencia Agrícola',
    icon: Grape,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50/80',
    borderColor: 'border-purple-200',
    variant: 'yellow' as const
  },
  {
    title: 'Guardianes de los Bosques',
    excerpt: 'Durante generaciones, las familias de Pinto Los Pellines han cuidado estos bosques ancestrales. Cada árbol cuenta una historia, cada sendero guarda un recuerdo de nuestros antepasados.',
    author: 'Comunidad Forestal',
    category: 'Protección Ambiental',
    icon: TreePine,
    color: 'text-green-600',
    bgColor: 'bg-green-50/80',
    borderColor: 'border-green-200',
    variant: 'blue' as const
  },
  {
    title: 'El Espíritu de las Rondas',
    excerpt: 'Nuestras rondas vecinales no son solo seguridad, son el corazón de nuestra comunidad. Vecinos cuidando de vecinos, manteniendo viva la tradición del apoyo mutuo que nos define como ñublensinos.',
    author: 'Equipo de Seguridad Comunitaria',
    category: 'Tradición Vecinal',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-200',
    variant: 'default' as const
  },
  {
    title: 'Las Estrellas sobre Ñuble',
    excerpt: 'Bajo el cielo más estrellado de Chile, nuestros abuelos nos enseñaron a soñar en grande. Hoy, esos sueños se hacen realidad gracias al trabajo conjunto de toda nuestra comunidad unida.',
    author: 'Junta de Vecinos',
    category: 'Sueños Compartidos',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50/80',
    borderColor: 'border-yellow-200',
    variant: 'yellow' as const
  }
]

export default function CommunityStories() {
  return (
    <section className='relative py-20 md:py-32 overflow-hidden'>
      {/* Countryside Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-amber-50/30 via-yellow-50/20 to-orange-50/30 -z-10'></div>
      <div className='absolute top-0 left-0 w-full h-full -z-5'>
        <div className='absolute top-20 left-10 opacity-8'>
          <BookOpen className='w-24 h-24 text-amber-300' />
        </div>
        <div className='absolute bottom-20 right-10 opacity-8'>
          <Heart className='w-32 h-32 text-red-300' />
        </div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5'>
          <Mountain className='w-40 h-40 text-green-300' />
        </div>
      </div>

      <div className='relative mx-auto max-w-7xl px-6'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <PixelCard variant='yellow' className='mx-auto w-fit mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'>
            <div className='flex items-center gap-3 px-8 py-4'>
              <BookOpen className='w-6 h-6 text-amber-600' />
              <span className='font-bold text-amber-800 text-lg'>Historias de Nuestra Tierra</span>
              <Heart className='w-6 h-6 text-red-600' />
            </div>
          </PixelCard>

          <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-700 via-red-700 to-green-700 bg-clip-text text-transparent'>
            🇨🇱 Relatos Ñublensinos
          </h2>
          <p className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            Cada familia, cada viña, cada tradición contribuye a tejer el rico tapiz de nuestra identidad chilena.
            Estas son algunas de las historias que hacen de Pinto Los Pellines un lugar único en el corazón de Ñuble.
          </p>
        </div>

        {/* Stories Grid */}
        <div className='grid gap-8 md:grid-cols-2 mb-16'>
          {communityStories.map((story, index) => {
            const Icon = story.icon
            return (
              <PixelCard
                key={index}
                variant={story.variant}
                className={`${story.bgColor} ${story.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className='p-8'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 shadow-lg ${story.color}`}>
                      <Icon className='w-6 h-6' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors'>
                        {story.title}
                      </h3>
                      <span className='text-sm text-gray-600 font-medium'>{story.category}</span>
                    </div>
                  </div>

                  <p className='text-gray-700 leading-relaxed text-lg mb-6'>
                    {story.excerpt}
                  </p>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600 italic'>Por: {story.author}</span>
                    <div className='flex items-center gap-1'>
                      <Star className='w-4 h-4 text-yellow-500 fill-current' />
                      <span className='text-sm text-gray-600'>Historia destacada</span>
                    </div>
                  </div>
                </div>
              </PixelCard>
            )
          })}
        </div>

        {/* Heritage Quote */}
        <div className='text-center'>
          <PixelCard variant='default' className='mx-auto max-w-4xl bg-gradient-to-r from-white/95 to-amber-50/95 border-gray-200 backdrop-blur-sm'>
            <div className='p-8'>
              <blockquote className='text-2xl font-medium text-gray-800 mb-6 leading-relaxed italic'>
                &quot;En Pinto Los Pellines, nuestras historias no se pierden en el tiempo, sino que se transmiten de generación en generación,
                enriqueciéndose con cada nueva voz que se suma a nuestro coro comunitario. Somos guardianes de la memoria colectiva de Ñuble.&quot;
              </blockquote>
              <footer className='flex items-center justify-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center'>
                  <span className='text-white font-bold'>Ñ</span>
                </div>
                <div className='text-left'>
                  <cite className='block font-semibold text-gray-800'>Voces Ancestrales</cite>
                  <span className='text-sm text-gray-600'>La sabiduría acumulada de nuestras familias ñublensinas</span>
                </div>
              </footer>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  )
}
