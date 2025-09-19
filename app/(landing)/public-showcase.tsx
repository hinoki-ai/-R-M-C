'use client'

import { motion } from 'framer-motion'
import { Award, Heart, Shield, Star, TreePine, Trophy, Users, Zap } from 'lucide-react'

import { Card } from '@/components/ui/card'

const showcaseItems = [
  {
    title: 'Comunidad Modelo',
    description: 'Reconocida por el Gobierno Regional como una de las comunidades mejor organizadas de Ñuble',
    icon: Award,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50/80',
    borderColor: 'border-yellow-200',
    variant: 'yellow' as const,
    metric: 'Premio 2024'
  },
  {
    title: '342 Familias Unidas',
    description: 'Más de tres siglos de historia familiar entretejidos en una comunidad fuerte y solidaria',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-200',
    variant: 'blue' as const,
    metric: '342 familias'
  },
  {
    title: '25 Años de Tradición',
    description: 'Un cuarto de siglo de rondas vecinales que mantienen segura nuestra querida tierra',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50/80',
    borderColor: 'border-red-200',
    variant: 'pink' as const,
    metric: '25 años'
  },
  {
    title: 'Bosques Protegidos',
    description: 'Miles de hectáreas de bosque nativo preservadas gracias a la labor comunitaria',
    icon: TreePine,
    color: 'text-green-600',
    bgColor: 'bg-green-50/80',
    borderColor: 'border-green-200',
    variant: 'blue' as const,
    metric: '500+ hectáreas'
  },
  {
    title: 'Energía Renovable',
    description: 'Paneles solares que alimentan nuestras escuelas y alumbran nuestros caminos',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50/80',
    borderColor: 'border-orange-200',
    variant: 'yellow' as const,
    metric: '100% renovable'
  },
  {
    title: 'Orgullo Ñublensino',
    description: 'El corazón latiente de la identidad chilena en el centro de nuestra región',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50/80',
    borderColor: 'border-pink-200',
    variant: 'pink' as const,
    metric: '❤️ infinito'
  }
]

export default function PublicShowcase() {
  return (
    <section className='relative py-20 md:py-32 overflow-hidden'>
      {/* Dynamic Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/30 to-green-50/40 -z-10'></div>
      <div className='absolute top-0 left-0 w-full h-full -z-5'>
        <div className='absolute top-20 left-10 opacity-6'>
          <Trophy className='w-28 h-28 text-yellow-300' />
        </div>
        <div className='absolute bottom-20 right-10 opacity-6'>
          <Star className='w-32 h-32 text-blue-300' />
        </div>
        <div className='absolute top-1/2 left-1/4 opacity-4'>
          <Award className='w-24 h-24 text-green-300' />
        </div>
        <div className='absolute top-1/3 right-1/4 opacity-5'>
          <Heart className='w-20 h-20 text-red-300' />
        </div>
      </div>

      <div className='relative mx-auto max-w-7xl px-6'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <Card className='mx-auto w-fit mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <div className='flex items-center gap-3 px-8 py-4'>
              <Trophy className='w-6 h-6 text-blue-600' />
              <span className='font-bold text-blue-800 text-lg'>Orgullo Comunitario</span>
              <Award className='w-6 h-6 text-yellow-600' />
            </div>
          </Card>

          <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-green-700 to-red-700 bg-clip-text text-transparent'>
            🇨🇱 Pinto Los Pellines en Números
          </h2>
          <p className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            Descubre los logros que hacen de nuestra comunidad un ejemplo de organización,
            solidaridad y progreso en el corazón de Ñuble. Cada número representa años de trabajo conjunto.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16'>
          {showcaseItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`${item.bgColor} ${item.borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer`}
                >
                  <div className='p-8 text-center'>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                      <Icon className='w-8 h-8' />
                    </div>

                    <div className='mb-4'>
                      <div className='text-3xl font-bold text-gray-800 mb-2'>{item.metric}</div>
                      <h3 className='text-xl font-bold text-gray-800 mb-3'>{item.title}</h3>
                    </div>

                    <p className='text-gray-700 leading-relaxed'>
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className='text-center'>
          <Card className='mx-auto max-w-4xl bg-gradient-to-r from-white/95 to-blue-50/95 border-gray-200 backdrop-blur-sm'>
            <div className='p-8'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>¿Quieres ser parte de esta historia?</h3>
              <p className='text-lg text-gray-700 mb-6 leading-relaxed'>
                Únete a la familia de Pinto Los Pellines y contribuye a escribir el próximo capítulo de nuestro legado comunitario.
                Juntos, seguimos construyendo el futuro de Ñuble con orgullo y determinación.
              </p>
              <div className='flex items-center justify-center gap-2 text-sm text-gray-600'>
                <Users className='w-4 h-4' />
                <span>Más de 342 familias ya forman parte de esta hermosa historia</span>
                <Heart className='w-4 h-4 text-red-500' />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}