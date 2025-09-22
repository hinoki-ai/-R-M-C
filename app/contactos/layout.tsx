import { PublicLayout } from '@/components/layout/public-layout'

export default function ContactosLayout({
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