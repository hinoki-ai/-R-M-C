'use client';

import { Grape, Heart, Sparkle, TreePine, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

import { HeroHeader } from './header'
import { Card } from '@/components/ui/card'


export default function HeroSection() {

    return (
        <>
            <HeroHeader />
            <main>
                <section className='relative overflow-hidden min-h-screen flex flex-col justify-center'>

                    <div className='flex-1 flex items-center py-20 md:py-36'>
                        <div className='relative z-20 mx-auto max-w-6xl px-6 text-center w-full'>
                                <div className='space-y-8'>
                                    {/* Welcome Badge with div */}
                                    <div className='mx-auto w-fit bg-amber-50/90 border border-amber-200 rounded-lg p-1'>
                                        <div className='flex items-center gap-3 px-6 py-3'>
                                            <div className='flex items-center gap-2'>
                                                <Grape className='w-5 h-5 text-red-600' />
                                                <Sparkle className='w-4 h-4 text-yellow-500' />
                                            </div>
                                            <span className='font-semibold text-amber-800'>¡Bienvenidos!</span>
                                            <div className='flex items-center gap-2'>
                                                <Sparkle className='w-4 h-4 text-yellow-500' />
                                                <TreePine className='w-5 h-5 text-green-600' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Title */}
                                    <h1 className='mx-auto mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl px-4 sm:px-0'>
                                        <span className='bg-gradient-to-r from-green-600 via-amber-600 to-red-600 bg-clip-text text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-8xl'>
                                            🇨🇱
                                        </span>
                                        <br />
                                        <span className='text-white drop-shadow-2xl block leading-tight'>Junta de Vecinos</span>
                                        <br />
                                        <span className='text-amber-100 drop-shadow-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight'>Pinto Los Pellines</span>
                                    </h1>

                                    {/* Countryside Description */}
                                    <p className='mx-auto my-8 max-w-2xl text-balance text-lg sm:text-xl text-white/95 drop-shadow-lg leading-relaxed font-medium px-4 sm:px-0'>
                                        En el corazón de Ñuble, Chile, conectamos a nuestra comunidad con tecnología moderna para mantener la seguridad y el bienestar de nuestras familias.
                                    </p>

                                    {/* Call to Action Buttons */}
                                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 px-4 sm:px-0 w-full max-w-md sm:max-w-none'>
                                        <Card className='bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto'>
                                            <Button
                                                asChild
                                                size='lg'
                                                className='bg-transparent hover:bg-transparent border-0 shadow-none text-white font-semibold px-6 sm:px-8 py-4 w-full sm:w-auto'>
                                                <Link href='#contacto' className='flex items-center justify-center'>
                                                    <Users className='w-5 h-5 mr-2 flex-shrink-0' />
                                                    <span className='text-center'>Únete a la Comunidad</span>
                                                </Link>
                                            </Button>
                                        </Card>

                                        <Card className='bg-white/10 backdrop-blur-sm border-white/30 w-full sm:w-auto'>
                                            <Button
                                                asChild
                                                size='lg'
                                                variant='outline'
                                                className='bg-transparent hover:bg-white/20 border-white/50 text-white hover:text-white shadow-none px-6 sm:px-8 py-4 w-full sm:w-auto'>
                                                <Link href='#nosotros' className='flex items-center justify-center'>
                                                    <Heart className='w-5 h-5 mr-2 flex-shrink-0' />
                                                    <span className='text-center'>Conoce Más</span>
                                                </Link>
                                            </Button>
                                        </Card>

                                    {/* Countryside Stats */}
                                    <div className='grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl mx-auto px-4 sm:px-0'>
                                        <Card className='bg-amber-50/80 border-amber-200 hover:shadow-lg transition-all duration-300'>
                                            <div className='text-center p-3 sm:p-4'>
                                                <div className='text-xl sm:text-2xl font-bold text-amber-800'>342</div>
                                                <div className='text-xs sm:text-sm text-amber-700'>Familias</div>
                                            </div>
                                        </Card>

                                        <Card className='bg-blue-50/80 border-blue-200 hover:shadow-lg transition-all duration-300'>
                                            <div className='text-center p-3 sm:p-4'>
                                                <div className='text-xl sm:text-2xl font-bold text-blue-800'>25</div>
                                                <div className='text-xs sm:text-sm text-blue-700'>Años de Tradición</div>
                                            </div>
                                        </Card>

                                        <Card className='bg-red-50/80 border-red-200 hover:shadow-lg transition-all duration-300'>
                                            <div className='text-center p-3 sm:p-4'>
                                                <div className='text-xl sm:text-2xl font-bold text-red-800'>1</div>
                                                <div className='text-xs sm:text-sm text-red-700'>Comunidad Unida</div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Countryside App Preview */}
                        <div className='relative z-20 mt-12 sm:mt-16'>
                            <div className='mx-auto max-w-4xl px-4 sm:px-6'>
                                <Card className='bg-white/95 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2'>
                                    <div className='p-3 sm:p-6'>
                                        <Image
                                            src='/hero-section-main-app-dark.png'
                                            alt='Junta de Vecinos Pinto Los Pellines App'
                                            width={2880}
                                            height={1842}
                                            priority
                                            className='w-full h-auto rounded-lg shadow-lg'
                                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                        </div>
                    </section>
            </main>
        </>
    )
}
