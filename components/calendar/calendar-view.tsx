'use client'

import { useAction, useQuery } from 'convex/react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Filter, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'


interface CalendarEvent {
  _id: string
  title: string
  description?: string
  categoryId: string
  category: {
    name: string
    color: string
    icon: string
  }
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  location?: string
  isAllDay: boolean
  isRecurring: boolean
  recurrenceRule?: Record<string, unknown>
  maxAttendees?: number
  isPublic: boolean
  requiresApproval: boolean
  organizerId: string
  organizer: {
    name: string
  }
  attendeeCount: number
  userAttendanceStatus?: "pending" | "confirmed" | "declined" | "tentative" | null
  createdAt: number
  updatedAt: number
}

interface CalendarViewProps {
  onEventClick?: (event: CalendarEvent) => void
  onCreateEvent?: () => void
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export function CalendarView({ onEventClick, onCreateEvent, selectedDate, onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get events for current month
  const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

  const events = useQuery(api.calendar.getEvents, { startDate, endDate }) || []
  const categories = useQuery(api.calendar.getEventCategories) || []
  const exportCalendarICS = useAction(api.calendar_export.exportCalendarICS)

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || event.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleExportCalendar = async () => {
    try {
      const icsContent = await exportCalendarICS({
        startDate,
        endDate,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      })

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `calendario-pellines-${format(currentDate, 'yyyy-MM')}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting calendar:', error)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev =>
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventStart = parseISO(event.startDate)
      const eventEnd = parseISO(event.endDate)
      return date >= eventStart && date <= eventEnd
    })
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    return (
      <div className='grid grid-cols-7 gap-1' >
        {/* Day headers */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className='p-2 text-center font-semibold text-sm text-gray-600 dark:text-gray-400' >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer
                hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                ${isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                ${isToday ? 'bg-blue-50 dark:bg-blue-950 border-blue-300' : ''}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => onDateSelect?.(day)}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>

              <div className='space-y-1' >
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event._id}
                    className='text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity'
                    // eslint-disable-next-line react/forbid-dom-props
                    style={{
                      backgroundColor: event.category.color + '20',
                      borderLeft: `3px solid ${event.category.color}`,
                      color: event.category.color
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick?.(event)
                    }}
                  >
                    <div className='font-medium' style={{ color: event.category.color }}> {/* eslint-disable-line react/forbid-dom-props */}
                      {event.title}
                    </div>
                    {event.startTime && !event.isAllDay && (
                      <div className='text-gray-600 dark:text-gray-400' >
                        {event.startTime}
                      </div>
                    )}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div className='text-xs text-gray-500' >
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className='w-full max-w-6xl mx-auto p-6' >
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6' >
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white' >
            Calendario Comunitario
          </h1>
          <p className='text-gray-600 dark:text-gray-400' >
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </p>
        </div>

        <div className='flex items-center gap-2' >
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className='w-4 h-4' />
          </Button>

          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className='w-32' >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='month' >Mes</SelectItem>
              <SelectItem value='week' >Semana</SelectItem>
              <SelectItem value='day' >Día</SelectItem>
            </SelectContent>
          </Select>

          <Button variant='outline' onClick={handleExportCalendar}>
            <Download className='w-4 h-4 mr-2' />
            Exportar ICS
          </Button>

          <Button onClick={onCreateEvent}>
            <Plus className='w-4 h-4 mr-2' />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-4 mb-6' >
        <div className='relative w-full' >
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Buscar eventos...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 w-full'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4' >
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-48' >
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue placeholder='Todas las categorías' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all' >Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category._id} value={category._id}>
                  <div className='flex items-center gap-2' >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Export Button */}
          <Button variant='outline' onClick={handleExportCalendar} className='sm:hidden' >
            <Download className='w-4 h-4 mr-2' />
            Exportar
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className='p-6' >
          {renderMonthView()}
        </CardContent>
      </Card>

      {/* Event List for selected date */}
      {selectedDate && (
        <Card className='mt-6' >
          <CardHeader>
            <CardTitle className='flex items-center gap-2' >
              <CalendarIcon className='w-5 h-5' />
              Eventos del {format(selectedDate, 'd \'de\' MMMM', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4' >
              {getEventsForDate(selectedDate).map(event => (
                <div
                  key={event._id}
                  className='flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                  onClick={() => onEventClick?.(event)}
                >
                  <div className='flex-1' >
                    <div className='flex items-center gap-2 mb-2' >
              <Badge
                className='border'
                style={{
                  backgroundColor: event.category.color + '20',
                  color: event.category.color,
                  borderColor: event.category.color
                }}
                variant='outline'
              >
                        <span className='mr-1' >{event.category.icon}</span>
                        {event.category.name}
                      </Badge>
                      {event.userAttendanceStatus && (
                        <Badge variant={
                          event.userAttendanceStatus === 'confirmed' ? 'default' :
                          event.userAttendanceStatus === 'tentative' ? 'secondary' : 'destructive'
                        }>
                          {event.userAttendanceStatus === 'confirmed' ? 'Confirmado' :
                           event.userAttendanceStatus === 'tentative' ? 'Tentativo' : 'Rechazado'}
                        </Badge>
                      )}
                    </div>

                    <h3 className='font-semibold text-lg mb-1' >{event.title}</h3>

                    {event.description && (
                      <p className='text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2' >
                        {event.description}
                      </p>
                    )}

                    <div className='flex items-center gap-4 text-sm text-gray-500' >
                      {!event.isAllDay && event.startTime && (
                        <span>{event.startTime} - {event.endTime}</span>
                      )}
                      {event.location && (
                        <span>📍 {event.location}</span>
                      )}
                      <span>👥 {event.attendeeCount} asistentes</span>
                    </div>
                  </div>
                </div>
              ))}

              {getEventsForDate(selectedDate).length === 0 && (
                <div className='text-center py-8 text-gray-500' >
                  No hay eventos programados para este día
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}