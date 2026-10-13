import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const courseName = (body.courseName || body.course_name || "General Course").trim();
    const background = (body.background || "").trim();
    const mode = (body.mode || "Online Live").trim();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO blickwinkle_website_course_enrollments
       (name, email, phone, course_name, background, mode, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending');`,
      [name, email, phone, courseName, background, mode]
    );

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error: unknown) {
    console.error("[Course Enrollment API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
