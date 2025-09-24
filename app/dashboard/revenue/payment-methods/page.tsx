// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import {
  IconCreditCard,
  IconWallet,
  IconCash,
  IconDeviceMobile,
} from '@tabler/icons-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-8">
      <div className="px-4 lg:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage and configure available payment methods for the community
            platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Credit/Debit Cards
            </CardTitle>
            <CardDescription>
              Visa, Mastercard, and other card payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">85%</div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Most popular payment method
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWallet className="h-5 w-5" />
              Digital Wallets
            </CardTitle>
            <CardDescription>
              PayPal, MercadoPago, and other wallets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">65%</div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Popular among younger users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCash className="h-5 w-5" />
              Bank Transfer
            </CardTitle>
            <CardDescription>
              Direct bank transfers and deposits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">45%</div>
              <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Available for larger payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceMobile className="h-5 w-5" />
              Mobile Payments
            </CardTitle>
            <CardDescription>Mobile carrier billing and apps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">25%</div>
              <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">In development</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Configuration</CardTitle>
            <CardDescription>
              Configure fees, limits, and availability for each payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Payment method configuration panel will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
