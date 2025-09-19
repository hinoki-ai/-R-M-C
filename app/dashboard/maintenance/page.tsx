"use client";

import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconClock,
  IconTool,
  IconTools,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock maintenance data
const maintenanceTasks = [
  {
    id: "MT-001",
    title: "Replace faulty occupancy sensor",
    location: "Level 2, Space 15",
    priority: "High",
    status: "In Progress",
    assignedTo: "Juan Carlos",
    dueDate: "2024-09-20",
    description: "Sensor is not detecting vehicle presence correctly",
  },
  {
    id: "MT-002",
    title: "Repair damaged barrier gate",
    location: "Entrance A",
    priority: "Critical",
    status: "Pending",
    assignedTo: "María González",
    dueDate: "2024-09-18",
    description: "Gate mechanism is stuck and won't open properly",
  },
  {
    id: "MT-003",
    title: "Clean and calibrate payment terminals",
    location: "All Levels",
    priority: "Medium",
    status: "Scheduled",
    assignedTo: "Carlos Ruiz",
    dueDate: "2024-09-25",
    description: "Monthly maintenance and cleaning of payment hardware",
  },
  {
    id: "MT-004",
    title: "Replace LED lighting in Level 3",
    location: "Level 3, Sections A-B",
    priority: "Low",
    status: "Completed",
    assignedTo: "Ana López",
    dueDate: "2024-09-15",
    description: "Replace burned out LED panels with new units",
  },
];

const equipmentStatus = [
  {
    name: "Occupancy Sensors",
    total: 150,
    operational: 142,
    maintenance: 5,
    offline: 3,
  },
  {
    name: "Barrier Gates",
    total: 4,
    operational: 3,
    maintenance: 1,
    offline: 0,
  },
  {
    name: "Payment Terminals",
    total: 8,
    operational: 7,
    maintenance: 1,
    offline: 0,
  },
  {
    name: "LED Lighting",
    total: 200,
    operational: 195,
    maintenance: 3,
    offline: 2,
  },
];

export default function MaintenancePage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground">
            Monitor equipment status, schedule maintenance tasks, and track repairs
          </p>
        </div>
        <Button>
          <IconTool className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Equipment Status Overview */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTools className="h-5 w-5" />
              Equipment Status
            </CardTitle>
            <CardDescription>
              Current operational status of parking facility equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {equipmentStatus.map((equipment) => {
                const operationalRate = Math.round(
                  (equipment.operational / equipment.total) * 100
                );
                return (
                  <div key={equipment.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {equipment.name}
                      </span>
                      <Badge
                        variant={
                          operationalRate >= 90
                            ? "secondary"
                            : operationalRate >= 70
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {operationalRate}%
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {equipment.operational}/{equipment.total}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600">
                        {equipment.operational} operational
                      </span>
                      {equipment.maintenance > 0 && (
                        <span className="text-yellow-600">
                          {equipment.maintenance} maintenance
                        </span>
                      )}
                      {equipment.offline > 0 && (
                        <span className="text-red-600">
                          {equipment.offline} offline
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Tasks Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Maintenance Tasks
            </CardTitle>
            <CardDescription>
              Active and scheduled maintenance tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(
                          task.priority
                        )} text-white`}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Tasks
            </CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
            <IconClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <IconCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled This Week
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">8</div>
            <p className="text-xs text-muted-foreground">
              Planned for this week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}