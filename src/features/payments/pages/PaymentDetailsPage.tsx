'use client';

import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Hash,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  User,
  Wallet,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { Payment, PaymentStatus } from '../types/payment.types';
import { usePaymentQuery } from '../hooks/usePayment';
import { formatDateTime } from '@/utils/date';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  created: 'border-blue-500/30 bg-blue-500/10 text-blue-700',
  authorized: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  captured: 'border-green-500/30 bg-green-500/10 text-green-700',
  failed: 'border-red-500/30 bg-red-500/10 text-red-700',
  refunded: 'border-purple-500/30 bg-purple-500/10 text-purple-700',
};

const formatPaymentStatus = (status: PaymentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

function formatAmount(payment: Payment): string {
  const amount = Number(payment.amount);

  if (!Number.isFinite(amount)) return '-';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payment.currency || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${payment.currency || 'INR'} ${amount.toFixed(2)}`;
  }
}

function formatPurchaseType(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function InfoItem({
  icon,
  label,
  value,
  mono = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border p-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <div className={`font-medium break-words ${mono ? 'font-mono text-xs' : 'text-sm'}`}>
        {value ?? '-'}
      </div>
    </div>
  );
}

function BooleanBadge({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <Badge
      variant="outline"
      className={
        value
          ? 'border-green-500/30 bg-green-500/10 text-green-700'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700'
      }
    >
      {value ? (
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
      ) : (
        <ShieldAlert className="mr-1 h-3.5 w-3.5" />
      )}
      {value ? trueLabel : falseLabel}
    </Badge>
  );
}

function PaymentEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <Receipt className="text-muted-foreground h-6 w-6" />
        </div>

        <h3 className="font-semibold">{title}</h3>

        <p className="text-muted-foreground mt-2 max-w-sm text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function PaymentDetailsPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const paymentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: payment, isLoading, isError, error, refetch } = usePaymentQuery(paymentId);

  const status = useMemo<PaymentStatus | null>(() => {
    if (!payment) return null;

    const validStatuses: PaymentStatus[] = [
      'created',
      'authorized',
      'captured',
      'failed',
      'refunded',
    ];

    return validStatuses.includes(payment.status) ? payment.status : null;
  }, [payment]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>

        <Card>
          <CardContent className="flex min-h-64 items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 animate-pulse" />
              Loading payment details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>

        <PaymentEmptyState
          title="Unable to load payment"
          description={
            error instanceof Error
              ? error.message
              : 'An error occurred while fetching payment details.'
          }
        />

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>

        <PaymentEmptyState
          title="Payment not found"
          description="The payment record may have been removed or the supplied ID is invalid."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Back to payments"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Payment Details</h1>

            <p
              className="text-muted-foreground mt-1 font-mono text-xs break-all"
              title={payment.id}
            >
              Record ID: {payment.id}
            </p>
          </div>
        </div>

        {status ? (
          <Badge variant="outline" className={`w-fit px-3 py-1.5 text-sm ${STATUS_STYLES[status]}`}>
            {formatPaymentStatus(status)}
          </Badge>
        ) : (
          <Badge variant="outline">Unknown status</Badge>
        )}
      </div>

      {/* Payment summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div className="min-w-0">
              <p className="text-muted-foreground text-sm">Payment Amount</p>
              <p className="mt-2 text-xl font-semibold break-words">{formatAmount(payment)}</p>
            </div>

            <div className="bg-muted rounded-lg p-2.5">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-muted-foreground text-sm">Payment Status</p>
              <p className="mt-2 font-semibold">
                {status ? formatPaymentStatus(status) : 'Unknown'}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-2.5">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-muted-foreground text-sm">Paid</p>

              <div className="mt-2">
                <BooleanBadge value={payment.isPaid} trueLabel="Paid" falseLabel="Unpaid" />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2.5">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-muted-foreground text-sm">Verification</p>

              <div className="mt-2">
                <BooleanBadge
                  value={payment.verified}
                  trueLabel="Verified"
                  falseLabel="Unverified"
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem icon={<Hash className="h-4 w-4" />} label="Record ID" value={payment.id} mono />

          <InfoItem
            icon={<Wallet className="h-4 w-4" />}
            label="Amount"
            value={formatAmount(payment)}
          />

          <InfoItem
            icon={<Wallet className="h-4 w-4" />}
            label="Currency"
            value={payment.currency}
          />

          <InfoItem
            icon={<Receipt className="h-4 w-4" />}
            label="Purchase Type"
            value={formatPurchaseType(payment.purchaseType)}
          />

          <InfoItem
            icon={<Hash className="h-4 w-4" />}
            label="Reference ID"
            value={payment.referenceId}
            mono
          />

          <InfoItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Order ID"
            value={payment.orderId}
            mono
          />

          <InfoItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Gateway Payment ID"
            value={payment.paymentId}
            mono
          />
        </CardContent>
      </Card>

      {/* User information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="User ID"
            value={payment.userId}
            mono
          />
        </CardContent>
      </Card>

      {/* Reporting information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reporting Period
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem icon={<Calendar className="h-4 w-4" />} label="Month" value={payment.month} />

          <InfoItem icon={<Calendar className="h-4 w-4" />} label="Year" value={payment.year} />

          <InfoItem
            icon={<Clock className="h-4 w-4" />}
            label="Payment Timestamp"
            value={formatDateTime(payment.timestamp)}
          />
        </CardContent>
      </Card>

      {/* Audit information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Audit Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Created At"
            value={formatDateTime(payment.createdAt)}
          />

          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Last Updated"
            value={formatDateTime(payment.updatedAt)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
