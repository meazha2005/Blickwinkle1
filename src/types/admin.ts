export interface ServiceEnquiry {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  service_name: string;
  message?: string | null;
  status: "pending" | "contacted" | "in_progress" | "closed";
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CourseEnrollment {
  id: number;
  name: string;
  email: string;
  phone: string;
  course_name: string;
  background?: string | null;
  mode: string;
  status: "pending" | "contacted" | "enrolled" | "rejected";
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  status: "active" | "unsubscribed";
  confirmation_sent: number;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  inquiry_type: string;
  preferred_contact: string;
  message: string;
  status: "new" | "in_review" | "replied" | "resolved";
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ChatbotMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export interface ChatbotLead {
  id: number;
  session_id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  course_name?: string | null;
  interested: "yes" | "no" | "pending";
  conversation: string;
  status: "new" | "contacted" | "enrolled" | "closed";
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  content: string;
  summary?: string | null;
  author?: string;
  status: "published" | "draft";
  created_at: string;
  updated_at?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at?: string;
  last_login?: string | null;
}

export interface AdminStats {
  services: { total: number; pending: number };
  courses: { total: number; pending: number };
  subscribers: { total: number; active: number };
  contacts: { total: number; new: number };
  chatbot?: { total: number; new: number };
  articles?: { total: number; published: number };
}

export interface AdminRecentActivities {
  services: ServiceEnquiry[];
  courses: CourseEnrollment[];
  contacts: ContactMessage[];
  subscribers: Subscriber[];
  chatbot?: ChatbotLead[];
  articles?: Article[];
}
