'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Payment } from '../types/payment.types';

interface PaymentHoverCardProps {
  payment: Payment;
}

const statusVariants: Record<
  Payment['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  created: 'secondary',
  authorized: 'outline',
  captured: 'default',
  failed: 'destructive',
  refunded: 'secondary',
};

const formatDate = (value: string | Date | null) => {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
  }).format(amount);

const formatLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="max-w-[190px] text-right font-medium break-all">{value || '—'}</span>
    </div>
  );
}

export function PaymentHoverCard({ payment }: PaymentHoverCardProps) {
  const initials = payment.purchaseType
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="link"
          className="text-foreground h-auto justify-start p-0 text-left font-semibold"
          onClick={(event) => event.stopPropagation()}
        >
          {payment.paymentId || payment.orderId || payment.id}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="z-[100] w-80 space-y-4">
        {/* Payment summary */}
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback>{initials || 'PAY'}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold">
              {formatAmount(payment.amount, payment.currency)}
            </p>

            <p className="text-muted-foreground text-xs">{formatLabel(payment.purchaseType)}</p>

            <Badge variant={statusVariants[payment.status]} className="mt-1 capitalize">
              {payment.status}
            </Badge>
          </div>
        </div>

        {/* Payment details */}
        <div className="space-y-2 text-sm">
          <Detail label="Payment ID" value={payment.paymentId || '—'} />

          <Detail label="Order ID" value={payment.orderId || '—'} />

          <Detail label="Transaction ID" value={payment.id} />

          <Detail label="User ID" value={payment.userId} />

          <Detail label="Reference ID" value={payment.referenceId} />

          <Detail label="Purchase Type" value={formatLabel(payment.purchaseType)} />

          <Detail label="Paid" value={payment.isPaid ? 'Yes' : 'No'} />

          <Detail label="Verified" value={payment.verified ? 'Yes' : 'No'} />

          <Detail label="Currency" value={payment.currency || 'INR'} />

          <Detail label="Billing Month" value={`${payment.month}/${payment.year}`} />

          <Detail label="Created" value={formatDate(payment.createdAt)} />

          <Detail label="Updated" value={formatDate(payment.updatedAt)} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
