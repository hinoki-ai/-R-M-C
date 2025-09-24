'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

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

interface WeatherBarChartWeeklyProps {
  data: WeatherDataPoint[];
  height?: number;
}

export function WeatherBarChartWeekly({ data, height = 300 }: WeatherBarChartWeeklyProps) {
  const chartData = useMemo(() => {
    // Group data by week and calculate averages
    const weeklyData = [];
    for (let week = 0; week < 4; week++) {
      const weekData = data.slice(week * 7, (week + 1) * 7);
      const avgTemp = weekData.reduce((sum, d) => sum + d.temperature, 0) / weekData.length;
      const totalPrecip = weekData.reduce((sum, d) => sum + d.precipitation, 0);
      const avgHumidity = weekData.reduce((sum, d) => sum + d.humidity, 0) / weekData.length;
      const maxWind = Math.max(...weekData.map(d => d.windSpeed));

      weeklyData.push({
        week: `Semana ${week + 1}`,
        avgTemp: Math.round(avgTemp),
        totalPrecip: Math.round(totalPrecip * 10) / 10,
        avgHumidity: Math.round(avgHumidity),
        maxWind,
      });
    }
    return weeklyData;
  }, [data]);

  const chartConfig = {
    avgTemp: {
      label: 'Temp. Promedio',
      color: 'hsl(var(--chart-1))',
    },
    totalPrecip: {
      label: 'Precip. Total',
      color: 'hsl(var(--chart-4))',
    },
    avgHumidity: {
      label: 'Humedad Promedio',
      color: 'hsl(var(--chart-2))',
    },
    maxWind: {
      label: 'Viento Máximo',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>Estadísticas Semanales</span>
        </CardTitle>
        <CardDescription>
          Resumen semanal del clima en las últimas 4 semanas
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
              dataKey="week"
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const units = {
                      avgTemp: '°C',
                      totalPrecip: ' mm',
                      avgHumidity: '%',
                      maxWind: ' km/h'
                    };
                    return [`${value}${units[name as keyof typeof units] || ''}`, chartConfig[name as keyof typeof chartConfig]?.label || name];
                  }}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="avgTemp"
              fill="var(--color-avgTemp)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="totalPrecip"
              fill="var(--color-totalPrecip)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="avgHumidity"
              fill="var(--color-avgHumidity)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="maxWind"
              fill="var(--color-maxWind)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}