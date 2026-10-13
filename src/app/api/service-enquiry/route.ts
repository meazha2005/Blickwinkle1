import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const serviceName = (body.serviceName || body.service_name || "General Service").trim();
    const message = (body.message || "").trim();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO blickwinkle_website_service_enquiries
       (name, email, phone, service_name, message, status)
       VALUES (?, ?, ?, ?, ?, 'pending');`,
      [name, email, phone, serviceName, message]
    );

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
    });
  } catch (error: unknown) {
    console.error("[Service Enquiry API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
