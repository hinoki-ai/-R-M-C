'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Building2,
  Calendar,
  Code,
  DollarSign,
  Github,
  HandHeart,
  Heart,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  Wrench
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { PublicLayout } from '@/components/layout/public-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ContributionItem {
  title: string
  description: string
  action: string
  link: string
  icon: any
  external?: boolean
}

export default function ContribucionesPage() {
  const router = useRouter()

  const contributionCategories = [
    {
      id: 'financial',
      title: 'Contribuciones Financieras',
      description: 'Apoya económicamente el desarrollo y mantenimiento de Pinto Los Pellines',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      items: [
        {
          title: 'Donaciones Directas',
          description: 'Contribuciones únicas o recurrentes para proyectos comunitarios',
          action: 'Ir a Donar',
          link: '/donate',
          icon: Heart,
          external: false
        },
        {
          title: 'Patrocinios Empresariales',
          description: 'Alianzas con empresas locales para proyectos específicos',
          action: 'Contactar',
          link: '/contactos',
          icon: Building2,
          external: false
        }
      ]
    },
    {
      id: 'volunteering',
      title: 'Voluntariado',
      description: 'Participa activamente en la construcción de nuestra comunidad',
      icon: HandHeart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      items: [
        {
          title: 'Eventos Comunitarios',
          description: 'Ayuda en organización de fiestas, talleres y actividades sociales',
          action: 'Ver Eventos',
          link: '/eventos',
          icon: Calendar,
          external: false
        },
        {
          title: 'Mantenimiento',
          description: 'Colabora en reparaciones, limpieza y mejoras del barrio',
          action: 'Postular',
          link: '/contactos',
          icon: Wrench,
          external: false
        },
        {
          title: 'Educación y Talleres',
          description: 'Comparte conocimientos y organiza capacitaciones',
          action: 'Proponer',
          link: '/contactos',
          icon: Users,
          external: false
        }
      ]
    },
    {
      id: 'technical',
      title: 'Contribuciones Técnicas',
      description: 'Ayuda a mejorar nuestra plataforma tecnológica',
      icon: Code,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      items: [
        {
          title: 'Desarrollo de Código',
          description: 'Contribuye al código fuente de la plataforma comunitaria',
          action: 'GitHub',
          link: 'https://github.com/hinoki-ai/-R-M-C',
          icon: Github,
          external: true
        },
        {
          title: 'Reportar Problemas',
          description: 'Ayuda identificando bugs y sugerencias de mejora',
          action: 'Issues',
          link: 'https://github.com/hinoki-ai/-R-M-C/issues',
          icon: AlertTriangle,
          external: true
        },
        {
          title: 'Documentación',
          description: 'Mejora guías, tutoriales y documentación del proyecto',
          action: 'Contribuir',
          link: 'https://github.com/hinoki-ai/-R-M-C',
          icon: MessageSquare,
          external: true
        }
      ]
    },
    {
      id: 'community',
      title: 'Participación Comunitaria',
      description: 'Sé parte activa de las decisiones y actividades del barrio',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      items: [
        {
          title: 'Junta de Vecinos',
          description: 'Participa en reuniones y decisiones comunitarias',
          action: 'Información',
          link: '/contactos',
          icon: Building2,
          external: false
        },
        {
          title: 'Ideas y Sugerencias',
          description: 'Comparte tus ideas para mejorar el barrio',
          action: 'Enviar',
          link: '/contactos',
          icon: Lightbulb,
          external: false
        },
        {
          title: 'Difusión',
          description: 'Ayuda a promover la plataforma en redes sociales',
          action: 'Compartir',
          link: '/contactos',
          icon: MessageSquare,
          external: false
        }
      ]
    }
  ]

  return (
    <PublicLayout>
      <div className='min-h-screen relative overflow-hidden bg-background'>
        {/* INVITING BACKGROUND with Warm Community Theme */}
        <div className='fixed inset-0 -z-10'>
          <Image
            src='/images/backgrounds/bg4.jpg'
            alt='Pinto Los Pellines Community Background'
            fill
            className='object-cover object-center dark:opacity-25 opacity-90'
            priority
            quality={95}
          />
          {/* Warm, inviting overlay gradients */}
          <div className='absolute inset-0 bg-gradient-to-br from-amber-100/40 via-orange-50/30 to-yellow-100/40 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-yellow-900/20' />
          <div className='absolute inset-0 bg-gradient-to-t from-red-900/15 via-transparent to-blue-900/15 dark:from-red-900/10 dark:via-transparent dark:to-blue-900/10' />
          <div className='absolute inset-0 bg-gradient-to-r from-green-900/8 via-transparent to-purple-900/8 dark:from-green-900/5 dark:via-transparent dark:to-purple-900/5' />
          {/* Soft light overlay for readability */}
          <div className='absolute inset-0 bg-white/15 dark:bg-black/20' />
        </div>

        {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
        {/* Enhanced Hero Section with Beautiful Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='text-center mb-20'
        >
          {/* Animated Icon with Glow Effect */}
          <motion.div
            className='flex justify-center mb-8'
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className='relative'>
              <div className='p-6 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-full shadow-2xl border-4 border-white/20 dark:border-gray-800/20'>
                <Heart className='w-16 h-16 text-white drop-shadow-lg' />
              </div>
              {/* Glow effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-amber-400 to-red-400 rounded-full blur-xl opacity-30 animate-pulse' />
            </div>
          </motion.div>

          {/* Enhanced Title with Gradient Text */}
          <motion.h1
            className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-2xl'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Formas de Contribuir
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            className='text-xl md:text-2xl text-gray-800 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Hay muchas maneras de ser parte del crecimiento y desarrollo de Pinto Los Pellines.
            <span className='text-amber-600 dark:text-amber-400 font-semibold'> Tu participación</span>, sea cual sea su forma, es invaluable para nuestra comunidad.
          </motion.p>

          {/* Decorative Elements */}
          <motion.div
            className='flex justify-center items-center space-x-4 mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className='flex space-x-2'>
              <Sparkles className='w-5 h-5 text-amber-500 animate-pulse' />
              <Star className='w-4 h-4 text-orange-500 animate-bounce' />
              <Sparkles className='w-5 h-5 text-red-500 animate-pulse' />
            </div>
          </motion.div>
        </motion.div>

        {/* Contribution Categories */}
        <div className='space-y-16'>
          {contributionCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + categoryIndex * 0.2, duration: 0.6 }}
            >
              {/* Enhanced Category Header */}
              <div className='text-center mb-12'>
                <motion.div
                  className={`inline-flex p-4 rounded-full ${category.bgColor} mb-6 shadow-xl border-2 border-white/20 dark:border-gray-800/20`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <category.icon className={`w-10 h-10 ${category.iconColor}`} />
                </motion.div>
                <motion.h2
                  className='text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + categoryIndex * 0.2 }}
                >
                  {category.title}
                </motion.h2>
                <motion.p
                  className='text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + categoryIndex * 0.2 }}
                >
                  {category.description}
                </motion.p>
              </div>

              {/* Category Items */}
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.2 + categoryIndex * 0.2 + itemIndex * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className='h-full group bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-white/20 dark:border-gray-800/20 hover:border-amber-300/50 dark:hover:border-amber-600/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative'>
                      {/* Subtle gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                      <CardHeader className='pb-4'>
                        <div className='flex items-center space-x-4 mb-3'>
                          <motion.div
                            className={`p-3 rounded-xl ${category.bgColor} shadow-lg`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <item.icon className={`w-6 h-6 ${category.iconColor}`} />
                          </motion.div>
                          <CardTitle className='text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors'>
                            {item.title}
                          </CardTitle>
                        </div>
                        <CardDescription className='text-gray-600 dark:text-gray-400 leading-relaxed text-base'>
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0`}
                            onClick={() => {
                              if (item.external) {
                                window.open(item.link, '_blank')
                              } else {
                                router.push(item.link)
                              }
                            }}
                          >
                            <span className='flex items-center justify-center space-x-2'>
                              <span>{item.action}</span>
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                →
                              </motion.div>
                            </span>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className='bg-gradient-to-br from-white/95 via-amber-50/80 to-orange-50/80 dark:from-gray-900/95 dark:via-amber-900/20 dark:to-orange-900/20 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-amber-200/30 dark:border-amber-800/30 mt-20 text-center relative overflow-hidden'
        >
          {/* Decorative background elements */}
          <div className='absolute top-4 left-4 opacity-10'>
            <Heart className='w-12 h-12 text-amber-500' />
          </div>
          <div className='absolute bottom-4 right-4 opacity-10'>
            <Sparkles className='w-10 h-10 text-orange-500' />
          </div>

          <motion.h2
            className='text-4xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
          >
            ¿No sabes por dónde empezar?
          </motion.h2>
          <motion.p
            className='text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-lg leading-relaxed'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
          >
            Todas las formas de contribuir son importantes. Si tienes alguna duda sobre cómo participar,
            <span className='text-amber-600 dark:text-amber-400 font-semibold'> no dudes en contactarnos</span>.
            ¡Estamos aquí para ayudarte con entusiasmo!
          </motion.p>
          <motion.div
            className='flex flex-col sm:flex-row gap-6 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size='lg'
                onClick={() => router.push('/contactos')}
                className='bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 text-lg'
              >
                <span className='flex items-center space-x-3'>
                  <Users className='w-6 h-6' />
                  <span>Contactar a la Comunidad</span>
                </span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size='lg'
                variant='outline'
                onClick={() => router.push('/donate')}
                className='border-2 border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg'
              >
                <span className='flex items-center space-x-3'>
                  <Heart className='w-6 h-6' />
                  <span>Hacer una Donación</span>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className='text-center mt-16 mb-8'
        >
          <div className='bg-gradient-to-r from-amber-100/50 via-orange-100/30 to-red-100/50 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-red-900/20 rounded-2xl p-8 backdrop-blur-sm border border-amber-200/20 dark:border-amber-800/20'>
            <motion.div
              className='flex justify-center mb-6'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
            >
              <div className='flex space-x-3'>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart className='w-8 h-8 text-red-500' />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                >
                  <Sparkles className='w-6 h-6 text-amber-500' />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                >
                  <Users className='w-8 h-8 text-orange-500' />
                </motion.div>
              </div>
            </motion.div>
            <motion.p
              className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              ¡Gracias por considerar contribuir a Pinto Los Pellines!
            </motion.p>
            <motion.p
              className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.9 }}
            >
              Tu participación hace la diferencia en nuestra comunidad.
              <span className='text-amber-600 dark:text-amber-400 font-semibold'> Juntos construimos un mejor futuro para todos</span>. 🙏
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
    </PublicLayout>
  )
}