"use client";

import { Input } from "@/components/ui/input";
import { useFilters } from "@/stores/filters-store";
import { MultiSelectFilter } from "@/components/filters/MultiSelectFilter";
import { filtersData } from "@/lib/filters-data";
import { Button } from "@/components/ui/button";

export function FiltersSidebar() {
  const filters = useFilters();

  const countActive =
    filters.state.length +
    filters.abn_status.length +
    filters.company_type.length +
    filters.gst_status.length +
    (filters.q ? 1 : 0);

  return (
    <aside className="w-full overflow-auto  max-w-xs shrink-0 space-y-4 ">
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-balance">
            Filters {countActive ? `(${countActive})` : ""}
          </h3>
          {countActive > 0 && (
            <Button
              onClick={filters.reset}
              variant="link"
              size="sm"
              className="h-4"
            >
              Clear all
            </Button>
          )}
        </div>
        <Input
          placeholder="Type filter name or ABN"
          value={filters.q}
          onChange={(e) => filters.setQuery(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <MultiSelectFilter
        title="ABN Status"
        options={filtersData.abn_status}
        selected={filters.abn_status}
        onToggle={(v) => filters.toggleMulti("abn_status", v)}
        onClear={() => filters.clearKey("abn_status")}
      />

      <MultiSelectFilter
        title="Company Type"
        options={filtersData.company_Type}
        selected={filters.company_type}
        onToggle={(v) => filters.toggleMulti("company_type", v)}
        onClear={() => filters.clearKey("company_type")}
      />

      <MultiSelectFilter
        title="GST Status"
        options={filtersData.gst_status}
        selected={filters.gst_status}
        onToggle={(v) => filters.toggleMulti("gst_status", v)}
        onClear={() => filters.clearKey("gst_status")}
      />

      <MultiSelectFilter
        title="States"
        options={filtersData.states}
        selected={filters.state}
        onToggle={(v) => filters.toggleMulti("state", v)}
        onClear={() => filters.clearKey("state")}
      />
    </aside>
  );
}
