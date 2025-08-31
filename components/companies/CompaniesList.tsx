"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { useFilters } from "@/stores/filters-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CompaniesListToolbar } from "./CompaniesListToolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tables } from "@/database.types";
import { MetaData } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function CompaniesList() {
  const filters = useFilters();
  const [selected, setSelected] = useState<Record<string | number, boolean>>(
    {}
  );

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    filters.state.forEach((v) => params.append("state", v));
    filters.abn_status.forEach((v) => params.append("abn_status", v));
    filters.company_type.forEach((v) => params.append("company_type", v));
    filters.gst_status.forEach((v) => params.append("gst_status", v));
    params.set("sort", filters.sort);
    params.set("order", filters.order);
    params.set("page", String(filters.page));
    params.set("pageSize", String(filters.pageSize));
    return params.toString();
  }, [filters]);

  console.log(qs);

  const { data, isLoading } = useSWR<{
    data: Tables<"australian_business_register">[];
    meta: MetaData;
  }>(`/api/companies?${qs}`, fetcher);

  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 0;
  const currentPage = data?.meta?.page ?? 1;

  const allOnPageChecked =
    rows.length > 0 && rows.every((r) => selected[r.abn]);
  const selectedCount = Object.values(selected).filter(Boolean).length;

  const toggleAll = (checked: boolean) => {
    const next = { ...selected };
    rows.forEach((r) => (next[r.abn] = checked));
    setSelected(next);
  };

  const toggleRow = (id: string | number, checked: boolean) => {
    setSelected((s) => ({ ...s, [id]: checked }));
  };

  return (
    <section className="flex-1  rounded-2xl border bg-card shadow-sm">
      <CompaniesListToolbar selectedCount={selectedCount} />

      <div className="px-4 py-3 h-[calc(100vh-220px)] overflow-auto">
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageChecked}
                    onCheckedChange={(v) => toggleAll(Boolean(v))}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>ABN</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>Company Type</TableHead>
                <TableHead>ABN Status</TableHead>
                <TableHead>GST Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-sm text-muted-foreground"
                  >
                    {Array.from({ length: filters.pageSize }).map((_, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <Skeleton key={i} className="h-[35px]  rounded-md" />
                        <hr />
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No results
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.abn}>
                    <TableCell className="w-10">
                      <Checkbox
                        checked={Boolean(selected[r.abn])}
                        onCheckedChange={(v) => toggleRow(r.abn, Boolean(v))}
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/image.png" />
                          <AvatarFallback>
                            {r.company_name?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        {/* max 30 char then do ... for rest char */}
                        {r.company_name.length > 25
                          ? r.company_name.slice(0, 25) + "..."
                          : r.company_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.abn}
                    </TableCell>
                    <TableCell>{r.state ?? "-"}</TableCell>
                    <TableCell>{r.postcode ?? "-"}</TableCell>
                    <TableCell>{r.company_type ?? "-"}</TableCell>
                    <TableCell>{r.abn_status ?? "-"}</TableCell>
                    <TableCell>{r.gst_status ?? "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
        <span className="text-muted-foreground">
          {total.toLocaleString()} results • Page {currentPage} of{" "}
          {totalPages || 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg bg-transparent"
            onClick={() => filters.setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className="rounded-lg"
            onClick={() =>
              filters.setPage(Math.min(totalPages || 1, currentPage + 1))
            }
            disabled={currentPage >= (totalPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
