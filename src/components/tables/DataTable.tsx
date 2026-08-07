import { useState } from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Spinner } from "../ui/spinner";

import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSortIcon } from "./DataTableSortIcon";
import type { DataTableProps } from "@/types/datatable.types";

export function DataTable<TData, TValue>({
  columns,
  data,

  loading = false,

  search,
  searchKey,
  onSearchChange,
  searchPlaceholder = "Search...",
  manualSearch = false,

  sorting,
  onSortingChange,
  manualSorting = false,

  filters,
  onFiltersChange,
  manualFiltering = false,

  pagination,
  onPaginationChange,
  manualPagination = false,

  totalRows,
  pageCount,

  columnVisibility,
  onColumnVisibilityChange,

  rowSelection,
  onRowSelectionChange,

  enableSearch = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableColumnVisibility = true,
  enableRowSelection = false,

  toolbar,
  emptyMessage = "No records found.",

  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);

  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>(
    [],
  );

  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: pagination?.pageSize ?? 10,
    },
  );

  const [internalVisibility, setInternalVisibility] = useState<VisibilityState>(
    {},
  );

  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  const sortingState = sorting ?? internalSorting;

  const filterState = filters ?? internalFilters;

  const paginationState = pagination ?? internalPagination;

  const visibilityState = columnVisibility ?? internalVisibility;

  const rowSelectionState = rowSelection ?? internalRowSelection;

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),

    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),

    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),

    manualSorting,
    manualFiltering,
    manualPagination,

    autoResetPageIndex: false,

    pageCount,

    state: {
      sorting: sortingState,
      columnFilters: filterState,
      pagination: paginationState,
      columnVisibility: visibilityState,
      rowSelection: rowSelectionState,
    },

    onSortingChange: onSortingChange ?? setInternalSorting,

    onColumnFiltersChange: onFiltersChange ?? setInternalFilters,

    onPaginationChange: onPaginationChange ?? setInternalPagination,

    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalVisibility,

    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,

    enableRowSelection,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  // console.log('Rows:', table.getRowModel().rows.length);
  // console.log(table.getRowModel().rows);

  return (
    <div>
      <DataTableToolbar
        table={table}

        toolbar={toolbar}

        enableSearch={enableSearch}
        enableColumnVisibility={enableColumnVisibility}

        search={search}
        searchKey={searchKey}
        manualSearch={manualSearch}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        enableFiltering={enableFiltering}
        enableExportCSV={true}
      />

      <div className="bg-card my-5 overflow-hidden rounded-none border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    onClick={
                      enableSorting && header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {header.column.getCanSort() && (
                          <DataTableSortIcon
                            direction={header.column.getIsSorted()}
                          />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={
                    onRowClick ? "hover:bg-muted/50 cursor-pointer" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <DataTablePagination
          table={table}

          manualPagination={manualPagination}

          totalRows={totalRows}

          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </div>
  );
}
