"use client";

import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  collapsible?: boolean;
};

export function MultiSelectFilter({
  title,
  options,
  selected,
  onToggle,
  onClear,
}: Props) {
  const hasSelection = selected.length > 0;
  const topFive = useMemo(() => options.slice(0, 12), [options]);

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground/90">{title}</h4>
        {hasSelection ? (
          <Button onClick={onClear} variant="link" size="sm" className="h-4">
            Clear
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-3 overflow-auto max-h-[100px] gap-2">
        {topFive.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => onToggle(opt)}
              aria-label={opt}
            />
            <span className="truncate">{opt}</span>
          </label>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-muted-foreground">No options</p>
        )}
      </div>
    </div>
  );
}
