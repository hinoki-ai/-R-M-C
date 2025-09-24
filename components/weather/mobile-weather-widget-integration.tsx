'use client';

import { useRouter } from 'next/navigation';
import { MobileHomeWeatherWidget } from './mobile-home-weather-widget';
import { useWeatherData } from '@/hooks/use-weather-data';

interface MobileWeatherWidgetIntegrationProps {
  compact?: boolean;
  location?: string;
}

export function MobileWeatherWidgetIntegration({
  compact = false,
  location = 'Pinto Los Pellines, Ñuble',
}: MobileWeatherWidgetIntegrationProps) {
  const router = useRouter();
  const { weatherData, forecast, alerts, loading, error, addWeatherData } =
    useWeatherData(location);

  const handleRefresh = async () => {
    // Force refresh by clearing cache or triggering re-fetch
    // This will be handled by the useWeatherData hook's internal refresh logic
    window.location.reload();
  };

  const handleOpenFullWeather = () => {
    router.push('/dashboard/weather');
  };

  if (loading && !weatherData) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-12 bg-gray-300 rounded"></div>
            <div className="w-full h-12 bg-gray-300 rounded"></div>
            <div className="w-full h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <span className="text-sm text-red-700">
              Error cargando datos del clima
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <MobileHomeWeatherWidget
      weatherData={weatherData}
      forecastData={forecast}
      alerts={alerts}
      onRefresh={handleRefresh}
      onOpenFullWeather={handleOpenFullWeather}
      compact={compact}
    />
  );
}
