'use client'

import { IconChevronLeft } from '@tabler/icons-react'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'


const CameraViewer = dynamic(() => import('@/components/camera/camera-viewer').then(mod => ({ default: mod.CameraViewer })), {
  ssr: false,
  loading: () => <div className='h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center'>Loading camera...</div>
})

export default function CameraViewPage() {
  const params = useParams()
  const cameraId = params.id as string

  const camera = useQuery(api.cameras.getCameraById, { cameraId: cameraId as any })

  if (!camera) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-4 mb-8'>
          <Button variant='outline' size='sm' asChild>
            <Link href='/dashboard/cameras'>
              <IconChevronLeft className='h-4 w-4 mr-2' />
              Back to Cameras
            </Link>
          </Button>
        </div>
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-4 w-1/2' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-64 w-full mb-4' />
              <div className='flex justify-between'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-4 mb-8'>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard/cameras'>
            <IconChevronLeft className='h-4 w-4 mr-2' />
            Back to Cameras
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Camera Viewer</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            View live feed and manage camera settings
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto'>
        <CameraViewer
          camera={camera}
          showControls={true}
          autoPlay={true}
          onEvent={(event, data) => {
            console.log('Camera event:', event, data)
            // Handle camera events here (motion detection, connection status, etc.)
          }}
        />
      </div>
    </div>
  )
}