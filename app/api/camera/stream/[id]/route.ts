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

    // Handle LS Vision camera streaming (O-Kamm only)
    if (camera.name.toLowerCase().includes('lsvision') || camera.name.toLowerCase().includes('ls vision')) {
      // Extract camera number from name (e.g., "Cámara LS Vision 2" -> 2)
      const cameraNumberMatch = camera.name.match(/(\d+)(?:\s*-\s*Pinto Los Pellines)?$/);
      const cameraNumber = cameraNumberMatch ? parseInt(cameraNumberMatch[1]) : 1;

      // Get the appropriate UID based on camera number
      const uidKey = cameraNumber === 1 ? 'LSVISION_UID' : `LSVISION_UID_${cameraNumber}`;
      const lsvisionUid = process.env[uidKey];

      if (!lsvisionUid) {
        return new NextResponse(`LS Vision O-Kamm UID not configured for camera ${cameraNumber} (${uidKey})`, {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }

      // Use O-Kamm cloud streaming exclusively
      const okammStreamUrl = `https://api.o-kamm.com/stream/${lsvisionUid}/live.m3u8`;

      return new NextResponse(JSON.stringify({
        streamUrl: okammStreamUrl,
        type: 'hls',
        camera: camera.name,
        cameraNumber,
        provider: 'o-kamm',
        uid: lsvisionUid,
        access: 'view-only',
        message: `O-Kamm HLS stream for camera ${cameraNumber} - community viewing`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
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