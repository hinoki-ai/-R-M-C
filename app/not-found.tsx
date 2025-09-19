import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <section className='h-screen w-screen flex flex-col items-center justify-center bg-black'>
            <h1 className='text-6xl font-black tracking-tight text-white text-center'>Página no encontrada</h1>
            <Link href='/'>
                <div className='mt-16 bg-white text-black text-xl font-medium flex items-center justify-center px-6 py-3 rounded-full'>
                    <span>Inicio</span>
                    <span className='ml-2'>→</span>
                </div>
            </Link>
        </section>
    )
}