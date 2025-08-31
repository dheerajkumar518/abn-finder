import { type SortKey } from "./types";

export const filtersData = {
  states: ["NSW", "VIC", "QLD", "ACT", "NT", "WA", "SA", "TAS"],
  company_Type: [
    "PUB",
    "PRV",
    "OIE",
    "SMF",
    "PTR",
    "DST",
    "FUT",
    "STR",
    "FPT",
    "DIT",
    "DTT",
    "UIE",
    "TRT",
    "CGE",
  ],
  gst_status: ["ACT", "CAN", "NON"],
  abn_status: ["ACT", "CAN"],
};

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "company_name", label: "Company Name" },
  { key: "abn", label: "ABN" },
  { key: "state", label: "State" },
  { key: "company_type", label: "Company Type" },
  { key: "abn_status", label: "ABN Status" },
  { key: "gst_status", label: "GST Status" },
];
