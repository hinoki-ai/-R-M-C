import { NextRequest, NextResponse } from 'next/server'

import { WeatherService } from '@/lib/services/weather-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'Pinto Los Pellines, Chile'
    const type = searchParams.get('type') || 'current' // 'current' or 'forecast'

    if (!WeatherService.isConfigured()) {
      return NextResponse.json({
        error: 'Weather API not configured',
        message: 'OpenWeather API key is required'
      }, { status: 503 })
    }

    if (type === 'forecast') {
      const forecast = await WeatherService.getWeatherForecast(location)
      return NextResponse.json({
        success: true,
        data: forecast,
        location,
        type: 'forecast'
      })
    } else {
      const weather = await WeatherService.getCurrentWeather(location)
      if (!weather) {
        return NextResponse.json({
          error: 'Weather data unavailable',
          message: 'Could not fetch weather data for the specified location'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: weather,
        location,
        type: 'current'
      })
    }

  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to fetch weather data'
    }, { status: 500 })
  }
}