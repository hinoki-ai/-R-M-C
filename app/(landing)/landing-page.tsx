export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-6 py-16'>
        <div className='text-center space-y-8'>
          <div className='space-y-4'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900'>
              PintoPellines
            </h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Plataforma comunitaria avanzada para Pinto Los Pellines
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>342</div>
              <div className='text-gray-600'>Vecinos Activos</div>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='text-3xl font-bold text-green-600 mb-2'>24</div>
              <div className='text-gray-600'>Cámaras Online</div>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>156</div>
              <div className='text-gray-600'>Familias</div>
            </div>
          </div>

          <div className='mt-16'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-8'>Próximos Eventos</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='font-semibold text-gray-900'>Reunión Junta Vecinal</h3>
                <p className='text-gray-600'>Mañana 19:00 - Salón Comunitario</p>
              </div>
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='font-semibold text-gray-900'>Festival Día del Campesino</h3>
                <p className='text-gray-600'>15 Nov - Plaza Principal</p>
              </div>
            </div>
          </div>

          <div className='mt-16 bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>🚀 Sistema en Desarrollo</h2>
            <p className='text-gray-600 mb-6'>
              Estamos trabajando arduamente para traerte la mejor plataforma comunitaria.
              Pronto podrás acceder a todas las funcionalidades avanzadas.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
              <div className='text-center'>
                <div className='text-blue-600 font-semibold'>Cámaras de Seguridad</div>
                <div className='text-gray-500'>Sistema de videovigilancia</div>
              </div>
              <div className='text-center'>
                <div className='text-green-600 font-semibold'>Gestión de Pagos</div>
                <div className='text-gray-500'>Contribuciones comunitarias</div>
              </div>
              <div className='text-center'>
                <div className='text-purple-600 font-semibold'>Panel de Control</div>
                <div className='text-gray-500'>Dashboard administrativo</div>
              </div>
              <div className='text-center'>
                <div className='text-orange-600 font-semibold'>Comunicación</div>
                <div className='text-gray-500'>Anuncios y eventos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}