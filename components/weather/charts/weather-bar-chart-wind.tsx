'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind } from 'lucide-react';

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

interface WeatherBarChartWindProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartWind({ data, height = 300 }: WeatherBarChartWindProps) {
  const chartData = useMemo(() => {
    // Create wind direction data (simplified)
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions.map((dir, index) => ({
      direction: dir,
      speed: Math.max(5, Math.round(15 + Math.sin((index / 8) * 2 * Math.PI) * 10 + Math.random() * 5)),
      frequency: Math.round(10 + Math.random() * 20), // How often wind comes from this direction
    }));
  }, []);

  const chartConfig = {
    speed: {
      label: 'Velocidad Promedio',
      color: 'hsl(var(--chart-3))',
    },
    frequency: {
      label: 'Frecuencia',
      color: 'hsl(var(--chart-7))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-green-600" />
          <span>Dirección del Viento</span>
        </CardTitle>
        <CardDescription>
          Velocidad y frecuencia por dirección cardinal
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
              dataKey="direction"
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    name === 'speed' ? `${value} km/h` : `${value}%`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="speed"
              fill="var(--color-speed)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="frequency"
              fill="var(--color-frequency)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}