import { Card } from '@/components/ui/card'

import { Table } from './table'
  

export default function FeaturesOne() {
    return (
        <section className='relative py-16 md:py-32'>
            {/* Semi-transparent overlay for better contrast */}
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm -z-10'></div>
            <div className='relative py-24'>
                <div className='mx-auto w-full max-w-5xl px-6'>
                    <div className='text-center'>
                        <h2 className='text-gray-900 text-4xl font-semibold'>🇨🇱 Servicios Junta de Vecinos Pinto Los Pellines</h2>
                        <p className='text-gray-700 mb-12 mt-4 text-balance text-lg'>En el corazón de Ñuble, trabajamos unidos para mantener la seguridad, organización y bienestar de nuestras 342 familias. Conoce nuestros principales servicios comunitarios y cómo construimos el futuro de nuestro barrio con orgullo chileno.</p>
                        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20'>
                            <Table />
                        </div>
                    </div>

                    <div className='border-gray-300/50 relative mt-16 grid gap-12 border-b pb-12 [--radius:1rem] md:grid-cols-2'>
                        <div>
                            <h3 className='text-gray-900 text-xl font-semibold'>Seguridad Vecinal Ñublensina</h3>
                            <p className='text-gray-700 my-4 text-lg'>Rondas nocturnas semanales, sistema de alarmas comunitarias y coordinación con Carabineros para mantener segura nuestra comunidad de 342 familias en el corazón de Ñuble.</p>
                            <Card
                                className='aspect-video overflow-hidden px-6 bg-white/90 backdrop-blur-sm'>
                                <Card className='h-full translate-y-6 rounded-b-none border-b-0 bg-white/80 flex items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='text-4xl mb-2'>📹</div>
                                        <p className='text-gray-600'>Sistema de Cámaras de Seguridad</p>
                                    </div>
                                </Card>
                            </Card>
                        </div>
                        <div>
                            <h3 className='text-gray-900 text-xl font-semibold'>Eventos y Tradición Ñublensina</h3>
                            <p className='text-gray-700 my-4 text-lg'>Feria artesanal mensual, fiestas patrias chilenas, navidad comunitaria y actividades culturales que mantienen viva la tradición ñublensina y fortalecen nuestros lazos familiares.</p>
                            <Card
                                className='aspect-video overflow-hidden bg-white/90 backdrop-blur-sm'>
                                <Card className='translate-6 h-full rounded-bl-none border-b-0 border-r-0 bg-white/80 pt-6 pb-0 flex items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='text-4xl mb-2'>🎉</div>
                                        <p className='text-gray-600'>Eventos Comunitarios</p>
                                    </div>
                                </Card>
                            </Card>
                        </div>
                    </div>

                    <div className='bg-white/90 backdrop-blur-sm mt-12 max-w-xl p-6 rounded-lg shadow-sm border border-white/20'>
                        <div className='text-center'>
                            <div className='text-4xl mb-4'>💬</div>
                            <p className='text-gray-600'>
                                Pronto compartiremos testimonios reales de nuestra comunidad.
                                Los mensajes de nuestros vecinos aparecerán aquí una vez que
                                comiencen a usar la plataforma.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
