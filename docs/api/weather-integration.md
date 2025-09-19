# Weather System Setup Guide

## Overview

The Junta de Vecinos app includes a comprehensive weather system that provides real-time weather data, forecasts, and alerts for the community. The system integrates with real weather APIs to provide accurate, live data for the Pinto Los Pellines community.

## Features

- 🌤️ **Current Weather**: Real-time temperature, humidity, wind, and more
- 📅 **7-Day Forecast**: Detailed weather predictions
- ⚠️ **Weather Alerts**: Storm warnings and safety notifications
- 📊 **Analytics**: Historical weather statistics and trends
- 🌱 **Community Impact**: How weather affects community activities
- 📱 **Mobile Optimized**: Works perfectly on both web and mobile apps

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# Weather API (Optional - for real weather data)
# Get your free API key from: https://openweathermap.org/api
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional: Custom location for weather data
NEXT_PUBLIC_DEFAULT_LOCATION=Pinto Los Pellines, Ñuble
```

### 2. Get OpenWeather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Create a new API key
5. Copy the API key to your `.env.local` file

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

3. With API key configured, you'll see real weather data for Pinto Los Pellines
4. Weather data will only display when real API data is available

## System Architecture

### Components

- **Weather Page** (`app/dashboard/weather/page.tsx`): Main weather interface
- **Weather Service** (`lib/weather-service.ts`): API integration service
- **Weather Hook** (`hooks/use-weather-data.ts`): Data management hook
- **Weather Components**: Alert manager and data manager components

### Data Flow

1. **Real-time Data**: Fetched from OpenWeather API every 30 minutes
2. **Caching**: Data stored in Convex for offline access
3. **Reliability**: System only displays data when real API data is available
4. **Mobile Sync**: Same real-time data available on web and mobile apps

### API Endpoints

The system integrates with:
- **OpenWeather Current Weather API**: Real-time weather data
- **OpenWeather Forecast API**: 7-day weather predictions
- **OpenWeather Geocoding API**: Location coordinate conversion

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
- **API**: Real weather data from OpenWeather
- **Manual**: Manually entered data by administrators
- **Sensor**: Data from local weather sensors (future integration)

## Troubleshooting

### Common Issues

1. **No Weather Data Showing**
   - Check if OpenWeather API key is configured
   - Verify API key is valid and has quota remaining
   - Check browser console for error messages

2. **Mobile App Issues**
   - Ensure Capacitor is properly configured
   - Check network permissions
   - Verify mobile build is up to date

3. **Performance Issues**
   - Weather data refreshes every 30 minutes
   - Check Convex database performance
   - Monitor API rate limits

### Debug Mode

Enable debug logging by setting:
```bash
NEXT_PUBLIC_WEATHER_DEBUG=true
```

## Security Considerations

- API keys are stored securely in environment variables
- Weather data is cached locally for offline access
- No sensitive user data is transmitted to weather APIs
- All data transmission uses HTTPS

## Future Enhancements

- **Weather Radar**: Integration with weather radar data
- **Historical Analysis**: Advanced weather trend analysis
- **Custom Alerts**: Location-specific weather notifications
- **Weather Cameras**: Integration with community weather cameras
- **IoT Sensors**: Connection to local weather sensor networks

## Support

For issues with the weather system:
1. Check the browser console for error messages
2. Verify API key configuration
3. Review the Convex dashboard for data issues
4. Check network connectivity

## API Limits

OpenWeather free tier includes:
- 1,000 API calls per day
- Current weather and 5-day forecast
- Basic weather data (no radar or historical data)

For higher usage, consider upgrading to a paid plan.