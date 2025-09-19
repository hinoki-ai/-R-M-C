'use client'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

import { ChatMaxingIconColoured } from '@/components/layout/logo'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'





export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { theme } = useTheme()
    const { user, isLoaded } = useUser()

    const menuItems = [
        { name: 'Donar', href: '/donate' },
        { name: 'Test Systems', href: '/test' },
    ]

    const appearance = {
        baseTheme: theme === 'dark' ? dark : undefined,
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className='fixed z-20 w-full px-2'>
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className='relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4'>
                        <div className='flex w-full justify-between lg:w-auto'>
                            <Link
                                href='/'
                                aria-label="inicio"
                                className='flex items-center space-x-2'>
                                <ChatMaxingIconColoured />
                                <span className='text-xl font-medium'>Pinto Los Pellines</span>
                                <Badge variant='outline' className='text-muted-foreground  text-xs'>Pinto Los Pellines</Badge>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Cerrar Menú' : 'Abrir Menú'}
                                className='relative z-20 -m-2.5 -mr-4 block cursor-pointer p-3 lg:hidden rounded-lg hover:bg-accent/50 transition-colors duration-200 active:scale-95'>
                                <span className='in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto text-lg duration-300 transition-all'>☰</span>
                                <span className='in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto text-lg -rotate-180 scale-0 opacity-0 duration-300 transition-all'>✕</span>
                            </button>
                        </div>

                        <div className='absolute inset-0 m-auto hidden size-fit lg:block'>
                            <ul className='flex gap-8 text-sm'>
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className='text-muted-foreground hover:text-accent-foreground block duration-150'>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='bg-background/95 backdrop-blur-xl in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl shadow-black/10 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent dark:border-white/5'>
                            <div className='lg:hidden'>
                                <ul className='space-y-6 text-base'>
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className='text-muted-foreground hover:text-accent-foreground block duration-200 py-2 px-3 rounded-lg hover:bg-accent/50 transition-all active:scale-95'>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit'>
                                <ModeToggle />
                                {!isLoaded ? (
                                    <div className='flex items-center justify-center'>
                                        <Loader2 className='size-8 p-2 animate-spin' />
                                    </div>
                                ) : user ? (
                                    <>
                                        <Button asChild size='sm'>
                                            <Link href='/dashboard'>
                                                <span>Panel de Control</span>
                                            </Link>
                                        </Button>
                                        <UserButton appearance={appearance} />
                                    </>
                                ) : (
                                    <>
                                        <SignInButton mode='modal'>
                                            <Button
                                                asChild
                                                variant='outline'
                                                size='sm'
                                                className={cn(isScrolled && 'lg:hidden')}>
                                                <Link href='#'>
                                                    <span>Iniciar Sesión</span>
                                                </Link>
                                            </Button>
                                        </SignInButton>
                                        <SignUpButton mode='modal'>
                                            <Button
                                                asChild
                                                size='sm'
                                                className={cn(isScrolled && 'lg:hidden')}>
                                                <Link href='#'>
                                                    <span>Registrarse</span>
                                                </Link>
                                            </Button>
                                        </SignUpButton>
                                        <SignUpButton mode='modal'>
                                            <Button
                                                asChild
                                                size='sm'
                                                className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                                <Link href='#'>
                                                    <span>Comenzar</span>
                                                </Link>
                                            </Button>
                                        </SignUpButton>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
