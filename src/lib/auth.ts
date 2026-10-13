import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "blickwinkle_secret_production_key_2026_jwt_token_secure";
const COOKIE_NAME = "blickwinkle_admin_token";

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}

export async function getAuthenticatedAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyAdminToken(token);
    if (!payload) return null;

    // Verify admin still exists in database
    const rows = await query<AdminPayload[]>(
      "SELECT id, email, name, role FROM blickwinkle_website_admins WHERE id = ? LIMIT 1;",
      [payload.id]
    );

    if (!rows || rows.length === 0) return null;
    return rows[0] as AdminPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
