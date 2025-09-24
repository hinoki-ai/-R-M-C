'use client';

import { motion } from 'framer-motion';
import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
  Zap,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherAlert, WeatherData, WeatherForecast } from '@/types/dashboard';
import { useMobilePerformance } from '@/lib/hooks/use-mobile-performance';

interface MobileHomeWeatherWidgetProps {
  weatherData?: WeatherData | null;
  forecastData?: WeatherForecast[] | null;
  onRefresh?: () => void;
  onOpenFullWeather?: () => void;
  compact?: boolean;
  alerts?: WeatherAlert[] | null;
}

// Mock hourly data - in real implementation this would come from API
interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
  precipitationChance: number;
}

const mockHourlyData: HourlyForecast[] = [
  { time: 'Ahora', temperature: 18, icon: 'sunny', precipitationChance: 0 },
  {
    time: '14:00',
    temperature: 20,
    icon: 'partly-cloudy',
    precipitationChance: 10,
  },
  { time: '15:00', temperature: 22, icon: 'sunny', precipitationChance: 0 },
  { time: '16:00', temperature: 23, icon: 'sunny', precipitationChance: 5 },
  {
    time: '17:00',
    temperature: 21,
    icon: 'partly-cloudy',
    precipitationChance: 15,
  },
  { time: '18:00', temperature: 19, icon: 'cloudy', precipitationChance: 20 },
  { time: '19:00', temperature: 17, icon: 'cloudy', precipitationChance: 25 },
  { time: '20:00', temperature: 16, icon: 'rain', precipitationChance: 60 },
];

export function MobileHomeWeatherWidget({
  weatherData,
  forecastData,
  onRefresh,
  onOpenFullWeather,
  compact = false,
  alerts = [],
}: MobileHomeWeatherWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [now, setNow] = useState(new Date());

  // Battery and performance info (mobile-aware)
  const { batteryInfo } = useMobilePerformance();

  const currentWeather = weatherData;
  const forecast = forecastData?.slice(0, 7); // 7-day forecast

  const getWeatherIcon = (icon: string, size = 24) => {
    const iconClass = `w-${size} h-${size}`;
    switch (icon?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'partly-cloudy':
      case 'partly_cloudy':
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setLastUpdated(new Date());
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        handleRefresh();
      },
      30 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  // Clock tick (update every 30s for smooth display without battery drain)
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeDisplay = useMemo(() => {
    return now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }, [now]);

  // Battery indicator helpers
  const batteryLevelPercent = Math.round((batteryInfo?.level ?? 0) * 100);
  const isCharging = !!batteryInfo?.charging;
  const batteryColor = batteryInfo
    ? batteryLevelPercent <= 20 && !isCharging
      ? 'text-red-500'
      : batteryLevelPercent <= 50 && !isCharging
        ? 'text-yellow-500'
        : 'text-emerald-500'
    : 'text-gray-400';

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Ñuble</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600" title="Hora actual">
                  {timeDisplay}
                </span>
                {batteryInfo && (
                  <span
                    className={`text-xs ${batteryColor} flex items-center`}
                    title={isCharging ? 'Cargando' : 'Batería'}
                  >
                    {isCharging ? '⚡' : '🔋'} {batteryLevelPercent}%
                  </span>
                )}
                <button
                  onClick={handleRefresh}
                  title="Actualizar clima"
                  aria-label="Actualizar datos del clima"
                  className={`p-1 rounded-full transition-colors ${
                    isRefreshing
                      ? 'animate-spin text-blue-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Emergency prompt (compact) */}
            {alerts && alerts.length > 0 && (
              <div className="mb-3 p-2 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                ⚠️ {alerts[0].title}
              </div>
            )}

            {currentWeather ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {getWeatherIcon(currentWeather.icon, 8)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentWeather.temperature.toFixed(0)}°
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {currentWeather.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    ST: {currentWeather.feelsLike?.toFixed(0)}°
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Wind className="w-3 h-3" />
                    <span>{currentWeather.windSpeed.toFixed(0)} km/h</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="animate-pulse flex items-center space-x-2">
                  <Cloud className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Cargando...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Pinto Los Pellines, Ñuble</span>
            </div>
            <button
              onClick={handleRefresh}
              title="Actualizar clima"
              aria-label="Actualizar datos del clima"
              className={`p-1 rounded-full transition-colors ${
                isRefreshing ? 'animate-spin' : 'hover:bg-white/20'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {/* Big clock and battery */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold tracking-tight" aria-label="Hora actual">
              {timeDisplay}
            </div>
            {batteryInfo && (
              <div className={`text-sm ${batteryColor}`} aria-label={isCharging ? 'Cargando' : 'Batería'}>
                {isCharging ? '⚡ Cargando' : '🔋'} {batteryLevelPercent}%
              </div>
            )}
          </div>

          {currentWeather ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">
                  {getWeatherIcon(currentWeather.icon, 12)}
                </div>
                <div>
                  <div className="text-4xl font-bold">
                    {currentWeather.temperature.toFixed(0)}°C
                  </div>
                  <div className="text-sm opacity-90 capitalize">
                    {currentWeather.description}
                  </div>
                  <div className="text-sm opacity-75">
                    ST: {currentWeather.feelsLike?.toFixed(0)}°C
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75 mb-1">
                  Actualizado: {formatTime(lastUpdated)}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  <Wind className="w-3 h-3 mr-1" />
                  {currentWeather.windSpeed.toFixed(0)} km/h
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse flex items-center space-x-2">
                <Cloud className="w-8 h-8" />
                <span>Cargando clima...</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-0">
          {/* Emergency prompt */}
          {alerts && alerts.length > 0 && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-red-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>⚠️</span>
                <span className="font-medium truncate">{alerts[0].title}</span>
              </div>
              <button
                onClick={onOpenFullWeather}
                className="text-sm underline text-red-700 hover:text-red-900"
              >
                Ver detalles
              </button>
            </div>
          )}

          {/* Hourly Forecast */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Próximas horas
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {mockHourlyData.map((hour, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center min-w-0 space-y-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xs text-gray-600 font-medium">
                    {hour.time}
                  </span>
                  <div className="text-lg">{getWeatherIcon(hour.icon, 6)}</div>
                  <span className="text-sm font-semibold text-gray-900">
                    {hour.temperature}°
                  </span>
                  {hour.precipitationChance > 0 && (
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">
                        {hour.precipitationChance}%
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Forecast */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Thermometer className="w-4 h-4 mr-2" />
              Pronóstico 6 días
            </h3>
            <div className="space-y-2">
              {forecast?.slice(0, 6).map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 min-w-0">
                      {index === 0
                        ? 'Hoy'
                        : index === 1
                          ? 'Mañana'
                          : new Date(day.date).toLocaleDateString('es-CL', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                    </span>
                    <div className="text-lg">{getWeatherIcon(day.icon, 6)}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {day.precipitationProbability > 0 && (
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">
                          {day.precipitationProbability}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-semibold text-gray-900">
                        {day.tempMax}°
                      </span>
                      <span className="text-gray-500">{day.tempMin}°</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          {currentWeather && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-gray-900">
                    {currentWeather.humidity}%
                  </div>
                  <div className="text-xs text-gray-600">Humedad</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <Eye className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-gray-900">
                    {currentWeather.visibility?.toFixed?.(1) ?? currentWeather.visibility} km
                  </div>
                  <div className="text-xs text-gray-600">Visibilidad</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <Wind className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-gray-900">
                    {currentWeather.pressure.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-600">hPa</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-gray-900">
                    {currentWeather.uvIndex?.toFixed(0) || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">UV</div>
                </div>
              </div>
            </div>
          )}

          {/* Tap to Open Full Weather */}
          <div
            className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-center cursor-pointer hover:from-blue-100 hover:to-cyan-100 transition-colors"
            onClick={onOpenFullWeather}
          >
            <span className="text-sm font-medium text-blue-700">
              Ver pronóstico completo →
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
