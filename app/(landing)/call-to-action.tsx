import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CallToAction() {
    return (
        <section className='py-16 px-6'>
            <div className=' mx-auto max-w-5xl rounded-3xl px-6 py-12 md:py-20 lg:py-32'>
                <Card className='w-full max-w-5xl h-auto aspect-[16/9]'>
                <div className='absolute text-center'>
                    <h2 className='text-balance text-4xl font-semibold lg:text-5xl'>🇨🇱 Únete al Orgullo Ñublensino</h2>
                    <p className='mt-4'>Tu participación es fundamental para el desarrollo de nuestra querida tierra ñublensina. Conoce cómo puedes contribuir al futuro de Pinto Los Pellines y honrar nuestras tradiciones chilenas.</p>

                    <div className='mt-12 flex flex-wrap justify-center gap-4'>
                        <Button
                            asChild
                            size='lg'>
                            <Link href='/dashboard'>
                                <span>Participar Activamente</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size='lg'
                            variant='outline'>
                            <Link href='#contacto'>
                                <span>Contactar Junta</span>
                            </Link>
                        </Button>
                    </div>
                </div>
                </Card>
            </div>
            
        </section>
    )
}