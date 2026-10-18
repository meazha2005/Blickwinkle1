import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { query, ensureArticlesTable } from "@/lib/db";
import { Article } from "@/types/admin";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "article"}-${Date.now().toString(36)}`;
}

export async function GET(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureArticlesTable();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    let sql = "SELECT * FROM blickwinkle_website_articles WHERE 1=1";
    const params: (string | number)[] = [];

    if (status && status !== "all") {
      sql += " AND status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (title LIKE ? OR content LIKE ? OR summary LIKE ? OR author LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    sql += " ORDER BY created_at DESC;";

    const items = await query<Article[]>(sql, params);
    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    console.error("[Admin Articles GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureArticlesTable();
    const body = await req.json();
    const { title, image_url, content, summary, author, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: "Article title is required." }, { status: 400 });
    }
    if (!image_url || !image_url.trim()) {
      return NextResponse.json({ success: false, error: "Article image is required." }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: "Article content is required." }, { status: 400 });
    }

    const trimmedTitle = title.trim();
    const slug = generateSlug(trimmedTitle);
    const autoSummary = summary?.trim() || (content.trim().slice(0, 180) + (content.length > 180 ? "..." : ""));
    const articleAuthor = author?.trim() || "Blickwinkle Team";
    const articleStatus = status === "draft" ? "draft" : "published";

    interface InsertResult {
      insertId: number;
    }

    const result = await query<InsertResult>(
      `INSERT INTO blickwinkle_website_articles (title, slug, image_url, content, summary, author, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [trimmedTitle, slug, image_url.trim(), content.trim(), autoSummary, articleAuthor, articleStatus]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
      slug,
      message: "Article created successfully.",
    });
  } catch (error: unknown) {
    console.error("[Admin Articles POST Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureArticlesTable();
    const body = await req.json();
    const { id, title, image_url, content, summary, author, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Article ID is required." }, { status: 400 });
    }

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (title !== undefined && title.trim()) {
      updates.push("title = ?");
      params.push(title.trim());
    }
    if (image_url !== undefined && image_url.trim()) {
      updates.push("image_url = ?");
      params.push(image_url.trim());
    }
    if (content !== undefined && content.trim()) {
      updates.push("content = ?");
      params.push(content.trim());
    }
    if (summary !== undefined) {
      updates.push("summary = ?");
      params.push(summary.trim());
    }
    if (author !== undefined) {
      updates.push("author = ?");
      params.push(author.trim());
    }
    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status === "draft" ? "draft" : "published");
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
    }

    params.push(id);
    await query(`UPDATE blickwinkle_website_articles SET ${updates.join(", ")} WHERE id = ?;`, params);

    return NextResponse.json({ success: true, message: "Article updated successfully." });
  } catch (error: unknown) {
    console.error("[Admin Articles PATCH Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureArticlesTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Article ID is required." }, { status: 400 });
    }

    await query("DELETE FROM blickwinkle_website_articles WHERE id = ?;", [id]);
    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Articles DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article." },
      { status: 500 }
    );
  }
}
