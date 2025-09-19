'use client'

import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Suspense, useState } from 'react'

import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { EventFilter, EventList } from '@/components/dashboard/shared/event-card'
import { EventHeader } from '@/components/dashboard/shared/section-header'
import { useEvents } from '@/hooks/use-dashboard-data'
import { Event } from '@/types/dashboard'


// No mock data - using real events only

function EventsContent() {
  const { user } = useUser()
  const { events: realEvents, loading, rsvpToEvent } = useEvents()

  // Use real data only - no mock fallbacks
  const events = realEvents

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<Event['category'] | undefined>(undefined)
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)

  // Calculate event counts by category
  const eventCounts = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1
    return acc
  }, {} as Record<Event['category'], number>)

  const handleRSVP = async (eventId: string) => {
    await rsvpToEvent(eventId)
    // Could show a success toast here
  }

  const handleViewDetails = (eventId: string) => {
    // Navigate to event details or open modal
    console.log('View event details:', eventId)
  }

  if (!user) {
    return (
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='events'>
        <div className='text-center py-12'>
          <p className='text-gray-600 dark:text-gray-400'>Cargando...</p>
        </div>
      </DocumentDashboardLayout>
    )
  }

  return (
    <DocumentDashboardLayout
      user={{
        id: user.id,
        name: user.firstName || user.username || 'Usuario',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: 'user',
        isAdmin: user.publicMetadata?.role === 'admin' || false
      }}
      currentSection='events'
    >
      <div className='space-y-6'>
        <EventHeader count={events.filter(e => new Date(e.date) >= new Date()).length} />

        {/* Event Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EventFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            eventCounts={eventCounts}
            showUpcomingOnly={showUpcomingOnly}
            onUpcomingToggle={() => setShowUpcomingOnly(!showUpcomingOnly)}
          />
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EventList
            events={events}
            onRSVP={handleRSVP}
            onViewDetails={handleViewDetails}
            loading={loading}
            compact={false}
            filterByCategory={selectedCategory}
            showUpcomingOnly={showUpcomingOnly}
          />
        </motion.div>

        {/* Event Calendar Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800'
        >
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            📅 Próximos Eventos
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map(event => (
                <div key={event.id} className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-gray-900 dark:text-white text-sm'>
                      {event.title}
                    </h4>
                    <span className='text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded'>
                      {new Date(event.date).toLocaleDateString('es-CL', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mb-2'>
                    📍 {event.location}
                  </p>
                  <p className='text-xs text-gray-500'>
                    🕐 {event.time}
                  </p>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Event Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800'
        >
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            📊 Estadísticas de Eventos
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>{events.length}</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Total de Eventos</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {events.filter(e => new Date(e.date) >= new Date()).length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Próximos</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {events.filter(e => e.isMandatory).length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Obligatorios</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {events.reduce((sum, e) => sum + (e.attendees || 0), 0)}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Asistentes Totales</div>
            </div>
          </div>
        </motion.div>
      </div>
    </DocumentDashboardLayout>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='events'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Cargando eventos...</p>
        </div>
      </DocumentDashboardLayout>
    }>
      <EventsContent />
    </Suspense>
  )
}