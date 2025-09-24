'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Thermometer, Droplets, Wind, Gauge, Eye } from 'lucide-react';

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

interface WeatherLineChartsProps {
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
    const baseTemp = 15 + Math.sin((i / 30) * 2 * Math.PI) * 10; // Seasonal variation
    const dailyVariation = Math.sin((i / 1) * 2 * Math.PI) * 5; // Daily variation
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

export function WeatherLineChartInteractive({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
    humidity: {
      label: 'Humedad',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Temperatura y Humedad - Tendencia Interactiva</span>
        </CardTitle>
        <CardDescription>
          Evolución de temperatura y humedad en los últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
            <YAxis yAxisId="temp" orientation="left" />
            <YAxis yAxisId="humidity" orientation="right" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Fecha: ${value}`}
                  formatter={(value, name) => [
                    `${value}${name === 'temperature' ? '°C' : '%'}`,
                    name === 'temperature' ? 'Temperatura' : 'Humedad'
                  ]}
                />
              }
            />
            <Legend />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-temperature)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-temperature)', strokeWidth: 2 }}
            />
            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--color-humidity)', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartDefault({ data, height = 300 }: WeatherLineChartsProps) {
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
          <span>Temperatura - Últimas 2 Semanas</span>
        </CardTitle>
        <CardDescription>
          Tendencia de temperatura diaria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartLinear({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
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
          <span>Temperatura - Semana Actual</span>
        </CardTitle>
        <CardDescription>
          Temperatura diaria con línea recta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
            <Line
              type="linear"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-temperature)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartStep({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    pressure: {
      label: 'Presión',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gauge className="w-5 h-5 text-green-600" />
          <span>Presión Atmosférica - Paso a Paso</span>
        </CardTitle>
        <CardDescription>
          Cambios de presión atmosférica por día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
                  formatter={(value) => [`${value} hPa`, 'Presión']}
                />
              }
            />
            <Line
              type="step"
              dataKey="pressure"
              stroke="var(--color-pressure)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartMultiple({ data, height = 300 }: WeatherLineChartsProps) {
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
    windSpeed: {
      label: 'Velocidad del Viento',
      color: 'hsl(var(--chart-2))',
    },
    humidity: {
      label: 'Humedad',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-blue-600" />
          <span>Múltiples Variables Meteorológicas</span>
        </CardTitle>
        <CardDescription>
          Temperatura, viento y humedad en los últimos 14 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
                    const units = {
                      temperature: '°C',
                      windSpeed: ' km/h',
                      humidity: '%'
                    };
                    return [`${value}${units[name as keyof typeof units] || ''}`, chartConfig[name as keyof typeof chartConfig]?.label || name];
                  }}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="var(--color-windSpeed)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartDots({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
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
          <Droplets className="w-5 h-5 text-blue-600" />
          <span>Precipitación - Con Puntos</span>
        </CardTitle>
        <CardDescription>
          Precipitación diaria con marcadores visibles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
                  formatter={(value) => [`${value} mm`, 'Precipitación']}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="precipitation"
              stroke="var(--color-precipitation)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-precipitation)', strokeWidth: 2, r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartCustomDots({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    uvIndex: {
      label: 'Índice UV',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const uvLevel = payload.uvIndex || 0;

    // Color based on UV level
    const getUVColor = (uv: number) => {
      if (uv <= 2) return '#10b981'; // Low - green
      if (uv <= 5) return '#f59e0b'; // Moderate - yellow
      if (uv <= 7) return '#f97316'; // High - orange
      if (uv <= 10) return '#ef4444'; // Very high - red
      return '#7c3aed'; // Extreme - purple
    };

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={getUVColor(uvLevel)}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-yellow-600" />
          <span>Índice UV - Puntos Personalizados</span>
        </CardTitle>
        <CardDescription>
          Nivel de radiación UV con colores por intensidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
                  formatter={(value) => [`${value}`, 'Índice UV']}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="uvIndex"
              stroke="var(--color-uvIndex)"
              strokeWidth={2}
              dot={<CustomDot />}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Bajo (1-2)
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Moderado (3-5)
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Alto (6-7)
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Muy Alto (8-10)
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Extremo (11+)
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartDotsColors({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-10).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
    humidity: {
      label: 'Humedad',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-purple-600" />
          <span>Temperatura y Humedad - Colores por Punto</span>
        </CardTitle>
        <CardDescription>
          Múltiples variables con puntos coloreados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
                    `${value}${name === 'temperature' ? '°C' : '%'}`,
                    name === 'temperature' ? 'Temperatura' : 'Humedad'
                  ]}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-temperature)', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-humidity)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartLabel({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
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
          <Thermometer className="w-5 h-5 text-cyan-600" />
          <span>Temperatura - Con Etiquetas</span>
        </CardTitle>
        <CardDescription>
          Temperatura diaria con valores mostrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            height={height}
            margin={{
              top: 20,
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
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              label={{ position: 'top', fontSize: 12 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherLineChartCustomLabel({ data, height = 300 }: WeatherLineChartsProps) {
  const chartData = useMemo(() => {
    return data.slice(-5).map(point => ({
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

  const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text
        x={x}
        y={y - 10}
        fill="var(--color-temperature)"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
      >
        {value}°C
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-indigo-600" />
          <span>Temperatura - Etiquetas Personalizadas</span>
        </CardTitle>
        <CardDescription>
          Temperatura con formato personalizado de etiquetas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            height={height}
            margin={{
              top: 30,
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
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-temperature)', strokeWidth: 2, r: 5 }}
              label={<CustomLabel />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Main component that renders all line chart variants
export function WeatherLineCharts({ height = 300 }: { height?: number }) {
  const sampleData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherLineChartInteractive data={sampleData} height={height} />
      <WeatherLineChartDefault data={sampleData} height={height} />
      <WeatherLineChartLinear data={sampleData} height={height} />
      <WeatherLineChartStep data={sampleData} height={height} />
      <WeatherLineChartMultiple data={sampleData} height={height} />
      <WeatherLineChartDots data={sampleData} height={height} />
      <WeatherLineChartCustomDots data={sampleData} height={height} />
      <WeatherLineChartDotsColors data={sampleData} height={height} />
      <WeatherLineChartLabel data={sampleData} height={height} />
      <WeatherLineChartCustomLabel data={sampleData} height={height} />
    </div>
  );
}