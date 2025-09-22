import { PublicLayout } from '@/components/layout/public-layout'

export default function CalendarioLayout({
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