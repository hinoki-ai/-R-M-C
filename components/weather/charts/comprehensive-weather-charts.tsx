'use client';

import { useMemo } from 'react';

// Import only the best chart components
import { WeatherLineChartInteractive } from './weather-line-charts';
import { WeatherBarChartPrecipitation } from './weather-bar-chart-precipitation';
import { WeatherPieChartConditions } from './weather-pie-charts';
import { WeatherAreaChartHumidity } from './weather-area-charts';
import { SystemMetricsLineChart } from './memory-performance-charts';
import { MemoryUsageAreaChart } from './memory-performance-charts';

interface ComprehensiveWeatherChartsProps {
  height?: number;
  showPerformanceCharts?: boolean;
}

// Generate sample weather data
const generateSampleWeatherData = () => {
  const data = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

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

export function ComprehensiveWeatherCharts({
  height = 300,
  showPerformanceCharts = true
}: ComprehensiveWeatherChartsProps) {
  const sampleWeatherData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Essential Weather Charts */}
      <WeatherLineChartInteractive data={sampleWeatherData} height={height} />
      <WeatherBarChartPrecipitation data={sampleWeatherData} height={height} />
      <WeatherPieChartConditions data={sampleWeatherData} height={height} />
      <WeatherAreaChartHumidity data={sampleWeatherData} height={height} />

      {/* Performance Charts (if enabled) */}
      {showPerformanceCharts && (
        <>
          <SystemMetricsLineChart height={height} />
          <MemoryUsageAreaChart height={height} />
        </>
      )}
    </div>
  );
}