'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

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

interface WeatherBarChartMultiProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartMulti({ data, height = 300 }: WeatherBarChartMultiProps) {
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
    humidity: {
      label: 'Humedad',
      color: 'hsl(var(--chart-2))',
    },
    windSpeed: {
      label: 'Viento',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Múltiples Variables - Barras Agrupadas</span>
        </CardTitle>
        <CardDescription>
          Temperatura, humedad y velocidad del viento
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
                      humidity: '%',
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
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="humidity"
              fill="var(--color-humidity)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="windSpeed"
              fill="var(--color-windSpeed)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}