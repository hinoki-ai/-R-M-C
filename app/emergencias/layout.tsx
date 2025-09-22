import { PublicLayout } from '@/components/layout/public-layout'

export default function EmergenciasLayout({
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