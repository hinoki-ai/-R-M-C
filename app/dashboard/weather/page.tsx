'use client';

import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Sprout,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  TrendingUp,
  Wind,
  Zap,
} from 'lucide-react';
import { Suspense } from 'react';

import {
  CardSkeleton,
  DataState,
  ErrorState,
  LoadingState,
} from '@/components/shared/loading-error-states';
import { ComponentErrorBoundary } from '@/components/shared/component-error-boundary';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeatherData } from '@/hooks/use-weather-data';
import { ComprehensiveWeatherCharts } from '@/components/weather/charts/comprehensive-weather-charts';

// Force dynamic rendering to avoid SSR issues with Convex queries
export const dynamic = 'force-dynamic';

// No mock data - using real weather data only

function WeatherContent() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  const { weatherData, alerts, forecast, loading, error } = useWeatherData();

  // Prevent SSR issues by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Cargando información del clima...
        </p>
      </div>
    );
  }

  // Use real data only - no mock data fallbacks
  const currentWeather = weatherData || null;
  const weeklyForecast = Array.isArray(forecast) ? forecast : [];
  const activeAlerts = Array.isArray(alerts) ? alerts : [];

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Cargando información del clima...
        </p>
      </div>
    );
  }

  const getWeatherIcon = (icon: string, size = 24) => {
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
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <BackButton className="mb-6" />
      <div>
        {/* Background Image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/backgrounds/bg4.jpg"
            alt="Weather Dashboard Background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Clima Comunidad Pinto Los Pellines
              </h1>
              <p className="text-muted-foreground mt-2">
                Información meteorológica y pronósticos para la Junta de Vecinos
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Ñuble, Chile
            </Badge>
          </motion.div>

          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <span>Condiciones Actuales</span>
                  {currentWeather && currentWeather.lastUpdated && (
                    <Badge variant="secondary" className="text-xs">
                      Última actualización:{' '}
                      {isClient
                        ? new Date(
                            currentWeather.lastUpdated as any
                          ).toLocaleTimeString('es-CL')
                        : 'Cargando...'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Weather */}
                  {currentWeather ? (
                    <div className="text-center lg:col-span-1">
                      <div className="text-4xl sm:text-6xl mb-2">
                        {getWeatherIcon(currentWeather.icon, 12)}
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                        {currentWeather.temperature.toFixed(1)}°C
                      </div>
                      <p className="text-muted-foreground capitalize text-sm sm:text-base">
                        {currentWeather.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Sensación térmica:{' '}
                        {currentWeather.feelsLike?.toFixed(1) ?? 'N/A'}°C
                      </p>
                    </div>
                  ) : (
                    <div className="text-center lg:col-span-1">
                      <Cloud className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-400" />
                      <div className="text-xl text-gray-500 mb-1">
                        Datos no disponibles
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Informacion meteorologica proximamente
                      </p>
                    </div>
                  )}

                  {/* Weather Details */}
                  {currentWeather ? (
                    <div className="grid grid-cols-2 gap-3 lg:col-span-1">
                      <Card className="p-4 hover:shadow-md transition-all duration-200">
                        <div className="text-center">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-3">
                            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {currentWeather.humidity}%
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Humedad
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 hover:shadow-md transition-all duration-200">
                        <div className="text-center">
                          <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg w-fit mx-auto mb-3">
                            <Wind className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {currentWeather.windSpeed.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            km/h
                          </div>
                          {currentWeather.windGusts &&
                            currentWeather.windGusts >
                              currentWeather.windSpeed && (
                              <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                Raf: {currentWeather.windGusts.toFixed(1)}
                              </div>
                            )}
                        </div>
                      </Card>

                      <Card className="p-4 hover:shadow-md transition-all duration-200">
                        <div className="text-center">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg w-fit mx-auto mb-3">
                            <Gauge className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {currentWeather.pressure.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            hPa
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 hover:shadow-md transition-all duration-200">
                        <div className="text-center">
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg w-fit mx-auto mb-3">
                            <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {currentWeather.visibility}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            km
                          </div>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center lg:col-span-1">
                      <Card className="p-8">
                        <Cloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-xl font-semibold mb-2">
                          Datos no disponibles
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Informacion meteorologica proximamente
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* Additional Info */}
                  {currentWeather ? (
                    <div className="grid grid-cols-1 gap-3 lg:col-span-1">
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Indice UV
                              </div>
                              <div
                                className={`text-lg font-semibold ${
                                  (currentWeather.uvIndex || 0) >= 8
                                    ? 'text-red-600 dark:text-red-400'
                                    : (currentWeather.uvIndex || 0) >= 6
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : (currentWeather.uvIndex || 0) >= 3
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {currentWeather.uvIndex}
                                {(currentWeather.uvIndex || 0) >= 6 && (
                                  <AlertTriangle className="w-4 h-4 inline ml-2" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                              <Cloud className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Nubosidad
                              </div>
                              <div className="text-lg font-semibold">
                                {currentWeather.cloudCover}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                              <Gauge className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Punto de rocio
                              </div>
                              <div className="text-lg font-semibold">
                                {currentWeather.dewPoint?.toFixed(1) ?? 'N/A'}°C
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                              <Thermometer className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                Sensacion termica
                              </div>
                              <div className="text-lg font-semibold">
                                {currentWeather.feelsLike?.toFixed(1) ?? 'N/A'}
                                °C
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center lg:col-span-1">
                      <Card className="p-8">
                        <p className="text-muted-foreground">
                          Informacion adicional no disponible
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Alertas Meteorológicas Activas</span>
                    <Badge variant="destructive">{activeAlerts.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-red-200 dark:border-red-700"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-foreground">
                              {alert.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            <strong>Instrucciones:</strong> {alert.instructions}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>🏛️ {alert.areas.join(', ')}</span>
                            <span>
                              ⏰ Hasta{' '}
                              {new Date(alert.endTime).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger
                  value="overview"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  Vista General
                </TabsTrigger>
                <TabsTrigger
                  value="forecast"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  Pronóstico
                </TabsTrigger>
                <TabsTrigger
                  value="charts"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  Gráficos
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  Rendimiento
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-8 h-8 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Temperatura
                          </p>
                          <p className="text-2xl font-bold">
                            {currentWeather
                              ? `${currentWeather.temperature.toFixed(1)}°C`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Humedad
                          </p>
                          <p className="text-2xl font-bold">
                            {currentWeather
                              ? `${currentWeather.humidity}%`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Wind className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Viento
                          </p>
                          <p className="text-2xl font-bold">
                            {currentWeather
                              ? `${currentWeather.windSpeed.toFixed(1)} km/h`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-8 h-8 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Presión
                          </p>
                          <p className="text-2xl font-bold">
                            {currentWeather
                              ? `${currentWeather.pressure.toFixed(1)} hPa`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Community Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sprout className="w-5 h-5 text-green-600" />
                      <span>Impacto en la Comunidad</span>
                    </CardTitle>
                    <CardDescription>
                      Cómo afecta el clima actual a las actividades comunitarias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">
                          Actividades Recomendadas
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>
                              Rondas vecinales nocturnas (condiciones
                              favorables)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span>
                              Mantenimiento de caminos rurales (moderado)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>
                              Riego de huertos comunitarios (necesario)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">
                          Consideraciones de Seguridad
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Monitorear niveles de ríos cercanos</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-green-500" />
                            <span>
                              Condiciones seguras para actividades al aire libre
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Pronóstico Semanal - Pinto Los Pellines</span>
                    </CardTitle>
                    <CardDescription>
                      Pronóstico meteorológico detallado para los próximos 7
                      días
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeklyForecast.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {weeklyForecast.map((day, index) => (
                          <motion.div
                            key={day.date}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-border"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {new Date(day.date).toLocaleDateString(
                                    'es-CL',
                                    {
                                      weekday: 'long',
                                      month: 'short',
                                      day: 'numeric',
                                    }
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {day.description}
                                </p>
                              </div>
                              <div className="text-3xl">
                                {getWeatherIcon(day.icon, 8)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  Temperatura
                                </span>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">
                                    {day.tempMax}°
                                  </span>
                                  <span className="text-gray-500">/</span>
                                  <span className="text-gray-500">
                                    {day.tempMin}°
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  Lluvia
                                </span>
                                <div className="flex items-center space-x-1">
                                  <CloudRain className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm">
                                    {day.precipitationProbability}%
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  Viento
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Wind className="w-4 h-4 text-green-500" />
                                  <span className="text-sm">
                                    {day.windSpeed} km/h
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-border">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Sunrise className="w-3 h-3" />
                                  <span>{day.sunrise}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Sunset className="w-3 h-3" />
                                  <span>{day.sunset}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Pronóstico no disponible</p>
                        <p className="text-sm mt-2">
                          La información meteorológica estará disponible
                          próximamente
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="charts" className="space-y-4 sm:space-y-6">
                {/* Interactive Weather Charts */}
                <div className="space-y-6">
                  <ComprehensiveWeatherCharts height={350} showPerformanceCharts={false} />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
                {/* Weather Charts */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>📊 Análisis Meteorológico Completo</CardTitle>
                      <CardDescription>
                        Visualización avanzada de datos climáticos históricos y tendencias
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ComprehensiveWeatherCharts height={350} showPerformanceCharts={false} />
                    </CardContent>
                  </Card>
                </div>

                {/* Weather Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>📊 Estadísticas Meteorológicas</CardTitle>
                    <CardDescription>
                      Resumen del clima en Pinto Los Pellines durante el último
                      mes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          --°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Temperatura Promedio
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          -- mm
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Precipitación Total
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          -- km/h
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Velocidad del Viento
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          --%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Humedad Promedio
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4 sm:space-y-6">
                {/* Performance and Memory Charts */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🔧 Monitoreo de Rendimiento del Sistema</CardTitle>
                      <CardDescription>
                        Análisis histórico de recursos del sistema, memoria y métricas de rendimiento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ComprehensiveWeatherCharts height={350} showPerformanceCharts={true} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function WeatherPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Cargando información meteorológica...
          </p>
        </div>
      }
    >
      <ComponentErrorBoundary componentName="WeatherPage">
        <WeatherContent />
      </ComponentErrorBoundary>
    </Suspense>
  );
}
