'use client';

// Force dynamic rendering to keep parity with other dashboard routes
export const dynamic = 'force-dynamic';

import { DashboardCharts } from '@/app/dashboard/dashboard-charts';

export default function DashboardChartsPage() {
  return <DashboardCharts />;
}

