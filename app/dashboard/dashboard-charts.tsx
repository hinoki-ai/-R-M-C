"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 12000000, sessions: 1200 },
  { month: "Feb", revenue: 15000000, sessions: 1350 },
  { month: "Mar", revenue: 18000000, sessions: 1500 },
  { month: "Apr", revenue: 22000000, sessions: 1650 },
  { month: "May", revenue: 25000000, sessions: 1800 },
  { month: "Jun", revenue: 28000000, sessions: 1950 },
];

const occupancyData = [
  { time: "00:00", occupancy: 15 },
  { time: "04:00", occupancy: 8 },
  { time: "08:00", occupancy: 45 },
  { time: "12:00", occupancy: 78 },
  { time: "16:00", occupancy: 92 },
  { time: "20:00", occupancy: 65 },
];

const infractionsData = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 1 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 2 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 6 },
  { day: "Sun", count: 3 },
];

export function DashboardCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Key performance indicators and trends
          </p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Sessions</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Trends</TabsTrigger>
          <TabsTrigger value="infractions">Infractions</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        new Intl.NumberFormat('es-CL', {
                          style: 'currency',
                          currency: 'CLP',
                        }).format(value as number),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parking Sessions</CardTitle>
                <CardDescription>
                  Number of parking sessions per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Occupancy Pattern</CardTitle>
              <CardDescription>
                Average occupancy rate throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={occupancyData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Occupancy"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infractions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Infractions</CardTitle>
              <CardDescription>
                Number of parking violations per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={infractionsData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}