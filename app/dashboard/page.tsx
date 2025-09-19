"use client";

import { DashboardCharts } from "@/app/dashboard/dashboard-charts";
import { ParkingLotMonitor } from "@/app/dashboard/parking-lot-monitor";
import { ParkingMetrics } from "@/app/dashboard/parking-metrics";
import {
  IconActivity,
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendar,
  IconCircleCheck,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "infraction",
      space: "23B",
      timeValue: "5",
      timeUnit: "minutes",
      status: "urgent",
      icon: IconAlertTriangle,
    },
    {
      id: 2,
      type: "session",
      space: "15A",
      timeValue: "12",
      timeUnit: "minutes",
      status: "info",
      icon: IconCircleCheck,
    },
    {
      id: 3,
      type: "maintenance",
      item: "occupancy sensors",
      timeValue: "1",
      timeUnit: "hour",
      status: "success",
      icon: IconCircleCheck,
    },
    {
      id: 4,
      type: "payment",
      amount: "$24.500.000",
      timeValue: "2",
      timeUnit: "hours",
      status: "success",
      icon: IconTrendingUp,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityTitle = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case "infraction":
        return `Overstay infraction in space ${activity.space}`;
      case "session":
        return `New parking session started in space ${activity.space}`;
      case "maintenance":
        return `Maintenance completed on ${activity.item}`;
      case "payment":
        return `Payment received: ${activity.amount}`;
      default:
        return activity.type;
    }
  };

  const getTimeString = (activity: typeof activities[0]) => {
    return `${activity.timeValue} ${activity.timeUnit} ago`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "urgent":
        return "Urgent";
      case "success":
        return "Success";
      case "info":
        return "Info";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconActivity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest system events and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;

            return (
              <div key={activity.id} className="flex items-center gap-3">
                <div
                  className={`p-1 rounded-full ${getStatusColor(activity.status)}`}
                >
                  <IconComponent className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getActivityTitle(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">{getTimeString(activity)}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "urgent" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {getStatusText(activity.status)}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenanceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertCircle className="h-5 w-5" />
          Maintenance Overview
        </CardTitle>
        <CardDescription>
          Upcoming and overdue maintenance tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <IconCalendar className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IconAlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Parking Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your parking operations, track performance metrics, and manage system activities in real-time.
          </p>
        </div>
      </div>

      {/* Parking Metrics */}
      <div className="px-4 lg:px-6">
        <ParkingMetrics />
      </div>

      {/* Dashboard Charts */}
      <div className="px-4 lg:px-6">
        <DashboardCharts />
      </div>

      {/* Parking Lot Monitor */}
      <ParkingLotMonitor />

      {/* Secondary Insights */}
      <div className="grid gap-6 md:grid-cols-2 px-4 lg:px-6">
        <RecentActivity />
        <MaintenanceOverview />
      </div>
    </div>
  );
}
