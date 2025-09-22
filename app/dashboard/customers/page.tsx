import { IconMail, IconMessageCircle, IconStar, IconUsers } from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomersPage() {
  return (
    <div className='space-y-8'>
      <div className='px-4 lg:px-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-bold'>Customer Management</h1>
          <p className='text-muted-foreground'>
            Comprehensive customer relationship management and engagement tools.
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5' />
              Customer Database
            </CardTitle>
            <CardDescription>
              Complete customer records and profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2,847</div>
            <p className='text-sm text-muted-foreground'>Total customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconStar className='h-5 w-5' />
              Loyalty Program
            </CardTitle>
            <CardDescription>
              Customer loyalty and rewards management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-sm text-muted-foreground'>Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconMessageCircle className='h-5 w-5' />
              Customer Feedback
            </CardTitle>
            <CardDescription>
              Reviews, ratings, and feedback management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4.6</div>
            <p className='text-sm text-muted-foreground'>Average rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconMail className='h-5 w-5' />
              Communications
            </CardTitle>
            <CardDescription>
              Customer communication and marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-sm text-muted-foreground'>Campaigns sent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}