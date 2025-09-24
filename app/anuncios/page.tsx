'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  MapPin,
  User,
  Users,
  Megaphone,
  AlertTriangle,
  ShoppingCart,
  FileText,
  Image as ImageIcon,
  Radio as RadioIcon,
  Cloud,
  Heart,
  DollarSign,
  ChevronDown,
  Menu,
  Loader2,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BackgroundSection } from '@/components/layout/background-section';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { Logo } from '@/components/logo';
import { useNavigationSound } from '@/hooks/use-navigation-sound';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getAramacCopyright } from '@/lib/copyright-system';
import { ROUTES } from '@/lib/router-context';

const announcements = [
  {
    id: 1,
    title: 'Cortes de Agua Programados - Sector Sur',
    content:
      'Este jueves 18 de octubre, entre 09:00 y 14:00 hrs, se realizarán trabajos de mantenimiento en la red de agua potable del sector sur. Se recomienda almacenar agua potable para consumo durante el corte programado.',
    type: 'urgent',
    date: '2025-10-15',
    author: 'Junta de Vecinos',
    location: 'Sector Sur - Pinto Los Pellines',
  },
  {
    id: 2,
    title: 'Campaña de Recolección de Semillas Tradicionales',
    content:
      'Invitamos a todos los agricultores del sector a participar en la preservación de semillas nativas. Punto de acopio: Casa de la Cultura los días jueves. ¡Mantengamos viva nuestra agricultura tradicional!',
    type: 'community',
    date: '2025-10-12',
    author: 'Comisión Agrícola',
    location: 'Casa de la Cultura',
  },
  {
    id: 3,
    title: 'Proyecto Completa: Mejoramiento Camino a La Laja',
    content:
      'Culminaron los trabajos de ripiado y señalización del camino rural. Agradecemos la colaboración de todos los vecinos en el proyecto participativo. El camino ahora es transitable durante todo el año.',
    type: 'success',
    date: '2025-10-10',
    author: 'Secretaría de Obras',
    location: 'Camino a La Laja',
  },
  {
    id: 4,
    title: 'Taller de Huertos Familiares',
    content:
      'Próximo sábado 26 de octubre, taller gratuito sobre agricultura orgánica y huertos urbanos. Cupos limitados. Inscripciones en secretaría de la Junta hasta el viernes.',
    type: 'event',
    date: '2025-10-08',
    author: 'Comisión de Medio Ambiente',
    location: 'Salón Comunal',
  },
  {
    id: 5,
    title: 'Vacunación Antirrábica Mascotas',
    content:
      'Este fin de semana 19-20 octubre, brigada veterinaria gratuita en el salón comunal. Es obligatorio vacunar a todos los perros y gatos. Evitemos brotes de rabia en nuestro sector rural.',
    type: 'health',
    date: '2025-10-05',
    author: 'Comisión de Salud Animal',
    location: 'Salón Comunal',
  },
];

const navigationItems = [
  {
    name: 'Comunidad',
    href: '#',
    icon: Users,
    subpages: [
      { name: 'Anuncios', href: '/anuncios', icon: Megaphone },
      { name: 'Comercios', href: '/comercios', icon: ShoppingCart },
      { name: 'Radio', href: '/radio', icon: RadioIcon },
    ],
  },
  {
    name: 'Dashboard',
    href: '#',
    icon: FileText,
    subpages: [
      { name: 'Calendario', href: '/dashboard/calendar', icon: Calendar },
      { name: 'Eventos', href: '/dashboard/events', icon: Calendar },
      { name: 'Contactos', href: '/dashboard/contacts', icon: User },
      { name: 'Documentos', href: '/dashboard/documents', icon: FileText },
      { name: 'Fotos', href: '/dashboard/photos', icon: ImageIcon },
      { name: 'Mapa', href: '/dashboard/maps', icon: MapPin },
      { name: 'Clima', href: '/dashboard/weather', icon: Cloud },
      { name: 'Emergencias', href: '/dashboard/emergencies', icon: AlertTriangle },
    ],
  },
  {
    name: 'Contribuciones',
    href: '#',
    icon: Heart,
    subpages: [
      { name: 'Formas de Contribuir', href: '/contribuciones', icon: Heart },
      { name: 'Donar', href: '/donate', icon: DollarSign },
    ],
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'community':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'event':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'health':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'urgent':
      return '🚨';
    case 'community':
      return '🤝';
    case 'success':
      return '✅';
    case 'event':
      return '📅';
    case 'health':
      return '🏥';
    default:
      return '📢';
  }
};

export default function AnunciosPage() {
  const pathname = usePathname();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const { playRandomSound } = useNavigationSound();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset dropdown state on navigation
  React.useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const Header = () => (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg'
          : 'bg-background/80 backdrop-blur-sm'
      )}
      suppressHydrationWarning
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Saltar al contenido principal
      </a>

      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Los Pellines
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  ir al inicio
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6"
            role="navigation"
            aria-label="Navegación principal"
          >
            {navigationItems.map(item => (
              <div key={item.name}>
                {item.subpages ? (
                  <DropdownMenu
                    open={openDropdown === item.name}
                    onOpenChange={open =>
                      setOpenDropdown(open ? item.name : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 data-[state=open]:bg-accent/50 data-[state=open]:text-foreground"
                        aria-label={`${item.name} menu`}
                        aria-haspopup="menu"
                        suppressHydrationWarning
                        onClick={playRandomSound}
                      >
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.name}
                        <ChevronDown
                          className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180"
                          aria-hidden="true"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="bottom"
                      sideOffset={8}
                      className="w-48 z-[60] bg-popover/95 backdrop-blur-md text-popover-foreground border border-border/50 shadow-lg shadow-black/10 dark:shadow-black/40"
                      avoidCollisions={true}
                      aria-label={`${item.name} submenu`}
                    >
                      {item.subpages.map((subpage, index) => (
                        <React.Fragment key={subpage.name}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={subpage.href}
                              className="flex items-center gap-2"
                              onClick={() => {
                                setOpenDropdown(null);
                                playRandomSound();
                              }}
                            >
                              <subpage.icon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                              {subpage.name}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.subpages.length - 1 && (
                            <DropdownMenuSeparator />
                          )}
                        </React.Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* Auth Buttons - Following template pattern */}
            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
              <AuthLoading>
                <div className="flex items-center justify-center">
                  <Loader2 className="size-8 p-2 animate-spin" />
                </div>
              </AuthLoading>

              <Authenticated>
                <Button asChild size="sm">
                  <Link href={ROUTES.DASHBOARD} onClick={playRandomSound}>
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </Authenticated>

              <Unauthenticated>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/sign-in" onClick={playRandomSound}>
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up" onClick={playRandomSound}>
                    Registrarse
                  </Link>
                </Button>
              </Unauthenticated>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? 'Close Menu' : 'Open Menu'}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuState && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/50">
            <nav
              className="flex flex-col gap-2 pt-4"
              role="navigation"
              aria-label="Navegación móvil"
            >
              {navigationItems.map(item => (
                <div key={item.name}>
                  {item.subpages ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.name}
                      </div>
                      <div className="ml-6 space-y-1">
                        {item.subpages.map(subpage => (
                          <Button
                            key={subpage.name}
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start"
                            onClick={() => {
                              setMenuState(false);
                              playRandomSound();
                            }}
                          >
                            <Link
                              href={subpage.href}
                              className="flex items-center gap-2"
                            >
                              <subpage.icon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                              {subpage.name}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                      onClick={() => setMenuState(false)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}

              {/* Mobile Auth Buttons - Following template pattern */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                <AuthLoading>
                  <div className="flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                </AuthLoading>

                <Authenticated>
                  <Button
                    size="sm"
                    asChild
                    onClick={() => {
                      setMenuState(false);
                      playRandomSound();
                    }}
                  >
                    <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                  </Button>
                </Authenticated>

                <Unauthenticated>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    onClick={() => {
                      setMenuState(false);
                      playRandomSound();
                    }}
                  >
                    <Link href="/sign-in">Iniciar Sesión</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    onClick={() => {
                      setMenuState(false);
                      playRandomSound();
                    }}
                  >
                    <Link href="/sign-up">Registrarse</Link>
                  </Button>
                </Unauthenticated>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  const Footer = () => {
    const copyrightText = getAramacCopyright({
      year: new Date().getFullYear(),
      brand: 'ΛRΛMΛC®',
      showPoweredBy: true,
      format: 'standard',
    });
    const brandMatch = copyrightText.match(/(ΛRΛMΛC®)/);

    const formattedText = brandMatch
      ? copyrightText.replace(
          brandMatch[0],
          `<span class="font-mono text-lg tracking-wider">${brandMatch[0]}</span>`
        )
      : copyrightText;

    return (
      <footer className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span
              className="text-muted-foreground block text-center text-sm mt-4"
              dangerouslySetInnerHTML={{ __html: formattedText }}
            />
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <Header />
      {/* Background Section */}
      <BackgroundSection
        imageSrc="/images/backgrounds/bg5.jpg"
        alt="Anuncios Page Background"
      />

      <div
        className="relative container mx-auto px-6 py-12 z-10 pt-20"
        id="main-content"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📢🇨🇱</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Anuncios Comunidad
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Mantente informado sobre las últimas noticias, eventos y anuncios
            importantes de la Junta de Vecinos Pinto Los Pellines, Ñuble
          </p>
        </motion.div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      className={`${getTypeColor(announcement.type)} border`}
                    >
                      <span className="mr-1">
                        {getTypeIcon(announcement.type)}
                      </span>
                      {announcement.type === 'urgent'
                        ? 'Urgente'
                        : announcement.type === 'community'
                          ? 'Comunidad'
                          : announcement.type === 'success'
                            ? 'Completado'
                            : announcement.type === 'event'
                              ? 'Evento'
                              : 'Salud'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {announcement.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{announcement.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Publicado:{' '}
                        {new Date(announcement.date).toLocaleDateString(
                          'es-ES'
                        )}
                      </span>
                    </div>
                  </div>
                  {announcement.type === 'event' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
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
          className="text-center bg-card border border-border rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Quieres publicar un anuncio?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Si eres parte de la directiva o tienes información importante para
            compartir con la comunidad, contacta a la secretaría de la Junta de
            Vecinos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Bell className="w-4 h-4 mr-2" />
              Contactar Secretaría
            </Button>
            <Button variant="outline">📞 Llamar Directiva</Button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
