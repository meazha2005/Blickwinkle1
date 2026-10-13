import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { ServiceEnquiry, CourseEnrollment, ContactMessage, Subscriber } from "@/types/admin";

interface CountRow {
  count: number;
}

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Service Enquiries
    const [serviceTotal] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_service_enquiries;"
    );
    const [servicePending] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_service_enquiries WHERE status = 'pending';"
    );

    // 2. Course Enrollments
    const [courseTotal] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_course_enrollments;"
    );
    const [coursePending] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_course_enrollments WHERE status = 'pending';"
    );

    // 3. Subscribers
    const [subTotal] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_subscribers;"
    );
    const [subActive] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_subscribers WHERE status = 'active';"
    );

    // 4. Contact Messages
    const [contactTotal] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_contact_messages;"
    );
    const [contactNew] = await query<CountRow[]>(
      "SELECT COUNT(*) as count FROM blickwinkle_website_contact_messages WHERE status = 'new';"
    );

    // Recent activities (latest 5 from each)
    const recentServices = await query<ServiceEnquiry[]>(
      "SELECT id, name, email, service_name, status, created_at FROM blickwinkle_website_service_enquiries ORDER BY created_at DESC LIMIT 5;"
    );
    const recentCourses = await query<CourseEnrollment[]>(
      "SELECT id, name, email, course_name, status, created_at FROM blickwinkle_website_course_enrollments ORDER BY created_at DESC LIMIT 5;"
    );
    const recentContacts = await query<ContactMessage[]>(
      "SELECT id, name, email, inquiry_type, status, created_at FROM blickwinkle_website_contact_messages ORDER BY created_at DESC LIMIT 5;"
    );
    const recentSubscribers = await query<Subscriber[]>(
      "SELECT id, email, status, created_at FROM blickwinkle_website_subscribers ORDER BY created_at DESC LIMIT 5;"
    );

    return NextResponse.json({
      success: true,
      stats: {
        services: {
          total: serviceTotal?.count || 0,
          pending: servicePending?.count || 0,
        },
        courses: {
          total: courseTotal?.count || 0,
          pending: coursePending?.count || 0,
        },
        subscribers: {
          total: subTotal?.count || 0,
          active: subActive?.count || 0,
        },
        contacts: {
          total: contactTotal?.count || 0,
          new: contactNew?.count || 0,
        },
      },
      recent: {
        services: recentServices || [],
        courses: recentCourses || [],
        contacts: recentContacts || [],
        subscribers: recentSubscribers || [],
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
