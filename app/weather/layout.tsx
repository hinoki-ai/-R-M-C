import { PublicLayout } from '@/components/layout/public-layout'

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  )
}