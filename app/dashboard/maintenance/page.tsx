import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTool, IconCalendar, IconChartBar, IconBolt } from "@tabler/icons-react";
import { DASHBOARD_SPACING } from "@/lib/dashboard-spacing";

export default function MaintenancePage() {
  return (
    <div className={DASHBOARD_SPACING.page.container}>
      <div className={`${DASHBOARD_SPACING.page.header} flex justify-between items-start`}>
        <div>
          <h1 className="text-2xl font-bold">Maintenance Operations</h1>
          <p className="text-muted-foreground">
            Comprehensive maintenance scheduling, tracking, and asset management.
          </p>
        </div>
      </div>

      <div className={`${DASHBOARD_SPACING.grid.cols[4]} ${DASHBOARD_SPACING.grid.gap} ${DASHBOARD_SPACING.page.header}`}>
        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}>
              <IconTool className="h-5 w-5" />
              Maintenance Operations
            </CardTitle>
            <CardDescription>
              Scheduled and unscheduled maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}>
              <IconCalendar className="h-5 w-5" />
              Maintenance Calendar
            </CardTitle>
            <CardDescription>
              Scheduled maintenance calendar
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Scheduled tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}>
              <IconChartBar className="h-5 w-5" />
              Maintenance Analytics
            </CardTitle>
            <CardDescription>
              Maintenance performance and trends
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={DASHBOARD_SPACING.card.header}>
            <CardTitle className={`flex items-center ${DASHBOARD_SPACING.component.badge}`}>
              <IconBolt className="h-5 w-5" />
              Maintenance Automation
            </CardTitle>
            <CardDescription>
              Automated maintenance workflows
            </CardDescription>
          </CardHeader>
          <CardContent className={DASHBOARD_SPACING.card.padding}>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Automated processes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}