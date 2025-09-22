import { PublicLayout } from '@/components/layout/public-layout'

export default function MapaLayout({
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