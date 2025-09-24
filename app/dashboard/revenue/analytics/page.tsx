// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import {
  IconChartBar,
  IconTrendingUp,
  IconUsers,
  IconCurrencyDollar,
} from '@tabler/icons-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Detailed analytics and insights for revenue optimization.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCurrencyDollar className="h-5 w-5" />
              Total Revenue
            </CardTitle>
            <CardDescription>Cumulative revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,245,430</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrendingUp className="h-5 w-5" />
              Growth Rate
            </CardTitle>
            <CardDescription>Monthly revenue growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-sm text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Paying Users
            </CardTitle>
            <CardDescription>Active paying subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-sm text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartBar className="h-5 w-5" />
              ARPU
            </CardTitle>
            <CardDescription>Average revenue per user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$365</div>
            <p className="text-sm text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics Dashboard</CardTitle>
            <CardDescription>
              Detailed charts and metrics for revenue analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Revenue analytics charts will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
