"use client";

import { SortKey } from "@/lib/types";
import { create } from "zustand";

type MultiKeys = "state" | "abn_status" | "company_type" | "gst_status";

interface FiltersState {
  q: string;
  state: string[];
  abn_status: string[];
  company_type: string[];
  gst_status: string[];
  sort: SortKey;
  order: "asc" | "desc";
  page: number;
  pageSize: number;

  setQuery: (_q: string) => void;
  toggleMulti: (_key: MultiKeys, _value: string) => void;
  setSort: (_sort: SortKey, _order?: "asc" | "desc") => void;
  setPage: (_page: number) => void;
  setPageSize: (_size: number) => void;
  reset: () => void;
  clearKey: (_key: MultiKeys) => void;
}

const initialState: Omit<
  FiltersState,
  | "setQuery"
  | "toggleMulti"
  | "setSort"
  | "setPage"
  | "setPageSize"
  | "reset"
  | "clearKey"
> = {
  q: "",
  state: [],
  abn_status: [],
  company_type: [],
  gst_status: [],
  sort: "company_name",
  order: "asc",
  page: 1,
  pageSize: 20,
};

export const useFilters = create<FiltersState>((set, get) => ({
  ...initialState,

  setQuery: (q) => set({ q, page: 1 }),

  toggleMulti: (key, value) => {
    const current = get()[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set({ [key]: next, page: 1 } as Partial<FiltersState>);
  },

  setSort: (sort, order) => {
    const currentOrder = get().order;
    set({
      sort,
      order:
        order ??
        (get().sort === sort && currentOrder === "asc" ? "desc" : "asc"),
      page: 1,
    });
  },

  setPage: (page) => set({ page }),

  setPageSize: (size) => set({ pageSize: size, page: 1 }),

  reset: () => set(initialState),

  clearKey: (key) => set({ [key]: [], page: 1 } as Partial<FiltersState>),
}));
