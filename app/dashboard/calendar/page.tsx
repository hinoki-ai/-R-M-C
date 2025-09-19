import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCalendar, IconTool, IconSparkles, IconEye } from "@tabler/icons-react";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Calendar System</h1>
          <p className="text-muted-foreground">
            Comprehensive scheduling, event management, and calendar integration.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Full Calendar
            </CardTitle>
            <CardDescription>
              Complete calendar view and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-sm text-muted-foreground">Events this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTool className="h-5 w-5" />
              Maintenance Schedule
            </CardTitle>
            <CardDescription>
              Scheduled maintenance activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-sm text-muted-foreground">Maintenance tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5" />
              Event Management
            </CardTitle>
            <CardDescription>
              Special events and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-sm text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconEye className="h-5 w-5" />
              Inspection Schedule
            </CardTitle>
            <CardDescription>
              Regular inspection and audit schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Scheduled inspections</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}