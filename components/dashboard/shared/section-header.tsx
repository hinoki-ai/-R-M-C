'use client'

import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { SectionHeaderProps } from '@/types/dashboard'
import { DASHBOARD_SPACING } from '@/lib/dashboard-spacing'

export function SectionHeader({
  title,
  description,
  icon,
  badge,
  actions
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`flex flex-col ${DASHBOARD_SPACING.element.loose} pb-6 border-b border-gray-200 dark:border-gray-700`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-center space-x-3'>
          {icon && (
            <div className={`${DASHBOARD_SPACING.component.icon} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg`}>
              <span className='text-white text-xl'>{icon}</span>
            </div>
          )}
          <div>
            <div className='flex items-center space-x-2'>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {title}
              </h1>
              {badge && (
                <Badge variant='secondary' className='bg-gradient-to-r from-purple-500 to-blue-500 text-white'>
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <p className='text-gray-600 dark:text-gray-400 mt-1'>
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className='flex items-center space-x-2'>
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Specialized headers for common sections
export function AnnouncementHeader({ count }: { count?: number }) {
  return (
    <SectionHeader
      title='Anuncios Comunidad'
      description='Últimas noticias y comunicados importantes de Pinto Los Pellines'
      icon='📢🇨🇱'
      badge={count ? `${count} nuevos` : undefined}
    />
  )
}

export function DocumentHeader({ count }: { count?: number }) {
  return (
    <SectionHeader
      title='Documentos Oficiales'
      description='Acceda a estatutos, actas y documentos importantes de la Junta de Vecinos'
      icon='📄🇨🇱'
      badge={count ? `${count} documentos` : undefined}
    />
  )
}

export function EventHeader({ count }: { count?: number }) {
  return (
    <SectionHeader
      title='Calendario Comunitario'
      description='Eventos culturales, sociales y actividades de la comunidad'
      icon='📅🇨🇱'
      badge={count ? `${count} próximos` : undefined}
    />
  )
}

export function MaintenanceHeader({ count }: { count?: number }) {
  return (
    <SectionHeader
      title='Mantenimiento Comunitario'
      description='Reportes y seguimiento de solicitudes de mantenimiento'
      icon='🔧🇨🇱'
      badge={count ? `${count} pendientes` : undefined}
    />
  )
}
