import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { ServiceEnquiry, CourseEnrollment, ContactMessage, Subscriber, ChatbotLead, Article } from "@/types/admin";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Execute all count aggregations and recent activity queries concurrently in parallel
    const [
      serviceCounts,
      courseCounts,
      subCounts,
      contactCounts,
      chatbotCounts,
      articleCounts,
      recentServices,
      recentCourses,
      recentContacts,
      recentSubscribers,
      recentChatbot,
      recentArticles,
    ] = await Promise.all([
      // 1. Service Enquiries count
      query<{ total: number | string; pending: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending FROM blickwinkle_website_service_enquiries;"
      ),
      // 2. Course Enrollments count
      query<{ total: number | string; pending: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending FROM blickwinkle_website_course_enrollments;"
      ),
      // 3. Subscribers count
      query<{ total: number | string; active: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) as active FROM blickwinkle_website_subscribers;"
      ),
      // 4. Contact Messages count
      query<{ total: number | string; new_count: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END), 0) as new_count FROM blickwinkle_website_contact_messages;"
      ),
      // 5. Chatbot leads count
      query<{ total: number | string; new_count: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END), 0) as new_count FROM blickwinkle_website_chatbot_leads;"
      ),
      // 6. Articles count
      query<{ total: number | string; published: number | string }[]>(
        "SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END), 0) as published FROM blickwinkle_website_articles;"
      ),
      // 7. Recent Service Enquiries (latest 5)
      query<ServiceEnquiry[]>(
        "SELECT id, name, email, service_name, status, created_at FROM blickwinkle_website_service_enquiries ORDER BY created_at DESC LIMIT 5;"
      ),
      // 8. Recent Course Enrollments (latest 5)
      query<CourseEnrollment[]>(
        "SELECT id, name, email, course_name, status, created_at FROM blickwinkle_website_course_enrollments ORDER BY created_at DESC LIMIT 5;"
      ),
      // 9. Recent Contact Messages (latest 5)
      query<ContactMessage[]>(
        "SELECT id, name, email, inquiry_type, status, created_at FROM blickwinkle_website_contact_messages ORDER BY created_at DESC LIMIT 5;"
      ),
      // 10. Recent Subscribers (latest 5)
      query<Subscriber[]>(
        "SELECT id, email, status, created_at FROM blickwinkle_website_subscribers ORDER BY created_at DESC LIMIT 5;"
      ),
      // 11. Recent Chatbot Leads (latest 5)
      query<ChatbotLead[]>(
        "SELECT id, session_id, name, phone, email, course_name, interested, conversation, status, created_at FROM blickwinkle_website_chatbot_leads ORDER BY created_at DESC LIMIT 5;"
      ),
      // 12. Recent Articles (latest 5)
      query<Article[]>(
        "SELECT id, title, slug, image_url, summary, author, status, created_at FROM blickwinkle_website_articles ORDER BY created_at DESC LIMIT 5;"
      ),
    ]);

    const sRow = serviceCounts?.[0];
    const cRow = courseCounts?.[0];
    const subRow = subCounts?.[0];
    const cntRow = contactCounts?.[0];
    const chatRow = chatbotCounts?.[0];
    const artRow = articleCounts?.[0];

    return NextResponse.json({
      success: true,
      stats: {
        services: {
          total: Number(sRow?.total || 0),
          pending: Number(sRow?.pending || 0),
        },
        courses: {
          total: Number(cRow?.total || 0),
          pending: Number(cRow?.pending || 0),
        },
        subscribers: {
          total: Number(subRow?.total || 0),
          active: Number(subRow?.active || 0),
        },
        contacts: {
          total: Number(cntRow?.total || 0),
          new: Number(cntRow?.new_count || 0),
        },
        chatbot: {
          total: Number(chatRow?.total || 0),
          new: Number(chatRow?.new_count || 0),
        },
        articles: {
          total: Number(artRow?.total || 0),
          published: Number(artRow?.published || 0),
        },
      },
      recent: {
        services: recentServices || [],
        courses: recentCourses || [],
        contacts: recentContacts || [],
        subscribers: recentSubscribers || [],
        chatbot: recentChatbot || [],
        articles: recentArticles || [],
      },
    });
  } catch (error: unknown) {
    console.error("[Admin Stats Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats." },
      { status: 500 }
    );
  }
}
