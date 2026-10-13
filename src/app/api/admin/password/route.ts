import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, comparePassword, hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Verify current password
    const rows = await query<Array<{ password_hash: string }>>(
      "SELECT password_hash FROM blickwinkle_website_admins WHERE id = ? LIMIT 1;",
      [admin.id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Admin user not found." }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await query(
      "UPDATE blickwinkle_website_admins SET password_hash = ? WHERE id = ?;",
      [newHash, admin.id]
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: unknown) {
    console.error("[Admin Password Change Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password." },
      { status: 500 }
    );
  }
}
