import { ConvexHttpClient } from 'convex/browser'
import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/convex/_generated/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

    // Get camera information
    const camera = await convex.query(api.cameras.getCameraById, { cameraId: id as any })

    if (!camera) {
      return new NextResponse('Camera not found', { status: 404 })
    }

    if (!camera.isActive || !camera.isOnline) {
      return new NextResponse('Camera is offline', { status: 503 })
    }

    // Camera is online but no stream available yet
    // Return a proper error response indicating camera is online but stream not configured
    return new NextResponse('Camera is online but stream not yet configured', {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('Camera stream error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}