'use client'


import { Button } from '@/components/ui/button'

export default function PaymentsPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center py-8'>
        <div className='text-4xl mb-4'>💰🇨🇱</div>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
          Aportes y Contribuciones Comunitarias
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Apoya el desarrollo sostenible de Pinto Los Pellines
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div className='p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 rounded-lg border'>
          <h4 className='font-semibold mb-2'>✅ Tu Estado de Pago</h4>
          <div className='text-center'>
            <div className='text-2xl mb-2'>💚</div>
            <p className='text-sm text-green-700 dark:text-green-300'>Al día - Octubre 2025</p>
            <p className='text-xs text-gray-500 mt-1'>Último aporte: $3.500 (Ago)</p>
          </div>
        </div>
        <div className='p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-900/20 rounded-lg border'>
          <h4 className='font-semibold mb-2'>📊 Fondo Común</h4>
          <div className='text-center'>
            <div className='text-2xl mb-2'>💰</div>
            <p className='text-lg font-bold text-blue-700 dark:text-blue-300'>$247.850</p>
            <p className='text-xs text-gray-500 mt-1'>Recaudado este año</p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'>
          <h4 className='font-semibold mb-2'>🌾 Proyecto: Sistema de Riego Comunitario</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Implementación de riego por goteo para huertos familiares. Meta: $180.000</p>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2'>
            <div className='bg-green-600 h-2 rounded-full w-3/5'></div>
          </div>
          <p className='text-xs text-gray-500'>$117.000 recaudados • 65% completado</p>
        </div>

        <div className='p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'>
          <h4 className='font-semibold mb-2'>🏥 Fondo Salud Animal</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Vacunación antirrábica y atención veterinaria gratuita para mascotas del sector.</p>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2'>
            <div className='bg-blue-600 h-2 rounded-full w-2/5'></div>
          </div>
          <p className='text-xs text-gray-500'>$22.500 recaudados • 45% completado</p>
        </div>

        <div className='flex justify-center mt-6'>
          <Button className='bg-green-600 hover:bg-green-700 px-8 py-3 text-lg'>
            💚 Hacer Aporte Voluntario
          </Button>
        </div>
      </div>
    </div>
  )
}