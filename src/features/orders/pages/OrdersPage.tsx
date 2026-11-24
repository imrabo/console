'use client';

import React, { useState } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table';

import { Link, useNavigate } from 'react-router-dom';

import { MoreHorizontal, Eye } from 'lucide-react';

import { useOrdersQuery, useUpdateOrderStatusMutation } from '../hooks/useOrders';

import type { Order, OrderFilters } from '../types/orders.types';
import { OrderStatus } from '../types/orders.enums';

import { DataTable } from '@/components/tables/DataTable';
import { DataTableFilter } from '@/components/tables/FilterDropdown';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatDate } from '@/utils/date';
import PageWrapper from '@/components/wrappers/PageWrapper';

/**
 * --------------------------------------------------------------------------
 * Initial Filters
 * --------------------------------------------------------------------------
 */

const initialFilters: OrderFilters = {
  search: '',
  userId: undefined,
  resourceId: undefined,
  creatorId: undefined,
  status: undefined,
  paymentMethod: undefined,
  currency: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

/**
 * --------------------------------------------------------------------------
 * Status Badge
 * --------------------------------------------------------------------------
 */

const getStatusVariant = (
  status: Order['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default';

    case 'pending':
      return 'secondary';

    case 'failed':
      return 'destructive';

    case 'refunded':
      return 'outline';

    default:
      return 'outline';
  }
};

/**
 * --------------------------------------------------------------------------
 * Orders Page
 * --------------------------------------------------------------------------
 */

export const OrdersPage: React.FC<{
  filters?: OrderFilters;
}> = ({ filters: initialFiltersProp }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<OrderFilters>(initialFiltersProp ?? initialFilters);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: ordersResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrdersQuery(filters);

  const orders = ordersResult?.data ?? [];
  const pagination: PaginationState = {
    pageIndex: Math.max((filters.page ?? 1) - 1, 0),
    pageSize: filters.limit ?? 10,
  };
  const sorting: SortingState = [
    {
      id: filters.sortBy ?? 'createdAt',
      desc: filters.sortOrder !== 'asc',
    },
  ];

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setFilters((previous) => {
      const previousPagination = {
        pageIndex: Math.max((previous.page ?? 1) - 1, 0),
        pageSize: previous.limit ?? 10,
      };
      const next = typeof updater === 'function' ? updater(previousPagination) : updater;

      return {
        ...previous,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      };
    });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    const sort = next[0];

    setFilters((previous) => ({
      ...previous,
      sortBy: (sort?.id as OrderFilters['sortBy']) ?? 'createdAt',
      sortOrder: sort ? (sort.desc ? 'desc' : 'asc') : 'desc',
      page: 1,
    }));
  };

  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatusMutation();

  /**
   * ------------------------------------------------------------------------
   * Columns
   * ------------------------------------------------------------------------
   */

  const columns: ColumnDef<Order>[] = [
    /**
     * Serial Number
     */
    {
      id: 'serialNo',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },

    /**
     * Order
     */
    {
      accessorKey: 'title',
      header: 'Order',

      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="min-w-0">
            <p className="text-foreground font-bold">{order.title}</p>

            <p className="text-muted-foreground max-w-[220px] truncate text-xs">
              Order ID: {order.id}
            </p>
          </div>
        );
      },
    },

    /**
     * User
     */
    {
      accessorKey: 'userName',
      header: 'User Name',

      cell: ({ row }) => {
        const userName = row.getValue('userName') as string;

        return (
          <span className="text-muted-foreground max-w-[150px] truncate text-xs font-medium">
            {userName}
          </span>
        );
      },
    },

    /**
     * Resource
     */
    {
      accessorKey: 'resourceId',
      header: 'Resource',

      cell: ({ row }) => {
        const resourceId = row.getValue('resourceId') as string;

        return (
          <span className="text-muted-foreground max-w-37.5 truncate text-xs font-medium">
            {resourceId}
          </span>
        );
      },
    },

    /**
     * Amount
     */
    {
      accessorKey: 'amount',
      header: 'Amount',

      cell: ({ row }) => {
        const order = row.original;

        return (
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {order.currency} {order.amount.toFixed(2)}
          </span>
        );
      },
    },

    /**
     * Status
     */
    {
      accessorKey: 'status',
      header: 'Status',

      cell: ({ row }) => {
        const status = row.getValue('status') as Order['status'];
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0"
                disabled={isUpdatingStatus}
                data-row-action
                onClick={(event) => event.stopPropagation()}
              >
                <Badge
                  variant={getStatusVariant(status)}
                  className="text-xs font-semibold capitalize"
                >
                  {status}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" data-row-action>
              {Object.values(OrderStatus).map((nextStatus) => (
                <DropdownMenuItem
                  key={nextStatus}
                  disabled={nextStatus === status || isUpdatingStatus}
                  onSelect={() => updateOrderStatus({ id: order.id, data: { status: nextStatus } })}
                  className="capitalize"
                >
                  {nextStatus}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },

    /**
     * Payment Method
     */
    {
      accessorKey: 'paymentMethod',
      header: 'Payment',

      cell: ({ row }) => {
        const paymentMethod = row.getValue('paymentMethod') as string | undefined;

        return paymentMethod ? (
          <span className="text-muted-foreground text-xs font-medium">{paymentMethod}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },

    /**
     * Created At
     */
    {
      accessorKey: 'createdAt',
      header: 'Created At',

      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string | Date;

        return <span className="text-muted-foreground text-xs">{formatDate(createdAt)}</span>;
      },
    },

    /**
     * Actions
     */
    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border-border/20 h-8 w-8 rounded-lg border"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-card border-border w-48 border"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* View */}
              <DropdownMenuItem asChild>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex cursor-pointer items-center rounded-md text-xs font-medium"
                >
                  <Eye className="mr-2 h-3 w-3" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /**
   * --------------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------------
   */

  const orderFilterOptions: DataTableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      placeholder: 'Select status',

      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
    },

    {
      key: 'paymentMethod',
      label: 'Payment',
      placeholder: 'Select payment method',

      options: [
        {
          label: 'Razorpay',
          value: 'razorpay',
        },
        {
          label: 'UPI',
          value: 'upi',
        },
        {
          label: 'Card',
          value: 'card',
        },
        {
          label: 'Cash',
          value: 'cash',
        },
      ],
    },

    {
      key: 'currency',
      label: 'Currency',
      placeholder: 'Select currency',

      options: [
        {
          label: 'INR',
          value: 'INR',
        },
        {
          label: 'USD',
          value: 'USD',
        },
      ],
    },
  ];

  /**
   * --------------------------------------------------------------------------
   * Filter Handler
   * --------------------------------------------------------------------------
   */

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater;

      const getFilter = (id: string) => next.find((filter) => filter.id === id)?.value;

      setFilters((previousFilters) => ({
        ...previousFilters,

        status: getFilter('status') as OrderFilters['status'] | undefined,

        paymentMethod: getFilter('paymentMethod') as OrderFilters['paymentMethod'] | undefined,

        currency: getFilter('currency') as OrderFilters['currency'] | undefined,

        page: 1,
      }));

      return next;
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------------
   */

  return (
    <PageWrapper>
      <div>
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground text-sm">Manage all your orders</p>
      </div>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={orders}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          manualPagination
          pageCount={ordersResult?.totalPages ?? 0}
          totalRows={ordersResult?.total ?? 0}
          sorting={sorting}
          error={error}
          errorMessage="Failed to load Orders"
          onSortingChange={handleSortingChange}
          manualSorting
          toolbar={<div />}
          enableSearch={true}
          manualSearch={true}
          search={filters.search}
          searchPlaceholder="Search orders by title..."
          onSearchChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              search: value,
              page: 1,
            }));
          }}
          loading={isLoading || isFetching}
          onRowClick={(order) => {
            navigate(`/orders/${order.id}`);
          }}
          filterOptions={orderFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      </div>
    </PageWrapper>
  );
};

export default OrdersPage;
