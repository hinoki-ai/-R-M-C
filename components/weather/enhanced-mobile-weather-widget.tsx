'use client';

import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData, WeatherForecast } from '@/types/dashboard';

interface EnhancedMobileWeatherWidgetProps {
  weatherData?: WeatherData | null;
  forecastData?: WeatherForecast[] | null;
  alerts?: any[] | null;
  onRefresh?: () => void;
  onOpenFullWeather?: () => void;
  compact?: boolean;
}

type ViewMode = 'current' | 'hourly' | 'daily' | 'alerts';

export function EnhancedMobileWeatherWidget({
  weatherData,
  forecastData,
  alerts = [],
  onRefresh,
  onOpenFullWeather,
  compact = false,
}: EnhancedMobileWeatherWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('current');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date());
  }, []);

  const currentWeather = weatherData;
  const forecast = forecastData?.slice(0, 7);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

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

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset } = info;

    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0) {
        // Swipe right - previous view
        setSwipeDirection('right');
        switch (viewMode) {
          case 'current':
            setViewMode('alerts');
            break;
          case 'hourly':
            setViewMode('current');
            break;
          case 'daily':
            setViewMode('hourly');
            break;
          case 'alerts':
            setViewMode('daily');
            break;
        }
      } else {
        // Swipe left - next view
        setSwipeDirection('left');
        switch (viewMode) {
          case 'current':
            setViewMode('hourly');
            break;
          case 'hourly':
            setViewMode('daily');
            break;
          case 'daily':
            setViewMode('alerts');
            break;
          case 'alerts':
            setViewMode('current');
            break;
        }
      }
    }

    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 300);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Mock hourly data
  const mockHourlyData = [
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

  const renderCurrentWeather = () => (
    <div className="p-4">
      {currentWeather ? (
        <div className="text-center">
          <div className="text-6xl mb-3">
            {getWeatherIcon(currentWeather.icon, 16)}
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {currentWeather.temperature.toFixed(0)}°C
          </div>
          <div className="text-sm text-gray-600 capitalize mb-2">
            {currentWeather.description}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            ST: {currentWeather.feelsLike?.toFixed(0)}°C
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-semibold">
                {currentWeather.windSpeed.toFixed(0)} km/h
              </div>
              <div className="text-xs text-gray-600">Viento</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-lg font-semibold">
                {currentWeather.humidity}%
              </div>
              <div className="text-xs text-gray-600">Humedad</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-sm text-gray-600">Cargando clima...</div>
        </div>
      )}
    </div>
  );

  const renderHourlyForecast = () => (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <Zap className="w-4 h-4 mr-2" />
        Próximas 24 horas
      </h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {mockHourlyData.map((hour, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center min-w-0 space-y-2 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors"
          >
            <span className="text-xs text-gray-600 font-medium">
              {hour.time}
            </span>
            <div className="text-xl">{getWeatherIcon(hour.icon, 6)}</div>
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
  );

  const renderDailyForecast = () => (
    <div className="p-4">
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
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/60 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900 min-w-0 w-16">
                {index === 0
                  ? 'Hoy'
                  : index === 1
                    ? 'Mañana'
                    : new Date(day.date).toLocaleDateString('es-CL', {
                        weekday: 'short',
                      })}
              </span>
              <div className="text-lg">{getWeatherIcon(day.icon, 6)}</div>
            </div>
            <div className="flex items-center space-x-3">
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
              <div className="flex items-center">
                {day.tempMax > (forecast[0]?.tempMax || 0) && (
                  <TrendingUp className="w-3 h-3 text-red-500" />
                )}
                {day.tempMax < (forecast[0]?.tempMax || 0) && (
                  <TrendingDown className="w-3 h-3 text-blue-500" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Alertas Climáticas
      </h3>
      {alerts && alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-red-700 mt-1">
                    {alert.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-sm text-gray-600">No hay alertas activas</div>
        </div>
      )}
    </div>
  );

  const renderViewIndicator = () => (
    <div className="flex justify-center space-x-2 px-4 pb-2">
      {(['current', 'hourly', 'daily', 'alerts'] as ViewMode[]).map(mode => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={`Ver ${mode === 'current' ? 'clima actual' : mode === 'hourly' ? 'pronóstico por horas' : mode === 'daily' ? 'pronóstico diario' : 'alertas'}`}
          aria-label={`Cambiar a vista ${mode === 'current' ? 'clima actual' : mode === 'hourly' ? 'pronóstico por horas' : mode === 'daily' ? 'pronóstico diario' : 'alertas'}`}
          className={`w-2 h-2 rounded-full transition-colors ${
            viewMode === mode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

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
                <span className="text-xs text-gray-500">
                  {formatTime(lastUpdated)}
                </span>
                <button
                  onClick={handleRefresh}
                  title="Actualizar clima"
                  aria-label="Actualizar datos del clima"
                  className={`p-1 rounded-full transition-colors ${isRefreshing ? 'animate-spin text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Pinto Los Pellines, Ñuble</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-75">
                {formatTime(lastUpdated)}
              </span>
              <button
                onClick={handleRefresh}
                title="Actualizar clima"
                aria-label="Actualizar datos del clima"
                className={`p-1 rounded-full transition-colors ${isRefreshing ? 'animate-spin' : 'hover:bg-white/20'}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className="relative"
      >
        <Card className="bg-white shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {viewMode === 'current' && renderCurrentWeather()}
            {viewMode === 'hourly' && renderHourlyForecast()}
            {viewMode === 'daily' && renderDailyForecast()}
            {viewMode === 'alerts' && renderAlerts()}

            {/* Swipe Indicators */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
              <div className="flex space-x-1">
                <span className="text-xs text-gray-600 capitalize">
                  {viewMode}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* View Indicator Dots */}
            {renderViewIndicator()}

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
    </div>
  );
}
