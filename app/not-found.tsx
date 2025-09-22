import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <section className='h-screen w-screen flex flex-col items-center justify-center bg-background'>
            <h1 className='text-6xl font-black tracking-tight text-foreground text-center'>Página no encontrada</h1>
            <Link href='/'>
                <div className='mt-16 bg-foreground text-background text-xl font-medium flex items-center justify-center px-6 py-3 rounded-full hover:bg-muted-foreground transition-colors'>
                    <span>Inicio</span>
                    <span className='ml-2'>→</span>
                </div>
            </Link>
        </section>
    )
}