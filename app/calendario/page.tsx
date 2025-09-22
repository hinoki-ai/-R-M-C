'use client'

import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { CalendarView } from '@/components/calendar/calendar-view'
import { EventDetails } from '@/components/calendar/event-details'
import { EventForm } from '@/components/calendar/event-form'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

type ViewMode = 'calendar' | 'create' | 'edit' | 'details'

export default function CalendarioPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('calendar')
  const [selectedEventId, setSelectedEventId] = useState<Id<"calendarEvents"> | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get current user info
  const userId = useQuery(api.users?.current) // Assuming this exists

  const handleEventClick = (event: any) => {
    setSelectedEventId(event._id)
    setCurrentView('details')
  }

  const handleCreateEvent = () => {
    setSelectedDate(null)
    setCurrentView('create')
  }

  const handleEditEvent = (eventId: Id<"calendarEvents">) => {
    setSelectedEventId(eventId)
    setCurrentView('edit')
  }

  const handleSaveEvent = (eventId: Id<"calendarEvents">) => {
    setCurrentView('calendar')
    setSelectedEventId(null)
    setSelectedDate(null)
  }

  const handleCancel = () => {
    setCurrentView('calendar')
    setSelectedEventId(null)
    setSelectedDate(null)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <EventForm
                selectedDate={selectedDate || undefined}
                onSave={handleSaveEvent}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        )

      case 'edit':
        return selectedEventId ? (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <EventForm
                eventId={selectedEventId}
                onSave={handleSaveEvent}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        ) : null

      case 'details':
        return selectedEventId ? (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <EventDetails
                eventId={selectedEventId}
                onClose={handleCancel}
                onEdit={handleEditEvent}
                isOrganizer={true} // TODO: Check if user is organizer
              />
            </DialogContent>
          </Dialog>
        ) : null

      default:
        return (
          <CalendarView
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
            selectedDate={selectedDate || undefined}
            onDateSelect={setSelectedDate}
          />
        )
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-green-950 dark:via-blue-950 dark:to-yellow-950'>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className='absolute top-20 left-12 text-6xl'>🏔️</div>
        <div className='absolute top-32 left-16 text-4xl'>🌽</div>
        <div className='absolute top-60 right-16 text-5xl'>🇨🇱</div>
        <div className='absolute top-80 left-8 text-3xl'>🌻</div>
        <div className='absolute bottom-32 left-20 text-4xl'>🏞️</div>
        <div className='absolute bottom-40 right-12 text-3xl'>🌽</div>
        <div className='absolute bottom-60 left-32 text-3xl'>🐑</div>
        <div className='absolute bottom-20 right-24 text-4xl'>🏘️</div>
        <div className='absolute top-40 right-8 text-3xl'>🌾</div>
        <div className='absolute bottom-80 right-40 text-2xl'>🇨🇱</div>
      </div>

      {/* Theme Toggle */}
      <div className='absolute top-4 right-4 z-10'>
        <ModeToggle />
      </div>

      <div className='relative'>
        {renderCurrentView()}
      </div>
    </div>
  )
}