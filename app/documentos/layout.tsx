import { PublicLayout } from '@/components/layout/public-layout'

export default function DocumentosLayout({
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