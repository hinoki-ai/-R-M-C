'use client'

import { useAuth, UserButton } from '@clerk/nextjs'
import {
  ChevronDown,
  Menu,
  X,
  Users,
  Sparkles,
  Home,
  Megaphone,
  Calendar,
  FileText,
  MapPin,
  Phone,
  Cloud
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/layout/mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    name: 'Comunidad',
    href: '#',
    icon: Users,
    subpages: [
      { name: 'Anuncios', href: '/anuncios', icon: Megaphone },
      { name: 'Eventos', href: '/eventos', icon: Calendar },
      { name: 'Documentos', href: '/documentos', icon: FileText },
      { name: 'Fotos', href: '/fotos', icon: Phone },
    ]
  },
  {
    name: 'Servicios',
    href: '#',
    icon: MapPin,
    subpages: [
      { name: 'Mapa', href: '/mapa', icon: MapPin },
      { name: 'Clima', href: '/weather', icon: Cloud },
      { name: 'Contactos', href: '/contactos', icon: Phone },
    ]
  },
  {
    name: 'Calendario',
    href: '/calendario',
    icon: Calendar,
  },
]

export const AdvancedHeader = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg'
        : 'bg-background/80 backdrop-blur-sm'
    )}>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo and Branding */}
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-3'>
              <Logo />
              <div className='hidden sm:block'>
                <div className='text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
                  Pinto Los Pellines
                </div>
                <div className='text-xs text-muted-foreground'>
                  Junta de Vecinos
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-6'>
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.subpages ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
                      >
                        <item.icon className='w-4 h-4' />
                        {item.name}
                        <ChevronDown className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-48'>
                      {item.subpages.map((subpage) => (
                        <DropdownMenuItem key={subpage.name} asChild>
                          <Link href={subpage.href} className='flex items-center gap-2'>
                            <subpage.icon className='w-4 h-4' />
                            {subpage.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant='ghost' asChild>
                    <Link href={item.href} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
                      <item.icon className='w-4 h-4' />
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

            {/* Auth Buttons */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className='flex items-center gap-3'>
                    <Button asChild size='sm' className='hidden sm:inline-flex'>
                      <Link href='/dashboard' className='flex items-center gap-2'>
                        <Users className='w-4 h-4' />
                        Dashboard
                        <Sparkles className='w-3 h-3' />
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
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' asChild>
                      <Link href='/sign-in'>Iniciar Sesión</Link>
                    </Button>
                    <Button size='sm' asChild>
                      <Link href='/sign-up'>Registrarse</Link>
                    </Button>
                    <Button size='sm' variant='outline' asChild>
                      <Link href='/dashboard' className='flex items-center gap-2'>
                        <Users className='w-4 h-4' />
                        Dashboard
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

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
            <nav className='flex flex-col gap-2 pt-4'>
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.subpages ? (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground'>
                        <item.icon className='w-4 h-4' />
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
                              <subpage.icon className='w-4 h-4' />
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
                        <item.icon className='w-4 h-4' />
                        {item.name}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}

              {/* Mobile Auth Buttons */}
              {isLoaded && !isSignedIn && (
                <div className='flex flex-col gap-2 mt-4 pt-4 border-t border-border/50'>
                  <Button variant='outline' size='sm' asChild onClick={() => setMenuState(false)}>
                    <Link href='/sign-in'>Iniciar Sesión</Link>
                  </Button>
                  <Button size='sm' asChild onClick={() => setMenuState(false)}>
                    <Link href='/sign-up'>Registrarse</Link>
                  </Button>
                  <Button size='sm' variant='outline' asChild onClick={() => setMenuState(false)}>
                    <Link href='/dashboard' className='flex items-center gap-2'>
                      <Users className='w-4 h-4' />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}