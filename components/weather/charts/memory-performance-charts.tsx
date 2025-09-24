'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { Cpu, MemoryStick, HardDrive, Zap, Server, Database } from 'lucide-react';

// Performance and Memory data interfaces
interface SystemMetricsPoint {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  memoryPercentage: number;
  diskUsage?: number;
  diskPercentage?: number;
  activeConnections?: number;
  loadAverage?: number[];
  component: string;
  environment: string;
}

interface PerformanceMetricsPoint {
  timestamp: number;
  pageLoadTime?: number;
  apiResponseTime?: number;
  errorRate?: number;
  userSatisfaction?: number;
  page?: string;
  deviceType: string;
}

interface MemoryUsagePoint {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  rss?: number;
  component: string;
  environment: string;
}

interface MemoryPerformanceChartsProps {
  systemData?: SystemMetricsPoint[];
  performanceData?: PerformanceMetricsPoint[];
  memoryData?: MemoryUsagePoint[];
  height?: number;
}

// Generate sample performance and memory data
const generateSampleSystemData = (): SystemMetricsPoint[] => {
  const data: SystemMetricsPoint[] = [];
  const now = new Date();

  for (let i = 48; i >= 0; i--) { // 48 hours of data
    const date = new Date(now);
    date.setHours(date.getHours() - i);

    data.push({
      timestamp: date.getTime(),
      cpuUsage: Math.max(0, Math.min(100, 20 + Math.sin((i / 24) * 2 * Math.PI) * 15 + (Math.random() - 0.5) * 10)),
      memoryUsage: 1024 + Math.sin((i / 12) * 2 * Math.PI) * 256 + (Math.random() - 0.5) * 128,
      memoryPercentage: Math.max(0, Math.min(100, 45 + Math.sin((i / 12) * 2 * Math.PI) * 15 + (Math.random() - 0.5) * 5)),
      diskUsage: 50 + Math.sin((i / 24) * 2 * Math.PI) * 10 + (Math.random() - 0.5) * 5,
      diskPercentage: Math.max(0, Math.min(100, 65 + Math.sin((i / 24) * 2 * Math.PI) * 8 + (Math.random() - 0.5) * 3)),
      activeConnections: Math.max(0, Math.round(50 + Math.sin((i / 6) * 2 * Math.PI) * 25 + Math.random() * 10)),
      loadAverage: [
        Math.max(0, 1.5 + Math.sin((i / 8) * 2 * Math.PI) * 0.8 + Math.random() * 0.3),
        Math.max(0, 1.2 + Math.sin((i / 8) * 2 * Math.PI) * 0.6 + Math.random() * 0.2),
        Math.max(0, 1.0 + Math.sin((i / 8) * 2 * Math.PI) * 0.4 + Math.random() * 0.1),
      ],
      component: 'web_app',
      environment: 'production',
    });
  }

  return data;
};

const generateSamplePerformanceData = (): PerformanceMetricsPoint[] => {
  const data: PerformanceMetricsPoint[] = [];
  const now = new Date();

  for (let i = 24; i >= 0; i--) { // 24 hours of data
    const date = new Date(now);
    date.setHours(date.getHours() - i);

    data.push({
      timestamp: date.getTime(),
      pageLoadTime: Math.max(500, 1200 + Math.sin((i / 12) * 2 * Math.PI) * 300 + (Math.random() - 0.5) * 200),
      apiResponseTime: Math.max(50, 150 + Math.sin((i / 8) * 2 * Math.PI) * 50 + (Math.random() - 0.5) * 30),
      errorRate: Math.max(0, Math.min(5, 0.5 + Math.sin((i / 16) * 2 * Math.PI) * 0.8 + Math.random() * 0.3)),
      userSatisfaction: Math.max(0, Math.min(100, 85 + Math.sin((i / 12) * 2 * Math.PI) * 8 + (Math.random() - 0.5) * 5)),
      page: i % 3 === 0 ? '/dashboard' : i % 3 === 1 ? '/weather' : '/home',
      deviceType: i % 2 === 0 ? 'desktop' : i % 3 === 0 ? 'mobile' : 'tablet',
    });
  }

  return data;
};

const generateSampleMemoryData = (): MemoryUsagePoint[] => {
  const data: MemoryUsagePoint[] = [];
  const now = new Date();

  for (let i = 72; i >= 0; i--) { // 72 hours of data
    const date = new Date(now);
    date.setHours(date.getHours() - i);

    data.push({
      timestamp: date.getTime(),
      heapUsed: 200 + Math.sin((i / 24) * 2 * Math.PI) * 100 + (Math.random() - 0.5) * 50,
      heapTotal: 512 + Math.sin((i / 48) * 2 * Math.PI) * 128 + (Math.random() - 0.5) * 32,
      rss: 350 + Math.sin((i / 24) * 2 * Math.PI) * 150 + (Math.random() - 0.5) * 75,
      component: i % 2 === 0 ? 'web_app' : i % 3 === 0 ? 'api_server' : 'database',
      environment: 'production',
    });
  }

  return data;
};

export function SystemMetricsLineChart({ data, height = 300 }: { data?: SystemMetricsPoint[], height?: number }) {
  const sampleData = useMemo(() => data || generateSampleSystemData(), [data]);

  const chartData = useMemo(() => {
    return sampleData.slice(-24).map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date(point.timestamp).toLocaleDateString('es-CL'),
    }));
  }, [sampleData]);

  const chartConfig = {
    cpuUsage: {
      label: 'CPU',
      color: 'hsl(var(--chart-1))',
    },
    memoryPercentage: {
      label: 'Memoria',
      color: 'hsl(var(--chart-2))',
    },
    diskPercentage: {
      label: 'Disco',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-blue-600" />
          <span>Métricas del Sistema - Uso de Recursos</span>
        </CardTitle>
        <CardDescription>
          CPU, memoria y uso de disco en las últimas 24 horas
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
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Hora: ${value}`}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}${name === 'cpuUsage' || name.includes('Percentage') ? '%' : ''}`,
                    name === 'cpuUsage' ? 'CPU' : name === 'memoryPercentage' ? 'Memoria' : 'Disco'
                  ]}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpuUsage"
              stroke="var(--color-cpuUsage)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="memoryPercentage"
              stroke="var(--color-memoryPercentage)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="diskPercentage"
              stroke="var(--color-diskPercentage)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function MemoryUsageAreaChart({ data, height = 300 }: { data?: MemoryUsagePoint[], height?: number }) {
  const sampleData = useMemo(() => data || generateSampleMemoryData(), [data]);

  const chartData = useMemo(() => {
    return sampleData.slice(-48).map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date(point.timestamp).toLocaleDateString('es-CL'),
      heapUsedMB: Math.round(point.heapUsed),
      heapTotalMB: Math.round(point.heapTotal),
      rssMB: point.rss ? Math.round(point.rss) : undefined,
    }));
  }, [sampleData]);

  const chartConfig = {
    heapUsedMB: {
      label: 'Heap Usado',
      color: 'hsl(var(--chart-1))',
    },
    heapTotalMB: {
      label: 'Heap Total',
      color: 'hsl(var(--chart-2))',
    },
    rssMB: {
      label: 'RSS',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MemoryStick className="w-5 h-5 text-green-600" />
          <span>Uso de Memoria - Historial</span>
        </CardTitle>
        <CardDescription>
          Memoria heap y RSS en las últimas 48 horas
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
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} MB`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
                />
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="heapUsedMB"
              stackId="1"
              stroke="var(--color-heapUsedMB)"
              fill="var(--color-heapUsedMB)"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="rssMB"
              stroke="var(--color-rssMB)"
              fill="var(--color-rssMB)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceMetricsBarChart({ data, height = 300 }: { data?: PerformanceMetricsPoint[], height?: number }) {
  const sampleData = useMemo(() => data || generateSamplePerformanceData(), [data]);

  const chartData = useMemo(() => {
    // Group by device type and calculate averages
    const deviceStats = sampleData.reduce((acc, point) => {
      if (!acc[point.deviceType]) {
        acc[point.deviceType] = {
          count: 0,
          totalLoadTime: 0,
          totalApiTime: 0,
          totalErrors: 0,
          totalSatisfaction: 0,
        };
      }

      acc[point.deviceType].count += 1;
      acc[point.deviceType].totalLoadTime += point.pageLoadTime || 0;
      acc[point.deviceType].totalApiTime += point.apiResponseTime || 0;
      acc[point.deviceType].totalErrors += point.errorRate || 0;
      acc[point.deviceType].totalSatisfaction += point.userSatisfaction || 0;

      return acc;
    }, {} as Record<string, any>);

    return Object.entries(deviceStats).map(([device, stats]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      avgLoadTime: Math.round(stats.totalLoadTime / stats.count),
      avgApiTime: Math.round(stats.totalApiTime / stats.count),
      avgErrorRate: Math.round((stats.totalErrors / stats.count) * 10) / 10,
      avgSatisfaction: Math.round(stats.totalSatisfaction / stats.count),
    }));
  }, [sampleData]);

  const chartConfig = {
    avgLoadTime: {
      label: 'Tiempo de Carga',
      color: 'hsl(var(--chart-1))',
    },
    avgApiTime: {
      label: 'Tiempo API',
      color: 'hsl(var(--chart-2))',
    },
    avgSatisfaction: {
      label: 'Satisfacción',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span>Rendimiento por Dispositivo</span>
        </CardTitle>
        <CardDescription>
          Métricas de rendimiento agrupadas por tipo de dispositivo
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
              dataKey="device"
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    name === 'avgSatisfaction' ? `${value}%` :
                    name.includes('Time') ? `${value}ms` :
                    name === 'avgErrorRate' ? `${value}%` : value,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="avgLoadTime"
              fill="var(--color-avgLoadTime)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="avgApiTime"
              fill="var(--color-avgApiTime)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="avgSatisfaction"
              fill="var(--color-avgSatisfaction)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function SystemLoadAverageChart({ data, height = 300 }: { data?: SystemMetricsPoint[], height?: number }) {
  const sampleData = useMemo(() => data || generateSampleSystemData(), [data]);

  const chartData = useMemo(() => {
    return sampleData.slice(-24).map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      load1: point.loadAverage?.[0] || 0,
      load5: point.loadAverage?.[1] || 0,
      load15: point.loadAverage?.[2] || 0,
    }));
  }, [sampleData]);

  const chartConfig = {
    load1: {
      label: '1 min',
      color: 'hsl(var(--chart-1))',
    },
    load5: {
      label: '5 min',
      color: 'hsl(var(--chart-2))',
    },
    load15: {
      label: '15 min',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          <span>Carga del Sistema - Promedios</span>
        </CardTitle>
        <CardDescription>
          Load average del sistema (1, 5 y 15 minutos)
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
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    Number(value).toFixed(2),
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="load1"
              stroke="var(--color-load1)"
              strokeWidth={3}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="load5"
              stroke="var(--color-load5)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="load15"
              stroke="var(--color-load15)"
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={{ r: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ConnectionsAndErrorsChart({ data, height = 300 }: { data?: SystemMetricsPoint[], height?: number }) {
  const sampleData = useMemo(() => data || generateSampleSystemData(), [data]);

  const chartData = useMemo(() => {
    return sampleData.slice(-24).map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      connections: point.activeConnections || 0,
    }));
  }, [sampleData]);

  const chartConfig = {
    connections: {
      label: 'Conexiones Activas',
      color: 'hsl(var(--chart-4))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>Conexiones y Estado del Sistema</span>
        </CardTitle>
        <CardDescription>
          Número de conexiones activas en el tiempo
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
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value}`, 'Conexiones Activas']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="connections"
              stroke="var(--color-connections)"
              fill="var(--color-connections)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex justify-center mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Pico de Conexiones: {Math.max(...chartData.map(d => d.connections))}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Main component that renders all memory and performance chart variants
export function MemoryPerformanceCharts({
  systemData,
  performanceData,
  memoryData,
  height = 300
}: MemoryPerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SystemMetricsLineChart data={systemData} height={height} />
      <MemoryUsageAreaChart data={memoryData} height={height} />
      <PerformanceMetricsBarChart data={performanceData} height={height} />
      <SystemLoadAverageChart data={systemData} height={height} />
      <ConnectionsAndErrorsChart data={systemData} height={height} />
    </div>
  );
}