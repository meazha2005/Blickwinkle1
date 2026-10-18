import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";

    const uploadDir = path.join(process.cwd(), "public", "uploads", "articles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".png";
      const sanitizedBase = path.basename(file.name, ext).replace(/[^\w-]/g, "_").slice(0, 30);
      const fileName = `article_${Date.now()}_${sanitizedBase}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/articles/${fileName}`;

      return NextResponse.json({ success: true, url: publicUrl });
    }

    // Handle base64 JSON payload
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { base64Data, fileName: origName } = body;

      if (!base64Data) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = ".png";

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime === "image/jpeg") ext = ".jpg";
        else if (mime === "image/webp") ext = ".webp";
        else if (mime === "image/svg+xml") ext = ".svg";
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(base64Data, "base64");
      }

      const safeBase = origName ? path.basename(origName).replace(/[^\w-]/g, "_").slice(0, 30) : "image";
      const fileName = `article_${Date.now()}_${safeBase}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/articles/${fileName}`;

      return NextResponse.json({ success: true, url: publicUrl });
    }

    return NextResponse.json({ success: false, error: "Unsupported content type" }, { status: 400 });
  } catch (error: unknown) {
    console.error("[Article Image Upload Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
