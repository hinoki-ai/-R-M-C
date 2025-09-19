'use client'

import { IconEye, IconChevronLeft, IconPlus } from '@tabler/icons-react'
import { useMutation } from 'convex/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { useToast } from '@/hooks/use-toast'

export default function AddCameraPage() {
  const router = useRouter()
  const { toast } = useToast()
  const addCamera = useMutation(api.cameras.addCamera)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    model: '',
    ipAddress: '',
    location: '',
    streamUrl: '',
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.ipAddress || !formData.streamUrl) {
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the validation errors before submitting.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const cameraData = {
        name: formData.name,
        description: formData.description || undefined,
        location: formData.location || undefined,
        streamUrl: formData.streamUrl || `rtsp://${formData.ipAddress}/stream`,
        resolution: undefined,
        frameRate: undefined,
        hasAudio: false,
      }

      const cameraId = await addCamera(cameraData)

      toast({
        title: 'Camera Added Successfully',
        description: `${formData.name} has been added to your security network.`,
      })

      router.push(`/dashboard/cameras/${cameraId}`)
    } catch (error) {
      console.error('Error adding camera:', error)
      toast({
        title: 'Error Adding Camera',
        description: 'Failed to add camera. Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className='text-3xl font-bold flex items-center gap-3'>
            <IconPlus className='h-8 w-8' />
            Add IP Camera
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Configure a new IP camera for your security network
          </p>
        </div>
      </div>

      <div className='max-w-4xl'>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconEye className='h-5 w-5' />
              IP Camera Configuration
            </CardTitle>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Basic camera configuration - complex features have been removed for simplicity
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Camera Name *</Label>
                  <Input
                    id='name'
                    placeholder='Camera name'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    placeholder='Front Entrance'
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Camera Brand */}
              <div className='space-y-2'>
                <Label htmlFor='brand'>Camera Brand</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select camera brand' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='hikvision'>Hikvision</SelectItem>
                    <SelectItem value='dahua'>Dahua</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Camera Model */}
              <div className='space-y-2'>
                <Label htmlFor='model'>Camera Model</Label>
                <Input
                  id='model'
                  placeholder='Camera model'
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  placeholder='Optional description of the camera...'
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Network Configuration */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Network Configuration</h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='ipAddress'>IP Address *</Label>
                    <Input
                      id='ipAddress'
                      placeholder='IP address'
                      value={formData.ipAddress}
                      onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='streamUrl'>Stream URL *</Label>
                    <Input
                      id='streamUrl'
                      placeholder='rtsp://ip-address/stream'
                      value={formData.streamUrl}
                      onChange={(e) => handleInputChange('streamUrl', e.target.value)}
                      required
                    />
                    <p className='text-xs text-gray-500'>RTSP or HTTP stream URL for the camera feed</p>
                  </div>
                </div>
              </div>

              <div className='flex gap-4 pt-6'>
                <Button type='submit' disabled={loading} className='flex-1'>
                  {loading ? 'Adding Camera...' : 'Add Camera'}
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link href='/dashboard/cameras'>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
