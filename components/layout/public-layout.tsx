import FooterSection from '@/app/(landing)/footer'
import { AdvancedHeader } from '@/components/layout/advanced-header'

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
      <FooterSection />
    </>
  )
}