"use client";

import {
  IconCoin,
  IconCreditCard,
  IconTrendingDown,
  IconTrendingUp,
  IconReceipt,
  IconCalendar,
  IconDownload,
} from "@tabler/icons-react";
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
} from "recharts";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock revenue data
const monthlyRevenue = [
  { month: "Jan", revenue: 12000000, transactions: 1200, avgTransaction: 10000 },
  { month: "Feb", revenue: 15000000, transactions: 1350, avgTransaction: 11111 },
  { month: "Mar", revenue: 18000000, transactions: 1500, avgTransaction: 12000 },
  { month: "Apr", revenue: 22000000, transactions: 1650, avgTransaction: 13333 },
  { month: "May", revenue: 25000000, transactions: 1800, avgTransaction: 13889 },
  { month: "Jun", revenue: 28000000, transactions: 1950, avgTransaction: 14359 },
];

const dailyRevenue = [
  { day: "Mon", amount: 850000 },
  { day: "Tue", amount: 920000 },
  { day: "Wed", amount: 780000 },
  { day: "Thu", amount: 1100000 },
  { day: "Fri", amount: 1350000 },
  { day: "Sat", amount: 1650000 },
  { day: "Sun", amount: 1420000 },
];

const paymentMethods = [
  { method: "Credit Card", amount: 18500000, percentage: 65.2, transactions: 1200 },
  { method: "Debit Card", amount: 5200000, percentage: 18.3, transactions: 450 },
  { method: "Cash", amount: 3800000, percentage: 13.4, transactions: 300 },
  { method: "Digital Wallet", amount: 1200000, percentage: 4.2, transactions: 80 },
];

const recentTransactions = [
  {
    id: "TXN-001",
    time: "14:30",
    space: "L2-15",
    amount: 25000,
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TXN-002",
    time: "14:25",
    space: "L1-08",
    amount: 18000,
    method: "Cash",
    status: "Completed",
  },
  {
    id: "TXN-003",
    time: "14:20",
    space: "L3-22",
    amount: 32000,
    method: "Debit Card",
    status: "Completed",
  },
  {
    id: "TXN-004",
    time: "14:15",
    space: "L2-03",
    amount: 15000,
    method: "Digital Wallet",
    status: "Pending",
  },
];

export default function RevenuePage() {
  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = monthlyRevenue.reduce((sum, month) => sum + month.transactions, 0);
  const avgTransactionValue = Math.round(totalRevenue / totalTransactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Revenue Management</h1>
          <p className="text-muted-foreground">
            Track payments, analyze revenue trends, and manage financial operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconDownload className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <IconReceipt className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IconCoin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <IconTrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <IconCreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalTransactions.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <IconTrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Transaction
            </CardTitle>
            <IconReceipt className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(avgTransactionValue)}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <IconTrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2.1%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(1420000)}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <IconTrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+15.3%</span>
              <span className="text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>
                  Revenue performance over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Pattern</CardTitle>
                <CardDescription>
                  Average revenue by day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyRevenue}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                      ]}
                    />
                    <Bar dataKey="amount" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
              <CardDescription>
                Breakdown of revenue by payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium">
                        {method.method}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm text-muted-foreground">
                        {method.percentage}%
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold">
                        {formatCurrency(method.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.transactions} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest payment transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Space</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.time}</TableCell>
                      <TableCell>{transaction.space}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}