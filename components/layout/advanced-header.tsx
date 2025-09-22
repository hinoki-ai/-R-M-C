'use client'

import { UserButton } from '@clerk/nextjs'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  Cloud,
  DollarSign,
  FileText,
  Heart,
  Image,
  Loader2,
  MapPin,
  Megaphone,
  Menu,
  Phone,
  Sparkles,
  Users,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { ModeToggle } from '@/components/layout/mode-toggle'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Comunidad',
    href: '#',
    icon: Users,
    subpages: [
      { name: 'Anuncios', href: '/anuncios', icon: Megaphone },
      { name: 'Eventos', href: '/eventos', icon: Calendar },
      { name: 'Calendario', href: '/calendario', icon: Calendar },
      { name: 'Contactos', href: '/contactos', icon: Phone },
    ]
  },
  {
    name: 'Servicios',
    href: '#',
    icon: MapPin,
    subpages: [
      { name: 'Mapa', href: '/mapa', icon: MapPin },
      { name: 'Emergencias', href: '/emergencias', icon: AlertTriangle },
    ]
  },
  {
    name: 'Recursos',
    href: '#',
    icon: FileText,
    subpages: [
      { name: 'Documentos', href: '/documentos', icon: FileText },
      { name: 'Fotos', href: '/fotos', icon: Image },
      { name: 'Clima', href: '/weather', icon: Cloud },
    ]
  },
  {
    name: 'Contribuciones',
    href: '#',
    icon: Heart,
    subpages: [
      { name: 'Formas de Contribuir', href: '/contribuciones', icon: Heart },
      { name: 'Donar', href: '/donate', icon: DollarSign },
    ]
  },
]

export const AdvancedHeader = () => {
  const pathname = usePathname()
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset dropdown state on navigation
  React.useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  return (
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
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md'
      >
        Saltar al contenido principal
      </a>

      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo and Branding */}
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-3'>
              <Logo />
              <div className='hidden sm:block'>
                <div className='text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
                  Pinto Los Pellines
                </div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Junta de Vecinos
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-6' role='navigation' aria-label='Navegación principal'>
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.subpages ? (
                  <DropdownMenu
                    open={openDropdown === item.name}
                    onOpenChange={(open) => setOpenDropdown(open ? item.name : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 data-[state=open]:bg-accent/50 data-[state=open]:text-foreground'
                        aria-label={`${item.name} menu`}
                        aria-haspopup='menu'
                        suppressHydrationWarning
                      >
                        <item.icon className='w-4 h-4' aria-hidden='true' />
                        {item.name}
                        <ChevronDown className='w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180' aria-hidden='true' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='start'
                      side='bottom'
                      sideOffset={8}
                      className='w-48 z-[60]'
                      avoidCollisions={true}
                      aria-label={`${item.name} submenu`}
                    >
                      {item.subpages.map((subpage, index) => (
                        <React.Fragment key={subpage.name}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={subpage.href}
                              className='flex items-center gap-2'
                              onClick={() => setOpenDropdown(null)}
                            >
                              <subpage.icon className='w-4 h-4' aria-hidden='true' />
                              {subpage.name}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.subpages.length - 1 && <DropdownMenuSeparator />}
                        </React.Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant='ghost' asChild>
                    <Link href={item.href} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
                      <item.icon className='w-4 h-4' aria-hidden='true' />
                      {item.name}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className='flex items-center gap-3'>
            {/* Theme Toggle */}
            <ModeToggle />

            {/* Auth Buttons - Following template pattern */}
            <div className='flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit'>
              <AuthLoading>
                <div className='flex items-center justify-center'>
                  <Loader2 className='size-8 p-2 animate-spin' />
                </div>
              </AuthLoading>

              <Authenticated>
                <Button asChild size='sm'>
                  <Link href='/dashboard'>
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <UserButton
                  afterSignOutUrl='/'
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8'
                    }
                  }}
                />
              </Authenticated>

              <Unauthenticated>
                <Button variant='outline' size='sm' asChild>
                  <Link href='/sign-in'>Iniciar Sesión</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link href='/sign-up'>Registrarse</Link>
                </Button>
              </Unauthenticated>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden'
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? 'Close Menu' : 'Open Menu'}
            >
              <Menu className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuState && (
          <div className='lg:hidden mt-4 pb-4 border-t border-border/50'>
            <nav className='flex flex-col gap-2 pt-4' role='navigation' aria-label='Navegación móvil'>
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.subpages ? (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground'>
                        <item.icon className='w-4 h-4' aria-hidden='true' />
                        {item.name}
                      </div>
                      <div className='ml-6 space-y-1'>
                        {item.subpages.map((subpage) => (
                          <Button
                            key={subpage.name}
                            variant='ghost'
                            size='sm'
                            asChild
                            className='w-full justify-start'
                            onClick={() => setMenuState(false)}
                          >
                            <Link href={subpage.href} className='flex items-center gap-2'>
                              <subpage.icon className='w-4 h-4' aria-hidden='true' />
                              {subpage.name}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant='ghost'
                      size='sm'
                      asChild
                      className='w-full justify-start'
                      onClick={() => setMenuState(false)}
                    >
                      <Link href={item.href} className='flex items-center gap-2'>
                        <item.icon className='w-4 h-4' aria-hidden='true' />
                        {item.name}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}

              {/* Mobile Auth Buttons - Following template pattern */}
              <div className='flex flex-col gap-2 mt-4 pt-4 border-t border-border/50'>
                <AuthLoading>
                  <div className='flex items-center justify-center'>
                    <Loader2 className='size-6 animate-spin' />
                  </div>
                </AuthLoading>

                <Authenticated>
                  <Button size='sm' asChild onClick={() => setMenuState(false)}>
                    <Link href='/dashboard'>Dashboard</Link>
                  </Button>
                </Authenticated>

                <Unauthenticated>
                  <Button variant='outline' size='sm' asChild onClick={() => setMenuState(false)}>
                    <Link href='/sign-in'>Iniciar Sesión</Link>
                  </Button>
                  <Button size='sm' asChild onClick={() => setMenuState(false)}>
                    <Link href='/sign-up'>Registrarse</Link>
                  </Button>
                </Unauthenticated>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}