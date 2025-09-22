'use client'

import {
  IconAlertCircle,
  IconCamera,
  IconLoader,
  IconMaximize as IconMaximize,
  IconMinus as IconPlayerPause,
  IconPlus as IconPlayerPlay,
  IconVolume2,
  IconVolumeOff,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface Camera {
  _id: string
  name: string
  description?: string
  location?: string
  isActive: boolean
  isOnline: boolean
  lastSeen?: number
  resolution?: string
  frameRate?: number
  hasAudio?: boolean
  streamUrl?: string
}

interface CameraViewerProps {
  camera: Camera
  className?: string
  showControls?: boolean
  autoPlay?: boolean
  onEvent?: (event: string, data?: Record<string, unknown>) => void
}

export function CameraViewer({
  camera,
  className,
  showControls = true,
  autoPlay = false,
  onEvent
}: CameraViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle camera feed connection
  useEffect(() => {
    try {
      if (!camera.isOnline || !camera.isActive) {
        setError('Camera is offline')
        return
      }

      if (isPlaying && videoRef.current) {
        setIsLoading(true)
        setError(null)

        const video = videoRef.current

        // Handle camera streaming
        const setupStream = async () => {
          try {
            // Use API endpoint for camera streaming
            const streamUrl = `/api/camera/stream/${camera._id}`
            video.src = streamUrl

            // Set up event listeners
            const handleLoadStart = () => {
              console.log('Camera stream loading started:', camera.name)
            }

            const handleCanPlay = () => {
              setIsLoading(false)
              setError(null)
              onEvent?.('connected', { cameraId: camera._id })
              console.log('Camera stream ready:', camera.name)
            }

            const handleError = (e: Event) => {
              console.error('Camera stream error:', e)
              setIsLoading(false)
              setError('Failed to load camera stream - real camera feed unavailable')
            }

            video.addEventListener('loadstart', handleLoadStart)
            video.addEventListener('canplay', handleCanPlay)
            video.addEventListener('error', handleError)

            // Load the video
            video.load()

            return () => {
              video.removeEventListener('loadstart', handleLoadStart)
              video.removeEventListener('canplay', handleCanPlay)
              video.removeEventListener('error', handleError)
            }
          } catch (error) {
            console.error('Error setting up camera stream:', error)
            setError('Camera connection failed')
            setIsLoading(false)
          }
        }

        setupStream()
      }
    } catch (error) {
      console.error('Error in camera feed setup:', error)
      setError('Camera connection failed')
      setIsLoading(false)
    }
  }, [camera, isPlaying, onEvent])


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    onEvent?.(isPlaying ? 'paused' : 'playing', { cameraId: camera._id })
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleRefresh = () => {
    setError(null)
    setIsLoading(true)
    onEvent?.('refreshing', { cameraId: camera._id })

    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false)
      onEvent?.('refreshed', { cameraId: camera._id })
    }, 1500)
  }

  const getStatusColor = () => {
    if (!camera.isActive) return 'bg-gray-500'
    return camera.isOnline ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = () => {
    if (!camera.isActive) return 'Inactive'
    return camera.isOnline ? 'Online' : 'Offline'
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <IconCamera className='h-5 w-5' />
            {camera.name}
          </CardTitle>
          <div className='flex items-center gap-2'>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <Badge variant={camera.isActive ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        <div className='space-y-2'>
          {camera.location && (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              📍 {camera.location}
            </p>
          )}
          {camera.hasAudio && (
            <Badge variant='outline' className='text-xs'>Audio Available</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='relative aspect-video bg-black'>
          {/* Video/Camera Feed Area */}
          <div className='absolute inset-0 flex items-center justify-center'>
            {error ? (
              <div className='text-center text-white'>
                <IconAlertCircle className='h-12 w-12 mx-auto mb-4 text-red-400' />
                <p className='text-lg font-semibold mb-2'>Connection Error</p>
                <p className='text-sm text-gray-300 mb-4'>{error}</p>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleRefresh}
                  className='text-white border-white hover:bg-white hover:text-black'
                >
                  <IconLoader className='h-4 w-4 mr-2' />
                  Retry
                </Button>
              </div>
            ) : isLoading ? (
              <div className='text-center text-white'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
                <p className='text-lg font-semibold'>Connecting...</p>
                <p className='text-sm text-gray-300'>Establishing camera feed</p>
              </div>
            ) : camera.isOnline && camera.isActive ? (
              <div className='relative w-full h-full'>
                {/* Video element */}
                <video
                  ref={videoRef}
                  className='w-full h-full object-cover'
                  muted={isMuted}
                  autoPlay={isPlaying}
                  playsInline
                />

                {/* Fallback placeholder when video is not available */}
                {!isPlaying && (
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <IconCamera className='h-16 w-16 mx-auto mb-4 text-gray-400' />
                      <p className='text-lg font-semibold mb-2'>Camera Ready</p>
                      <p className='text-sm text-gray-400'>
                        Click play to start stream
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                  <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
                      <p className='text-sm'>Connecting to camera...</p>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {error && (
                  <div className='absolute inset-0 bg-black/80 flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <IconAlertCircle className='h-12 w-12 mx-auto mb-4 text-red-400' />
                      <p className='text-lg font-semibold mb-2'>Connection Error</p>
                      <p className='text-sm text-gray-300 mb-4'>{error}</p>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleRefresh}
                        className='text-white border-white hover:bg-white hover:text-black'
                      >
                        <IconLoader className='h-4 w-4 mr-2' />
                        Retry
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status indicators */}
                {isPlaying && !error && (
                  <div className='absolute top-4 right-4'>
                    <div className='flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1'>
                      <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                      <span className='text-white text-sm'>LIVE</span>
                    </div>
                  </div>
                )}

                {/* Connection quality indicator */}
                <div className='absolute bottom-4 left-4'>
                  <div className='flex items-center gap-1'>
                    {camera.isOnline ? (
                      <IconWifi className='h-4 w-4 text-green-400' />
                    ) : (
                      <IconWifiOff className='h-4 w-4 text-red-400' />
                    )}
                    <span className='text-white text-sm'>
                      {camera.isOnline ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center text-white'>
                <IconCamera className='h-12 w-12 mx-auto mb-4 text-gray-400' />
                <p className='text-lg font-semibold mb-2'>Camera Offline</p>
                <p className='text-sm text-gray-300'>Camera is not available</p>
              </div>
            )}
          </div>

          {/* Canvas for image processing (motion detection removed) */}
          <canvas
            ref={canvasRef}
            className='hidden'
          />
        </div>

        {/* Controls */}
        {showControls && (
          <div className='p-4 bg-gray-50 dark:bg-gray-900 border-t'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePlayPause}
                  disabled={!camera.isOnline || !camera.isActive}
                >
                  {isPlaying ? (
                    <IconPlayerPause className='h-4 w-4' />
                  ) : (
                    <IconPlayerPlay className='h-4 w-4' />
                  )}
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleMuteToggle}
                >
                  {isMuted ? (
                    <IconVolumeOff className='h-4 w-4' />
                  ) : (
                    <IconVolume2 className='h-4 w-4' />
                  )}
                </Button>

                <div className='flex items-center gap-2 min-w-[120px]'>
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className='flex-1'
                    disabled={isMuted}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-400 w-8'>
                    {volume}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleRefresh}
                >
                  <IconLoader className='h-4 w-4' />
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleFullscreenToggle}
                >
                  <IconMaximize className='h-4 w-4' />
                </Button>

              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}