'use client';

import { useUser } from '@clerk/nextjs';
import {
  IconActivity,
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendar,
  IconCircleCheck,
  IconCloud,
  IconHome,
  IconMessage,
  IconPhone,
  IconShield,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

import { MobileCard, MobileDashboard } from '@/components/dashboard/mobile-dashboard';
import { Badge } from '@/components/ui/badge';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardSection } from '@/components/ui/loading-wrapper';
import { FloatingElement, InteractiveCard, PulseElement } from '@/components/ui/magnetic-button';
import { ScrollReveal, StaggerReveal } from '@/components/ui/scroll-progress';
import { DASHBOARD_SPACING } from '@/lib/dashboard-spacing';




// Community Events Component
function CommunityEvents() {
  const events = [
    { id: 1, title: 'Reunión Ordinaria Junta', date: '15 Nov', time: '19:00', location: 'Salón Comunal' },
    { id: 2, title: 'Campaña de Reciclaje', date: '20 Nov', time: '10:00', location: 'Plaza Principal' },
    { id: 3, title: 'Fiesta de Navidad', date: '25 Dic', time: '18:00', location: 'Centro Comunitario' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconCalendar className='h-5 w-5' />
          Eventos Comunidad
        </CardTitle>
        <CardDescription>Próximos eventos y actividades comunitarias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {events.map((event) => (
            <div key={event.id} className='flex items-center justify-between p-3 bg-muted rounded'>
              <div>
                <p className='font-medium text-sm'>{event.title}</p>
                <p className='text-xs text-muted-foreground'>{event.location}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>{event.date}</p>
                <p className='text-xs text-muted-foreground'>{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Weather & Safety Component
function WeatherOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconCloud className='h-5 w-5' />
          Clima y Alertas
        </CardTitle>
        <CardDescription>Condiciones climáticas y alertas de seguridad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='text-center'>
            <p className='text-3xl font-bold'>22°C</p>
            <p className='text-sm text-muted-foreground'>Soleado</p>
            <p className='text-xs text-muted-foreground mt-2'>Actualizado hace 5 min</p>
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex justify-between'>
              <span>Humedad:</span>
              <span className='font-medium'>65%</span>
            </div>
            <div className='flex justify-between'>
              <span>Viento:</span>
              <span className='font-medium'>15 km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Neighborhood Security Component
function NeighborhoodSecurity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconShield className='h-5 w-5' />
          Seguridad Barrial
        </CardTitle>
        <CardDescription>Monitoreo y alertas de seguridad comunitaria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-600'>8/10</p>
              <p className='text-sm text-muted-foreground'>Cámaras Activas</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-blue-600'>2</p>
              <p className='text-sm text-muted-foreground'>Alertas Hoy</p>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Estado del Sistema:</span>
              <Badge variant='default'>Operativo</Badge>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Última Verificación:</span>
              <span className='font-medium'>Hace 15 min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Neighborhood Directory Component
function NeighborhoodDirectory() {
  const services = [
    { name: 'Directiva Junta de Vecinos', contact: 'María González', role: 'Presidenta' },
    { name: 'Secretaría', contact: 'Carlos Rodríguez', role: 'Secretario' },
    { name: 'Tesorería', contact: 'Ana López', role: 'Tesorera' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconHome className='h-5 w-5' />
          Directorio Barrial
        </CardTitle>
        <CardDescription>Contactos importantes de la junta de vecinos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {services.map((service, index) => (
            <div key={index} className='flex items-center justify-between p-3 bg-muted rounded'>
              <div>
                <p className='font-medium text-sm'>{service.name}</p>
                <p className='text-xs text-muted-foreground'>{service.contact}</p>
              </div>
              <Badge variant='outline'>{service.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'announcement',
      title: 'Nuevo anuncio: Reunión extraordinaria',
      timeValue: '2',
      timeUnit: 'horas',
      status: 'info',
      icon: IconMessage,
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Solicitud de mantenimiento completada',
      timeValue: '4',
      timeUnit: 'horas',
      status: 'success',
      icon: IconCircleCheck,
    },
    {
      id: 3,
      type: 'emergency',
      title: 'Alerta de seguridad en zona norte',
      timeValue: '6',
      timeUnit: 'horas',
      status: 'urgent',
      icon: IconAlertTriangle,
    },
    {
      id: 4,
      type: 'event',
      title: 'Nuevo evento: Campaña de reciclaje',
      timeValue: '1',
      timeUnit: 'día',
      status: 'info',
      icon: IconCalendar,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimeString = (activity: typeof activities[0]) => {
    return `Hace ${activity.timeValue} ${activity.timeUnit}`;
  };

  const getActivityTitle = (activity: typeof activities[0]) => {
    return activity.title;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'Urgente';
      case 'success':
        return 'Completado';
      case 'info':
        return 'Información';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconActivity className='h-5 w-5' />
          Actividad Reciente
        </CardTitle>
        <CardDescription>
          Últimas actividades y actualizaciones comunitarias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.map((activity) => {
            const IconComponent = activity.icon;

            return (
              <div key={activity.id} className='flex items-center gap-3'>
                <div
                  className={`p-1 rounded-full ${getStatusColor(activity.status)}`}
                >
                  <IconComponent className='h-3 w-3 text-white' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>
                    {getActivityTitle(activity)}
                  </p>
                  <p className='text-xs text-muted-foreground'>{getTimeString(activity)}</p>
                </div>
                <Badge
                  variant={
                    activity.status === 'urgent' ? 'destructive' : 'secondary'
                  }
                  className='text-xs'
                >
                  {getStatusText(activity.status)}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenanceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconAlertCircle className='h-5 w-5' />
          Maintenance Overview
        </CardTitle>
        <CardDescription>
          Upcoming and overdue maintenance tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex items-center gap-3'>
            <IconCalendar className='h-8 w-8 text-blue-500' />
            <div>
              <p className='text-2xl font-bold'>5</p>
              <p className='text-xs text-muted-foreground'>Scheduled</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <IconAlertTriangle className='h-8 w-8 text-red-500' />
            <div>
              <p className='text-2xl font-bold text-red-600'>2</p>
              <p className='text-xs text-muted-foreground'>Overdue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate initial loading for better UX demonstration
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setIsInitialLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const isPremium = user?.publicMetadata?.subscription === 'premium' ||
                   user?.publicMetadata?.role === 'admin';
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Handle refresh for mobile pull-to-refresh
  const handleRefresh = async () => {
    setIsInitialLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsInitialLoading(false);
  };

  const dashboardContent = (
    <div className={DASHBOARD_SPACING.page.container}>
      {/* Page Header */}
      <div className={`${DASHBOARD_SPACING.page.header} flex justify-between items-start`}>
        <div>
          <h1 className='text-3xl font-bold'>Panel de Junta de Vecinos</h1>
          <p className='text-muted-foreground'>
            Resumen ejecutivo del estado comunitario y métricas clave.
          </p>
          <div className={`flex items-center ${DASHBOARD_SPACING.element.tight} mt-3`}>
            <Badge variant={isPremium || isAdmin ? 'default' : 'secondary'}>
              {isAdmin ? 'Admin' : isPremium ? 'Premium' : 'Free'}
            </Badge>
            {!isPremium && !isAdmin && (
              <Badge variant='outline' className='text-xs'>
                Limited Access
              </Badge>
            )}
          </div>
        </div>
      </div>

      <BentoGrid className='px-4 lg:px-6'>

      {/* Dashboard Summary Metrics */}
      <ScrollReveal direction='up' delay={100}>
        <BentoGridItem colSpan={4} className='p-6'>
          <DashboardSection isLoading={isInitialLoading} type='metrics'>
            <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='hover:shadow-md transition-shadow duration-200 border-0 bg-muted/30'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Alertas Activas</CardTitle>
                <IconAlertTriangle className='h-4 w-4 text-red-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>2</div>
                <p className='text-xs text-muted-foreground'>Requieren atención inmediata</p>
              </CardContent>
            </Card>
            <Card className='hover:shadow-md transition-shadow duration-200 border-0 bg-muted/30'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Solicitudes Pendientes</CardTitle>
                <IconAlertCircle className='h-4 w-4 text-orange-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-orange-600'>5</div>
                <p className='text-xs text-muted-foreground'>Mantenimiento y reparaciones</p>
              </CardContent>
            </Card>
            <Card className='hover:shadow-md transition-shadow duration-200 border-0 bg-muted/30'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Eventos Próximos</CardTitle>
                <IconCalendar className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-blue-600'>3</div>
                <p className='text-xs text-muted-foreground'>Esta semana</p>
              </CardContent>
            </Card>
            <Card className='hover:shadow-md transition-shadow duration-200 border-0 bg-muted/30'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Participación</CardTitle>
                <IconUsers className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>85%</div>
                <p className='text-xs text-muted-foreground'>Asistencia promedio</p>
              </CardContent>
            </Card>
          </div>
        </DashboardSection>
      </BentoGridItem>
      </ScrollReveal>

      {/* Quick Access Navigation */}
      <StaggerReveal staggerDelay={150} direction='up'>
        <BentoGridItem colSpan={1}>
          <Link href='/dashboard/announcements'>
            <InteractiveCard
              className='h-full border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
              magnetic={true}
              glowOnHover={true}
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FloatingElement>
                    <IconMessage className='h-5 w-5 text-blue-600' />
                  </FloatingElement>
                  Anuncios
                </CardTitle>
                <CardDescription>2 anuncios activos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>Último: Reunión Junta Ordinaria</p>
                <div className='mt-3'>
                  <Badge variant='default' className='text-xs'>Ver detalles →</Badge>
                </div>
              </CardContent>
            </InteractiveCard>
          </Link>
        </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <Link href='/dashboard/maintenance'>
          <InteractiveCard
            className='h-full border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900'
            magnetic={true}
            glowOnHover={true}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <PulseElement pulse={true} pulseColor='orange'>
                  <IconAlertCircle className='h-5 w-5 text-orange-600' />
                </PulseElement>
                Mantenimiento
              </CardTitle>
              <CardDescription>5 solicitudes pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>Crítico: Reparación de semáforo</p>
              <div className='mt-3'>
                <Badge variant='default' className='text-xs'>Ver detalles →</Badge>
              </div>
            </CardContent>
          </InteractiveCard>
        </Link>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <Link href='/dashboard/events'>
          <InteractiveCard
            className='h-full border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900'
            magnetic={true}
            glowOnHover={true}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FloatingElement delay={0.5}>
                  <IconCalendar className='h-5 w-5 text-green-600' />
                </FloatingElement>
                Eventos
              </CardTitle>
              <CardDescription>3 eventos próximos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>Próximo: Taller de Compostaje</p>
              <div className='mt-3'>
                <Badge variant='default' className='text-xs'>Ver detalles →</Badge>
              </div>
            </CardContent>
          </InteractiveCard>
        </Link>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <Link href='/dashboard/emergencies'>
          <InteractiveCard
            className='h-full border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900'
            magnetic={true}
            glowOnHover={true}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <PulseElement pulse={true} pulseColor='red'>
                  <IconAlertTriangle className='h-5 w-5 text-red-600' />
                </PulseElement>
                Emergencias
              </CardTitle>
              <CardDescription>2 alertas activas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>Crítico: Alerta de incendio</p>
              <div className='mt-3'>
                <Badge variant='destructive' className='text-xs'>Ver detalles →</Badge>
              </div>
            </CardContent>
          </InteractiveCard>
        </Link>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <Link href='/dashboard/cameras'>
          <InteractiveCard
            className='h-full border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'
            magnetic={true}
            glowOnHover={true}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FloatingElement delay={1}>
                  <IconShield className='h-5 w-5 text-purple-600' />
                </FloatingElement>
                Seguridad
              </CardTitle>
              <CardDescription>Sistema operativo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>8/10 cámaras activas</p>
              <div className='mt-3'>
                <Badge variant='default' className='text-xs'>Ver detalles →</Badge>
              </div>
            </CardContent>
          </InteractiveCard>
        </Link>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <Link href='/dashboard/weather'>
          <InteractiveCard
            className='h-full border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900'
            magnetic={true}
            glowOnHover={true}
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FloatingElement delay={1.5}>
                  <IconCloud className='h-5 w-5 text-cyan-600' />
                </FloatingElement>
                Clima
              </CardTitle>
              <CardDescription>Condiciones actuales</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>22°C - Soleado</p>
              <div className='mt-3'>
                <Badge variant='default' className='text-xs'>Ver detalles →</Badge>
              </div>
            </CardContent>
          </InteractiveCard>
        </Link>
      </BentoGridItem>
      </StaggerReveal>

      {/* Recent Activity Summary */}
      <ScrollReveal direction='right' delay={200}>
        <BentoGridItem colSpan={2} rowSpan={2}>
        <DashboardSection isLoading={isInitialLoading} type='activity'>
          <Card className='h-full border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconActivity className='h-5 w-5' />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas actualizaciones comunitarias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-1 rounded-full bg-red-500'>
                    <IconAlertTriangle className='h-3 w-3 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Nueva alerta de seguridad en zona norte</p>
                    <p className='text-xs text-muted-foreground'>Hace 30 minutos</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-1 rounded-full bg-green-500'>
                    <IconCircleCheck className='h-3 w-3 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Solicitud de mantenimiento completada</p>
                    <p className='text-xs text-muted-foreground'>Hace 2 horas</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-1 rounded-full bg-blue-500'>
                    <IconCalendar className='h-3 w-3 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Nuevo evento: Campaña de reciclaje</p>
                    <p className='text-xs text-muted-foreground'>Hace 4 horas</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-1 rounded-full bg-purple-500'>
                    <IconShield className='h-3 w-3 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Cámara de seguridad reactivada</p>
                    <p className='text-xs text-muted-foreground'>Hace 6 horas</p>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </DashboardSection>
      </BentoGridItem>
      </ScrollReveal>

      {/* Quick Actions */}
      <StaggerReveal staggerDelay={100} direction='fade'>
        <BentoGridItem colSpan={1}>
        <MobileCard className='h-full border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-lg transition-all duration-300 hover:scale-105'>
          <CardContent className='flex flex-col items-center justify-center py-6'>
            <IconMessage className='h-8 w-8 text-blue-600 mb-2' />
            <p className='text-sm font-medium'>Nuevo Anuncio</p>
          </CardContent>
        </MobileCard>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <MobileCard className='h-full border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 hover:shadow-lg transition-all duration-300 hover:scale-105'>
          <CardContent className='flex flex-col items-center justify-center py-6'>
            <IconAlertCircle className='h-8 w-8 text-orange-600 mb-2' />
            <p className='text-sm font-medium'>Reportar Problema</p>
          </CardContent>
        </MobileCard>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <MobileCard className='h-full border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-lg transition-all duration-300 hover:scale-105'>
          <CardContent className='flex flex-col items-center justify-center py-6'>
            <IconCalendar className='h-8 w-8 text-green-600 mb-2' />
            <p className='text-sm font-medium'>Crear Evento</p>
          </CardContent>
        </MobileCard>
      </BentoGridItem>

      <BentoGridItem colSpan={1}>
        <MobileCard className='h-full border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 hover:shadow-lg transition-all duration-300 hover:scale-105'>
          <CardContent className='flex flex-col items-center justify-center py-6'>
            <IconPhone className='h-8 w-8 text-red-600 mb-2' />
            <p className='text-sm font-medium'>Contactos</p>
          </CardContent>
        </MobileCard>
      </BentoGridItem>
      </StaggerReveal>

      </BentoGrid>
    </div>
  );

  // Return mobile or desktop version
  return isMobile ? (
    <MobileDashboard onRefresh={handleRefresh}>
      {dashboardContent}
    </MobileDashboard>
  ) : (
    dashboardContent
  );
}

export default function Page() {
  return (
      <Suspense fallback={
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading dashboard...</p>
          </div>
        </div>
      }>
      <DashboardContent />
    </Suspense>
  );
}

