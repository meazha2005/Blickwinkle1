import { NextResponse } from "next/server";
import { query, ensureArticlesTable } from "@/lib/db";
import { Article } from "@/types/admin";

export async function GET(req: Request) {
  try {
    await ensureArticlesTable();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    let sql = "SELECT id, title, slug, image_url, summary, author, status, created_at, updated_at FROM blickwinkle_website_articles WHERE status = 'published'";
    const params: string[] = [];

    if (search) {
      sql += " AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY created_at DESC;";

    const articles = await query<Article[]>(sql, params);
    return NextResponse.json({ success: true, articles });
  } catch (error: unknown) {
    console.error("[Public Articles GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles.", articles: [] },
      { status: 500 }
    );
  }
}
