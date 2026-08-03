import React from "react";
import type { Table } from "@tanstack/react-table";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FilterDropdown } from "./FilterDropdown";

export interface DataTableFilter {
  key: string;
  label: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface DataTableToolbarProps<TData, _TValue> {
  table: Table<TData>;

  toolbar?: React.ReactNode;

  enableSearch?: boolean;
  enableColumnVisibility?: boolean;

  search?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  enableRefresh?: boolean;
  onRefresh?: () => void;
  enableExportCSV?: boolean;
  onExportCSV?: () => void;
  enableExportExcel?: boolean;
  onExportExcel?: () => void;
  enableFiltering?: boolean;
  filters?: DataTableFilter[];
  manualSearch?: boolean;
  onSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData, TValue>({
  table,

  toolbar,

  enableSearch = true,
  enableColumnVisibility = true,

  search,
  searchKey,
  searchPlaceholder = "Search...",

  manualSearch = false,
  enableRefresh = false,
  onRefresh,
  enableExportCSV = false,
  onExportCSV,
  enableExportExcel = false,
  onExportExcel,
  enableFiltering = true,
  filters,
  onSearchChange,
}: DataTableToolbarProps<TData, TValue>) {
  const searchValue = manualSearch
    ? (search ?? "")
    : ((table.getColumn(searchKey ?? "")?.getFilterValue() as string) ?? "");

  const handleSearch = (value: string) => {
    if (manualSearch) {
      onSearchChange?.(value);
      return;
    }

    if (!searchKey) return;

    table.getColumn(searchKey)?.setFilterValue(value);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left Side */}
      <div className="flex flex-1 items-center gap-2">
        {enableSearch && (
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {enableFiltering && filters && filters.length > 0 && (
          <FilterDropdown table={table} filters={filters} />
        )}
        {enableExportExcel && onExportExcel && (
          <Button variant="outline" onClick={onExportExcel}>
            Export Excel
          </Button>
        )}
        {enableExportCSV && onExportCSV && (
          <Button variant="outline" onClick={onExportCSV}>
            Export CSV
          </Button>
        )}
        {enableRefresh && onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                    className="capitalize"
                  >
                    {(column.columnDef.meta as { label?: string })?.label ??
                      column.id.replace(/([A-Z])/g, " $1")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {toolbar}
      </div>
    </div>
  );
}
