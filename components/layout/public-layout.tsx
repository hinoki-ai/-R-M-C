import FooterSection from '@/app/(landing)/footer'
import { AdvancedHeader } from '@/components/layout/advanced-header'
import { SocialConveyor } from '@/components/ui/social-conveyor'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <AdvancedHeader />
      <div className='pt-16'> {/* Add top padding to account for fixed header */}
        {children}
      </div>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <SocialConveyor />
      </div>
      <FooterSection />
    </>
  )
}