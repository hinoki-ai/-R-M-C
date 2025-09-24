import { mutation } from '../_generated/server';

// No sample weather data - using only real weather data from actual API sources
const WEATHER_DATA: any[] = []; // Empty array - no sample data

// No sample weather alerts - using only real alerts from actual weather services
const WEATHER_ALERTS: any[] = []; // Empty array - no sample data

// No sample weather forecasts - using only real forecasts from actual weather services
const WEATHER_FORECASTS: any[] = []; // Empty array - no sample data

export const seedWeather = mutation({
  args: {},
  handler: async ctx => {
    console.log('✅ Weather seeding skipped - no sample data will be created');

    // Log the count of existing weather data (should be 0 or only real data)
    const existingWeatherData = await ctx.db.query('weatherData').collect();
    const existingAlerts = await ctx.db.query('weatherAlerts').collect();
    const existingForecasts = await ctx.db.query('weatherForecasts').collect();

    console.log(
      `📊 Existing weather data points in database: ${existingWeatherData.length}`
    );
    console.log(
      `📊 Existing weather alerts in database: ${existingAlerts.length}`
    );
    console.log(
      `📊 Existing weather forecasts in database: ${existingForecasts.length}`
    );

    return {
      seeded: 0,
      skipped: true,
      existingWeatherData: existingWeatherData.length,
      existingAlerts: existingAlerts.length,
      existingForecasts: existingForecasts.length,
      message: 'No sample weather data created - using only real weather data',
    };
  },
});
