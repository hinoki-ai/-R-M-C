import { cn } from '@/lib/utils'

export const Table = ({ className }: { className?: string }) => {
    const activities = [
        {
            id: 1,
            date: '22/09/2025',
            type: 'Feria',
            status: 'Próxima',
            statusVariant: 'warning',
            title: 'Feria Artesanal Pinto',
            participants: '120+',
        },
        {
            id: 2,
            date: '15/09/2025',
            type: 'Asamblea',
            status: 'Completada',
            statusVariant: 'success',
            title: 'Asamblea Ordinaria',
            participants: '67',
        },
        {
            id: 3,
            date: '13/09/2025',
            type: 'Seguridad',
            status: 'Completada',
            statusVariant: 'success',
            title: 'Ronda Vecinal Nocturna',
            participants: '18',
        },
        {
            id: 4,
            date: '06/09/2025',
            type: 'Mantenimiento',
            status: 'Completada',
            statusVariant: 'success',
            title: 'Limpieza Plaza Principal',
            participants: '32',
        },
    ]

    return (
        <div className={cn('bg-background shadow-foreground/5 inset-ring-1 inset-ring-background ring-foreground/5 relative w-full overflow-hidden rounded-xl border border-transparent p-6 shadow-md ring-1', className)}>
            <div className='mb-6'>
                <div className='flex gap-1.5'>
                    <div className='bg-muted size-2 rounded-full border border-black/5'></div>
                    <div className='bg-muted size-2 rounded-full border border-black/5'></div>
                    <div className='bg-muted size-2 rounded-full border border-black/5'></div>
                </div>
                <div className='mt-3 text-lg font-medium'>Actividades Recientes</div>
                <p className='mt-1 text-sm'>Últimas actividades y eventos de nuestra comunidad</p>
            </div>
            <table
                className='w-max table-auto border-collapse lg:w-full'
                data-rounded='medium'>
                <thead className='dark:bg-background bg-gray-950/5'>
                    <tr className='*:border *:p-3 *:text-left *:text-sm *:font-medium'>
                        <th className='rounded-l-[--card-radius]'>#</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Actividad</th>
                        <th className='rounded-r-[--card-radius]'>Participantes</th>
                    </tr>
                </thead>
                <tbody className='text-sm'>
                    {activities.map((activity) => (
                        <tr
                            key={activity.id}
                            className='*:border *:p-2'>
                            <td>{activity.id}</td>
                            <td>{activity.date}</td>
                            <td>
                                <span className='rounded-full px-2 py-1 text-xs bg-blue-500/15 text-blue-800'>{activity.type}</span>
                            </td>
                            <td>
                                <div className='text-title'>
                                    <span className='text-foreground font-medium'>{activity.title}</span>
                                    <div className='mt-1'>
                                        <span className={cn('rounded-full px-2 py-0.5 text-xs', activity.statusVariant == 'success' && 'bg-lime-500/15 text-lime-800', activity.statusVariant == 'danger' && 'bg-red-500/15 text-red-800', activity.statusVariant == 'warning' && 'bg-yellow-500/15 text-yellow-800')}>{activity.status}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{activity.participants}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
