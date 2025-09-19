'use client'

import {
  IconCamera,
  IconCircleCheckFilled,
  IconHelp,
  IconLoader,
  IconSearch,
} from '@tabler/icons-react'
import { useMutation, useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

export default function CameraEventsPage() {
  const [selectedCamera, setSelectedCamera] = useState<'all' | Id<'cameras'>>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(50)

  const cameras = useQuery(api.cameras.getCameras)
  const events = useQuery(api.cameras.getCameraEvents, {
    cameraId: selectedCamera === 'all' ? undefined : selectedCamera,
    limit
  })
  const acknowledgeEvent = useMutation(api.cameras.acknowledgeCameraEvent)

  const handleCameraChange = (value: string) => {
    setSelectedCamera(value === 'all' ? 'all' : value as Id<'cameras'>)
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'motion_detected':
        return <IconCamera className='h-4 w-4' />
      case 'connection_lost':
        return <IconLoader className='h-4 w-4' />
      case 'connection_restored':
        return <IconCircleCheckFilled className='h-4 w-4' />
      case 'recording_started':
        return <IconCamera className='h-4 w-4' />
      case 'recording_stopped':
        return <IconLoader className='h-4 w-4' />
      case 'alert':
        return <IconHelp className='h-4 w-4' />
      default:
        return <IconSearch className='h-4 w-4' />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'motion_detected':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950'
      case 'connection_lost':
        return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'connection_restored':
        return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'recording_started':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950'
      case 'recording_stopped':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950'
      case 'alert':
        return 'text-red-600 bg-red-50 dark:bg-red-950'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCameraName = (cameraId: string) => {
    const camera = cameras?.find(c => c._id === cameraId)
    return camera?.name || 'Unknown Camera'
  }

  const handleAcknowledgeEvent = async (eventId: Id<'cameraEvents'>) => {
    try {
      await acknowledgeEvent({ eventId })
    } catch (error) {
      console.error('Error acknowledging event:', error)
    }
  }

  const filteredEvents = events?.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCameraName(event.cameraId).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter

    return matchesSearch && matchesType && matchesSeverity
  }) || []

  const unacknowledgedCount = events?.filter(e => !e.acknowledged).length || 0

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-3'>
            <IconHelp className='h-8 w-8' />
            Camera Events
            {unacknowledgedCount > 0 && (
              <Badge variant='destructive' className='ml-2'>
                {unacknowledgedCount} New
              </Badge>
            )}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Monitor and manage security camera events and alerts
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className='mb-6'>
        <CardContent className='p-6'>
          <div className='flex flex-wrap gap-4 items-end'>
            <div className='flex-1 min-w-[200px]'>
              <label className='block text-sm font-medium mb-2'>Search Events</label>
              <div className='relative'>
                <IconSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search by camera name or message...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='min-w-[150px]'>
              <label className='block text-sm font-medium mb-2'>Camera</label>
              <Select value={selectedCamera === 'all' ? 'all' : selectedCamera} onValueChange={handleCameraChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Cameras</SelectItem>
                  {cameras?.map(camera => (
                    <SelectItem key={camera._id} value={camera._id}>
                      {camera.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='min-w-[150px]'>
              <label className='block text-sm font-medium mb-2'>Event Type</label>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='motion_detected'>Motion Detected</SelectItem>
                  <SelectItem value='connection_lost'>Connection Lost</SelectItem>
                  <SelectItem value='connection_restored'>Connection Restored</SelectItem>
                  <SelectItem value='recording_started'>Recording Started</SelectItem>
                  <SelectItem value='recording_stopped'>Recording Stopped</SelectItem>
                  <SelectItem value='alert'>Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='min-w-[150px]'>
              <label className='block text-sm font-medium mb-2'>Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Severities</SelectItem>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='critical'>Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant='outline' onClick={() => {
              setSelectedCamera('all')
              setEventTypeFilter('all')
              setSeverityFilter('all')
              setSearchQuery('')
            }}>
              <IconLoader className='h-4 w-4 mr-2' />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className='space-y-4'>
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className='p-12 text-center'>
              <IconSearch className='h-12 w-12 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-semibold mb-2'>No Events Found</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                {events?.length === 0 ? 'No camera events have been logged yet.' : 'Try adjusting your filters.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event._id} className={`transition-colors ${!event.acknowledged ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-4'>
                    <div className={`p-2 rounded-lg ${getEventColor(event.eventType)}`}>
                      {getEventIcon(event.eventType)}
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <h3 className='font-semibold'>{getCameraName(event.cameraId)}</h3>
                        <Badge variant='outline' className='text-xs'>
                          {event.eventType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                        <span className='text-xs text-gray-500 capitalize'>{event.severity}</span>
                      </div>

                      <p className='text-gray-700 dark:text-gray-300 mb-2'>{event.message}</p>

                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                        {!event.acknowledged && (
                          <span className='text-blue-600 font-medium'>Unacknowledged</span>
                        )}
                      </div>

                      {event.metadata && (
                        <details className='mt-2'>
                          <summary className='text-sm text-gray-500 cursor-pointer hover:text-gray-700'>
                            View Details
                          </summary>
                          <pre className='mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto'>
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {!event.acknowledged && (
                      <Button
                        size='sm'
                        onClick={() => handleAcknowledgeEvent(event._id)}
                        className='flex items-center gap-2'
                      >
                        <IconCircleCheckFilled className='h-4 w-4' />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {events && events.length >= limit && (
        <div className='text-center mt-8'>
          <Button
            variant='outline'
            onClick={() => setLimit(prev => prev + 50)}
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  )
}
