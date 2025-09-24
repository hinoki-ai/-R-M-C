'use client';

import { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
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
import { Radar as RadarIcon, Circle, Activity, TrendingUp } from 'lucide-react';

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

interface WeatherRadarRadialChartsProps {
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

export function WeatherRadarChartMultiVariable({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    // Calculate averages for each variable
    const averages = data.reduce((acc, point) => {
      acc.temperature += point.temperature;
      acc.humidity += point.humidity;
      acc.pressure += point.pressure / 10; // Scale down for radar
      acc.windSpeed += point.windSpeed;
      acc.precipitation += point.precipitation * 10; // Scale up for visibility
      acc.visibility += point.visibility;
      acc.uvIndex += point.uvIndex || 0;
      return acc;
    }, {
      temperature: 0,
      humidity: 0,
      pressure: 0,
      windSpeed: 0,
      precipitation: 0,
      visibility: 0,
      uvIndex: 0,
    });

    const count = data.length;
    return [{
      variable: 'Temperatura',
      value: Math.round(averages.temperature / count),
      fullMark: 40,
    }, {
      variable: 'Humedad',
      value: Math.round(averages.humidity / count),
      fullMark: 100,
    }, {
      variable: 'Presión',
      value: Math.round(averages.pressure / count),
      fullMark: 105,
    }, {
      variable: 'Viento',
      value: Math.round(averages.windSpeed / count),
      fullMark: 30,
    }, {
      variable: 'Precipitación',
      value: Math.round(averages.precipitation / count),
      fullMark: 50,
    }, {
      variable: 'Visibilidad',
      value: Math.round(averages.visibility / count),
      fullMark: 15,
    }];
  }, [data]);

  const chartConfig = {
    value: {
      label: 'Valor Promedio',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RadarIcon className="w-5 h-5 text-purple-600" />
          <span>Análisis Radar de Variables Climáticas</span>
        </CardTitle>
        <CardDescription>
          Valores promedio de múltiples variables meteorológicas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadarChart data={chartData} height={height}>
            <PolarGrid />
            <PolarAngleAxis dataKey="variable" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'dataMax']}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Valor Promedio"
              dataKey="value"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value}`, 'Valor Promedio']}
                />
              }
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherRadarChartComfort({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    // Calculate comfort metrics based on weather data
    const latest = data[0]; // Most recent data
    return [{
      factor: 'Temperatura',
      comfort: Math.max(0, 100 - Math.abs(latest.temperature - 22) * 5), // Optimal ~22°C
      fullMark: 100,
    }, {
      factor: 'Humedad',
      comfort: Math.max(0, 100 - Math.abs(latest.humidity - 50) * 2), // Optimal ~50%
      fullMark: 100,
    }, {
      factor: 'Viento',
      comfort: Math.max(0, 100 - (latest.windSpeed - 10) * 5), // Optimal ~10 km/h
      fullMark: 100,
    }, {
      factor: 'Precipitación',
      comfort: Math.max(0, 100 - latest.precipitation * 20), // Less precipitation = more comfort
      fullMark: 100,
    }, {
      factor: 'Visibilidad',
      comfort: Math.min(100, latest.visibility * 6.67), // Better visibility = more comfort
      fullMark: 100,
    }, {
      factor: 'Presión',
      comfort: Math.max(0, 100 - Math.abs(latest.pressure - 1013) * 2), // Optimal ~1013 hPa
      fullMark: 100,
    }];
  }, [data]);

  const chartConfig = {
    comfort: {
      label: 'Índice de Comodidad',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-600" />
          <span>Radar de Comodidad Climática</span>
        </CardTitle>
        <CardDescription>
          Evaluación de comodidad basada en condiciones actuales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadarChart data={chartData} height={height}>
            <PolarGrid />
            <PolarAngleAxis dataKey="factor" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Comodidad"
              dataKey="comfort"
              stroke="var(--color-comfort)"
              fill="var(--color-comfort)"
              fillOpacity={0.4}
              strokeWidth={3}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${Math.round(Number(value))}%`, 'Comodidad']}
                />
              }
            />
          </RadarChart>
        </ChartContainer>
        <div className="flex justify-center mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Comodidad General: {Math.round(chartData.reduce((sum, item) => sum + item.comfort, 0) / chartData.length)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherRadialBarChartTemperature({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    const latest = data[0];
    return [{
      name: 'Temperatura Actual',
      value: latest.temperature,
      maxValue: 40,
      fill: 'hsl(var(--chart-1))',
    }];
  }, [data]);

  const chartConfig = {
    value: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-red-600" />
          <span>Temperatura Radial</span>
        </CardTitle>
        <CardDescription>
          Temperatura actual en escala radial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={chartData}
            height={height}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill="var(--color-value)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value}°C`, 'Temperatura']}
                />
              }
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-red-600">
            {chartData[0].value}°C
          </div>
          <div className="text-sm text-muted-foreground">
            Temperatura Actual
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherRadialBarChartHumidity({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    const latest = data[0];
    return [{
      name: 'Humedad Actual',
      value: latest.humidity,
      maxValue: 100,
      fill: 'hsl(var(--chart-2))',
    }];
  }, [data]);

  const chartConfig = {
    value: {
      label: 'Humedad',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-cyan-600" />
          <span>Humedad Radial</span>
        </CardTitle>
        <CardDescription>
          Nivel de humedad en escala radial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="80%"
            data={chartData}
            height={height}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={15}
              fill="var(--color-value)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value}%`, 'Humedad']}
                />
              }
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-cyan-600">
            {chartData[0].value}%
          </div>
          <div className="text-sm text-muted-foreground">
            Humedad Relativa
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherRadialBarChartMultiMetric({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    const latest = data[0];
    return [
      {
        name: 'Temperatura',
        value: (latest.temperature / 40) * 100, // Normalize to 0-100
        actualValue: latest.temperature,
        unit: '°C',
        fill: 'hsl(var(--chart-1))',
      },
      {
        name: 'Humedad',
        value: latest.humidity,
        actualValue: latest.humidity,
        unit: '%',
        fill: 'hsl(var(--chart-2))',
      },
      {
        name: 'Viento',
        value: (latest.windSpeed / 30) * 100, // Normalize to 0-100
        actualValue: latest.windSpeed,
        unit: 'km/h',
        fill: 'hsl(var(--chart-3))',
      },
      {
        name: 'Presión',
        value: ((latest.pressure - 980) / 70) * 100, // Normalize atmospheric pressure
        actualValue: latest.pressure,
        unit: 'hPa',
        fill: 'hsl(var(--chart-4))',
      },
    ];
  }, [data]);

  const chartConfig = {
    value: {
      label: 'Valor',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Métricas Múltiples - Barras Radiales</span>
        </CardTitle>
        <CardDescription>
          Condiciones climáticas actuales en vista radial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="90%"
            data={chartData}
            height={height}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              fill="var(--color-value)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const data = props.payload;
                    return [`${data.actualValue}${data.unit}`, data.name];
                  }}
                />
              }
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="chart-value-text"
                data-chart-color={item.fill}
              >
                {item.actualValue}{item.unit}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherRadarChartWeekly({ data, height = 300 }: WeatherRadarRadialChartsProps) {
  const chartData = useMemo(() => {
    // Group by days of the week
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const dayData = data.filter(point => {
        const date = new Date(point.timestamp);
        return date.getDay() === i;
      });

      const avgTemp = dayData.length > 0
        ? dayData.reduce((sum, d) => sum + d.temperature, 0) / dayData.length
        : 0;

      return {
        day: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i],
        temperature: Math.round(avgTemp),
        fullMark: 35,
      };
    });

    return weeklyData;
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura Promedio',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RadarIcon className="w-5 h-5 text-orange-600" />
          <span>Temperatura Semanal - Radar</span>
        </CardTitle>
        <CardDescription>
          Promedio de temperatura por día de la semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadarChart data={chartData} height={height}>
            <PolarGrid />
            <PolarAngleAxis dataKey="day" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'dataMax']}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Temperatura"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              fill="var(--color-temperature)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value}°C`, 'Temperatura Promedio']}
                />
              }
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Main component that renders all radar and radial chart variants
export function WeatherRadarRadialCharts({ height = 300 }: { height?: number }) {
  const sampleData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherRadarChartMultiVariable data={sampleData} height={height} />
      <WeatherRadarChartComfort data={sampleData} height={height} />
      <WeatherRadialBarChartTemperature data={sampleData} height={height} />
      <WeatherRadialBarChartHumidity data={sampleData} height={height} />
      <WeatherRadialBarChartMultiMetric data={sampleData} height={height} />
      <WeatherRadarChartWeekly data={sampleData} height={height} />
    </div>
  );
}