import { PublicLayout } from '@/components/layout/public-layout'

export default function EventosLayout({
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