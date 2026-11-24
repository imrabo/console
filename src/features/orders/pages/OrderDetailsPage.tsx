'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  User,
  Package,
  Receipt,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Hash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Order } from '../types/orders.types';
import { OrderStatus } from '../types/orders.enums';
import { InfoRow } from '@/components/custom/info-row';
import { formatDateTime } from '@/utils/date';
import { useUpdateOrderStatusMutation } from '../hooks/useOrders';

export function OrderDetailsPage({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatusMutation();

  const updatedDate = order.updatedAt ? new Date(order.updatedAt) : null;

  const completedDate = order.completedAt ? new Date(order.completedAt) : null;

  const refundedDate = order.refundedAt ? new Date(order.refundedAt) : null;

  const getStatusVariant = (
    status: Order['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (String(status).toLowerCase()) {
      case 'completed':
        return 'default';

      case 'failed':
        return 'destructive';

      case 'refunded':
        return 'secondary';

      case 'pending':
        return 'outline';

      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (String(status).toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-3 w-3" />;

      case 'failed':
        return <XCircle className="h-3 w-3" />;

      case 'refunded':
        return <RotateCcw className="h-3 w-3" />;

      case 'pending':
        return <Clock className="h-3 w-3" />;

      default:
        return null;
    }
  };

  const formatStatus = (status: Order['status']) => {
    return String(status)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatAmount = () => {
    return `${order.currency} ${order.amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      {/* Back */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      {/* Hero */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Order icon / summary */}
            <div className="bg-muted relative flex min-h-[280px] w-full items-center justify-center lg:min-h-[320px] lg:w-[380px]">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-background flex h-24 w-24 items-center justify-center rounded-full shadow-sm">
                  <Receipt className="text-muted-foreground h-12 w-12" />
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Order Amount</p>

                  <p className="text-3xl font-bold">{formatAmount()}</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <Badge variant={getStatusVariant(order.status)} className="gap-1">
                  {getStatusIcon(order.status)}
                  {formatStatus(order.status)}
                </Badge>
              </div>
            </div>

            {/* Main information */}
            <div className="flex-1 p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-5">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusVariant(order.status)} className="gap-1">
                      {getStatusIcon(order.status)}
                      {formatStatus(order.status)}
                    </Badge>

                    {order.paymentMethod && (
                      <Badge variant="secondary">{order.paymentMethod}</Badge>
                    )}

                    <Badge variant="outline">{order.currency}</Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{order.title}</h1>

                    <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
                      Order placed for the selected resource.
                    </p>
                  </div>

                  {/* User */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs font-medium uppercase">
                        Customer
                      </p>

                      <p className="font-semibold">{order.userId}</p>
                    </div>
                  </div>

                  {/* Basic metadata */}
                  <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">{formatAmount()}</p>

                        <p className="text-muted-foreground text-xs">Amount</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">
                          {order.paymentMethod || 'Not specified'}
                        </p>

                        <p className="text-muted-foreground text-xs">Payment Method</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">{order.resourceId}</p>

                        <p className="text-muted-foreground text-xs">Resource ID</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status updates are the only order mutation available in the console. */}
                <div className="flex flex-wrap gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={isUpdatingStatus}>
                        Update status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.values(OrderStatus).map((nextStatus) => (
                        <DropdownMenuItem
                          key={nextStatus}
                          disabled={nextStatus === order.status || isUpdatingStatus}
                          onSelect={() =>
                            updateOrderStatus({ id: order.id, data: { status: nextStatus } })
                          }
                          className="capitalize"
                        >
                          {nextStatus}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Amount */}
        <Card>
          <CardContent className="p-6">
            <CircleDollarSign className="text-muted-foreground mb-3 h-5 w-5" />

            <p className="text-muted-foreground text-sm">Order Amount</p>

            <div className="mt-1 text-3xl font-bold">{formatAmount()}</div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6">
            {getStatusIcon(order.status) || (
              <Receipt className="text-muted-foreground mb-3 h-5 w-5" />
            )}

            <p className="text-muted-foreground text-sm">Order Status</p>

            <div className="mt-2">
              <Badge variant={getStatusVariant(order.status)} className="gap-1">
                {getStatusIcon(order.status)}
                {formatStatus(order.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardContent className="p-6">
            <CreditCard className="text-muted-foreground mb-3 h-5 w-5" />

            <p className="text-muted-foreground text-sm">Payment Method</p>

            <div className="mt-1 text-xl font-bold">{order.paymentMethod || 'Not specified'}</div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardContent className="p-6">
            <Hash className="text-muted-foreground mb-3 h-5 w-5" />

            <p className="text-muted-foreground text-sm">Currency</p>

            <div className="mt-1 text-xl font-bold">{order.currency}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>

              <TabsTrigger value="payment">Payment</TabsTrigger>

              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Order Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>

                    <CardDescription>Basic information about this order.</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <InfoRow label="Order ID" value={order.id} />

                    <InfoRow label="Title" value={order.title} />

                    <InfoRow label="Amount" value={formatAmount()} />

                    <InfoRow label="Currency" value={order.currency} />

                    <InfoRow
                      label="Status"
                      value={
                        <Badge variant={getStatusVariant(order.status)} className="gap-1">
                          {getStatusIcon(order.status)}
                          {formatStatus(order.status)}
                        </Badge>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Relationships */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Relationships</CardTitle>

                    <CardDescription>
                      Users and resources associated with this order.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <InfoRow label="User ID" value={order?.userId ?? ''} />

                    <InfoRow label="Resource ID" value={order.resourceId} />

                    <InfoRow label="Creator ID" value={order.creatorId} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment */}
            <TabsContent value="payment">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>

                    <CardDescription>Payment details associated with this order.</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <InfoRow label="Amount" value={formatAmount()} />

                    <InfoRow label="Currency" value={order.currency} />

                    <InfoRow
                      label="Payment Method"
                      value={order.paymentMethod || 'Not available'}
                    />

                    <InfoRow label="Payment ID" value={order.paymentId || 'Not available'} />

                    <InfoRow
                      label="Status"
                      value={
                        <Badge variant={getStatusVariant(order.status)} className="gap-1">
                          {getStatusIcon(order.status)}
                          {formatStatus(order.status)}
                        </Badge>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Payment ID */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Reference</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {order.paymentId ? (
                      <div className="bg-muted flex items-center gap-3 rounded-lg border p-4">
                        <CreditCard className="text-muted-foreground h-5 w-5 shrink-0" />

                        <p className="min-w-0 flex-1 truncate text-sm">{order.paymentId}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No payment ID has been recorded for this order.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Metadata */}
            <TabsContent value="metadata">
              <Card>
                <CardHeader>
                  <CardTitle>Order Metadata</CardTitle>

                  <CardDescription>System information associated with this order.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <InfoRow label="Order ID" value={order.id} />

                  <InfoRow label="User ID" value={order.userId} />

                  <InfoRow label="Resource ID" value={order.resourceId} />

                  <InfoRow label="Creator ID" value={order.creatorId} />

                  <InfoRow label="Created By" value={order.createdBy || '-'} />

                  <InfoRow label="Updated By" value={order.updatedBy || '-'} />

                  <InfoRow label="Payment ID" value={order.paymentId || 'Not available'} />

                  <InfoRow label="Created At" value={formatDateTime(order.createdAt)} />

                  <InfoRow
                    label="Updated At"
                    value={updatedDate ? formatDateTime(updatedDate) : 'Never updated'}
                  />

                  <InfoRow
                    label="Completed At"
                    value={completedDate ? formatDateTime(order.completedAt) : 'Not completed'}
                  />

                  <InfoRow
                    label="Refunded At"
                    value={refundedDate ? formatDateTime(order.refundedAt) : 'Not refunded'}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow
                label="Status"
                value={
                  <Badge variant={getStatusVariant(order.status)} className="gap-1">
                    {getStatusIcon(order.status)}
                    {formatStatus(order.status)}
                  </Badge>
                }
              />

              <InfoRow label="Amount" value={formatAmount()} />

              <InfoRow label="Currency" value={order.currency} />

              <InfoRow label="Payment Method" value={order.paymentMethod || 'Not specified'} />
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                  <User className="text-muted-foreground h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs uppercase">User ID</p>

                  <p className="truncate font-semibold">{order.userId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource */}
          <Card>
            <CardHeader>
              <CardTitle>Resource</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                  <Package className="text-muted-foreground h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs uppercase">Resource ID</p>

                  <p className="truncate font-semibold">{order.resourceId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />

                <div>
                  <p className="text-sm font-medium">Created</p>

                  <p className="text-muted-foreground text-xs">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />

                <div>
                  <p className="text-sm font-medium">Last Updated</p>

                  <p className="text-muted-foreground text-xs">
                    {updatedDate ? formatDateTime(order.updatedAt) : 'Never updated'}
                  </p>
                </div>
              </div>

              {completedDate && (
                <>
                  <Separator />

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-muted-foreground mt-0.5 h-4 w-4" />

                    <div>
                      <p className="text-sm font-medium">Completed</p>

                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(order.completedAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {refundedDate && (
                <>
                  <Separator />

                  <div className="flex items-start gap-3">
                    <RotateCcw className="text-muted-foreground mt-0.5 h-4 w-4" />

                    <div>
                      <p className="text-sm font-medium">Refunded</p>

                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(order.refundedAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
