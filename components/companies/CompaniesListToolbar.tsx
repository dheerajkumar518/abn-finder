"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/lib/filters-data";
import { useFilters } from "@/stores/filters-store";

export function CompaniesListToolbar({
  selectedCount,
}: {
  selectedCount: number;
}) {
  const { sort, order, setSort } = useFilters();

  const current = sortOptions.find((o) => o.key === sort)?.label ?? "Relevance";

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <span className="text-sm text-muted-foreground">
            {selectedCount} selected
          </span>
        ) : (
          "Companies"
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by</span>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="sm">
              {current} ({order === "asc" ? "Asc" : "Desc"})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {sortOptions.map((opt) => (
              <DropdownMenuItem key={opt.key} onClick={() => setSort(opt.key)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
            <div className="my-1 border-t" />
            <DropdownMenuItem
              onClick={() => setSort(sort, order === "asc" ? "desc" : "asc")}
            >
              Toggle Order ({order === "asc" ? "Desc" : "Asc"})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
