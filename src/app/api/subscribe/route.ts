import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendSubscriptionWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Insert or re-activate subscriber in database
    await query(
      `INSERT INTO blickwinkle_website_subscribers (email, status, confirmation_sent)
       VALUES (?, 'active', 1)
       ON DUPLICATE KEY UPDATE status = 'active';`,
      [email]
    );

    // Send confirmation email in background / async
    try {
      await sendSubscriptionWelcomeEmail(email);
    } catch (mailError) {
      console.error("[Email Error] Failed to send subscription confirmation:", mailError);
      // We still return success since they are registered in DB
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! A confirmation email has been sent.",
    });
  } catch (error: unknown) {
    console.error("[Subscribe API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Unable to complete subscription. Please try again." },
      { status: 500 }
    );
  }
}
