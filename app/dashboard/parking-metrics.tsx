"use client";

import {
  IconActivity,
  IconAlertTriangle,
  IconCar,
  IconClock,
  IconCoin,
  IconMapPin,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconWifi,
} from "@tabler/icons-react";
import { memo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ParkingMetricsProps {
  className?: string;
}

interface MetricsData {
  totalRevenue: number;
  revenueChange: number;
  occupancyRate: number;
  occupancyChange: number;
  totalSpaces: number;
  spacesChange: number;
  activeSessions: number;
  sessionsChange: number;
  activeInfractions: number;
  infractionsChange: number;
  avgDuration: number;
  durationChange: number;
}

function ParkingMetricsComponent({ className }: ParkingMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockData: MetricsData = {
    totalRevenue: 24500000,
    revenueChange: 12.5,
    occupancyRate: 78.3,
    occupancyChange: 5.2,
    totalSpaces: 150,
    spacesChange: 0,
    activeSessions: 45,
    sessionsChange: 8.1,
    activeInfractions: 3,
    infractionsChange: -25.0,
    avgDuration: 2.3,
    durationChange: 3.7,
  };

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use mock data for now
        setMetrics(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading metrics: {error}</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const metricsConfig = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      change: metrics.revenueChange,
      icon: IconCoin,
      description: "Revenue this month",
    },
    {
      title: "Occupancy Rate",
      value: `${metrics.occupancyRate}%`,
      change: metrics.occupancyChange,
      icon: IconCar,
      description: "Current space utilization",
    },
    {
      title: "Total Spaces",
      value: metrics.totalSpaces.toString(),
      change: metrics.spacesChange,
      icon: IconMapPin,
      description: "Available parking spaces",
    },
    {
      title: "Active Sessions",
      value: metrics.activeSessions.toString(),
      change: metrics.sessionsChange,
      icon: IconActivity,
      description: "Current parking sessions",
    },
    {
      title: "Active Infractions",
      value: metrics.activeInfractions.toString(),
      change: metrics.infractionsChange,
      icon: IconAlertTriangle,
      description: "Outstanding violations",
    },
    {
      title: "Avg. Duration",
      value: `${metrics.avgDuration}h`,
      change: metrics.durationChange,
      icon: IconClock,
      description: "Average parking time",
    },
    {
      title: "System Status",
      value: "Online",
      change: 0,
      icon: IconWifi,
      description: "All systems operational",
    },
    {
      title: "Active Users",
      value: "127",
      change: 15.3,
      icon: IconUsers,
      description: "Users this week",
    },
  ];

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {metricsConfig.map((metric, index) => {
        const IconComponent = metric.icon;
        const isPositive = metric.change >= 0;
        const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`h-3 w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                    {formatPercentage(metric.change)}
                  </span>
                </div>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export const ParkingMetrics = memo(ParkingMetricsComponent);