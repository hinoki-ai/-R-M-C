'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

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

interface WeatherBarChartComparisonProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartComparison({ data, height = 300 }: WeatherBarChartComparisonProps) {
  const chartData = useMemo(() => {
    // Compare current vs previous period
    const currentWeek = data.slice(0, 7);
    const previousWeek = data.slice(7, 14);

    const current = {
      period: 'Esta Semana',
      temperature: Math.round(currentWeek.reduce((sum, d) => sum + d.temperature, 0) / currentWeek.length),
      precipitation: Math.round(currentWeek.reduce((sum, d) => sum + d.precipitation, 0) * 10) / 10,
      windSpeed: Math.round(currentWeek.reduce((sum, d) => sum + d.windSpeed, 0) / currentWeek.length),
    };

    const previous = {
      period: 'Semana Anterior',
      temperature: Math.round(previousWeek.reduce((sum, d) => sum + d.temperature, 0) / previousWeek.length),
      precipitation: Math.round(previousWeek.reduce((sum, d) => sum + d.precipitation, 0) * 10) / 10,
      windSpeed: Math.round(previousWeek.reduce((sum, d) => sum + d.windSpeed, 0) / previousWeek.length),
    };

    return [current, previous];
  }, [data]);

  const chartConfig = {
    temperature: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
    precipitation: {
      label: 'Precipitación',
      color: 'hsl(var(--chart-4))',
    },
    windSpeed: {
      label: 'Velocidad del Viento',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Comparación Semanal</span>
        </CardTitle>
        <CardDescription>
          Esta semana vs semana anterior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
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
              dataKey="period"
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const units = {
                      temperature: '°C',
                      precipitation: ' mm',
                      windSpeed: ' km/h'
                    };
                    return [`${value}${units[name as keyof typeof units] || ''}`, chartConfig[name as keyof typeof chartConfig]?.label || name];
                  }}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="temperature"
              fill="var(--color-temperature)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="precipitation"
              fill="var(--color-precipitation)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="windSpeed"
              fill="var(--color-windSpeed)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}