'use client'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import {
  IconCircleCheckFilled,
  IconEye,
  IconHelp,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconWifi,
  IconWifiOff
} from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import * as React from 'react'

import { DashboardErrorBoundary } from '@/components/dashboard/dashboard-error-boundary'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useConvexQueryWithError } from '@/hooks/use-convex-error-handler'


interface Camera {
  _id: string
  name: string
  description?: string
  location?: string
  streamUrl: string
  isActive: boolean
  isOnline: boolean
  lastSeen?: number
  resolution?: string
  frameRate?: number
  hasAudio?: boolean
  createdBy: string
  createdAt: number
  updatedAt: number
}

// Error component for cameras page
function CamerasError({ error, onRetry, canRetry, isOnline }: {
  error: string
  onRetry: () => void
  canRetry: boolean
  isOnline: boolean
}) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-3'>
            <IconEye className='h-8 w-8' />
            Security Cameras
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage and monitor your security camera network
          </p>
        </div>
      </div>

      <div className='text-center py-12'>
        <div className='text-4xl mb-4'>
          {!isOnline ? '📶' : '⚠️'}
        </div>
        <h3 className='text-xl font-semibold mb-2'>
          {!isOnline ? 'Sin Conexión' : 'Error al Cargar Cámaras'}
        </h3>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {!isOnline
            ? 'No hay conexión a internet. Las cámaras se cargarán cuando recuperes la conexión.'
            : 'No se pudieron cargar las cámaras de seguridad'
          }
        </p>

        <Alert className='mb-6'>
          {!isOnline ? (
            <IconWifiOff className='h-4 w-4' />
          ) : (
            <IconHelp className='h-4 w-4' />
          )}
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        {canRetry && isOnline && (
          <Button onClick={onRetry} className='flex items-center gap-2'>
            <IconRefresh className='h-4 w-4' />
            Intentar de Nuevo
          </Button>
        )}

        {!isOnline && (
          <Alert>
            <IconWifi className='h-4 w-4' />
            <AlertDescription>
              Las cámaras se cargarán automáticamente cuando recuperes la conexión a internet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

// Main content component
function CamerasPageContent() {
  const { user } = useUser()
  const [cameras, setCameras] = useState<Camera[]>([])

  const { data: camerasData, error, isLoading, canRetry, retry, isError } = useConvexQueryWithError(
    api.cameras.getCameras,
    {
      maxRetries: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Cameras page error:', error)
      }
    }
  )

  // Network status for offline handling
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (camerasData && Array.isArray(camerasData)) {
      setCameras(camerasData)
    }
  }, [camerasData])

  const getStatusColor = (isOnline: boolean, isActive: boolean) => {
    if (!isActive) return 'bg-gray-500'
    return isOnline ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = (isOnline: boolean, isActive: boolean) => {
    if (!isActive) return 'Inactive'
    return isOnline ? 'Online' : 'Offline'
  }

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Never'

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='text-center'>
          <IconCircleCheckFilled className='h-16 w-16 text-yellow-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2'>Authentication Required</h2>
          <p className='text-gray-600 dark:text-gray-400'>Please sign in to access camera management.</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (isError && error) {
    return (
      <CamerasError
        error={error.message}
        onRetry={retry}
        canRetry={canRetry}
        isOnline={isOnline}
      />
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-3'>
            <IconEye className='h-8 w-8' />
            Security Cameras
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage and monitor your security camera network
          </p>
        </div>
        <Button asChild className='flex items-center gap-2'>
          <Link href='/dashboard/cameras/add'>
            <IconPlus className='h-4 w-4' />
            Add Camera
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Cameras</p>
                <p className='text-2xl font-bold'>{isLoading ? '...' : cameras.length}</p>
              </div>
              <IconEye className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Online</p>
                <p className='text-2xl font-bold text-green-600'>
                  {isLoading ? '...' : cameras.filter(c => c.isOnline && c.isActive).length}
                </p>
              </div>
              <IconCircleCheckFilled className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Offline</p>
                <p className='text-2xl font-bold text-red-600'>
                  {isLoading ? '...' : cameras.filter(c => !c.isOnline && c.isActive).length}
                </p>
              </div>
              <IconHelp className='h-8 w-8 text-red-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Inactive</p>
                <p className='text-2xl font-bold text-gray-600'>
                  {isLoading ? '...' : cameras.filter(c => !c.isActive).length}
                </p>
              </div>
              <IconSettings className='h-8 w-8 text-gray-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cameras Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-32 w-full mb-4' />
                <div className='flex justify-between'>
                  <Skeleton className='h-8 w-20' />
                  <Skeleton className='h-8 w-20' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cameras.length === 0 ? (
        <div className='text-center py-12'>
          <IconEye className='h-16 w-16 text-gray-400 mx-auto mb-4' />
          <h3 className='text-xl font-semibold mb-2'>No cameras found</h3>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Get started by adding your first security camera
          </p>
          <Button asChild>
            <Link href='/dashboard/cameras/add'>
              <IconPlus className='h-4 w-4 mr-2' />
              Add Your First Camera
            </Link>
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cameras.map((camera) => (
            <Card key={camera._id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{camera.name}</CardTitle>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(camera.isOnline, camera.isActive)}`}
                    />
                    <Badge variant={camera.isActive ? 'default' : 'secondary'}>
                      {getStatusText(camera.isOnline, camera.isActive)}
                    </Badge>
                  </div>
                </div>
                <div className='space-y-2'>
                  {camera.description && (
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {camera.description}
                    </p>
                  )}
                  {camera.hasAudio && (
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>Audio</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className='aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center'>
                  <IconEye className='h-12 w-12 text-gray-400' />
                </div>

                <div className='space-y-2 mb-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600 dark:text-gray-400'>Location:</span>
                    <span>{camera.location || 'Not set'}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600 dark:text-gray-400'>Stream:</span>
                    <span className='font-mono text-xs'>{camera.streamUrl.substring(0, 30)}...</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600 dark:text-gray-400'>Last Seen:</span>
                    <span>{formatLastSeen(camera.lastSeen)}</span>
                  </div>
                  {camera.resolution && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600 dark:text-gray-400'>Resolution:</span>
                      <span>{camera.resolution}</span>
                    </div>
                  )}
                </div>

                <Button variant='outline' size='sm' asChild className='w-full'>
                  <Link href={`/dashboard/cameras/${camera._id}`}>
                    <IconSearch className='h-4 w-4 mr-2' />
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Main component
export default function CamerasPage() {
  return <CamerasPageContent />
}
