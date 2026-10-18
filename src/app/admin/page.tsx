"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  Bot,
  FileText,
} from "lucide-react";

import OverviewTab from "@/components/admin/OverviewTab";
import ServicesTab from "@/components/admin/ServicesTab";
import CoursesTab from "@/components/admin/CoursesTab";
import ChatbotTab from "@/components/admin/ChatbotTab";
import ArticlesTab from "@/components/admin/ArticlesTab";
import SubscribersTab from "@/components/admin/SubscribersTab";
import ContactsTab from "@/components/admin/ContactsTab";
import SettingsTab from "@/components/admin/SettingsTab";

import { AdminUser, AdminStats, AdminRecentActivities } from "@/types/admin";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<AdminRecentActivities | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.admin) {
          setAdmin(data.admin);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Fetch stats manually or when tab switches
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecent(data.recent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch stats when admin is authenticated or when navigating back to the dashboard tab
  useEffect(() => {
    if (admin) {
      void fetchStats();
    }
  }, [admin, activeTab, fetchStats]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "services",
      label: "Service Enquiries",
      icon: Briefcase,
      badge: stats?.services?.pending && stats.services.pending > 0 ? stats.services.pending : null,
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    {
      id: "courses",
      label: "Course Enrollments",
      icon: GraduationCap,
      badge: stats?.courses?.pending && stats.courses.pending > 0 ? stats.courses.pending : null,
      badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
    {
      id: "chatbot",
      label: "SHIYA Chats",
      icon: Bot,
      badge: stats?.chatbot?.new && stats.chatbot.new > 0 ? stats.chatbot.new : null,
      badgeColor: "bg-purple-100 text-purple-800 border border-purple-200",
    },
    {
      id: "articles",
      label: "Articles",
      icon: FileText,
      badge: stats?.articles?.total && stats.articles.total > 0 ? stats.articles.total : null,
      badgeColor: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    },
    {
      id: "subscribers",
      label: "Subscribed Mails",
      icon: Mail,
      badge: stats?.subscribers?.total && stats.subscribers.total > 0 ? stats.subscribers.total : null,
      badgeColor: "bg-slate-100 text-slate-800 border border-slate-200",
    },
    {
      id: "contacts",
      label: "Contact Messages",
      icon: MessageSquare,
      badge: stats?.contacts?.new && stats.contacts.new > 0 ? stats.contacts.new : null,
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-10 h-10 border-4 border-[#0071BC] border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-slate-700">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row">
      {/* ── 1. Desktop Sidebar (Clean White Background) ─────────── */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-white text-slate-700 border-r border-slate-200/90 shadow-sm p-6 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* Logo & Portal title */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Blickwinkle" fill sizes="32px" className="object-contain" priority />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-slate-900 text-base tracking-tight group-hover:text-[#0071BC] transition-colors">
                  BLICKWINKLE
                </span>
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-extrabold mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#0071BC] to-[#005f9e] text-white shadow-md shadow-[#0071BC]/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin User Footer Card */}
        <div className="pt-6 border-t border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0071BC] to-[#39B54A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              BW
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-slate-900 text-xs truncate">{admin?.name || "Admin"}</p>
              <p className="text-slate-500 text-[11px] truncate">{admin?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. Mobile Top Navigation Bar (Clean White) ────────────── */}
      <header className="md:hidden bg-white text-slate-900 p-4 sticky top-0 z-40 border-b border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7">
            <Image src="/logo.png" alt="Blickwinkle" fill sizes="28px" className="object-contain" priority />
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm">BLICKWINKLE</span>
            <span className="text-[9px] text-emerald-600 block font-bold leading-none">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats()}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${statsLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] z-50 bg-white/98 backdrop-blur-md p-6 flex flex-col justify-between border-b border-slate-200 shadow-xl">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#0071BC] to-[#005f9e] text-white shadow-md shadow-[#0071BC]/20"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-200 space-y-3">
            <div className="text-xs text-slate-500">
              Logged in as <strong className="text-slate-900">{admin?.email}</strong>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 py-3 text-center rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
              >
                Go to Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 text-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs hover:bg-rose-100 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Main Content Area ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && (
          <OverviewTab
            stats={stats}
            recent={recent}
            loading={statsLoading}
            onRefresh={fetchStats}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === "services" && <ServicesTab onDataChange={fetchStats} />}
        {activeTab === "courses" && <CoursesTab onDataChange={fetchStats} />}
        {activeTab === "chatbot" && <ChatbotTab onDataChange={fetchStats} />}
        {activeTab === "articles" && <ArticlesTab onDataChange={fetchStats} />}
        {activeTab === "subscribers" && <SubscribersTab onDataChange={fetchStats} />}
        {activeTab === "contacts" && <ContactsTab onDataChange={fetchStats} />}
        {activeTab === "settings" && <SettingsTab admin={admin} />}
      </main>
    </div>
  );
}
