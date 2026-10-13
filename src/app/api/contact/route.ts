import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const inquiryType = (body.inquiryType || body.inquiry_type || "General Inquiry").trim();
    const preferredContact = (body.preferredContact || body.preferred_contact || "Email").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
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
      `INSERT INTO blickwinkle_website_contact_messages
       (name, email, phone, inquiry_type, preferred_contact, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new');`,
      [name, email, phone, inquiryType, preferredContact, message]
    );

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
