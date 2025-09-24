'use client';

import { RouterProvider } from '@/lib/router-context';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
