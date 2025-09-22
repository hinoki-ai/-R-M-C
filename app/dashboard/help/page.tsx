import { IconBook, IconHelp, IconMessageCircle, IconVideo } from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div className='space-y-8'>
      <div className='px-4 lg:px-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-bold'>Help & Documentation</h1>
          <p className='text-muted-foreground'>
            Comprehensive help resources, documentation, and support materials.
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconBook className='h-5 w-5' />
              Documentation
            </CardTitle>
            <CardDescription>
              Complete user and API documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>247</div>
            <p className='text-sm text-muted-foreground'>Help articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconVideo className='h-5 w-5' />
              Video Tutorials
            </CardTitle>
            <CardDescription>
              Step-by-step video guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-sm text-muted-foreground'>Video tutorials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconMessageCircle className='h-5 w-5' />
              Community Support
            </CardTitle>
            <CardDescription>
              Community forums and discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>5,432</div>
            <p className='text-sm text-muted-foreground'>Community posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconHelp className='h-5 w-5' />
              Live Support
            </CardTitle>
            <CardDescription>
              24/7 customer support availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>Online</div>
            <p className='text-sm text-muted-foreground'>Support available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}