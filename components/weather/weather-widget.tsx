'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sprout,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/types/dashboard';

interface WeatherWidgetProps {
  compact?: boolean;
  showDetails?: boolean;
  weatherData?: WeatherData | null;
  forecastData?: any[] | null;
  showAgricultural?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const WeatherWidgetComponent: React.FC<WeatherWidgetProps> = ({
  compact = false,
  showDetails = true,
  weatherData,
  forecastData,
  showAgricultural = false,
  loading = false,
  error = null,
  onRetry
}) => {
  // Weather data will be fetched from real sources
  // For now, showing empty state until real weather data is available
  const currentWeather = weatherData;
  const forecast = forecastData;

  // Memoized agricultural insights for farming community
  const agriculturalInsights = useMemo(() => {
    if (!currentWeather || !forecast || !showAgricultural) return null;

    const insights = [];
    const today = forecast.find(
      f => f.date === new Date().toISOString().split('T')[0]
    );

    if (today?.evapotranspiration) {
      insights.push({
        type: 'evapotranspiration',
        value: today.evapotranspiration,
        message: `Evapotranspiracion: ${today.evapotranspiration} mm`,
        color: 'text-green-600',
      });
    }

    if ((currentWeather.uvIndex || 0) >= 8) {
      insights.push({
        type: 'uv_warning',
        value: currentWeather.uvIndex,
        message: 'Indice UV alto - proteger cultivos',
        color: 'text-orange-600',
      });
    }

    if (currentWeather.dewPoint && currentWeather.dewPoint > 10) {
      insights.push({
        type: 'humidity_risk',
        value: currentWeather.dewPoint,
        message: 'Riesgo enfermedades fungicas',
        color: 'text-blue-600',
      });
    }

    if (currentWeather.windGusts && currentWeather.windGusts > 20) {
      insights.push({
        type: 'wind_risk',
        value: currentWeather.windGusts,
        message: 'Viento fuerte - riesgo cosecha',
        color: 'text-red-600',
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  }, [currentWeather, forecast, showAgricultural]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
      </div>

      {/* Weather icon and temp skeleton */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse" />
      </div>

      {/* Weather details skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced error state with retry
  const ErrorState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Cloud className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        Error al cargar datos meteorológicos
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-xs mx-auto">
        {error || 'No se pudieron cargar los datos del clima. Verifica tu conexión a internet.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Cloud className="w-4 h-4 mr-2" />
          Reintentar
        </button>
      )}
    </div>
  );

  // Memoized weather icon function
  const getWeatherIcon = useMemo(() => (icon: string, size = 24) => {
    const iconClass = `w-${size} h-${size}`;
    switch (icon) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />;
    }
  }, []);

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardContent className="p-4">
          {currentWeather ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(currentWeather.icon, 6)}
                <div>
                  <div className="text-lg font-bold">
                    {currentWeather.temperature.toFixed(1)}°C
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentWeather.description}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 space-y-1">
                <div className="flex items-center justify-end space-x-1">
                  <Wind className="w-3 h-3" />
                  <span>{currentWeather.windSpeed.toFixed(1)} km/h</span>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <Droplets className="w-3 h-3" />
                  <span>{currentWeather.humidity}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Cloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-600">Clima no disponible</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <span>Clima Actual</span>
            {currentWeather && (
              <>
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-normal text-gray-600">
                  {currentWeather.location}
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : currentWeather ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Weather */}
              <div className="text-center md:col-span-1">
                <div className="text-5xl mb-2">
                  {getWeatherIcon(currentWeather.icon, 12)}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {currentWeather.temperature.toFixed(1)}°C
                </div>
                <p className="text-gray-600 dark:text-gray-400 capitalize text-sm">
                  {currentWeather.description}
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500">
                    Actualizado: {currentWeather.lastUpdated}
                  </p>
                </div>
              </div>

              {/* Weather Details */}
              {showDetails && (
                <div className="grid grid-cols-2 gap-3 md:col-span-2">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                    <div className="text-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-3">
                        <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentWeather.humidity}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Humedad
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                    <div className="text-center">
                      <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg w-fit mx-auto mb-3">
                        <Wind className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentWeather.windSpeed.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        km/h
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                    <div className="text-center">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg w-fit mx-auto mb-3">
                        <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentWeather.pressure.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        hPa
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                    <div className="text-center">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg w-fit mx-auto mb-3">
                        <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentWeather.visibility}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        km
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agricultural Insights */}
              {agriculturalInsights && agriculturalInsights.length > 0 && (
                <div className="md:col-span-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Sprout className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Informacion Agricola
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {agriculturalInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
                      >
                        <div className={`text-sm font-medium ${insight.color}`}>
                          {insight.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Datos meteorologicos no disponibles
              </h3>
              <p className="text-gray-600 text-sm">
                La informacion del clima se cargara desde fuentes oficiales
                proximamente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Memoized export to prevent unnecessary re-renders
export const WeatherWidget = memo(WeatherWidgetComponent);
