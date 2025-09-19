import { Calendar, Grape, Heart, Mountain, Shield, Sun, TreePine, Users } from 'lucide-react'

import PixelCard from '@/components/react-bits/pixel-card'

const countrysideFeatures = [
  {
    icon: Shield,
    title: 'Seguridad Campesina',
    description: 'Rondas nocturnas que protegen nuestras viñas y hogares bajo el cielo estrellado de Ñuble',
    color: 'text-red-600',
    variant: 'pink' as const,
    bgColor: 'bg-red-50/80',
    borderColor: 'border-red-200'
  },
  {
    icon: Grape,
    title: 'Viñas Tradicionales',
    description: 'Cultivo ancestral de uvas que dan vida a nuestros vinos y la identidad de Pinto Los Pellines',
    color: 'text-purple-600',
    variant: 'yellow' as const,
    bgColor: 'bg-purple-50/80',
    borderColor: 'border-purple-200'
  },
  {
    icon: TreePine,
    title: 'Bosques Ancestrales',
    description: 'Protección y cuidado de nuestros bosques nativos que abrazan nuestra comunidad',
    color: 'text-green-600',
    variant: 'blue' as const,
    bgColor: 'bg-green-50/80',
    borderColor: 'border-green-200'
  },
  {
    icon: Mountain,
    title: 'Tradición Montañesa',
    description: 'Orgullo de nuestras montañas que nos recuerdan la fuerza de nuestros antepasados ñublensinos',
    color: 'text-amber-600',
    variant: 'yellow' as const,
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-200'
  },
  {
    icon: Sun,
    title: 'Sol de Nuestra Tierra',
    description: 'Energía renovable que ilumina nuestros caminos y calienta nuestros corazones',
    color: 'text-yellow-600',
    variant: 'yellow' as const,
    bgColor: 'bg-yellow-50/80',
    borderColor: 'border-yellow-200'
  },
  {
    icon: Heart,
    title: 'Espíritu Comunitario',
    description: 'El amor que une a nuestras 342 familias en la construcción de un futuro mejor',
    color: 'text-pink-600',
    variant: 'pink' as const,
    bgColor: 'bg-pink-50/80',
    borderColor: 'border-pink-200'
  }
]

const countrysideHighlights = [
  {
    title: 'Feria Artesanal Mensual',
    description: 'Donde nuestras manos crean arte y nuestros corazones se conectan bajo el sol de Ñuble',
    icon: Calendar,
    color: 'text-orange-600'
  },
  {
    title: 'Rondas Vecinales Nocturnas',
    description: 'Protegiendo nuestros sueños mientras las estrellas vigilan nuestros campos',
    icon: Shield,
    color: 'text-blue-600'
  },
  {
    title: 'Fiestas Patrias Chilenas',
    description: 'Celebrando nuestra independencia con cueca, ramadas y orgullo nacional',
    icon: Users,
    color: 'text-red-600'
  }
]

export default function CommunityFeatures() {
  return (
    <section className='relative py-20 md:py-32 overflow-hidden'>
      {/* Countryside Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-green-50/40 via-yellow-50/30 to-blue-50/40 -z-10'></div>
      <div className='absolute top-0 left-0 w-full h-full -z-5'>
        <div className='absolute top-20 left-10 opacity-10'>
          <TreePine className='w-32 h-32 text-green-400' />
        </div>
        <div className='absolute bottom-20 right-10 opacity-10'>
          <Mountain className='w-40 h-40 text-amber-400' />
        </div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5'>
          <Grape className='w-48 h-48 text-purple-400' />
        </div>
      </div>

      <div className='relative mx-auto max-w-7xl px-6'>
        {/* Main Title */}
        <div className='text-center mb-16'>
          <PixelCard variant='yellow' className='mx-auto w-fit mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'>
            <div className='flex items-center gap-3 px-8 py-4'>
              <Sun className='w-6 h-6 text-yellow-600' />
              <span className='font-bold text-amber-800 text-lg'>Orgullo de Nuestra Tierra</span>
              <TreePine className='w-6 h-6 text-green-600' />
            </div>
          </PixelCard>

          <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-700 via-amber-700 to-red-700 bg-clip-text text-transparent'>
            🇨🇱 Belleza Campesina
          </h2>
          <p className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            En el corazón de Ñuble, donde la tierra besa el cielo y las viñas cuentan historias ancestrales,
            forjamos una comunidad que honra sus raíces mientras construye el futuro con orgullo chileno.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20'>
          {countrysideFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <PixelCard
                key={index}
                variant={feature.variant}
                className={`${feature.bgColor} ${feature.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className='p-8 text-center'>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 mb-6 shadow-lg ${feature.color}`}>
                    <Icon className='w-8 h-8' />
                  </div>
                  <h3 className='text-2xl font-bold mb-4 text-gray-800'>{feature.title}</h3>
                  <p className='text-gray-700 leading-relaxed text-lg'>
                    {feature.description}
                  </p>
                </div>
              </PixelCard>
            )
          })}
        </div>

        {/* Countryside Highlights */}
        <div className='mb-16'>
          <div className='text-center mb-12'>
            <h3 className='text-3xl font-bold text-gray-800 mb-4'>Momentos que Nos Definen</h3>
            <p className='text-lg text-gray-600'>Las tradiciones que mantienen vivo el espíritu de Pinto Los Pellines</p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {countrysideHighlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <PixelCard
                  key={index}
                  variant='default'
                  className='bg-white/90 backdrop-blur-sm border-gray-200 hover:shadow-xl transition-all duration-300'
                >
                  <div className='p-6'>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-4 shadow-md ${highlight.color}`}>
                      <Icon className='w-6 h-6' />
                    </div>
                    <h4 className='text-xl font-semibold mb-3 text-gray-800'>{highlight.title}</h4>
                    <p className='text-gray-700 leading-relaxed'>
                      {highlight.description}
                    </p>
                  </div>
                </PixelCard>
              )
            })}
          </div>
        </div>

        {/* Countryside Quote */}
        <div className='text-center'>
          <PixelCard variant='blue' className='mx-auto max-w-4xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <div className='p-8'>
              <blockquote className='text-2xl font-medium text-gray-800 mb-6 leading-relaxed'>
                &quot;En Pinto Los Pellines, no solo vivimos en un lugar hermoso, sino que somos parte de una historia viva.
                Cada viña, cada árbol, cada familia contribuye a tejer el tapiz de nuestra identidad chilena.&quot;
              </blockquote>
              <footer className='flex items-center justify-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center'>
                  <span className='text-white font-bold'>JVP</span>
                </div>
                <div className='text-left'>
                  <cite className='block font-semibold text-gray-800'>Junta de Vecinos Pinto Los Pellines</cite>
                  <span className='text-sm text-gray-600'>Con el corazón en la tierra y la mirada en el futuro</span>
                </div>
              </footer>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  )
}
