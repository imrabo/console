import type { ColumnDef, ColumnFiltersState, OnChangeFn, PaginationState, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    loading?: boolean;

    // Search
    searchKey?: string;
    search?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    manualSearch?: boolean;

    // Sorting
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    manualSorting?: boolean;

    // Filters
    filters?: ColumnFiltersState;
    onFiltersChange?: OnChangeFn<ColumnFiltersState>;
    manualFiltering?: boolean;

    // Pagination
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    manualPagination?: boolean;

    totalRows?: number;
    pageCount?: number;

    // Visibility
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

    // Row Selection
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;

    // Features
    enableSearch?: boolean;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enablePagination?: boolean;
    enableColumnVisibility?: boolean;
    enableRowSelection?: boolean;
    enableExportCSV?: boolean;
    enableExportExcel?: boolean;
    enableRefresh?: boolean;

    toolbar?: React.ReactNode;

    emptyMessage?: string;

    onRowClick?: (row: TData) => void;

}