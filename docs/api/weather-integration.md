# Weather System Setup Guide

## Overview

The Junta de Vecinos app includes a comprehensive weather system that provides real-time weather data, forecasts, and alerts for the community. The system integrates with the free Open-Meteo API to provide accurate, live weather data for the Pinto Los Pellines community.

## Features

- 🌤️ **Current Weather**: Real-time temperature, humidity, wind, and more
- 📅 **7-Day Forecast**: Detailed weather predictions with historical data
- ⚠️ **Weather Alerts**: Storm warnings and safety notifications
- 📊 **Analytics**: Historical weather statistics and trends
- 🌱 **Community Impact**: How weather affects community activities
- 📱 **Mobile Optimized**: Works perfectly on both web and mobile apps
- 🚀 **Free & Unlimited**: No API keys required, powered by Open-Meteo

## Setup Instructions

### 1. Environment Configuration

The weather system uses Open-Meteo API which is completely free and requires no API keys. No environment variables are needed for basic functionality.

However, you can optionally configure:

```bash
# Optional: Custom location for weather data
NEXT_PUBLIC_DEFAULT_LOCATION=Pinto Los Pellines, Ñuble
```

### 2. Open-Meteo API

The system automatically uses the free Open-Meteo API:

- **No API Key Required**: Completely free weather data
- **No Rate Limits**: Unlimited requests for non-commercial use
- **Global Coverage**: Weather data for any location worldwide
- **Reliable Source**: Meteorological data from national weather services

### 3. Database Setup

The weather system uses Convex for data storage. The database schema is already configured with the following tables:

- `weatherData`: Current and historical weather data
- `weatherAlerts`: Weather alerts and warnings
- `weatherForecasts`: Weather forecast data

### 4. Testing the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/weather`

3. You'll immediately see real weather data for Pinto Los Pellines (no API key needed)
4. The system provides live weather data powered by Open-Meteo

## System Architecture

### Components

- **Weather Page** (`app/dashboard/weather/page.tsx`): Main weather interface
- **Weather Service** (`lib/services/weather-service.ts`): Open-Meteo API integration service
- **Weather Hook** (`hooks/use-weather-data.ts`): Data management hook
- **Weather Components**: Alert manager and data manager components

### Data Flow

1. **Real-time Data**: Fetched from Open-Meteo API with intelligent caching
2. **Caching**: 15-minute in-memory cache to reduce API calls and improve performance
3. **Reliability**: Robust error handling ensures the system works even during API outages
4. **Mobile Sync**: Same real-time data available on web and mobile apps

### API Endpoints

The system integrates with:

- **Open-Meteo Current Weather API**: Real-time weather data (temperature, humidity, wind, etc.)
- **Open-Meteo Forecast API**: 7-day weather predictions with historical data
- **Automatic Location**: Fixed to Pinto Los Pellines coordinates for consistent data

## Mobile Integration

The weather system is fully integrated with Capacitor for mobile apps:

- **iOS App**: Works with Capacitor iOS
- **Android App**: Works with Capacitor Android
- **PWA Support**: Installable web app with offline capabilities
- **Native Features**: Location services and push notifications

## Customization

### Location Configuration

You can customize the weather location by:

1. Setting the `NEXT_PUBLIC_DEFAULT_LOCATION` environment variable
2. Modifying the location in the weather hook
3. Adding location selection in the UI

### Weather Alerts

Weather alerts can be:

- **Automatic**: Generated from weather API data
- **Manual**: Created by administrators
- **Custom**: Configured for specific community needs

### Data Sources

The system integrates with verified data sources:

- **API**: Real weather data from Open-Meteo (free, unlimited)
- **Manual**: Manually entered data by administrators
- **Sensor**: Data from local weather sensors (future integration)

## Troubleshooting

### Common Issues

1. **No Weather Data Showing**
   - Check network connectivity to open-meteo.com
   - Verify the API endpoint is accessible
   - Check browser console for error messages

2. **Mobile App Issues**
   - Ensure Capacitor is properly configured
   - Check network permissions
   - Verify mobile build is up to date

3. **Performance Issues**
   - Weather data is cached for 15 minutes to improve performance
   - Check browser network tab for slow API responses
   - Monitor cache usage with WeatherService.getCacheStats()

### Debug Mode

Enable debug logging by setting:

```bash
NEXT_PUBLIC_WEATHER_DEBUG=true
```

## Security Considerations

- **No API Keys Required**: Open-Meteo is completely free and requires no authentication
- Weather data is cached locally for offline access
- No sensitive user data is transmitted to weather APIs
- All data transmission uses HTTPS
- Rate limiting protects against abuse while allowing legitimate use

## Future Enhancements

- **Weather Radar**: Integration with weather radar data
- **Historical Analysis**: Advanced weather trend analysis
- **Custom Alerts**: Location-specific weather notifications
- **Weather Cameras**: Integration with community weather cameras
- **IoT Sensors**: Connection to local weather sensor networks

## Support

For issues with the weather system:

1. Check the browser console for error messages
2. Verify network connectivity to open-meteo.com
3. Check the WeatherService.getCacheStats() for cache status
4. Review API response times and error handling

## API Limits

**Open-Meteo has NO limits for non-commercial use:**

- Unlimited API calls
- All weather data freely available
- No registration or API keys required
- Global weather coverage
- Historical data included

This makes it perfect for community applications like Junta de Vecinos.
