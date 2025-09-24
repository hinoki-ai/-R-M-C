'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

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

interface WeatherBarChartStackedProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartStacked({ data, height = 300 }: WeatherBarChartStackedProps) {
  const chartData = useMemo(() => {
    return data.slice(-7).map(point => ({
      ...point,
      date: point.date || new Date(point.timestamp).toLocaleDateString('es-CL'),
      // Create stacked components
      tempComfort: Math.min(point.temperature, 20), // Comfortable temperature
      tempHeat: Math.max(0, point.temperature - 20), // Heat component
      tempCold: Math.max(0, 10 - point.temperature), // Cold component
    }));
  }, [data]);

  const chartConfig = {
    tempCold: {
      label: 'Frío',
      color: 'hsl(var(--chart-4))',
    },
    tempComfort: {
      label: 'Cómodo',
      color: 'hsl(var(--chart-5))',
    },
    tempHeat: {
      label: 'Calor',
      color: 'hsl(var(--chart-6))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-orange-600" />
          <span>Comodidad Térmica - Barras Apiladas</span>
        </CardTitle>
        <CardDescription>
          Desglose de sensación térmica por componentes
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
                  formatter={(value, name) => [
                    `${value}°C`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="tempCold"
              stackId="temperature"
              fill="var(--color-tempCold)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="tempComfort"
              stackId="temperature"
              fill="var(--color-tempComfort)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="tempHeat"
              stackId="temperature"
              fill="var(--color-tempHeat)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}