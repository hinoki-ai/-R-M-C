'use client'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function LSVisionCamerasPage() {
  // Temporarily simplified for deployment
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold flex items-center gap-3'>
          <div className='h-8 w-8 bg-blue-600 rounded'></div>
          Cámaras de Seguridad - Pinto Los Pellines
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>
          Sistema de vigilancia comunitaria - Próximamente disponible
        </p>
      </div>

      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
        <h2 className='text-lg font-semibold text-yellow-800 mb-2'>🚧 Página en Desarrollo</h2>
        <p className='text-yellow-700'>
          Esta página está siendo preparada para su lanzamiento. Pronto podrás acceder al sistema completo de cámaras de seguridad.
        </p>
      </div>
    </div>
  );
}
