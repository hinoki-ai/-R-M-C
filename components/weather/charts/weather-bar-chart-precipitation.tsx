'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain } from 'lucide-react';

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

interface WeatherBarChartPrecipitationProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartPrecipitation({ data, height = 300 }: WeatherBarChartPrecipitationProps) {
  const chartData = useMemo(() => {
    return data.slice(-14).map(point => ({
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
          <span>Precipitación Diaria</span>
        </CardTitle>
        <CardDescription>
          Milímetros de lluvia por día en las últimas 2 semanas
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
                  formatter={(value) => [`${value} mm`, 'Precipitación']}
                />
              }
            />
            <Bar
              dataKey="precipitation"
              fill="var(--color-precipitation)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}