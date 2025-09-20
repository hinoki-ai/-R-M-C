import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { PulsatingButton } from '@/components/magicui/pulsating-button'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { 
  Users, 
  Calendar, 
  Megaphone, 
  FileText, 
  AlertTriangle, 
  Wallet,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  Mountain,
  TreePine,
  Sun,
  Cloud,
  Bird,
  Heart,
  Zap,
  Shield,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* SUPREME DARK MODE BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/backgrounds/bg2.jpg"
          alt="Pinto Los Pellines Supreme Background"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Enhanced Dark Overlay with Chilean Colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-yellow-900/10" />
      </div>

      {/* SUPREME HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="text-3xl">🇨🇱</div>
              <TextEffect
                preset="fade-in-blur"
                per="word"
                as="h1"
                className="text-2xl font-bold text-white drop-shadow-lg"
              >
                Junta de Vecinos
              </TextEffect>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                En Línea
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* SUPREME HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center space-y-12">

            {/* Main Title with Supreme Text Effects */}
            <div className="space-y-8">
              <TextEffect
                preset="fade-in-blur"
                per="word"
                speedSegment={0.3}
                as="h1"
                className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl"
              >
                🇨🇱 Junta de Vecinos
              </TextEffect>
              
              <TextEffect
                preset="fade-in-blur"
                per="word"
                speedSegment={0.3}
                delay={0.5}
                as="h2"
                className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-xl"
              >
                Pinto Los Pellines, Ñuble
              </TextEffect>
              
              <TextEffect
                preset="fade-in-blur"
                per="line"
                speedSegment={0.3}
                delay={1}
                as="p"
                className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
              >
                La plataforma comunitaria más avanzada de Chile con tecnología de vanguardia, 
                cámaras de seguridad inteligentes, pagos integrados y gestión completa de la comunidad.
              </TextEffect>
            </div>

            {/* Supreme Action Buttons */}
            <AnimatedGroup
              preset="scale"
              className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
            >
              <PulsatingButton
                pulseColor="#10b981"
                duration="2s"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <span className="text-lg">Ir al Dashboard</span>
                  <Sparkles className="w-5 h-5" />
                </Link>
              </PulsatingButton>

              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/anuncios" className="flex items-center gap-3">
                  <Megaphone className="w-6 h-6" />
                  <span className="text-lg">Ver Anuncios</span>
                  <Star className="w-5 h-5" />
                </Link>
              </Button>
            </AnimatedGroup>

            {/* Supreme Stats with Infinite Slider */}
            <div className="mt-20">
              <InfiniteSlider
                speed={50}
                speedOnHover={20}
                className="py-4"
              >
                {[
                  { icon: Users, value: "342", label: "Familias Activas", color: "text-blue-400" },
                  { icon: Calendar, value: "25", label: "Años de Tradición", color: "text-green-400" },
                  { icon: Shield, value: "100%", label: "Seguridad Garantizada", color: "text-yellow-400" },
                  { icon: Heart, value: "1", label: "Comunidad Unida", color: "text-red-400" },
                  { icon: Zap, value: "24/7", label: "Monitoreo Activo", color: "text-purple-400" },
                  { icon: Activity, value: "99.9%", label: "Uptime Garantizado", color: "text-cyan-400" }
                ].map((stat, index) => (
                  <Card key={index} className="mx-4 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </InfiniteSlider>
            </div>
          </div>
        </div>
      </section>

      {/* SUPREME CHILEAN CULTURAL BANNER */}
      <section className="relative py-16 bg-gradient-to-r from-red-900/30 via-yellow-900/20 to-blue-900/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h3"
            className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-red-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg"
          >
            Orgullosamente Rural y Tecnológico
          </TextEffect>
        </div>
      </section>

      {/* SUPREME QUICK ACTIONS */}
      <section className="relative py-20 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h2"
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-2xl"
          >
            Acciones Rápidas
          </TextEffect>
          
          <AnimatedGroup
            preset="scale"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <Link href="/dashboard/emergencias">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-md border-red-500/30 hover:border-red-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-8 h-8 text-red-400 group-hover:text-red-300" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-red-100 transition-colors">Reportar Emergencia</CardTitle>
                  <CardDescription className="text-red-200/80 group-hover:text-red-100/90">Situaciones de riesgo o emergencias</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/anuncios">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-md border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-100 transition-colors">Anuncios Comunidad</CardTitle>
                  <CardDescription className="text-blue-200/80 group-hover:text-blue-100/90">Últimas noticias y avisos</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/events">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-md border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-green-400 group-hover:text-green-300" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-green-100 transition-colors">Calendario Eventos</CardTitle>
                  <CardDescription className="text-green-200/80 group-hover:text-green-100/90">Próximas actividades comunitarias</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/documentos">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 backdrop-blur-md border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-yellow-100 transition-colors">Documentos Junta</CardTitle>
                  <CardDescription className="text-yellow-200/80 group-hover:text-yellow-100/90">Estatutos, actas y documentos oficiales</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </AnimatedGroup>
        </div>
      </section>

      {/* SUPREME COMMUNITY STATS */}
      <section className="relative py-20 bg-gradient-to-br from-green-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h2"
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-2xl"
          >
            Estadísticas de la Comunidad
          </TextEffect>
          
          <AnimatedGroup
            preset="scale"
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, value: "342", label: "Vecinos Registrados", color: "from-blue-500 to-cyan-500" },
              { icon: Calendar, value: "8", label: "Eventos este Mes", color: "from-green-500 to-emerald-500" },
              { icon: Megaphone, value: "12", label: "Anuncios Activos", color: "from-yellow-500 to-orange-500" },
              { icon: Wallet, value: "$247K", label: "Fondo Común", color: "from-purple-500 to-pink-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* SUPREME RECENT ACTIVITY */}
      <section className="relative py-20 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h2"
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-2xl"
          >
            Actividad Reciente
          </TextEffect>
          
          <AnimatedGroup
            preset="slide"
            className="max-w-5xl mx-auto space-y-6"
          >
            {[
              {
                icon: "🔵",
                title: "Nueva Asamblea General",
                description: "Convocatoria para el 14 de diciembre",
                time: "Hace 2 días",
                color: "from-blue-500/20 to-blue-600/10",
                borderColor: "border-blue-500/30"
              },
              {
                icon: "🟢",
                title: "Mantenimiento Calle Real",
                description: "Proyecto completado exitosamente",
                time: "Hace 1 semana",
                color: "from-green-500/20 to-green-600/10",
                borderColor: "border-green-500/30"
              },
              {
                icon: "🟡",
                title: "Campaña Vacunación Mascotas",
                description: "Brigada veterinaria gratuita disponible",
                time: "Hace 2 semanas",
                color: "from-yellow-500/20 to-yellow-600/10",
                borderColor: "border-yellow-500/30"
              }
            ].map((activity, index) => (
              <Card key={index} className={`group relative overflow-hidden bg-gradient-to-br ${activity.color} backdrop-blur-md ${activity.borderColor} hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                        {activity.title}
                      </h3>
                      <p className="text-white/80 mb-4 text-lg group-hover:text-white/90 transition-colors duration-300">
                        {activity.description}
                      </p>
                      <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors duration-300">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-lg">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* SUPREME EMERGENCY SECTION */}
      <section className="relative py-20 bg-gradient-to-br from-red-900/60 via-red-800/40 to-red-900/60 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/10 to-red-500/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h2"
            className="text-4xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl"
          >
            ¿Necesitas Ayuda de Emergencia?
          </TextEffect>
          <TextEffect
            preset="fade-in-blur"
            per="line"
            delay={0.5}
            as="p"
            className="text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            En situaciones de riesgo, estamos aquí para ayudarte las 24 horas del día, 
            los 7 días de la semana con nuestro sistema de emergencias inteligente.
          </TextEffect>
          
          <AnimatedGroup preset="bounce">
            <PulsatingButton
              pulseColor="#ef4444"
              duration="1.5s"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-12 py-6 rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-2 text-2xl"
            >
              <Link href="/dashboard/emergencias" className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8" />
                <span>Botón de Emergencia</span>
                <Zap className="w-6 h-6" />
              </Link>
            </PulsatingButton>
          </AnimatedGroup>
        </div>
      </section>

      {/* SUPREME FOOTER */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-blue-900/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedGroup preset="fade" className="space-y-8">
            <TextEffect
              preset="fade-in-blur"
              per="word"
              as="h3"
              className="text-3xl font-bold mb-4 text-white drop-shadow-lg"
            >
              Junta de Vecinos Pinto Los Pellines
            </TextEffect>
            <p className="text-xl text-gray-300 mb-6 drop-shadow-lg">
              Ñuble, Chile
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              La plataforma comunitaria más avanzada de Chile con tecnología de vanguardia, 
              diseñada para conectar y fortalecer nuestra comunidad rural.
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-5 h-5" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-5 h-5" />
                <span>Rápido</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Heart className="w-5 h-5" />
                <span>Confiable</span>
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </footer>
    </main>
  )
}