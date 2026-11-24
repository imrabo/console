'use client';

import React, { useMemo, useState } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Eye, MoreHorizontal } from 'lucide-react';

import type { Payment, PaymentFilters, PaymentStatus } from '../types/payment.types';

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageWrapper from '@/components/wrappers/PageWrapper';
import { DataTableFilter } from '@/components/tables/FilterDropdown';
import { formatDate } from '@/utils/date';
import { usePaymentsQuery } from '../hooks/usePayment';
import { PaymentHoverCard } from '../components/payment-hover-card';
import usersService from '@/features/users/services/usersService';

const initialFilters: PaymentFilters = {
  search: '',
  status: undefined,
  purchaseType: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

const PAYMENT_STATUSES: PaymentStatus[] = [
  'created',
  'authorized',
  'captured',
  'failed',
  'refunded',
];

function getAmount(payment: Payment): number | null {
  const amount = payment.amount;
  return Number.isFinite(amount) ? amount : null;
}

function formatAmount(payment: Payment): string {
  const amount = getAmount(payment);

  if (amount === null) {
    return '-';
  }

  const currency = payment.currency || 'INR';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatPaymentStatus(status: PaymentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export const PaymentsPage: React.FC<{
  filters?: Pick<PaymentFilters, 'userId'>;
}> = ({ filters: initialFiltersProp }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState(initialFilters.search);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialFilters.limit ?? 10);
  const [sorting, setSorting] = useState<SortingState>([
    { id: initialFilters.sortBy ?? 'createdAt', desc: initialFilters.sortOrder !== 'asc' },
  ]);

  /**
   * Derive API filters from the table state.
   * Do not maintain a separate filters state.
   */
  const filters = useMemo<PaymentFilters>(() => {
    const getFilter = (id: string) => columnFilters.find((filter) => filter.id === id)?.value;

    const status = getFilter('status');
    const purchaseType = getFilter('purchaseType');

    return {
      ...initialFilters,
      userId: initialFiltersProp?.userId,
      search,
      status: typeof status === 'string' ? (status as PaymentStatus) : undefined,
      purchaseType:
        typeof purchaseType === 'string'
          ? (purchaseType as PaymentFilters['purchaseType'])
          : undefined,
      sortBy: (sorting[0]?.id as PaymentFilters['sortBy']) ?? 'createdAt',
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      page,
      limit: pageSize,
    };
  }, [columnFilters, initialFiltersProp?.userId, page, pageSize, search, sorting]);

  const {
    data: paymentResult,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = usePaymentsQuery(filters);
  const userIds = useMemo(
    () =>
      [...new Set((paymentResult?.data ?? []).map((payment) => payment.userId))].filter(Boolean),
    [paymentResult?.data]
  );
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: [COLLECTIONS.USERS, userId],
      queryFn: () => usersService.fetchUserById(userId),
    })),
  });
  const usersById = useMemo(
    () => new Map(userIds.map((userId, index) => [userId, userQueries[index]?.data])),
    [userIds, userQueries]
  );
  const pagination: PaginationState = { pageIndex: page - 1, pageSize };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setPageSize(next.pageSize);
    setPage(next.pageSize === pageSize ? next.pageIndex + 1 : 1);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(next);
    setPage(1);
  };

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: 'serialNo',
        header: 'Sr. No.',
        cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'paymentId',
        header: 'Payment ID',
        enableHiding: false,
        cell: ({ row }) => <PaymentHoverCard payment={row.original} />,
      },
      {
        id: 'userName',
        header: 'User Name',
        accessorFn: (payment) => usersById.get(payment.userId)?.fullName ?? '',
        cell: ({ row }) => usersById.get(row.original.userId)?.fullName || '-',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold whitespace-nowrap">{formatAmount(row.original)}</span>
        ),
      },
      {
        accessorKey: 'purchaseType',
        header: 'Purchase Type',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {String(row.original.purchaseType || '-').replace(/([a-z])([A-Z])/g, '$1 $2')}
          </Badge>
        ),
      },
      {
        accessorKey: 'referenceId',
        header: 'Reference ID',
        cell: ({ row }) => {
          const referenceId = row.original.referenceId;

          return (
            <span className="font-mono text-xs" title={referenceId || ''}>
              {referenceId || '-'}
            </span>
          );
        },
      },

      {
        accessorKey: 'isPaid',
        header: 'Paid',
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.isPaid
                ? 'border-green-500/30 bg-green-500/10 text-green-700'
                : 'border-muted bg-muted/50 text-muted-foreground'
            }
          >
            {row.original.isPaid ? 'Paid' : 'Unpaid'}
          </Badge>
        ),
      },
      {
        accessorKey: 'verified',
        header: 'Verified',
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.verified
                ? 'border-green-500/30 bg-green-500/10 text-green-700'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-700'
            }
          >
            {row.original.verified ? 'Verified' : 'Unverified'}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {row.original.createdAt ? formatDate(row.original.createdAt) : '-'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="border-border/20 h-8 w-8 rounded-lg border"
                    aria-label="Payment actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="border-border bg-card w-48 border">
                  <DropdownMenuItem
                    onSelect={() => navigate(`/payments/${payment.id}`)}
                    className="cursor-pointer text-xs font-medium"
                  >
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    View Payment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [page, pageSize, usersById]
  );

  const filterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: 'status',
        label: 'Status',
        placeholder: 'Select status',
        options: PAYMENT_STATUSES.map((status) => ({
          label: formatPaymentStatus(status),
          value: status,
        })),
      },
      {
        key: 'purchaseType',
        label: 'Purchase Type',
        placeholder: 'Select purchase type',
        options: [
          { label: 'Webinar Registration', value: 'webinarRegistration' },
          { label: 'Resource Purchase', value: 'resourcePurchase' },
          { label: 'Program Purchase', value: 'programPurchase' },
          { label: 'Expert Request', value: 'expertRequest' },
        ],
      },
    ],
    []
  );

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => (typeof updater === 'function' ? updater(previous) : updater));
  };

  return (
    <PageWrapper className="animate-fade-in min-w-0 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Payments Management</h1>
        <p className="text-muted-foreground text-sm">Manage all your payments</p>
      </div>
      <div className="w-full min-w-0 space-y-6">
        <DataTable
          columns={columns}
          data={paymentResult?.data ?? []}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          manualPagination
          totalRows={paymentResult?.total ?? 0}
          pageCount={paymentResult?.totalPages ?? 0}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          manualSorting
          enableSearch
          manualSearch
          search={search}
          searchPlaceholder="Search payments..."
          onSearchChange={setSearch}
          loading={isLoading || isFetching}
          filterOptions={filterOptions}
          filters={columnFilters}
          onFiltersChange={handleColumnFiltersChange}
          onRowClick={(payment) => navigate(`/payments/${payment.id}`)}
        />
      </div>
    </PageWrapper>
  );
};

export default PaymentsPage;
