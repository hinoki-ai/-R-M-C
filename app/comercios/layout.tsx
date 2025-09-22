import { PublicLayout } from '@/components/layout/public-layout'

export default function ComerciosLayout({
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