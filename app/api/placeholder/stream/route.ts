import { NextResponse } from 'next/server'

// Force static generation for compatibility with export
export const dynamic = 'force-static'

// This endpoint has been removed - no placeholder data should be served
export async function GET() {
  return NextResponse.json({
    error: 'This endpoint has been disabled - no placeholder data is served',
    status: 'disabled',
    message: 'All data must come from real sources only'
  }, { status: 410 }) // 410 Gone - resource is no longer available
}