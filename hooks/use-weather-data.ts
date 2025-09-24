import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { WeatherService } from '@/lib/services/weather-service';
import { WeatherAlert, WeatherData, WeatherForecast } from '@/types/dashboard';
import { useConvexQueryWithError } from '@/hooks/use-convex-error-handler';

interface WeatherStats {
  total: number;
  averageTemperature: number;
  averageHumidity: number;
  totalAlerts: number;
  activeAlerts: number;
}

interface WeatherMutationData {
  timestamp: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  description: string;
  icon: string;
  feelsLike: number;
  dewPoint: number;
  cloudCover: number;
  location: string;
  source: 'api' | 'manual' | 'sensor';
}

interface WeatherAlertData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  type: 'storm' | 'heat' | 'cold' | 'flood' | 'wind' | 'other';
  startTime: number;
  endTime: number;
  areas: string[];
  instructions: string;
}

interface WeatherForecastData {
  date: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  location: string;
  source: 'api' | 'manual';
}

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  forecast: WeatherForecast[] | null;
  alerts: WeatherAlert[] | null;
  loading: boolean;
  error: string | null;
  stats: WeatherStats | null;
  // Mutations
  addWeatherData: (data: WeatherMutationData) => Promise<string>;
  updateWeatherData: (
    id: string,
    updates: Partial<WeatherMutationData>
  ) => Promise<void>;
  deleteWeatherData: (id: string) => Promise<void>;
  createAlert: (alert: WeatherAlertData) => Promise<string>;
  updateAlert: (
    id: string,
    updates: Partial<WeatherAlertData>
  ) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  addForecast: (forecast: WeatherForecastData) => Promise<string>;
  updateForecast: (
    id: string,
    updates: Partial<WeatherForecastData>
  ) => Promise<void>;
  deleteForecast: (id: string) => Promise<void>;
}

export function useWeatherData(
  location = 'Pinto Los Pellines, Ñuble'
): UseWeatherDataReturn {
  const [realWeatherData, setRealWeatherData] = useState<WeatherData | null>(
    null
  );
  const [realForecast, setRealForecast] = useState<WeatherForecast[] | null>(
    null
  );
  const [isLoadingRealData, setIsLoadingRealData] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [fetchErrorCount, setFetchErrorCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  // Use comprehensive error handling for all Convex operations
  const weatherDataQuery = useConvexQueryWithError(
    api.weather.getCurrentWeather,
    {
      location,
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
    }
  );

  const forecastQuery = useConvexQueryWithError(
    api.weather.getWeatherForecasts,
    {
      location,
      days: 7,
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
    }
  );

  const alertsQuery = useConvexQueryWithError(
    api.weather.getWeatherAlerts,
    {
      activeOnly: true,
      limit: 10,
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
    }
  );

  const statsQuery = useConvexQueryWithError(
    api.weather.getWeatherStats,
    {
      location,
      days: 30,
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
    }
  );

  // Extract data and errors from queries
  const storedWeatherData = weatherDataQuery.data;
  const storedForecast = forecastQuery.data;
  const alerts = alertsQuery.data;
  const stats = statsQuery.data;

  // Combine errors from all queries
  const hasQueryErrors =
    weatherDataQuery.isError ||
    forecastQuery.isError ||
    alertsQuery.isError ||
    statsQuery.isError;
  const queryError =
    weatherDataQuery.error ||
    forecastQuery.error ||
    alertsQuery.error ||
    statsQuery.error;

  // Mutations
  const addWeatherDataMutation = useMutation(api.weather.addWeatherData);
  const updateWeatherDataMutation = useMutation(api.weather.updateWeatherData);
  const deleteWeatherDataMutation = useMutation(api.weather.deleteWeatherData);
  const createAlertMutation = useMutation(api.weather.createWeatherAlert);
  const updateAlertMutation = useMutation(api.weather.updateWeatherAlert);
  const deleteAlertMutation = useMutation(api.weather.deleteWeatherAlert);
  const addForecastMutation = useMutation(api.weather.addWeatherForecast);
  const updateForecastMutation = useMutation(api.weather.updateWeatherForecast);
  const deleteForecastMutation = useMutation(api.weather.deleteWeatherForecast);

  // Use real data if available, otherwise fallback to stored data
  const weatherData = realWeatherData || storedWeatherData;
  const forecast = realForecast || storedForecast;

  // Calculate stats from current data
  const calculatedStats: WeatherStats | null =
    weatherData && forecast && alerts
      ? {
          total: 1,
          averageTemperature: (weatherData as any).temperature,
          averageHumidity: (weatherData as any).humidity,
          totalAlerts: Array.isArray(alerts) ? alerts.length : 0,
          activeAlerts: Array.isArray(alerts)
            ? alerts.filter((alert: WeatherAlert) => alert.isActive).length
            : 0,
        }
      : null;

  // Smart weather data fetching with caching and optimization
  const fetchRealWeatherData = useCallback(async (force = false) => {
    if (!WeatherService.isConfigured()) return;

    // Smart caching: don't fetch if data is fresh (within 30 minutes) unless forced
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    const cacheDuration = 30 * 60 * 1000; // 30 minutes

    if (!force && timeSinceLastFetch < cacheDuration && realWeatherData) {
      return;
    }

    // Exponential backoff for failed requests
    if (fetchErrorCount > 0) {
      const backoffDelay = Math.min(1000 * Math.pow(2, fetchErrorCount), 30000);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }

    setIsLoadingRealData(true);
    try {
      const [currentWeather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(location),
        WeatherService.getWeatherForecast(location),
      ]);

      if (currentWeather) {
        setRealWeatherData({
          id: 'real-time',
          timestamp: currentWeather.lastUpdated,
          temperature: currentWeather.temperature,
          humidity: currentWeather.humidity ?? 0,
          pressure: currentWeather.pressure ?? 1013,
          windSpeed: currentWeather.windSpeed ?? 0,
          windDirection: currentWeather.windDirection ?? 0,
          precipitation: currentWeather.precipitation,
          uvIndex: currentWeather.uvIndex ?? 0,
          visibility: currentWeather.visibility ?? 10000,
          description: currentWeather.description ?? '',
          icon: currentWeather.icon ?? '',
          feelsLike: currentWeather.feelsLike ?? currentWeather.temperature,
          dewPoint: currentWeather.dewPoint ?? currentWeather.temperature,
          cloudCover: currentWeather.cloudCover ?? 0,
          location: currentWeather.location,
          source: 'api',
          isHistorical: false,
        });

        // Store in database for caching (only on success)
        try {
          await addWeatherDataMutation({
            timestamp: Date.now(),
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity ?? 0,
            pressure: currentWeather.pressure ?? 1013,
            windSpeed: currentWeather.windSpeed ?? 0,
            windDirection: currentWeather.windDirection ?? 0,
            precipitation: currentWeather.precipitation,
            uvIndex: currentWeather.uvIndex ?? 0,
            visibility: currentWeather.visibility ?? 10000,
            description: currentWeather.description ?? '',
            icon: currentWeather.icon ?? '',
            feelsLike: currentWeather.feelsLike ?? currentWeather.temperature,
            dewPoint: currentWeather.dewPoint ?? currentWeather.temperature,
            cloudCover: currentWeather.cloudCover ?? 0,
            location: currentWeather.location,
            source: 'api',
          });
        } catch (error) {
          console.warn('Failed to store weather data in database:', error);
          // Don't fail the whole operation for database storage issues
        }
      }

      if (forecastData && forecastData.length > 0) {
        const forecastArray: WeatherForecast[] = forecastData.map(
          (item, index) => ({
            id: `forecast-${index}`,
            date: item.date,
            tempMin: item.tempMin ?? 0,
            tempMax: item.tempMax ?? 0,
            humidity: item.humidity ?? 0,
            precipitation: item.precipitation,
            precipitationProbability: item.precipitationProbability,
            windSpeed: item.windSpeed ?? 0,
            windDirection: item.windDirection ?? 0,
            description: item.description ?? '',
            icon: item.icon ?? '',
            uvIndex: item.uvIndex ?? 0,
            sunrise: item.sunrise,
            sunset: item.sunset,
            location: location,
            source: 'api',
            updatedAt: new Date().toISOString(),
          })
        );

        setRealForecast(forecastArray);

        // Store forecast data in database (only on success)
        for (const forecast of forecastData) {
          try {
            await addForecastMutation({
              date: forecast.date,
              tempMin: forecast.tempMin ?? 0,
              tempMax: forecast.tempMax ?? 0,
              humidity: forecast.humidity ?? 0,
              precipitation: forecast.precipitation,
              precipitationProbability: forecast.precipitationProbability,
              windSpeed: forecast.windSpeed ?? 0,
              windDirection: forecast.windDirection ?? 0,
              description: forecast.description ?? '',
              icon: forecast.icon ?? '',
              uvIndex: forecast.uvIndex ?? 0,
              sunrise: forecast.sunrise,
              sunset: forecast.sunset,
              location: location,
              source: 'api',
            });
          } catch (error) {
            console.warn('Failed to store forecast data in database:', error);
            // Continue with other forecasts
          }
        }
      }

      // Reset error count on successful fetch
      setFetchErrorCount(0);
      setLastFetchTime(now);

    } catch (error) {
      console.error('Error fetching real weather data:', error);
      setFetchErrorCount(prev => prev + 1);

      // Don't show error state for temporary network issues, let cached data persist
      if (fetchErrorCount >= 3) {
        console.warn('Multiple weather fetch failures, keeping cached data');
      }
    } finally {
      setIsLoadingRealData(false);
    }
  }, [location, lastFetchTime, realWeatherData, fetchErrorCount, addWeatherDataMutation, addForecastMutation]);

  // Visibility API integration and smart refresh
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && intervalRef.current) {
        // Fetch fresh data when tab becomes visible
        fetchRealWeatherData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchRealWeatherData]);

  // Initial fetch and smart refresh interval
  useEffect(() => {
    // Initial fetch
    fetchRealWeatherData();

    // Smart refresh: only when tab is visible, with longer intervals
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (isVisibleRef.current) {
          fetchRealWeatherData();
        }
      }, 45 * 60 * 1000); // 45 minutes - balances freshness with API limits
    };

    setupInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location, fetchRealWeatherData]);

  // Loading states - include query loading states
  const queryLoading =
    weatherDataQuery.isLoading ||
    forecastQuery.isLoading ||
    alertsQuery.isLoading ||
    statsQuery.isLoading;

  const loading =
    (!weatherData && !storedWeatherData) ||
    (!forecast && !storedForecast) ||
    !alerts ||
    !stats ||
    isLoadingRealData ||
    queryLoading;

  // Combine all errors
  const error = hasQueryErrors
    ? queryError?.message || 'Error loading weather data'
    : null;

  // Helper function to safely create date strings
  const safeDateString = (dateValue: any): string => {
    try {
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        return new Date(dateValue).toISOString();
      }
      if (dateValue && typeof dateValue === 'object' && dateValue.toISOString) {
        return dateValue.toISOString();
      }
      return new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    // Type assertions to handle Convex query result types
    weatherData: weatherData
      ? ({
          ...(weatherData as any),
          id: 'real-time',
          timestamp: safeDateString(
            (weatherData as any).timestamp || (weatherData as any).createdAt
          ),
        } as WeatherData)
      : null,
    forecast: Array.isArray(forecast)
      ? forecast.map((f: any, index: number) => ({
          ...f,
          id: f.id || `forecast-${index}`,
          updatedAt: safeDateString(f.updatedAt || f.createdAt),
        }))
      : [],
    alerts: Array.isArray(alerts)
      ? alerts.map((a: any, index: number) => ({
          ...a,
          id: a.id || `alert-${index}`,
          startTime: safeDateString(a.startTime || a.createdAt),
          endTime: safeDateString(a.endTime || a.createdAt),
          createdAt: safeDateString(a.createdAt),
        }))
      : [],
    loading,
    error,
    stats: calculatedStats,
    // Mutations
    addWeatherData: async (data: WeatherMutationData) => {
      try {
        return await addWeatherDataMutation(data);
      } catch (error) {
        throw new Error(
          `Failed to add weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    updateWeatherData: async (
      id: string,
      updates: Partial<WeatherMutationData>
    ) => {
      try {
        await updateWeatherDataMutation({ id: id as any, updates });
      } catch (error) {
        throw new Error(
          `Failed to update weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    deleteWeatherData: async (id: string) => {
      try {
        await deleteWeatherDataMutation({ id: id as any });
      } catch (error) {
        throw new Error(
          `Failed to delete weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    createAlert: async (alert: WeatherAlertData) => {
      try {
        return await createAlertMutation(alert);
      } catch (error) {
        throw new Error(
          `Failed to create alert: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    updateAlert: async (id: string, updates: Partial<WeatherAlertData>) => {
      try {
        await updateAlertMutation({ id: id as any, updates });
      } catch (error) {
        throw new Error(
          `Failed to update alert: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    deleteAlert: async (id: string) => {
      try {
        await deleteAlertMutation({ id: id as any });
      } catch (error) {
        throw new Error(
          `Failed to delete alert: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    addForecast: async (forecast: WeatherForecastData) => {
      try {
        return await addForecastMutation(forecast);
      } catch (error) {
        throw new Error(
          `Failed to add forecast: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    updateForecast: async (
      id: string,
      updates: Partial<WeatherForecastData>
    ) => {
      try {
        await updateForecastMutation({ id: id as any, updates });
      } catch (error) {
        throw new Error(
          `Failed to update forecast: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    deleteForecast: async (id: string) => {
      try {
        await deleteForecastMutation({ id: id as any });
      } catch (error) {
        throw new Error(
          `Failed to delete forecast: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  };
}
