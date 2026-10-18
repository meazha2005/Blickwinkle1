import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      name,
      phone,
      email,
      courseName,
      interested,
      conversation,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required." },
        { status: 400 }
      );
    }

    const conversationStr =
      typeof conversation === "string"
        ? conversation
        : JSON.stringify(conversation || []);

    const interestedVal =
      interested === "yes" || interested === "no" ? interested : "pending";

    const sql = `
      INSERT INTO blickwinkle_website_chatbot_leads (
        session_id, name, phone, email, course_name, interested, conversation, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
      ON DUPLICATE KEY UPDATE
        name = COALESCE(VALUES(name), name),
        phone = COALESCE(VALUES(phone), phone),
        email = COALESCE(VALUES(email), email),
        course_name = COALESCE(VALUES(course_name), course_name),
        interested = CASE
          WHEN interested = 'yes' THEN 'yes'
          WHEN VALUES(interested) IS NOT NULL AND VALUES(interested) != 'pending' THEN VALUES(interested)
          ELSE interested
        END,
        conversation = CASE
          WHEN CHAR_LENGTH(VALUES(conversation)) >= CHAR_LENGTH(conversation) THEN VALUES(conversation)
          ELSE conversation
        END,
        updated_at = NOW();
    `;

    await query(sql, [
      sessionId,
      name?.trim() || null,
      phone?.trim() || null,
      email?.trim() || null,
      courseName?.trim() || null,
      interestedVal,
      conversationStr,
    ]);

    return NextResponse.json({ success: true, message: "Chatbot conversation recorded." });
  } catch (error: unknown) {
    console.error("[Chatbot Lead API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save chatbot conversation." },
      { status: 500 }
    );
  }
}
