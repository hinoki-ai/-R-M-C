'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
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
import { PieChart as PieChartIcon, Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

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

interface WeatherPieChartsProps {
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

// Color palette for pie charts
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
];

export function WeatherPieChartConditions({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize weather conditions based on temperature and precipitation
    const conditions = data.reduce((acc, point) => {
      let condition = 'Despejado';
      if (point.precipitation > 2) {
        condition = 'Lluvioso';
      } else if (point.temperature > 25) {
        condition = 'Caluroso';
      } else if (point.temperature < 10) {
        condition = 'Frío';
      } else if (point.humidity > 70) {
        condition = 'Húmedo';
      } else if (point.windSpeed > 15) {
        condition = 'Ventoso';
      }

      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(conditions).map(([condition, count], index) => ({
      condition,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-gray-600" />
          <span>Distribución de Condiciones Climáticas</span>
        </CardTitle>
        <CardDescription>
          Frecuencia de diferentes tipos de clima en el período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ condition, percentage }) => `${condition}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Frecuencia']}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {chartData.map((item, index) => (
            <Badge key={item.condition} variant="outline" style={{ borderColor: item.fill }}>
              {item.condition}: {item.percentage}%
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherPieChartTemperatureRanges({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize temperatures into ranges
    const ranges = data.reduce((acc, point) => {
      let range = 'Muy Frío (< 5°C)';
      if (point.temperature >= 5 && point.temperature < 15) {
        range = 'Frío (5-15°C)';
      } else if (point.temperature >= 15 && point.temperature < 25) {
        range = 'Templado (15-25°C)';
      } else if (point.temperature >= 25 && point.temperature < 30) {
        range = 'Cálido (25-30°C)';
      } else if (point.temperature >= 30) {
        range = 'Muy Cálido (> 30°C)';
      }

      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(ranges).map(([range, count], index) => ({
      range,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-600" />
          <span>Rangos de Temperatura</span>
        </CardTitle>
        <CardDescription>
          Distribución de temperaturas por rangos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ range, percentage }) => `${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Días']}
                />
              }
            />
            <Legend />
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {chartData.map((item) => (
            <div key={item.range} className="flex items-center space-x-2">
              <div
                className="chart-legend-indicator"
                data-chart-color={item.fill}
              />
              <span>{item.range}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherPieChartPrecipitationLevels({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize precipitation levels
    const levels = data.reduce((acc, point) => {
      let level = 'Sin Lluvia';
      if (point.precipitation > 0 && point.precipitation <= 1) {
        level = 'Lluvia Ligera (0-1mm)';
      } else if (point.precipitation > 1 && point.precipitation <= 5) {
        level = 'Lluvia Moderada (1-5mm)';
      } else if (point.precipitation > 5 && point.precipitation <= 10) {
        level = 'Lluvia Fuerte (5-10mm)';
      } else if (point.precipitation > 10) {
        level = 'Lluvia Muy Fuerte (>10mm)';
      }

      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(levels).map(([level, count], index) => ({
      level,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CloudRain className="w-5 h-5 text-blue-600" />
          <span>Niveles de Precipitación</span>
        </CardTitle>
        <CardDescription>
          Distribución de intensidad de lluvia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Días']}
                />
              }
            />
            <Legend />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {chartData.map((item) => (
            <Badge key={item.level} variant="outline">
              {item.level.split(' ')[0]}: {item.percentage}%
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherPieChartWindCategories({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize wind speeds
    const categories = data.reduce((acc, point) => {
      let category = 'Calma (< 5 km/h)';
      if (point.windSpeed >= 5 && point.windSpeed < 15) {
        category = 'Suave (5-15 km/h)';
      } else if (point.windSpeed >= 15 && point.windSpeed < 25) {
        category = 'Moderado (15-25 km/h)';
      } else if (point.windSpeed >= 25 && point.windSpeed < 35) {
        category = 'Fuerte (25-35 km/h)';
      } else if (point.windSpeed >= 35) {
        category = 'Muy Fuerte (>35 km/h)';
      }

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count], index) => ({
      category,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-green-600" />
          <span>Categorías de Viento</span>
        </CardTitle>
        <CardDescription>
          Distribución de velocidades del viento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => `${category.split(' ')[0]}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Días']}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherPieChartHumidityRanges({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize humidity levels
    const ranges = data.reduce((acc, point) => {
      let range = 'Seco (< 40%)';
      if (point.humidity >= 40 && point.humidity < 60) {
        range = 'Normal (40-60%)';
      } else if (point.humidity >= 60 && point.humidity < 80) {
        range = 'Húmedo (60-80%)';
      } else if (point.humidity >= 80) {
        range = 'Muy Húmedo (>80%)';
      }

      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(ranges).map(([range, count], index) => ({
      range,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-cyan-600" />
          <span>Rangos de Humedad</span>
        </CardTitle>
        <CardDescription>
          Niveles de humedad relativa en el ambiente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={90}
              paddingAngle={2}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Días']}
                />
              }
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WeatherPieChartUVIndex({ data, height = 300 }: WeatherPieChartsProps) {
  const chartData = useMemo(() => {
    // Categorize UV index levels
    const uvLevels = data.reduce((acc, point) => {
      const uv = point.uvIndex || 0;
      let level = 'Bajo (1-2)';
      if (uv >= 3 && uv <= 5) {
        level = 'Moderado (3-5)';
      } else if (uv >= 6 && uv <= 7) {
        level = 'Alto (6-7)';
      } else if (uv >= 8 && uv <= 10) {
        level = 'Muy Alto (8-10)';
      } else if (uv >= 11) {
        level = 'Extremo (11+)';
      }

      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(uvLevels).map(([level, count], index) => ({
      level,
      count,
      percentage: Math.round((count / data.length) * 100),
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Días',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-600" />
          <span>Índice UV</span>
        </CardTitle>
        <CardDescription>
          Distribución de niveles de radiación ultravioleta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ level, percentage }) => `${level.split(' ')[0]}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} días`, 'Días']}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {chartData.map((item, index) => (
            <Badge
              key={item.level}
              variant="outline"
              className={
                index === 0 ? 'bg-green-50 text-green-700' :
                index === 1 ? 'bg-yellow-50 text-yellow-700' :
                index === 2 ? 'bg-orange-50 text-orange-700' :
                index === 3 ? 'bg-red-50 text-red-700' :
                'bg-purple-50 text-purple-700'
              }
            >
              {item.level}: {item.percentage}%
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main component that renders all pie chart variants
export function WeatherPieCharts({ height = 300 }: { height?: number }) {
  const sampleData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherPieChartConditions data={sampleData} height={height} />
      <WeatherPieChartTemperatureRanges data={sampleData} height={height} />
      <WeatherPieChartPrecipitationLevels data={sampleData} height={height} />
      <WeatherPieChartWindCategories data={sampleData} height={height} />
      <WeatherPieChartHumidityRanges data={sampleData} height={height} />
      <WeatherPieChartUVIndex data={sampleData} height={height} />
    </div>
  );
}