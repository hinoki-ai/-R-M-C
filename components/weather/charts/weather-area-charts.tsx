'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Thermometer, Droplets, Wind, TrendingUp } from 'lucide-react';

// Weather data interfaces
interface WeatherDataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
  uvIndex?: number;
  date?: string;
}

interface WeatherAreaChartsProps {
  data: WeatherDataPoint[];
  height?: number;
}

// Generate sample weather data for demonstration
const generateSampleWeatherData = (): WeatherDataPoint[] => {
  const data: WeatherDataPoint[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic weather patterns
    const baseTemp = 15 + Math.sin((i / 30) * 2 * Math.PI) * 10;
    const dailyVariation = Math.sin((i / 1) * 2 * Math.PI) * 5;
    const temperature = Math.round(baseTemp + dailyVariation + (Math.random() - 0.5) * 3);

    const humidity = Math.max(30, Math.min(90, 60 + Math.sin((i / 7) * 2 * Math.PI) * 20 + (Math.random() - 0.5) * 10));
    const pressure = Math.round(1013 + Math.sin((i / 14) * 2 * Math.PI) * 10 + (Math.random() - 0.5) * 5);
    const windSpeed = Math.max(0, Math.round(5 + Math.sin((i / 5) * 2 * Math.PI) * 8 + Math.random() * 5));
    const precipitation = Math.max(0, Math.round(Math.sin((i / 10) * 2 * Math.PI) * 5 + Math.random() * 2));
    const visibility = Math.round(8 + Math.random() * 7);

    data.push({
      timestamp: date.getTime(),
      temperature,
      humidity: Math.round(humidity),
      pressure,
      windSpeed,
      precipitation,
      visibility,
      uvIndex: Math.round(Math.max(0, Math.min(11, 6 + Math.sin((i / 30) * 2 * Math.PI) * 3))),
      date: date.toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
    });
  }

  return data;
};

export function WeatherAreaChartDefault({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-red-600" />
          <span>Temperatura - Área Básica</span>
        </CardTitle>
        <CardDescription>
          Tendencia de temperatura en área sombreada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}°C`, 'Temperatura']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              fill="var(--color-temperature)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartGradient({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-orange-600" />
          <span>Temperatura - Gradiente</span>
        </CardTitle>
        <CardDescription>
          Área con gradiente visual atractivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}°C`, 'Temperatura']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              fill="url(#temperatureGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartStacked({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
      // Create stacked data: temperature range (temp - 5 to temp + 5)
      tempMin: Math.max(0, point.temperature - 5),
      tempRange: 10, // Fixed range for stacking
    }));
  }, [data]);

  const chartConfig = {
    tempMin: {
      label: 'Temperatura Mínima',
      color: 'hsl(var(--chart-1))',
    },
    tempRange: {
      label: 'Rango de Temperatura',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-purple-600" />
          <span>Rango de Temperatura - Apilado</span>
        </CardTitle>
        <CardDescription>
          Visualización del rango de temperatura diario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${value}°C`,
                    name === 'tempMin' ? 'Base Temperatura' : 'Rango'
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="tempMin"
              stackId="1"
              stroke="var(--color-tempMin)"
              fill="var(--color-tempMin)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="tempRange"
              stackId="1"
              stroke="var(--color-tempRange)"
              fill="var(--color-tempRange)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartPrecipitation({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-21).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    precipitation: {
      label: 'Precipitación',
      color: 'hsl(var(--chart-4))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CloudRain className="w-5 h-5 text-blue-600" />
          <span>Precipitación - Acumulada</span>
        </CardTitle>
        <CardDescription>
          Tendencia de precipitación en las últimas 3 semanas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="precipitationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-precipitation)" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="var(--color-precipitation)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--color-precipitation)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} mm`, 'Precipitación']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="precipitation"
              stroke="var(--color-precipitation)"
              fill="url(#precipitationGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartHumidity({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    humidity: {
      label: 'Humedad',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-cyan-600" />
          <span>Humedad Relativa</span>
        </CardTitle>
        <CardDescription>
          Nivel de humedad en el ambiente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-humidity)" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="var(--color-humidity)" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}%`, 'Humedad']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="var(--color-humidity)"
              fill="url(#humidityGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartWindSpeed({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    windSpeed: {
      label: 'Velocidad del Viento',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-green-600" />
          <span>Velocidad del Viento</span>
        </CardTitle>
        <CardDescription>
          Intensidad del viento por día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-windSpeed)" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="var(--color-windSpeed)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} km/h`, 'Velocidad del Viento']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="windSpeed"
              stroke="var(--color-windSpeed)"
              fill="url(#windGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherAreaChartMultiLayer({ data, height = 300 }: WeatherAreaChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-10).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
      // Normalize values for better visualization
      tempNormalized: (point.temperature + 20) / 2, // Scale to 0-20 range
      humidityNormalized: point.humidity / 5, // Scale to 0-20 range
    }));
  }, [data]);

  const chartConfig = {
    tempNormalized: {
      label: 'Temperatura (normalizada)',
      color: 'hsl(var(--chart-1))',
    },
    humidityNormalized: {
      label: 'Humedad (normalizada)',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Variables Normalizadas - Múltiples Capas</span>
        </CardTitle>
        <CardDescription>
          Temperatura y humedad en escalas comparables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const labels = {
                      tempNormalized: 'Temperatura',
                      humidityNormalized: 'Humedad'
                    };
                    return [`${value}`, labels[name as keyof typeof labels] || name];
                  }}
                />
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="tempNormalized"
              stackId="1"
              stroke="var(--color-tempNormalized)"
              fill="var(--color-tempNormalized)"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="humidityNormalized"
              stackId="1"
              stroke="var(--color-humidityNormalized)"
              fill="var(--color-humidityNormalized)"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Main component that renders all area chart variants
export function WeatherAreaCharts({ height = 300 }: { height?: number }) {
  const sampleData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherAreaChartDefault data={sampleData} height={height} />
      <WeatherAreaChartGradient data={sampleData} height={height} />
      <WeatherAreaChartStacked data={sampleData} height={height} />
      <WeatherAreaChartPrecipitation data={sampleData} height={height} />
      <WeatherAreaChartHumidity data={sampleData} height={height} />
      <WeatherAreaChartWindSpeed data={sampleData} height={height} />
      <WeatherAreaChartMultiLayer data={sampleData} height={height} />
    </div>
  );
}