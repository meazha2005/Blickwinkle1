import { NextResponse } from "next/server";
import { query, ensureArticlesTable } from "@/lib/db";
import { Article } from "@/types/admin";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureArticlesTable();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID or slug is required" }, { status: 400 });
    }

    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric
      ? "SELECT * FROM blickwinkle_website_articles WHERE id = ? LIMIT 1;"
      : "SELECT * FROM blickwinkle_website_articles WHERE slug = ? LIMIT 1;";

    const rows = await query<Article[]>(sql, [id]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: rows[0] });
  } catch (error: unknown) {
    console.error("[Single Article GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article." },
      { status: 500 }
    );
  }
}
