import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { ServiceEnquiry } from "@/types/admin";

export async function GET(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    let sql = "SELECT * FROM blickwinkle_website_service_enquiries WHERE 1=1";
    const params: (string | number)[] = [];

    if (status && status !== "all") {
      sql += " AND status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR service_name LIKE ? OR message LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern);
    }

    sql += " ORDER BY created_at DESC;";

    const items = await query<ServiceEnquiry[]>(sql, params);
    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    console.error("[Service Enquiries GET Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch enquiries." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
    }

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      params.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
    }

    params.push(id);
    await query(`UPDATE blickwinkle_website_service_enquiries SET ${updates.join(", ")} WHERE id = ?;`, params);

    return NextResponse.json({ success: true, message: "Enquiry updated." });
  } catch (error: unknown) {
    console.error("[Service Enquiries PATCH Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to update enquiry." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
    }

    await query("DELETE FROM blickwinkle_website_service_enquiries WHERE id = ?;", [id]);
    return NextResponse.json({ success: true, message: "Enquiry deleted." });
  } catch (error: unknown) {
    console.error("[Service Enquiries DELETE Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to delete enquiry." }, { status: 500 });
  }
}
