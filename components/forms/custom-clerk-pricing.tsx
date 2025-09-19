import { DollarSign, Heart, Lightbulb, Users } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function CommunitySupport() {
    const supportOptions = [
        {
            title: 'Participación Activa',
            description: 'Únete a nuestras reuniones mensuales y actividades comunitarias.',
            icon: Users,
            action: 'Participar',
            href: '#contacto'
        },
        {
            title: 'Donaciones',
            description: 'Apoya económicamente los proyectos de desarrollo comunitario.',
            icon: DollarSign,
            action: 'Donar',
            href: '/donate'
        },
        {
            title: 'Voluntariado',
            description: 'Ofrece tu tiempo y conocimientos para ayudar a la comunidad.',
            icon: Heart,
            action: 'Ofrecer Ayuda',
            href: '#contacto'
        },
        {
            title: 'Ideas y Propuestas',
            description: 'Comparte tus ideas para mejorar nuestro barrio.',
            icon: Lightbulb,
            action: 'Enviar Idea',
            href: '#contacto'
        }
    ]

    return (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {supportOptions.map((option, index) => (
                <Card key={index} className='text-center'>
                    <CardHeader>
                        <div className='mx-auto mb-4 size-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                            <option.icon className='size-6 text-primary' />
                        </div>
                        <CardTitle className='text-xl'>{option.title}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className='w-full'>
                            <Link href={option.href}>
                                {option.action}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}