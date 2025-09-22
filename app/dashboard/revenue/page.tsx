import { IconChartPie, IconCreditCard, IconReceipt, IconTrendingUp } from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RevenuePage() {
  return (
    <div className='space-y-8'>
      <div className='px-4 lg:px-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-bold'>Revenue Management</h1>
          <p className='text-muted-foreground'>
            Comprehensive revenue tracking, analysis, and optimization tools.
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconCreditCard className='h-5 w-5' />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Total revenue and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$125,430</div>
            <p className='text-sm text-muted-foreground'>This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconReceipt className='h-5 w-5' />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Payment processing and methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-sm text-muted-foreground'>Active methods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconTrendingUp className='h-5 w-5' />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Revenue growth and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>+12.5%</div>
            <p className='text-sm text-muted-foreground'>vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconChartPie className='h-5 w-5' />
              Pricing Management
            </CardTitle>
            <CardDescription>
              Dynamic pricing and rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-sm text-muted-foreground'>Active price plans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}