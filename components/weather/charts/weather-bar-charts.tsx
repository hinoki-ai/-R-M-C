'use client';

import { useMemo } from 'react';
import { WeatherBarChartBasic } from './weather-bar-chart-basic';
import { WeatherBarChartMulti } from './weather-bar-chart-multi';
import { WeatherBarChartStacked } from './weather-bar-chart-stacked';
import { WeatherBarChartPrecipitation } from './weather-bar-chart-precipitation';
import { WeatherBarChartWind } from './weather-bar-chart-wind';
import { WeatherBarChartWeekly } from './weather-bar-chart-weekly';
import { WeatherBarChartComparison } from './weather-bar-chart-comparison';

// Weather data interfaces (shared across components)
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

// Main component that renders all bar chart variants
export function WeatherBarCharts({ height = 300 }: { height?: number }) {
  const sampleData = useMemo(() => generateSampleWeatherData(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeatherBarChartBasic data={sampleData} height={height} />
      <WeatherBarChartMulti data={sampleData} height={height} />
      <WeatherBarChartStacked data={sampleData} height={height} />
      <WeatherBarChartPrecipitation data={sampleData} height={height} />
      <WeatherBarChartWind data={sampleData} height={height} />
      <WeatherBarChartWeekly data={sampleData} height={height} />
      <WeatherBarChartComparison data={sampleData} height={height} />
    </div>
  );
}