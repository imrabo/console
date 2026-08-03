import type { Table } from "@tanstack/react-table";
import { Filter } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface DataTableFilter {
  key: string;
  label: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface FilterDropdownProps<TData> {
  table: Table<TData>;
  filters: DataTableFilter[];
}

export function FilterDropdown<TData>({
  table,
  filters,
}: FilterDropdownProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="mb-2 block text-sm font-medium">
                {filter.label}
              </label>

              <Select
                value={
                  (table.getColumn(filter.key)?.getFilterValue() as string) ??
                  ""
                }
                onValueChange={(value) =>
                  table
                    .getColumn(filter.key)
                    ?.setFilterValue(value === "ALL" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={filter.placeholder ?? filter.label}
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>

                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
