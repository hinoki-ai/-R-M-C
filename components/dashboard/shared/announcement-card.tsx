'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Calendar, Info } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Announcement } from '@/types/dashboard'

interface AnnouncementCardProps {
  announcement: Announcement
  onMarkAsRead?: (id: string) => void
  compact?: boolean
}

const priorityConfig = {
  high: {
    color: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    icon: AlertTriangle,
    badge: 'Urgente'
  },
  medium: {
    color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    icon: Bell,
    badge: 'Importante'
  },
  low: {
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
    icon: Info,
    badge: 'Información'
  }
}

const categoryConfig = {
  emergency: { emoji: '🚨', color: 'text-red-600' },
  event: { emoji: '📅', color: 'text-blue-600' },
  maintenance: { emoji: '🔧', color: 'text-orange-600' },
  general: { emoji: '📢', color: 'text-gray-600' }
}

export function AnnouncementCard({ announcement, onMarkAsRead, compact = false }: AnnouncementCardProps) {
  const priority = priorityConfig[announcement.priority]
  const category = categoryConfig[announcement.category]
  const PriorityIcon = priority.icon

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 rounded-lg border-l-4 ${priority.color} cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => onMarkAsRead?.(announcement.id)}
      >
        <div className='flex items-start justify-between'>
          <div className='flex items-start space-x-3 flex-1'>
            <div className={`p-2 rounded-lg ${priority.color.replace('border-', 'bg-').replace(' bg-', ' bg-opacity-20 bg-')}`}>
              <PriorityIcon className='w-4 h-4 text-current' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center space-x-2'>
                <h4 className='font-semibold text-gray-900 dark:text-white'>
                  {announcement.title}
                </h4>
                <span className={category.color}>{category.emoji}</span>
                {announcement.priority === 'high' && (
                  <Badge variant='destructive' className='text-xs'>
                    {priority.badge}
                  </Badge>
                )}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {announcement.content.length > 100
                  ? `${announcement.content.substring(0, 100)}...`
                  : announcement.content
                }
              </p>
              <div className='flex items-center justify-between mt-2'>
                <span className='text-xs text-gray-500'>
                  {announcement.author} • {new Date(announcement.publishedAt).toLocaleDateString('es-CL')}
                </span>
                {announcement.isRead === false && (
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className={`border-l-4 ${priority.color} hover:shadow-lg transition-shadow`}>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center space-x-2'>
              <PriorityIcon className={`w-5 h-5 ${priority.color.includes('red') ? 'text-red-600' : priority.color.includes('yellow') ? 'text-yellow-600' : 'text-blue-600'}`} />
              <CardTitle className='text-lg flex items-center space-x-2'>
                <span>{announcement.title}</span>
                <span className={category.color}>{category.emoji}</span>
              </CardTitle>
            </div>
            {announcement.priority === 'high' && (
              <Badge variant='destructive'>
                {priority.badge}
              </Badge>
            )}
          </div>
          <CardDescription className='text-base'>
            {announcement.content}
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
            <div className='flex items-center space-x-4'>
              <span className='flex items-center space-x-1'>
                <span>Por:</span>
                <span className='font-medium'>{announcement.author}</span>
              </span>
              <span className='flex items-center space-x-1'>
                <Calendar className='w-4 h-4' />
                <span>{new Date(announcement.publishedAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </span>
            </div>
            {onMarkAsRead && !announcement.isRead && (
              <button
                onClick={() => onMarkAsRead(announcement.id)}
                className='text-blue-600 hover:text-blue-800 text-sm font-medium'
              >
                Marcar como leído
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Announcement List Component
interface AnnouncementListProps {
  announcements: Announcement[]
  onMarkAsRead?: (id: string) => void
  loading?: boolean
  compact?: boolean
}

export function AnnouncementList({ announcements, onMarkAsRead, loading, compact = false }: AnnouncementListProps) {
  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='h-32 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
          </div>
        ))}
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className='text-center py-12'>
        <Bell className='w-12 h-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No hay anuncios
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          Los anuncios importantes aparecerán aquí cuando estén disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {announcements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AnnouncementCard
            announcement={announcement}
            onMarkAsRead={onMarkAsRead}
            compact={compact}
          />
        </motion.div>
      ))}
    </div>
  )
}