'use client'

import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  Heart,
  Megaphone,
  Shield,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ModeToggle } from '@/components/layout/mode-toggle'
import { PublicLayout } from '@/components/layout/public-layout'
import { PulsatingButton } from '@/components/magicui/pulsating-button'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TextEffect } from '@/components/ui/text-effect'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <PublicLayout>
      <main className='min-h-screen relative overflow-hidden bg-background' >
        {/* THEME-ADAPTIVE BACKGROUND */}
        <div className='fixed inset-0 -z-10' >
          <Image
            src='/images/backgrounds/bg2.jpg'
            alt='Pinto Los Pellines Background'
            fill
            className='object-cover object-center dark:opacity-30 opacity-100'
            priority
            quality={95}
          />
          {/* Theme-adaptive overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90 dark:from-black/60 dark:via-black/40 dark:to-black/80' />
          <div className='absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-blue-900/20 dark:from-red-900/10 dark:via-transparent dark:to-blue-900/10' />
          <div className='absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-yellow-900/10 dark:from-green-900/5 dark:via-transparent dark:to-yellow-900/5' />
          {/* Light theme overlay for better contrast */}
          <div className='absolute inset-0 bg-white/20 dark:bg-transparent' />
        </div>

      {/* SUPREME HERO SECTION */}
      <section className='relative min-h-screen flex items-center justify-center pt-20' >
        <div className='container mx-auto px-4 py-16 relative z-10' >
          <div className='text-center space-y-12' >

            {/* Main Title with Supreme Text Effects */}
            <div className='space-y-8' >
              <TextEffect
                preset='fade-in-blur'
                per='word'
                speedSegment={0.3}
                as='h1'
                className='text-6xl md:text-8xl font-bold text-foreground drop-shadow-2xl'
              >
                🇨🇱 Junta de Vecinos
              </TextEffect>

              <TextEffect
                preset='fade-in-blur'
                per='word'
                speedSegment={0.3}
                delay={0.5}
                as='h2'
                className='text-3xl md:text-5xl font-semibold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-xl'
              >
                Pinto Los Pellines, Ñuble
              </TextEffect>

              <TextEffect
                preset='fade-in-blur'
                per='line'
                speedSegment={0.3}
                delay={1}
                as='p'
                className='text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed drop-shadow-lg'
              >
                La plataforma comunitaria más avanzada de Chile con tecnología de vanguardia, 
                cámaras de seguridad inteligentes, pagos integrados y gestión completa de la comunidad.
              </TextEffect>
            </div>

            {/* Supreme Action Buttons */}
            <AnimatedGroup
              preset='scale'
              className='flex flex-col sm:flex-row gap-6 justify-center mt-16'
            >
              <Button
                size='lg'
                variant='outline'
                className='bg-card/10 border-border/30 text-foreground hover:bg-card/20 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-foreground/25 transition-all duration-300 hover:-translate-y-1'
              >
                <Link href='/anuncios' className='flex items-center gap-3' >
                  <Megaphone className='w-6 h-6' />
                  <span className='text-lg' >Ver Anuncios</span>
                  <Star className='w-5 h-5' />
                </Link>
              </Button>
            </AnimatedGroup>

            {/* Supreme Stats with Infinite Slider */}
            <div className='mt-20' >
              <InfiniteSlider
                speed={50}
                speedOnHover={20}
                className='py-4'
              >
                {[
                  { icon: Users, value: '342', label: 'Familias Activas', color: 'text-blue-400' },
                  { icon: Calendar, value: '25', label: 'Años de Tradición', color: 'text-green-400' },
                  { icon: Shield, value: '100%', label: 'Seguridad Garantizada', color: 'text-yellow-400' },
                  { icon: Heart, value: '1', label: 'Comunidad Unida', color: 'text-red-400' },
                  { icon: Zap, value: '24/7', label: 'Monitoreo Activo', color: 'text-purple-400' },
                  { icon: Activity, value: '99.9%', label: 'Uptime Garantizado', color: 'text-cyan-400' }
                ].map((stat, index) => (
                  <Card key={index} className='mx-4 bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105' >
                    <CardContent className='p-6 text-center' >
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                      <div className='text-3xl font-bold text-foreground mb-2' >{stat.value}</div>
                      <div className='text-sm text-muted-foreground' >{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </InfiniteSlider>
            </div>
          </div>
        </div>
      </section>

      {/* SUPREME CHILEAN CULTURAL BANNER */}
      <section className='relative py-16' >
        <div className='container mx-auto px-4 text-center relative z-10' >
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h3'
            className='text-3xl font-bold bg-gradient-to-r from-yellow-300 via-red-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg'
          >
            Orgullosamente Rural y Tecnológico
          </TextEffect>
        </div>
      </section>

      {/* SUPREME QUICK ACTIONS */}
      <section className='relative py-20' >
        <div className='container mx-auto px-4' >
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-4xl md:text-5xl font-bold text-center mb-16 text-foreground drop-shadow-2xl'
          >
            Acciones Rápidas
          </TextEffect>
          
          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
          >
            <Link href='/dashboard/emergencies' >
              <Card className='group relative overflow-hidden bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30 hover:border-red-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 dark:from-red-900/30 dark:to-red-800/20' >
                <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <CardHeader className='pb-3 relative z-10' >
                  <div className='w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' >
                    <AlertTriangle className='w-8 h-8 text-red-400 group-hover:text-red-300' />
                  </div>
                  <CardTitle className='text-xl text-foreground group-hover:text-red-100 transition-colors' >Reportar Emergencia</CardTitle>
                  <CardDescription className='text-muted-foreground group-hover:text-red-100/90' >Situaciones de riesgo o emergencias</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href='/anuncios' >
              <Card className='group relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 dark:from-blue-900/30 dark:to-blue-800/20' >
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <CardHeader className='pb-3 relative z-10' >
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' >
                    <Megaphone className='w-8 h-8 text-blue-400 group-hover:text-blue-300' />
                  </div>
                  <CardTitle className='text-xl text-foreground group-hover:text-blue-100 transition-colors' >Anuncios Comunidad</CardTitle>
                  <CardDescription className='text-muted-foreground group-hover:text-blue-100/90' >Últimas noticias y avisos</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href='/dashboard/events' >
              <Card className='group relative overflow-hidden bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 dark:from-green-900/30 dark:to-green-800/20' >
                <div className='absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <CardHeader className='pb-3 relative z-10' >
                  <div className='w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' >
                    <Calendar className='w-8 h-8 text-green-400 group-hover:text-green-300' />
                  </div>
                  <CardTitle className='text-xl text-foreground group-hover:text-green-100 transition-colors' >Calendario Eventos</CardTitle>
                  <CardDescription className='text-muted-foreground group-hover:text-green-100/90' >Próximas actividades comunitarias</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href='/documentos' >
              <Card className='group relative overflow-hidden bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 dark:from-yellow-900/30 dark:to-yellow-800/20' >
                <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <CardHeader className='pb-3 relative z-10' >
                  <div className='w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' >
                    <FileText className='w-8 h-8 text-yellow-400 group-hover:text-yellow-300' />
                  </div>
                  <CardTitle className='text-xl text-foreground group-hover:text-yellow-100 transition-colors' >Documentos Junta</CardTitle>
                  <CardDescription className='text-muted-foreground group-hover:text-yellow-100/90' >Estatutos, actas y documentos oficiales</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </AnimatedGroup>
        </div>
      </section>

      {/* COMERCIOS LOCALES DESTACADOS */}
      <section className='relative py-16'>
        <div className='container mx-auto px-4 relative z-10'>
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-3xl md:text-4xl font-bold text-center mb-12 text-foreground drop-shadow-2xl'
          >
            🏪 Comercios Locales Destacados
          </TextEffect>

          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'
          >
            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105 group'>
              <CardHeader>
                <div className='flex items-center justify-between mb-4'>
                  <Badge className='bg-green-500/20 text-green-300'>🏪 Supermercado</Badge>
                  <div className='flex text-yellow-400'>
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <CardTitle className='text-2xl text-foreground group-hover:text-amber-100 transition-colors'>
                  Supermercados Los Pellines
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Calle Comercio 321 • Abierto todos los días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4'>
                  Productos frescos locales, abarrotes y artículos del hogar.
                  Especialistas en productos agrícolas de la zona.
                </p>
                <div className='flex justify-between items-center'>
                  <div className='text-muted-foreground/60 text-sm'>📞 Contactar</div>
                  <Button size='sm' variant='outline' className='bg-card/10 border-border/30 text-foreground hover:bg-card/20'>
                    Ver Más
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105 group'>
              <CardHeader>
                <div className='flex items-center justify-between mb-4'>
                  <Badge className='bg-blue-500/20 text-blue-300'>🍞 Panadería</Badge>
                  <div className='flex text-yellow-400'>
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <CardTitle className='text-2xl text-foreground group-hover:text-amber-100 transition-colors'>
                  Panadería Doña Carmen
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Calle Principal 654 • Lunes a Sábado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4'>
                  Pan artesanal, pasteles tradicionales y productos horneados
                  con ingredientes locales de la más alta calidad.
                </p>
                <div className='flex justify-between items-center'>
                  <div className='text-muted-foreground/60 text-sm'>📞 Contactar</div>
                  <Button size='sm' variant='outline' className='bg-card/10 border-border/30 text-foreground hover:bg-card/20'>
                    Ver Más
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105 group'>
              <CardHeader>
                <div className='flex items-center justify-between mb-4'>
                  <Badge className='bg-red-500/20 text-red-300'>🍽️ Restaurante</Badge>
                  <div className='flex text-yellow-400'>
                    {'⭐'.repeat(4)}
                  </div>
                </div>
                <CardTitle className='text-2xl text-foreground group-hover:text-amber-100 transition-colors'>
                  Restaurante El Rincón
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Calle Gastronomía 147 • Miércoles a Domingo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4'>
                  Comida típica chilena con toques modernos. Platos preparados
                  con productos frescos de productores locales.
                </p>
                <div className='flex justify-between items-center'>
                  <div className='text-muted-foreground/60 text-sm'>📞 Contactar</div>
                  <Button size='sm' variant='outline' className='bg-card/10 border-border/30 text-foreground hover:bg-card/20'>
                    Ver Más
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedGroup>

          <div className='text-center mt-8'>
            <Button variant='gradientWarm'>
              Ver Todos los Comercios →
            </Button>
          </div>
        </div>
      </section>

      {/* SUPREME COMMUNITY STATS */}
      <section className='relative py-20' >
        <div className='container mx-auto px-4 relative z-10' >
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-4xl md:text-5xl font-bold text-center mb-16 text-foreground drop-shadow-2xl'
          >
            Estadísticas de la Comunidad
          </TextEffect>
          
          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-2 md:grid-cols-4 gap-8'
          >
            {[
              { icon: Users, value: '342', label: 'Vecinos Registrados', color: 'from-blue-500 to-cyan-500' },
              { icon: Calendar, value: '8', label: 'Eventos este Mes', color: 'from-green-500 to-emerald-500' },
              { icon: Megaphone, value: '12', label: 'Anuncios Activos', color: 'from-yellow-500 to-orange-500' },
              { icon: Wallet, value: '$247K', label: 'Fondo Común', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className='text-center group' >
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <stat.icon className='w-10 h-10 text-foreground' />
                </div>
                <div className='text-4xl font-bold mb-2 text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground group-hover:bg-clip-text transition-all duration-300' >
                  {stat.value}
                </div>
                <div className='text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-300' >
                  {stat.label}
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* CLIMA Y TIEMPO PINTO LOS PELLINES */}
      <section className='relative py-16'>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-6xl mx-auto'>
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-3xl md:text-4xl font-bold text-center mb-12 text-foreground drop-shadow-2xl'
          >
            🌤️ Clima en Pinto Los Pellines
          </TextEffect>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Current Weather */}
              <Card className='bg-card/10 border-border/20'>
                <CardHeader className='text-center'>
                  <div className='text-6xl mb-4'>☀️</div>
                  <CardTitle className='text-2xl text-foreground'>Clima Actual</CardTitle>
                  <CardDescription className='text-muted-foreground'>Pinto Los Pellines, Ñuble</CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                  <div className='text-4xl font-bold text-foreground mb-2'>22°C</div>
                  <div className='text-muted-foreground mb-4'>Despejado</div>
                  <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
                    <div>
                      <div className='font-semibold'>Sensación</div>
                      <div>24°C</div>
                    </div>
                    <div>
                      <div className='font-semibold'>Humedad</div>
                      <div>65%</div>
                    </div>
                    <div>
                      <div className='font-semibold'>Viento</div>
                      <div>12 km/h</div>
                    </div>
                    <div>
                      <div className='font-semibold'>Presión</div>
                      <div>1013 hPa</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className='bg-card/10 border-border/20'>
                <CardHeader>
                  <CardTitle className='text-xl text-foreground'>Pronóstico 5 Días</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[
                      { day: 'Hoy', icon: '☀️', temp: '22°', desc: 'Despejado' },
                      { day: 'Mañana', icon: '⛅', temp: '19°', desc: 'Parcialmente nublado' },
                      { day: 'Miércoles', icon: '🌧️', temp: '16°', desc: 'Lluvia ligera' },
                      { day: 'Jueves', icon: '☀️', temp: '21°', desc: 'Soleado' },
                      { day: 'Viernes', icon: '⛅', temp: '18°', desc: 'Nubes dispersas' }
                    ].map((forecast, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-2xl'>{forecast.icon}</span>
                          <div>
                            <div className='text-foreground font-medium'>{forecast.day}</div>
                            <div className='text-muted-foreground text-sm'>{forecast.desc}</div>
                          </div>
                        </div>
                        <div className='text-foreground font-bold'>{forecast.temp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agricultural & Community Info */}
              <Card className='bg-card/10 border-border/20'>
                <CardHeader>
                  <CardTitle className='text-xl text-foreground'>Información Agrícola</CardTitle>
                  <CardDescription className='text-muted-foreground'>Relevante para la zona rural</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Índice UV</span>
                      <Badge className='bg-yellow-500/20 text-yellow-300'>Alto (7)</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Riego recomendado</span>
                      <Badge className='bg-blue-500/20 text-blue-300'>Moderado</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Calidad del aire</span>
                      <Badge className='bg-green-500/20 text-green-300'>Buena</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Época de cosecha</span>
                      <Badge className='bg-orange-500/20 text-orange-300'>Invierno</Badge>
                    </div>

                    <div className='mt-6 p-3 bg-card/10 rounded-lg'>
                      <h4 className='text-foreground font-medium mb-2'>💡 Recomendaciones</h4>
                      <ul className='text-muted-foreground text-sm space-y-1'>
                        <li>• Riego temprano mañana</li>
                        <li>• Protección solar alta</li>
                        <li>• Monitoreo de heladas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SUPREME RECENT ACTIVITY */}
      <section className='relative py-20' >
        <div className='container mx-auto px-4' >
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-4xl md:text-5xl font-bold text-center mb-16 text-foreground drop-shadow-2xl'
          >
            Actividad Reciente
          </TextEffect>
          
          <AnimatedGroup
            preset='slide'
            className='max-w-5xl mx-auto space-y-6'
          >
            {[
              {
                icon: '🔵',
                title: 'Nueva Asamblea General',
                description: 'Convocatoria para el 14 de diciembre',
                time: 'Hace 2 días',
                color: 'from-blue-500/20 to-blue-600/10',
                borderColor: 'border-blue-500/30'
              },
              {
                icon: '🟢',
                title: 'Mantenimiento Calle Real',
                description: 'Proyecto completado exitosamente',
                time: 'Hace 1 semana',
                color: 'from-green-500/20 to-green-600/10',
                borderColor: 'border-green-500/30'
              },
              {
                icon: '🟡',
                title: 'Campaña Vacunación Mascotas',
                description: 'Brigada veterinaria gratuita disponible',
                time: 'Hace 2 semanas',
                color: 'from-yellow-500/20 to-yellow-600/10',
                borderColor: 'border-yellow-500/30'
              }
            ].map((activity, index) => (
              <Card key={index} className={`group relative overflow-hidden bg-gradient-to-br ${activity.color} ${activity.borderColor} hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl`}>
                <CardContent className='p-8' >
                  <div className='flex items-start space-x-6' >
                    <div className='text-4xl group-hover:scale-110 transition-transform duration-300' >
                      {activity.icon}
                    </div>
                    <div className='flex-1' >
                      <h3 className='font-bold text-2xl mb-3 text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground group-hover:bg-clip-text transition-all duration-300' >
                        {activity.title}
                      </h3>
                      <p className='text-muted-foreground mb-4 text-lg group-hover:text-foreground/90 transition-colors duration-300' >
                        {activity.description}
                      </p>
                      <div className='flex items-center text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300' >
                        <Clock className='w-5 h-5 mr-2' />
                        <span className='text-lg' >{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* LOGROS Y PROYECTOS COMUNITARIOS */}
      <section className='relative py-16'>
        <div className='container mx-auto px-4 relative z-10'>
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-3xl md:text-4xl font-bold text-center mb-12 text-foreground drop-shadow-2xl'
          >
            🏆 Logros y Proyectos Comunitarios
          </TextEffect>

          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'
          >
            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <div className='text-4xl mb-4'>🚰</div>
                <CardTitle className='text-xl text-foreground'>Sistema de Agua Potable</CardTitle>
                <Badge className='bg-green-500/20 text-green-300 mt-2'>Completado 2023</Badge>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm text-center mb-4'>
                  Proyecto de $45M para agua potable en 150 hogares.
                  Financiado por fondos regionales y aportes comunitarios.
                </p>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-300'>150</div>
                  <div className='text-muted-foreground/60 text-xs'>Hogares beneficiados</div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <div className='text-4xl mb-4'>🌳</div>
                <CardTitle className='text-xl text-foreground'>Parque Comunitario</CardTitle>
                <Badge className='bg-blue-500/20 text-blue-300 mt-2'>En Desarrollo</Badge>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm text-center mb-4'>
                  Espacio recreativo de 2 hectáreas con áreas verdes,
                  juegos infantiles y zona deportiva.
                </p>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-300'>75%</div>
                  <div className='text-muted-foreground/60 text-xs'>Completado</div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <div className='text-4xl mb-4'>📹</div>
                <CardTitle className='text-xl text-foreground'>Sistema de Seguridad</CardTitle>
                <Badge className='bg-yellow-500/20 text-yellow-300 mt-2'>Completado 2024</Badge>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm text-center mb-4'>
                  25 cámaras de seguridad y monitoreo 24/7.
                  Reducción del 60% en incidentes reportados.
                </p>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-yellow-300'>25</div>
                  <div className='text-muted-foreground/60 text-xs'>Cámaras instaladas</div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <div className='text-4xl mb-4'>🎓</div>
                <CardTitle className='text-xl text-foreground'>Programa Educativo</CardTitle>
                <Badge className='bg-purple-500/20 text-purple-300 mt-2'>Activo</Badge>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm text-center mb-4'>
                  Talleres gratuitos para jóvenes: computación,
                  idiomas y emprendimiento local.
                </p>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-300'>85</div>
                  <div className='text-muted-foreground/60 text-xs'>Participantes activos</div>
                </div>
              </CardContent>
            </Card>
          </AnimatedGroup>

          <div className='text-center mt-8'>
            <Button variant='outline' className='bg-card/10 border-border/30 text-foreground hover:bg-card/20'>
              Ver Todos los Proyectos →
            </Button>
          </div>
        </div>
      </section>

      {/* APOYO Y COLABORACIÓN COMUNITARIA */}
      <section className='relative py-20'>
        <div className='container mx-auto px-4 relative z-10'>
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-4xl md:text-5xl font-bold text-center mb-4 text-foreground drop-shadow-2xl'
          >
            Apoyo y Colaboración Comunitaria
          </TextEffect>
          <TextEffect
            preset='fade-in-blur'
            per='line'
            delay={0.5}
            as='p'
            className='text-xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed drop-shadow-lg text-center'
          >
            Tu contribución hace posible el desarrollo de Pinto Los Pellines.
            Conoce las formas en que puedes apoyar y participar en el crecimiento de nuestra comunidad.
          </TextEffect>

          <AnimatedGroup
            preset='scale'
            className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'
          >
            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <CardTitle className='text-2xl text-foreground mb-2'>Donación Básica</CardTitle>
                <div className='text-4xl font-bold text-emerald-300 mb-2'>$5.000</div>
                <div className='text-muted-foreground'>/mes</div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-muted-foreground mb-6'>
                  <li>• Apoyo general a la comunidad</li>
                  <li>• Reconocimiento público</li>
                  <li>• Acceso a eventos comunitarios</li>
                  <li>• Boletín informativo mensual</li>
                </ul>
                <Button className='w-full bg-emerald-600 hover:bg-emerald-700 text-foreground font-semibold'>
                  Contribuir Ahora
                </Button>
              </CardContent>
            </Card>

              <Card className='bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-400/30 hover:scale-105 transition-all duration-300 relative dark:from-emerald-600/30 dark:to-green-600/30'>
              <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-foreground px-4 py-1 rounded-full text-sm font-semibold'>
                Más Popular
              </div>
              <CardHeader className='text-center'>
                <CardTitle className='text-2xl text-foreground mb-2'>Colaborador Activo</CardTitle>
                <div className='text-4xl font-bold text-emerald-300 mb-2'>$15.000</div>
                <div className='text-muted-foreground'>/mes</div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-muted-foreground mb-6'>
                  <li>• Todo lo anterior</li>
                  <li>• Participación en decisiones</li>
                  <li>• Eventos exclusivos para colaboradores</li>
                  <li>• Reconocimiento especial en eventos</li>
                  <li>• Acceso prioritario a servicios</li>
                </ul>
                <Button className='w-full bg-emerald-600 hover:bg-emerald-700 text-foreground font-semibold'>
                  Contribuir Ahora
                </Button>
              </CardContent>
            </Card>

            <Card className='bg-card/10 border-border/20 hover:bg-card/20 transition-all duration-300 hover:scale-105'>
              <CardHeader className='text-center'>
                <CardTitle className='text-2xl text-foreground mb-2'>Patrocinador Mayor</CardTitle>
                <div className='text-4xl font-bold text-emerald-300 mb-2'>$50.000</div>
                <div className='text-muted-foreground'>/mes</div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-muted-foreground mb-6'>
                  <li>• Todo lo anterior</li>
                  <li>• Nombre en instalaciones comunitarias</li>
                  <li>• Eventos corporativos exclusivos</li>
                  <li>• Consultoría directa con la junta</li>
                  <li>• Reconocimiento permanente</li>
                </ul>
                <Button className='w-full bg-emerald-600 hover:bg-emerald-700 text-foreground font-semibold'>
                  Contribuir Ahora
                </Button>
              </CardContent>
            </Card>
          </AnimatedGroup>

          <div className='text-center mt-12'>
            <p className='text-muted-foreground mb-4'>
              ¿Prefieres contribuir de otra forma? Contáctanos para opciones personalizadas.
            </p>
            <Button variant='outline' className='bg-card/10 border-border/30 text-foreground hover:bg-card/20'>
              Otras Formas de Contribuir
            </Button>
          </div>
        </div>
      </section>

      {/* SUPREME EMERGENCY SECTION */}
      <section className='relative py-20' >
        <div className='container mx-auto px-4 text-center relative z-10' >
          <TextEffect
            preset='fade-in-blur'
            per='word'
            as='h2'
            className='text-4xl md:text-6xl font-bold mb-8 text-foreground drop-shadow-2xl'
          >
            ¿Necesitas Ayuda de Emergencia?
          </TextEffect>
          <TextEffect
            preset='fade-in-blur'
            per='line'
            delay={0.5}
            as='p'
            className='text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed drop-shadow-lg'
          >
            En situaciones de riesgo, estamos aquí para ayudarte las 24 horas del día, 
            los 7 días de la semana con nuestro sistema de emergencias inteligente.
          </TextEffect>
          
          <AnimatedGroup preset='bounce' className='flex justify-center' >
            <PulsatingButton
              pulseColor='#ef4444'
              duration='1.5s'
              className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-foreground font-bold px-12 py-6 rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-2 text-2xl'
            >
              <Link href='/dashboard/emergencies' className='flex items-center gap-4' >
                <AlertTriangle className='w-8 h-8' />
                <span>Botón de Emergencia</span>
                <Zap className='w-6 h-6' />
              </Link>
            </PulsatingButton>
          </AnimatedGroup>
        </div>
      </section>

      {/* MOBILE APP DOWNLOAD SECTION - Temporarily disabled for deployment */}
      {/* <MobileAppDownload /> */}

    </main>
    </PublicLayout>
  )
}