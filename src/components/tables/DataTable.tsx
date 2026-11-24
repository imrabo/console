import React, { useState } from 'react';

import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';

import { AlertCircle, Database, RefreshCw } from 'lucide-react';

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import { Spinner } from '../ui/spinner';

import { DataTableToolbar, DataTableFilter } from './DataTableToolbar';

import { DataTablePagination } from './DataTablePagination';

import { DataTableSortIcon } from './DataTableSortIcon';

import { DataTableProps } from '@/types/datatable.types';

function compareColumnValues<TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string) {
  const left = rowA.getValue<unknown>(columnId);
  const right = rowB.getValue<unknown>(columnId);
  const dateColumn = /(date|time|At|timestamp)$/i.test(columnId);

  const toTimestamp = (value: unknown): number | null => {
    if (value instanceof Date) return value.getTime();
    if (!value || typeof value !== 'object') return null;

    const timestamp = value as {
      seconds?: unknown;
      _seconds?: unknown;
      nanoseconds?: unknown;
      _nanoseconds?: unknown;
    };
    const seconds = Number(timestamp.seconds ?? timestamp._seconds);

    return Number.isFinite(seconds)
      ? seconds * 1000 + Number(timestamp.nanoseconds ?? timestamp._nanoseconds ?? 0) / 1_000_000
      : null;
  };

  if (dateColumn) {
    const leftTime = toTimestamp(left) ?? (typeof left === 'string' ? Date.parse(left) : NaN);
    const rightTime = toTimestamp(right) ?? (typeof right === 'string' ? Date.parse(right) : NaN);
    if (Number.isFinite(leftTime) && Number.isFinite(rightTime)) return leftTime - rightTime;
  }

  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  if (typeof left === 'boolean' && typeof right === 'boolean') return Number(left) - Number(right);

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function DataTable<TData, TValue>({
  columns,
  data,

  loading = false,

  // Error
  error = null,
  onRetry,
  errorMessage = 'Something went wrong while loading the data.',

  // Search
  search,
  searchKey,
  onSearchChange,
  searchPlaceholder = 'Search...',
  manualSearch = false,

  // Search validation
  searchMaxLength,
  searchPattern,

  // Sorting
  sorting,
  onSortingChange,
  manualSorting = false,

  // Filtering
  filters,
  onFiltersChange,
  manualFiltering = false,

  // Pagination
  pagination,
  onPaginationChange,
  manualPagination = false,

  totalRows,
  pageCount,
  pageSizeOptions = [10, 20, 50, 100],

  // Column visibility
  columnVisibility,
  onColumnVisibilityChange,

  // Row selection
  rowSelection,
  onRowSelectionChange,

  // Features
  enableSearch = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableRowSelection = false,

  enableExportCSV = true,
  enableExportExcel = false,
  enableRefresh = false,

  onExportCSV,
  onExportExcel,
  onRefresh,

  toolbar,

  filterOptions = [],

  emptyIcon = <Database />,
  emptyMessage = 'No records found.',

  onRowClick,
}: DataTableProps<TData, TValue> & {
  filterOptions?: DataTableFilter[];

  /**
   * Optional search validation.
   */
  searchMaxLength?: number;
  searchPattern?: RegExp;

  /**
   * Optional error state.
   *
   * Pass an Error object, string, or true.
   */
  error?: Error | string | boolean | null;

  /**
   * Optional retry handler.
   *
   * If provided, a Retry button will be shown.
   */
  onRetry?: () => void;

  /**
   * Message shown when the table is in an error state.
   */
  errorMessage?: string;
}) {
  /*
   * -------------------------------------------------------
   * Internal state
   * -------------------------------------------------------
   */

  const [internalSorting, setInternalSorting] = useState<SortingState>([]);

  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>([]);

  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination?.pageSize ?? 10,
  });

  const [internalVisibility, setInternalVisibility] = useState<VisibilityState>({});

  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

  /*
   * -------------------------------------------------------
   * Controlled / uncontrolled state
   * -------------------------------------------------------
   */

  const sortingState = sorting ?? internalSorting;

  const filterState = filters ?? internalFilters;

  const paginationState = pagination ?? internalPagination;

  const visibilityState = columnVisibility ?? internalVisibility;

  const rowSelectionState = rowSelection ?? internalRowSelection;

  const sortableColumns = columns.map((column) =>
    'accessorKey' in column || 'accessorFn' in column
      ? { ...column, enableSorting: true, sortingFn: compareColumnValues }
      : column
  ) as ColumnDef<TData, TValue>[];

  const filterValues = Object.fromEntries(filterState.map(({ id, value }) => [id, String(value)]));

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(paginationState) : updater;
    const paginationUpdate = {
      ...next,
      // TanStack's setPageSize preserves the top visible row. Admin tables
      // consistently restart at the first page when the page size changes.
      pageIndex: next.pageSize === paginationState.pageSize ? next.pageIndex : 0,
    };

    if (onPaginationChange) {
      onPaginationChange(paginationUpdate);
    } else {
      setInternalPagination(paginationUpdate);
    }
  };

  const resetPagination = () => {
    handlePaginationChange((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
  };

  const handleFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const nextFilters = typeof updater === 'function' ? updater(filterState) : updater;

    if (JSON.stringify(nextFilters) === JSON.stringify(filterState)) {
      return;
    }

    if (onFiltersChange) {
      onFiltersChange(nextFilters);
    } else {
      setInternalFilters(nextFilters);
    }

    resetPagination();
  };

  const handleSearchChange = (value: string) => {
    if (value === (search ?? '')) {
      return;
    }

    onSearchChange?.(value);
    resetPagination();
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    const nextFilters = filterState.filter((filter) => filter.id !== key);

    if (value !== undefined) {
      nextFilters.push({
        id: key,
        value,
      });
    }

    const updater = nextFilters as ColumnFiltersState;

    handleFiltersChange(updater);
  };

  /*
   * -------------------------------------------------------
   * React Table
   * -------------------------------------------------------
   */

  const table = useReactTable({
    data,
    columns: sortableColumns,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: manualSorting || !enableSorting ? undefined : getSortedRowModel(),

    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),

    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),

    manualSorting: manualSorting || !enableSorting,
    manualFiltering,
    manualPagination,

    autoResetPageIndex: false,

    pageCount: manualPagination ? pageCount : undefined,

    enableSorting,

    state: {
      sorting: sortingState,
      columnFilters: filterState,
      pagination: paginationState,
      columnVisibility: visibilityState,
      rowSelection: rowSelectionState,
    },

    onSortingChange: onSortingChange ?? setInternalSorting,

    onColumnFiltersChange: handleFiltersChange,

    onPaginationChange: handlePaginationChange,

    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalVisibility,

    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,

    enableRowSelection,
  });

  const exportVisiblePageAsCsv = () => {
    const columns = table
      .getVisibleLeafColumns()
      .filter((column) => 'accessorKey' in column.columnDef || 'accessorFn' in column.columnDef);
    const rows = table.getRowModel().rows;

    const escapeCsvValue = (value: unknown) => {
      let formattedValue = '';

      if (value instanceof Date) {
        formattedValue = value.toISOString();
      } else if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof value.toDate === 'function'
      ) {
        formattedValue = value.toDate().toISOString();
      } else if (
        typeof value === 'object' &&
        value !== null &&
        'seconds' in value &&
        typeof value.seconds === 'number'
      ) {
        formattedValue = new Date(value.seconds * 1000).toISOString();
      } else if (value !== null && value !== undefined) {
        formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      }

      // Prevent spreadsheet applications from interpreting untrusted text as a formula.
      if (/^[\u0000-\u0020]*[=+\-@]/.test(formattedValue)) {
        formattedValue = `'${formattedValue}`;
      }

      return `"${formattedValue.replace(/"/g, '""')}"`;
    };

    const headerLabels = columns.map((column) => {
      const metaLabel = (column.columnDef.meta as { label?: string } | undefined)?.label;
      const header = column.columnDef.header;
      const label = typeof header === 'string' ? header : column.id;

      return escapeCsvValue(metaLabel ?? label);
    });

    const csvRows = rows.map((row) =>
      columns.map((column) => escapeCsvValue(row.getValue(column.id))).join(',')
    );
    const csv = [headerLabels.join(','), ...csvRows].join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'table-export.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="w-full max-w-full min-w-0">
      <DataTableToolbar
        table={table}
        toolbar={toolbar}
        enableSearch={enableSearch}
        search={search}
        searchKey={searchKey}
        manualSearch={manualSearch}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        searchMaxLength={searchMaxLength}
        searchPattern={searchPattern}
        enableFiltering={enableFiltering}
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        enableColumnVisibility={enableColumnVisibility}
        enableExportCSV={enableExportCSV}
        onExportCSV={onExportCSV ?? exportVisiblePageAsCsv}
        enableExportExcel={enableExportExcel}
        onExportExcel={onExportExcel}
        enableRefresh={enableRefresh}
        onRefresh={onRefresh}
      />

      {/* Responsive Data Table */}

      {/* Responsive Data Table */}
      <div className="my-5 w-full max-w-full min-w-0 overflow-hidden rounded-xl border">
        <div
          className="relative w-full min-w-0 overflow-x-auto overscroll-x-contain"
          role="region"
          aria-label="Scrollable data table"
          tabIndex={0}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
          }}
        >
          <div className="w-full min-w-[1000px] md:min-w-full">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();

                      return (
                        <TableHead
                          key={header.id}
                          className={
                            canSort
                              ? 'cursor-pointer whitespace-nowrap select-none'
                              : 'whitespace-nowrap'
                          }
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-2">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {canSort && (
                                <DataTableSortIcon direction={header.column.getIsSorted()} />
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="h-48 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Spinner />
                        <p className="text-muted-foreground text-sm">Loading data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="h-48 text-center"
                    >
                      <div className="flex flex-col items-center justify-center px-4 py-8">
                        <div className="bg-destructive/10 text-destructive mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                          <AlertCircle className="h-5 w-5" />
                        </div>

                        <h3 className="text-foreground font-semibold">Unable to load data</h3>

                        <p className="text-muted-foreground mt-2 max-w-md text-sm">
                          {typeof error === 'string' ? error : 'Something Went Wrong'}
                        </p>

                        {onRetry && (
                          <button
                            type="button"
                            onClick={onRetry}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={onRowClick ? 'hover:bg-muted/50 cursor-pointer' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="h-32 text-center"
                    >
                      {emptyIcon && (
                        <div className="text-muted-foreground flex justify-center p-2">
                          {emptyIcon}
                        </div>
                      )}
                      <p className="text-muted-foreground text-sm">{emptyMessage}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
        </div>
      </div>

      {/* <div className="my-5 w-full max-w-full min-w-0 overflow-hidden rounded-xl border">
        <div
          className="w-full min-w-0 overflow-x-auto overscroll-x-contain"
          role="region"
          aria-label="Scrollable data table"
          tabIndex={0}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
          }}
        >
          <div className="w-full min-w-[1000px] md:min-w-full">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();

                      return (
                        <TableHead
                          key={header.id}
                          className={
                            canSort
                              ? 'cursor-pointer whitespace-nowrap select-none'
                              : 'whitespace-nowrap'
                          }
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-2">
                              {flexRender(header.column.columnDef.header, header.getContext())}

                              {canSort && (
                                <DataTableSortIcon direction={header.column.getIsSorted()} />
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={onRowClick ? 'hover:bg-muted/50 cursor-pointer' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="h-32 text-center"
                    >
                      {emptyIcon && (
                        <div className="text-muted-foreground flex justify-center p-2">
                          {emptyIcon}
                        </div>
                      )}

                      <p className="text-muted-foreground text-sm">{emptyMessage}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
        </div>
      </div> */}

      {enablePagination && (
        <DataTablePagination
          table={table}
          manualPagination={manualPagination}
          totalRows={totalRows}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
