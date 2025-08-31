export type SortKey =
  | "company_name"
  | "abn"
  | "state"
  | "company_type"
  | "abn_status"
  | "gst_status";

export type MetaData = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
