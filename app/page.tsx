export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-600 via-amber-600 to-red-600 flex items-center justify-center'>
      <div className='text-center text-white p-8'>
        <h1 className='text-6xl font-bold mb-4'>🇨🇱</h1>
        <h2 className='text-4xl font-bold mb-2'>Junta de Vecinos</h2>
        <h3 className='text-2xl font-semibold mb-8'>Pinto Los Pellines</h3>
        <p className='text-lg mb-8'>Bienvenidos a nuestra comunidad</p>
        <div className='space-x-4'>
          <a href='/dashboard' className='bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
            Ir al Dashboard
          </a>
          <a href='/anuncios' className='bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors'>
            Ver Anuncios
          </a>
        </div>
      </div>
    </div>
  );
}