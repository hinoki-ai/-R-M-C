"use client";

import {
  IconUser,
  IconUsers,
  IconMail,
  IconPhone,
  IconCar,
  IconCalendar,
  IconMapPin,
  IconCreditCard,
  IconSearch,
  IconPlus,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock customer data
const customers = [
  {
    id: "CUS-001",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+56 9 1234 5678",
    vehicleCount: 2,
    totalSpent: 450000,
    lastVisit: "2024-09-18",
    status: "Active",
    membership: "Premium",
    violations: 0,
  },
  {
    id: "CUS-002",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+56 9 2345 6789",
    vehicleCount: 1,
    totalSpent: 285000,
    lastVisit: "2024-09-17",
    status: "Active",
    membership: "Standard",
    violations: 1,
  },
  {
    id: "CUS-003",
    name: "Ana López",
    email: "ana.lopez@email.com",
    phone: "+56 9 3456 7890",
    vehicleCount: 3,
    totalSpent: 720000,
    lastVisit: "2024-09-16",
    status: "Active",
    membership: "VIP",
    violations: 0,
  },
  {
    id: "CUS-004",
    name: "Juan Martínez",
    email: "juan.martinez@email.com",
    phone: "+56 9 4567 8901",
    vehicleCount: 1,
    totalSpent: 120000,
    lastVisit: "2024-09-15",
    status: "Inactive",
    membership: "Basic",
    violations: 2,
  },
];

const customerSegments = [
  {
    segment: "VIP Members",
    count: 45,
    avgSpent: 850000,
    avgVisits: 25,
    color: "bg-purple-500",
  },
  {
    segment: "Premium Members",
    count: 120,
    avgSpent: 450000,
    avgVisits: 18,
    color: "bg-blue-500",
  },
  {
    segment: "Standard Members",
    count: 280,
    avgSpent: 220000,
    avgVisits: 12,
    color: "bg-green-500",
  },
  {
    segment: "Basic Users",
    count: 450,
    avgSpent: 95000,
    avgVisits: 6,
    color: "bg-gray-500",
  },
];

const recentActivity = [
  {
    customer: "María González",
    action: "Payment completed",
    amount: 25000,
    time: "2 hours ago",
    type: "payment",
  },
  {
    customer: "Carlos Rodríguez",
    action: "Vehicle registered",
    amount: null,
    time: "4 hours ago",
    type: "registration",
  },
  {
    customer: "Ana López",
    action: "Membership upgraded",
    amount: null,
    time: "6 hours ago",
    type: "upgrade",
  },
  {
    customer: "Juan Martínez",
    action: "Violation issued",
    amount: null,
    time: "1 day ago",
    type: "violation",
  },
];

export default function CustomersPage() {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgRevenuePerCustomer = Math.round(totalRevenue / totalCustomers);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Standard":
        return "bg-green-100 text-green-800";
      case "Basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return IconCreditCard;
      case "registration":
        return IconCar;
      case "upgrade":
        return IconUser;
      case "violation":
        return IconMapPin;
      default:
        return IconUser;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer profiles, track behavior, and analyze customer segments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconSearch className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <IconUsers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IconCreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Revenue/Customer
            </CardTitle>
            <IconUser className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(avgRevenuePerCustomer)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Retention
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <p className="text-xs text-muted-foreground">
              30-day retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4 px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="customers">Customer List</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>
                Complete list of registered customers and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-9" />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <IconMail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IconPhone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCar className="h-4 w-4" />
                          {customer.vehicleCount}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getMembershipColor(customer.membership)}>
                          {customer.membership}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
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
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {customerSegments.map((segment) => (
              <Card key={segment.segment}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                    {segment.segment}
                  </CardTitle>
                  <CardDescription>
                    Customer segment analysis and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{segment.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Monthly Spent</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(segment.avgSpent)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Visits/Month</p>
                      <p className="text-lg font-semibold">{segment.avgVisits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Activity</CardTitle>
              <CardDescription>
                Latest customer interactions and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{activity.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right">
                            {activity.amount && (
                              <p className="font-semibold">
                                {formatCurrency(activity.amount)}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}