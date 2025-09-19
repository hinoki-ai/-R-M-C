import { Protect } from '@clerk/nextjs'

import CustomClerkPricing from '@/components/forms/custom-clerk-pricing';

function UpgradeCard() {
  return (
    <>
      <div className='mx-auto max-w-2xl space-y-4 text-center'>
        <h1 className='text-center text-2xl font-semibold lg:text-3xl'>Contribuciones Comunitarias</h1>
        <p>Esta sección está disponible con contribuciones activas. Elige el nivel que se ajuste a tu capacidad de apoyar a Pinto Los Pellines.</p>
      </div>
      <div className='px-8 lg:px-12'>
        <CustomClerkPricing />
      </div>
    </>
  )
}


function FeaturesCard() {
  return (
    <div className='px-4 lg:px-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Funciones Avanzadas</h1>
        </div>
        <div className='rounded-lg border bg-card p-6'>
          <h2 className='text-lg font-semibold mb-4'>Panel de Control Comunitario</h2>
            <p className='text-muted-foreground'>
              Acceso a herramientas avanzadas para la gestión comunitaria, reportes detallados y participación activa en decisiones del barrio.
            </p>
          </div>
        </div>
      </div>
    )
}


export default function TeamPage() {
  return (
    <Protect
    condition={(has) => {
      // Check if user has any of the paid plans
      // return has({ plan: "vecino_activo" }) || has({ plan: "colaborador" }) || has({ plan: "patrocinador" })
      // Or alternatively, check if user doesn't have free plan (if free plan exists)
      return !has({ plan: 'free_user' })
    }}
      fallback={<UpgradeCard/>}
    >
      <FeaturesCard />
    </Protect>
  )
} 