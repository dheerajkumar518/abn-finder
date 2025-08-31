import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MetaData } from "@/lib/types";
import { Tables } from "@/database.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const states = searchParams.getAll("state");
    const abnStatuses = searchParams.getAll("abn_status");
    const companyTypes = searchParams.getAll("company_type");
    const gstStatuses = searchParams.getAll("gst_status");
    const sort = searchParams.get("sort") || "company_name";
    const order = (searchParams.get("order") || "asc") as "asc" | "desc";
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = createClient();

    let query = (await supabase)
      .from("australian_business_register")
      .select(
        "abn, abn_status, company_type, company_name, gst_status, state, postcode",
        { count: "exact" }
      );

    if (q) {
      const isNumeric = /^\d+$/.test(q);
      if (isNumeric) {
        // ABN stored as number -> use eq for exact match; for partial numeric search, consider casting in DB/view
        query = query.eq("abn", Number(q));
      } else {
        query = query.ilike("company_name", `%${q}%`);
      }
    }

    if (states.length) query = query.in("state", states);
    if (abnStatuses.length) query = query.in("abn_status", abnStatuses);
    if (companyTypes.length) query = query.in("company_type", companyTypes);
    if (gstStatuses.length) query = query.in("gst_status", gstStatuses);

    // Sorting
    query = query.order(sort, {
      ascending: order === "asc",
      nullsFirst: true,
    });

    // Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: data ?? ([] as Tables<"australian_business_register">[]),
      meta: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0,
      } as MetaData,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
