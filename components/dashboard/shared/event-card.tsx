'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Event } from '@/types/dashboard'

interface EventCardProps {
  event: Event
  onRSVP?: (id: string) => void
  onViewDetails?: (id: string) => void
  compact?: boolean
}

const categoryConfig = {
  cultural: { emoji: '🎭', color: 'text-purple-600', label: 'Cultural' },
  social: { emoji: '👥', color: 'text-blue-600', label: 'Social' },
  maintenance: { emoji: '🔧', color: 'text-orange-600', label: 'Mantenimiento' },
  assembly: { emoji: '🏛️', color: 'text-red-600', label: 'Asamblea' }
}

export function EventCard({ event, onRSVP, onViewDetails, compact = false }: EventCardProps) {
  const category = categoryConfig[event.category as keyof typeof categoryConfig] || categoryConfig.cultural

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='p-4 border rounded-lg hover:shadow-md transition-shadow'
      >
        <div className='flex items-start justify-between'>
          <div className='flex items-start space-x-3 flex-1'>
            <div className='p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center space-x-2'>
                <h4 className='font-semibold text-gray-900 dark:text-white'>
                  {event.title}
                </h4>
                <span className={category.color}>{category.emoji}</span>
                <Badge variant='outline' className='text-xs'>
                  {category.label}
                </Badge>
                {event.isMandatory && (
                  <Badge variant='destructive' className='text-xs'>
                    Obligatorio
                  </Badge>
                )}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description
                }
              </p>
              <div className='flex items-center justify-between mt-2 text-xs text-gray-500'>
                <div className='flex items-center space-x-4'>
                  <span className='flex items-center space-x-1'>
                    <Calendar className='w-3 h-3' />
                    <span>{new Date(event.date).toLocaleDateString('es-CL')}</span>
                  </span>
                  <span className='flex items-center space-x-1'>
                    <Clock className='w-3 h-3' />
                    <span>{event.time}</span>
                  </span>
                  <span className='flex items-center space-x-1'>
                    <MapPin className='w-3 h-3' />
                    <span>{event.location}</span>
                  </span>
                  {event.attendees && (
                    <span className='flex items-center space-x-1'>
                      <Users className='w-3 h-3' />
                      <span>{event.attendees}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {onRSVP && (
            <Button
              size='sm'
              variant='outline'
              onClick={() => onRSVP(event.id)}
            >
              Confirmar Asistencia
            </Button>
          )}
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
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg'>
                <Calendar className='w-6 h-6 text-white' />
              </div>
              <div>
                <CardTitle className='flex items-center space-x-2'>
                  <span>{event.title}</span>
                  <span className={category.color}>{category.emoji}</span>
                </CardTitle>
                <CardDescription className='mt-1'>
                  {event.description}
                </CardDescription>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Badge variant='secondary' className='bg-gradient-to-r from-green-500 to-blue-500 text-white'>
                {category.label}
              </Badge>
              {event.isMandatory && (
                <Badge variant='destructive'>
                  Obligatorio
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                <Calendar className='w-4 h-4 text-blue-600' />
                <span>{new Date(event.date).toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                <Clock className='w-4 h-4 text-green-600' />
                <span>{event.time}</span>
              </div>
              <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                <MapPin className='w-4 h-4 text-red-600' />
                <span>{event.location}</span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                <User className='w-4 h-4 text-purple-600' />
                <span>Organiza: {event.organizer}</span>
              </div>
              {event.attendees !== undefined && (
                <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Users className='w-4 h-4 text-orange-600' />
                  <span>{event.attendees} asistentes confirmados</span>
                </div>
              )}
            </div>
          </div>
          {(onRSVP || onViewDetails) && (
            <div className='flex items-center justify-end space-x-2 mt-6 pt-4 border-t'>
              {onViewDetails && (
                <Button
                  variant='outline'
                  onClick={() => onViewDetails(event.id)}
                >
                  Ver Detalles
                </Button>
              )}
              {onRSVP && (
                <Button
                  onClick={() => onRSVP(event.id)}
                  className='bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                >
                  Confirmar Asistencia
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Event List Component
interface EventListProps {
  events: Event[]
  onRSVP?: (id: string) => void
  onViewDetails?: (id: string) => void
  loading?: boolean
  compact?: boolean
  filterByCategory?: Event['category']
  showUpcomingOnly?: boolean
}

export function EventList({
  events,
  onRSVP,
  onViewDetails,
  loading,
  compact = false,
  filterByCategory,
  showUpcomingOnly = true
}: EventListProps) {
  let filteredEvents = events

  // Filter by category if specified
  if (filterByCategory) {
    filteredEvents = filteredEvents.filter(event => event.category === filterByCategory)
  }

  // Filter to show only upcoming events if specified
  if (showUpcomingOnly) {
    const now = new Date()
    filteredEvents = filteredEvents.filter(event => new Date(event.date) >= now)
  }

  // Sort by date
  filteredEvents = filteredEvents.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

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

  if (filteredEvents.length === 0) {
    return (
      <div className='text-center py-12'>
        <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No hay eventos
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          {filterByCategory
            ? `No se encontraron eventos de tipo ${categoryConfig[filterByCategory as keyof typeof categoryConfig]?.label.toLowerCase()}.`
            : showUpcomingOnly
              ? 'No hay eventos próximos programados.'
              : 'Los eventos aparecerán aquí cuando estén disponibles.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {filteredEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EventCard
            event={event}
            onRSVP={onRSVP}
            onViewDetails={onViewDetails}
            compact={compact}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Event Filter Component
interface EventFilterProps {
  selectedCategory?: Event['category']
  onCategoryChange: (category?: Event['category']) => void
  eventCounts: Record<Event['category'], number>
  showUpcomingOnly?: boolean
  onUpcomingToggle?: () => void
}

export function EventFilter({
  selectedCategory,
  onCategoryChange,
  eventCounts,
  showUpcomingOnly,
  onUpcomingToggle
}: EventFilterProps) {
  const categories: Event['category'][] = ['cultural', 'social', 'maintenance', 'assembly']

  return (
    <div className='flex flex-wrap gap-2 mb-6'>
      <Button
        variant={selectedCategory === undefined ? 'default' : 'outline'}
        size='sm'
        onClick={() => onCategoryChange(undefined)}
      >
        Todos ({Object.values(eventCounts).reduce((a, b) => a + b, 0)})
      </Button>
      {categories.map(category => {
        const config = categoryConfig[category as keyof typeof categoryConfig]
        return (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size='sm'
            onClick={() => onCategoryChange(category)}
          >
            <span className='mr-1'>{config.emoji}</span>
            {config.label} ({eventCounts[category] || 0})
          </Button>
        )
      })}
      {onUpcomingToggle && (
        <Button
          variant={showUpcomingOnly ? 'default' : 'outline'}
          size='sm'
          onClick={onUpcomingToggle}
        >
          <Clock className='w-4 h-4 mr-1' />
          Solo Próximos
        </Button>
      )}
    </div>
  )
}