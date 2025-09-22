'use client';

import { useQuery } from 'convex/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/convex/_generated/api';

// Real data from Convex database - shows 0 when no data exists
const useParticipationData = () => {
  const events = useQuery(api.calendar.getEvents, {}) || [];
  const announcements = useQuery(api.community.getAnnouncements) || [];

  // Group by month for the last 6 months
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      monthNum: date.getMonth(),
      year: date.getFullYear()
    });
  }

  return months.map(({ month, monthNum, year }) => {
    const monthEvents = events.filter((event: any) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getMonth() === monthNum && eventDate.getFullYear() === year;
    });

    const monthAnnouncements = announcements.filter((announcement: any) => {
      const announcementDate = new Date(announcement._creationTime);
      return announcementDate.getMonth() === monthNum && announcementDate.getFullYear() === year;
    });

    // Calculate attendance from events (if available)
    const totalAttendance = monthEvents.reduce((sum: number, event: any) =>
      sum + (event.attendance || 0), 0
    );

    return {
      month,
      eventos: monthEvents.length,
      asistencia: totalAttendance,
      anuncios: monthAnnouncements.length
    };
  });
};

const useMaintenanceData = () => {
  // This would need a maintenance requests query - for now showing 0
  const maintenanceRequests = useQuery(api.community.getMaintenanceRequests) || [];

  // Group by weeks for current month
  const now = new Date();
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), (i + 1) * 7 + 1);
    weeks.push({ weekStart, weekEnd });
  }

  return weeks.map((week, index) => {
    const weekRequests = maintenanceRequests.filter((request: any) => {
      const requestDate = new Date(request._creationTime);
      return requestDate >= week.weekStart && requestDate < week.weekEnd;
    });

    const completedRequests = weekRequests.filter((request: any) => request.status === 'completed');

    return {
      semana: `Sem ${index + 1}`,
      solicitudes: weekRequests.length,
      completadas: completedRequests.length
    };
  });
};

const useEngagementData = () => {
  // This would need engagement tracking - for now showing 0
  const engagementData = useQuery(api.community.getEngagementStats) || [];

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return days.map((dia, index) => {
    // Find data for this day of week
    const dayData = engagementData.find((d: any) => d.dayOfWeek === index) || { views: 0, interactions: 0 };

    return {
      dia,
      vistas: dayData.views,
      interacciones: dayData.interactions
    };
  });
};

export function DashboardCharts() {
  const participationData = useParticipationData();
  const maintenanceData = useMaintenanceData();
  const engagementData = useEngagementData();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Estadísticas Comunidad</h2>
          <p className='text-sm text-muted-foreground'>
            Indicadores clave de participación y actividad comunitaria (datos reales - muestra 0 si no hay datos)
          </p>
        </div>
      </div>

      <Tabs defaultValue='participacion' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='participacion'>Participación</TabsTrigger>
          <TabsTrigger value='mantenimiento'>Mantenimiento</TabsTrigger>
          <TabsTrigger value='engagement'>Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value='participacion' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Eventos y Asistencia</CardTitle>
                <CardDescription>
                  Participación en eventos comunitarios últimos 6 meses (datos reales)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <AreaChart data={participationData}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type='monotone'
                      dataKey='asistencia'
                      stroke='#10b981'
                      fill='#10b981'
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anuncios Publicados</CardTitle>
                <CardDescription>
                  Número de anuncios publicados por mes (datos reales)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={participationData}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='anuncios' fill='#82ca9d' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='mantenimiento' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Mantenimiento</CardTitle>
              <CardDescription>
                Solicitudes y trabajos completados por semana (datos reales)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart data={maintenanceData}>
                  <XAxis dataKey='semana' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='solicitudes' fill='#3b82f6' />
                  <Bar dataKey='completadas' fill='#10b981' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='engagement' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Engagement Diario</CardTitle>
              <CardDescription>
                Vistas e interacciones por día de la semana (datos reales)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={engagementData}>
                  <XAxis dataKey='dia' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='vistas' fill='#8b5cf6' />
                  <Bar dataKey='interacciones' fill='#06b6d4' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}