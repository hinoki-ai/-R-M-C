import { AdvancedHeader } from '@/components/layout/advanced-header'

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdvancedHeader />
      <div className='pt-16'> {/* Add top padding to account for fixed header */}
        {children}
      </div>
    </>
  )
}