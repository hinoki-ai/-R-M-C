// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import {
  IconBolt,
  IconCalendar,
  IconChartBar,
  IconTool,
} from '@tabler/icons-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DASHBOARD_SPACING } from '@/lib/dashboard-spacing';

export default function MaintenancePage() {
  return (
    <div className={DASHBOARD_SPACING.page.container}>
      <div
        className={`${DASHBOARD_SPACING.page.header} flex justify-between items-start`}
      >
        <div>
          <h1 className="text-2xl font-bold">Operaciones de Mantenimiento</h1>
          <p className="text-muted-foreground">
            Programación integral de mantenimiento, seguimiento y gestión de
            activos.
          </p>
        </div>
      </div>

      <div
        className={`${DASHBOARD_SPACING.grid.cols[4]} ${DASHBOARD_SPACING.grid.gap} ${DASHBOARD_SPACING.page.header}`}
      >
        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle
              className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}
            >
              <IconTool className="h-5 w-5" />
              Operaciones de Mantenimiento
            </CardTitle>
            <CardDescription>
              Mantenimiento programado y no programado
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">Tareas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle
              className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}
            >
              <IconCalendar className="h-5 w-5" />
              Calendario de Mantenimiento
            </CardTitle>
            <CardDescription>
              Calendario de mantenimiento programado
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Tareas programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle
              className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}
            >
              <IconChartBar className="h-5 w-5" />
              Análisis de Mantenimiento
            </CardTitle>
            <CardDescription>
              Rendimiento de mantenimiento y tendencias
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <p className="text-sm text-muted-foreground">Tiempo de actividad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle
              className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}
            >
              <IconBolt className="h-5 w-5" />
              Automatización de Mantenimiento
            </CardTitle>
            <CardDescription>
              Flujos de trabajo de mantenimiento automatizados
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">
              Procesos automatizados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
