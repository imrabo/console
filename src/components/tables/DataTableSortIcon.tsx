import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface DataTableSortIconProps {
  direction: false | "asc" | "desc";
}

export function DataTableSortIcon({ direction }: DataTableSortIconProps) {
  switch (direction) {
    case "asc":
      return <ArrowUp className="text-primary h-4 w-4" />;

    case "desc":
      return <ArrowDown className="text-primary h-4 w-4" />;

    default:
      return (
        <ArrowUpDown className="text-muted-foreground h-4 w-4 opacity-60" />
      );
  }
}
