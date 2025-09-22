'use client'

import { useAction, useMutation, useQuery } from 'convex/react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertCircle, Calendar, CheckCircle, Clock, Download, Edit, MapPin, Trash2, User, Users, XCircle } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'


interface EventDetailsProps {
  eventId: Id<'calendarEvents'>
  onClose: () => void
  onEdit?: (eventId: Id<'calendarEvents'>) => void
  isOrganizer?: boolean
}


export function EventDetails({ eventId, onClose, onEdit, isOrganizer }: EventDetailsProps) {
  const [showRSVP, setShowRSVP] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined' | 'tentative'>('confirmed')
  const [rsvpNotes, setRsvpNotes] = useState('')

  const event = useQuery(api.calendar.getEvents, { userId: undefined })?.find(e => e._id === eventId)
  const respondToEvent = useMutation(api.calendar.respondToEvent)
  const deleteEvent = useMutation(api.calendar.deleteEvent)
  const exportEventICS = useAction(api.calendar_export.exportEventICS)

  if (!event) {
    return (
      <Card className='w-full max-w-2xl mx-auto' >
        <CardContent className='p-6' >
          <div className='text-center' >Cargando evento...</div>
        </CardContent>
      </Card>
    )
  }

  const handleRSVP = async () => {
    try {
      await respondToEvent({
        eventId,
        status: rsvpStatus,
        notes: rsvpNotes.trim() || undefined,
      })
      setShowRSVP(false)
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error responding to event:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteEvent({ eventId })
        onClose()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const handleExportEvent = async () => {
    try {
      const icsContent = await exportEventICS({ eventId })

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `evento-${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting event:', error)
    }
  }

  const getAttendanceStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className='w-4 h-4 text-green-500' />
      case 'declined':
        return <XCircle className='w-4 h-4 text-red-500' />
      case 'tentative':
        return <AlertCircle className='w-4 h-4 text-yellow-500' />
      default:
        return <Clock className='w-4 h-4 text-gray-400' />
    }
  }

  const getAttendanceStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'declined':
        return 'Rechazado'
      case 'tentative':
        return 'Tentativo'
      case 'pending':
        return 'Pendiente'
      default:
        return 'No respondido'
    }
  }

  return (
    <Card className='w-full max-w-2xl mx-auto' >
      <CardHeader>
        <div className='flex items-start justify-between' >
          <div className='flex-1' >
            <CardTitle className='text-2xl mb-2' >{event.title}</CardTitle>
            <Badge
              style={{
                backgroundColor: event.category.color + '20',
                color: event.category.color,
                borderColor: event.category.color
              }}
              variant='outline'
              className='mb-4'
            >
              <span className='mr-1' >{event.category.icon}</span>
              {event.category.name}
            </Badge>
          </div>

          <div className='flex gap-2' >
            <Button variant='outline' size='sm' onClick={handleExportEvent}>
              <Download className='w-4 h-4 mr-2' />
              Exportar
            </Button>
            {isOrganizer && (
              <>
                <Button variant='outline' size='sm' onClick={() => onEdit?.(eventId)}>
                  <Edit className='w-4 h-4 mr-2' />
                  Editar
                </Button>
                <Button variant='outline' size='sm' onClick={handleDelete}>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Eliminar
                </Button>
              </>
            )}
            <Button variant='outline' size='sm' onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6' >
        {/* Description */}
        {event.description && (
          <div>
            <h3 className='font-semibold mb-2' >Descripción</h3>
            <p className='text-gray-600 dark:text-gray-400 whitespace-pre-wrap' >
              {event.description}
            </p>
          </div>
        )}

        {/* Date and Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4' >
          <div className='flex items-center gap-3' >
            <Calendar className='w-5 h-5 text-blue-500' />
            <div>
              <div className='font-medium' >
                {format(parseISO(event.startDate), 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}
                {event.startDate !== event.endDate && (
                  <> - {format(parseISO(event.endDate), 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}</>
                )}
              </div>
              {event.isAllDay && (
                <div className='text-sm text-gray-500' >Todo el día</div>
              )}
            </div>
          </div>

          {!event.isAllDay && event.startTime && (
            <div className='flex items-center gap-3' >
              <Clock className='w-5 h-5 text-green-500' />
              <div>
                <div className='font-medium' >
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {event.location && (
          <div className='flex items-center gap-3' >
            <MapPin className='w-5 h-5 text-red-500' />
            <div>
              <div className='font-medium' >{event.location}</div>
            </div>
          </div>
        )}

        {/* Organizer and Attendance */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4' >
          <div className='flex items-center gap-3' >
            <User className='w-5 h-5 text-purple-500' />
            <div>
              <div className='text-sm text-gray-500' >Organizado por</div>
              <div className='font-medium' >{event.organizer.name}</div>
            </div>
          </div>

          <div className='flex items-center gap-3' >
            <Users className='w-5 h-5 text-orange-500' />
            <div>
              <div className='text-sm text-gray-500' >Asistentes</div>
              <div className='font-medium' >
                {event.attendeeCount}
                {event.maxAttendees && event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
              </div>
            </div>
          </div>
        </div>

        {/* User's Attendance Status */}
        {event.userAttendanceStatus && (
          <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg' >
            {getAttendanceStatusIcon(event.userAttendanceStatus)}
            <div>
              <div className='font-medium' >Tu respuesta</div>
              <div className='text-sm text-gray-600 dark:text-gray-400' >
                {getAttendanceStatusText(event.userAttendanceStatus)}
              </div>
            </div>
          </div>
        )}

        {/* RSVP Section */}
        {!event.userAttendanceStatus && (
          <div className='border-t pt-6' >
            <h3 className='font-semibold mb-4' >¿Asistirás a este evento?</h3>

            {!showRSVP ? (
              <div className='flex gap-3' >
                <Button onClick={() => { setRsvpStatus('confirmed'); setShowRSVP(true); }}>
                  <CheckCircle className='w-4 h-4 mr-2' />
                  Sí, asistiré
                </Button>
                <Button variant='outline' onClick={() => { setRsvpStatus('tentative'); setShowRSVP(true); }}>
                  <AlertCircle className='w-4 h-4 mr-2' />
                  Tal vez
                </Button>
                <Button variant='outline' onClick={() => { setRsvpStatus('declined'); setShowRSVP(true); }}>
                  <XCircle className='w-4 h-4 mr-2' />
                  No asistiré
                </Button>
              </div>
            ) : (
              <div className='space-y-4' >
                <div>
                  <Label>Estado de asistencia</Label>
                  <Select value={rsvpStatus} onValueChange={(value: any) => setRsvpStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='confirmed' >Confirmado</SelectItem>
                      <SelectItem value='tentative' >Tentativo</SelectItem>
                      <SelectItem value='declined' >Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notas adicionales (opcional)</Label>
                  <Textarea
                    value={rsvpNotes}
                    onChange={(e) => setRsvpNotes(e.target.value)}
                    placeholder='Comentarios sobre tu asistencia...'
                    rows={3}
                  />
                </div>

                <div className='flex gap-3' >
                  <Button onClick={handleRSVP}>
                    Enviar respuesta
                  </Button>
                  <Button variant='outline' onClick={() => setShowRSVP(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className='text-sm text-gray-500 space-y-1 border-t pt-4' >
          <div>Creado: {format(event.createdAt, 'd/MM/yyyy \'a las\' HH:mm', { locale: es })}</div>
          <div>Última actualización: {format(event.updatedAt, 'd/MM/yyyy \'a las\' HH:mm', { locale: es })}</div>
          {event.isRecurring && (
            <div className='text-blue-600 dark:text-blue-400' >Este es un evento recurrente</div>
          )}
          {event.requiresApproval && (
            <div className='text-orange-600 dark:text-orange-400' >Requiere aprobación para asistir</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}