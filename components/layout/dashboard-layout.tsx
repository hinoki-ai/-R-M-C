/**
 * PRIVATE DASHBOARD LAYOUT
 *
 * All content within the /dashboard route is PRIVATE and requires authentication.
 * This layout contains sensitive community management tools, security cameras,
 * administrative functions, and private community data.
 *
 * Public community showcase content is available on the homepage (/) for everyone to see.
 */

import Image from 'next/image'
import { AppSidebar } from '@/app/dashboard/app-sidebar'
import { LoadingBar } from '@/app/dashboard/loading-bar'
import { SiteHeader } from '@/app/dashboard/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
      className='group/layout relative'
    >
      {/* Background Image */}
      <div className='fixed inset-0 -z-10'>
        <Image
          src='/images/backgrounds/bg3.jpg'
          alt='Dashboard Background'
          fill
          className='object-cover object-center'
          priority
          quality={90}
        />
      </div>

      <AppSidebar />
      <SidebarInset>
        <LoadingBar />
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 