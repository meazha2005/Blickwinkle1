import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { comparePassword, signAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    interface AdminRow {
      id: number;
      email: string;
      password_hash: string;
      name: string;
      role: string;
    }

    const rows = await query<AdminRow[]>(
      "SELECT id, email, password_hash, name, role FROM blickwinkle_website_admins WHERE email = ? LIMIT 1;",
      [email]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last_login
    await query(
      "UPDATE blickwinkle_website_admins SET last_login = NOW() WHERE id = ?;",
      [admin.id]
    );

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error("[Admin Login Error]:", error);
    const msg = error instanceof Error ? error.message : "Authentication failed. Please try again.";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
