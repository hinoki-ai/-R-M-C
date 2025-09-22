import { PublicLayout } from '@/components/layout/public-layout'

export default function FotosLayout({
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