import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { sendBroadcastMail } from "@/lib/mail";
import { Subscriber } from "@/types/admin";

export async function GET(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    let sql = "SELECT * FROM blickwinkle_website_subscribers WHERE 1=1";
    const params: string[] = [];

    if (status && status !== "all") {
      sql += " AND status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND email LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " ORDER BY created_at DESC;";

    const items = await query<Subscriber[]>(sql, params);
    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    console.error("[Subscribers GET Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch subscribers." }, { status: 500 });
  }
}

// POST: Broadcast email to subscribers
export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();
    let recipients: string[] = body.recipientEmails || [];

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and message are required." },
        { status: 400 }
      );
    }

    // If no specific recipients passed, send to all active subscribers
    if (!recipients || recipients.length === 0) {
      const rows = await query<{ email: string }[]>(
        "SELECT email FROM blickwinkle_website_subscribers WHERE status = 'active';"
      );
      recipients = (rows || []).map((r) => r.email);
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No active subscribers found to receive this email." },
        { status: 400 }
      );
    }

    await sendBroadcastMail({
      recipients,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast email sent successfully to ${recipients.length} subscriber(s).`,
      count: recipients.length,
    });
  } catch (error: unknown) {
    console.error("[Subscribers Broadcast Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send broadcast email." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required." }, { status: 400 });
    }

    await query("UPDATE blickwinkle_website_subscribers SET status = ? WHERE id = ?;", [status, id]);
    return NextResponse.json({ success: true, message: "Subscriber status updated." });
  } catch (error: unknown) {
    console.error("[Subscribers PATCH Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to update subscriber." }, { status: 500 });
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

    await query("DELETE FROM blickwinkle_website_subscribers WHERE id = ?;", [id]);
    return NextResponse.json({ success: true, message: "Subscriber removed." });
  } catch (error: unknown) {
    console.error("[Subscribers DELETE Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to delete subscriber." }, { status: 500 });
  }
}
