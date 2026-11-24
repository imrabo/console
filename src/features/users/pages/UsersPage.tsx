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
import { Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, PlusCircle, Eye, Pencil, Crown } from 'lucide-react';

import { useUsersQuery } from '../hooks/useUsers';

import type { UserFilters, UserType } from '../types';

import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import PageWrapper from '@/components/wrappers/PageWrapper';

import { DataTableFilter } from '@/components/tables/FilterDropdown';
import { formatDate } from '@/utils/date';
import { UserHoverCard } from '../components/UserHoverCard';

const initialFilters: UserFilters = {
  search: '',
  membershipType: undefined,
  gender: undefined,
  relationship: undefined,
  isActive: undefined,
  isExpert: undefined,
  createdOn: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const UsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const navigate = useNavigate();

  /**
   * Single source of truth for table filters.
   */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  /**
   * Search is maintained separately from column filters.
   */
  const [search, setSearch] = useState(initialFilters.search);

  /**
   * Derive API filters from UI state.
   *
   * Do not maintain another `filters` state.
   * This prevents filter state from getting out of sync
   * with the DataTable state.
   */
  // const filters = useMemo<UserFilters>(() => {
  //   const getFilter = (id: string) => columnFilters.find((filter) => filter.id === id)?.value;

  //   const isActiveValue = getFilter('isActive');
  //   const isExpertValue = getFilter('isExpert');

  //   return {
  //     ...initialFilters,

  //     search,

  //     membershipType: getFilter('membershipType') as UserFilters['membershipType'] | undefined,

  //     gender: getFilter('gender') as UserFilters['gender'] | undefined,

  //     isActive: isActiveValue === undefined ? undefined : isActiveValue === 'true',

  //     isExpert: isExpertValue === undefined ? undefined : isExpertValue === 'true',

  //     page: 1,
  //   };
  // }, [columnFilters, search]);
  const filters = useMemo<UserFilters>(() => {
    const getFilter = (id: string) => columnFilters.find((filter) => filter.id === id)?.value;

    const isActiveValue = getFilter('isActive');
    const isExpertValue = getFilter('isExpert');

    return {
      ...initialFilters,
      search,
      membershipType: getFilter('membershipType') as UserFilters['membershipType'] | undefined,
      gender: getFilter('gender') as UserFilters['gender'] | undefined,
      isActive: isActiveValue === undefined ? undefined : isActiveValue === 'true',
      isExpert: isExpertValue === undefined ? undefined : isExpertValue === 'true',
      createdOn: getFilter('createdOn') as UserFilters['createdOn'],
      sortBy: (sorting[0]?.id as UserFilters['sortBy']) ?? 'createdAt',
      sortOrder: sorting[0]?.desc === false ? 'asc' : 'desc',
      page,
      limit: pageSize,
    };
  }, [columnFilters, search, page, pageSize, sorting]);

  /**
   * Users query.
   */
  const { data: users, isLoading, isError, error, refetch, isFetching } = useUsersQuery(filters);

  /**
   * Keep columns stable between renders.
   *
   * This is important because DataTable receives `columns`
   * and should not receive a brand-new column definition
   * every time UsersPage rerenders.
   */
  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        id: 'serialNo',
        header: 'Sr. No.',
        cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
      },

      {
        accessorKey: 'fullName',
        header: 'Full Name',
        enableHiding: false,

        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center gap-1">
              {user.isExpert && <Crown className="h-4 w-4 shrink-0 text-amber-500" />}

              <UserHoverCard user={user} />
            </div>
          );
        },
      },

      {
        accessorKey: 'email',
        header: 'Email',

        cell: ({ row }) => <span className="text-xs font-medium">{row.original.email || '-'}</span>,
      },

      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',

        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.phoneNumber || '-'}</span>
        ),
      },

      {
        accessorKey: 'gender',
        header: 'Gender',

        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs font-medium capitalize">
            {row.original.gender || '-'}
          </Badge>
        ),
      },

      {
        accessorKey: 'membershipType',
        header: 'Membership',

        cell: ({ row }) => {
          const membership = row.original.membershipType;

          return (
            <Badge variant="outline" className="text-xs font-semibold">
              {membership === 'PREMIUM' ? 'Premium' : 'Free'}
            </Badge>
          );
        },
      },

      {
        id: 'isActive',
        accessorFn: (user) => user.isActive,
        header: 'Status',

        cell: ({ row }) => {
          const status = row.original.isActive ? 'ACTIVE' : 'INACTIVE';

          const className =
            status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-600'
              : status === 'INACTIVE'
                ? 'bg-amber-500/10 text-amber-600'
                : 'bg-muted text-muted-foreground';

          return (
            <Badge variant="outline" className={` ${className}`}>
              {status || '-'}
            </Badge>
          );
        },
      },

      {
        accessorKey: 'createdAt',
        header: 'Created At',

        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },

      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableHiding: false,

        cell: ({ row }) => {
          const user = row.original;

          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="border-border/20 h-8 w-8 rounded-lg border"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="bg-card border-border w-48 border">
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/users/${user.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View User
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit User
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [page, pageSize]
  );

  /**
   * DataTable filter configuration.
   *
   * Kept outside render-dependent state so it does not
   * change unnecessarily.
   */
  const userFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: 'membershipType',
        label: 'Membership',
        placeholder: 'Select membership',
        options: [
          { label: 'Premium', value: 'PREMIUM' },
          { label: 'Free', value: 'FREE' },
        ],
      },

      {
        key: 'gender',
        label: 'Gender',
        placeholder: 'Select gender',
        options: [
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other', value: 'OTHER' },
        ],
      },

      {
        key: 'isActive',
        label: 'Status',
        placeholder: 'Select status',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
      },

      {
        key: 'isExpert',
        label: 'Expert',
        placeholder: 'Select expert status',
        options: [
          { label: 'Expert', value: 'true' },
          { label: 'Not Expert', value: 'false' },
        ],
      },
      {
        key: 'createdOn',
        label: 'Joined date',
        type: 'date',
        options: [],
      },
    ],
    []
  );

  /**
   * Only update DataTable filter state.
   *
   * Do NOT update API filters here.
   * `filters` is derived from `columnFilters`.
   */
  // const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
  //   setColumnFilters((previous) => (typeof updater === 'function' ? updater(previous) : updater));
  // };
  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => (typeof updater === 'function' ? updater(previous) : updater));

    setPage(1);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((previous) => (typeof updater === 'function' ? updater(previous) : updater));
    setPage(1);
  };

  return (
    <PageWrapper className="animate-fade-in min-w-0 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm">Manage all your users</p>
      </div>
      <div className="w-full min-w-0 space-y-6">
        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users?.data ?? []}
          toolbar={
            <>
              <Link to="/users/create">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add User
                </Button>
              </Link>
            </>
          }
          enableSearch={true}
          manualSearch={true}
          search={search}
          searchPlaceholder="Search users..."
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          loading={isLoading || isFetching}
          error={isError ? error : null}
          onRetry={() => void refetch()}
          onRowClick={(user) => {
            navigate(`/users/${user.id}`);
          }}
          filterOptions={userFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          manualSorting

          pagination={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={(updater) => {
            const previous: PaginationState = {
              pageIndex: page - 1,
              pageSize,
            };

            const next = typeof updater === 'function' ? updater(previous) : updater;

            setPage(next.pageIndex + 1);

            if (next.pageSize !== pageSize) {
              setPageSize(next.pageSize);
              setPage(1);
            }
          }}
          manualPagination
          pageSizeOptions={[10, 20, 50, 100, 250, 500, 1000]}
          enableSorting
          totalRows={users?.total ?? 0}
          pageCount={users?.totalPages ?? 0}
        />
      </div>
    </PageWrapper>
  );
};

export default UsersPage;
