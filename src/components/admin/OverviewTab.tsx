"use client";

import {
  Briefcase,
  GraduationCap,
  Mail,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AdminStats, AdminRecentActivities, ServiceEnquiry, CourseEnrollment } from "@/types/admin";

interface OverviewProps {
  stats: AdminStats | null;
  recent: AdminRecentActivities | null;
  loading: boolean;
  onRefresh: (showLoader?: boolean) => void;
  onNavigateTab: (tab: string) => void;
}

export default function OverviewTab({
  stats,
  recent,
  loading,
  onRefresh,
  onNavigateTab,
}: OverviewProps) {
  const cards = [
    {
      title: "Service Enquiries",
      count: stats?.services?.total || 0,
      sub: `${stats?.services?.pending || 0} pending action`,
      icon: Briefcase,
      color: "#0071BC",
      tab: "services",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Course Enrollments",
      count: stats?.courses?.total || 0,
      sub: `${stats?.courses?.pending || 0} pending review`,
      icon: GraduationCap,
      color: "#39B54A",
      tab: "courses",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Email Subscribers",
      count: stats?.subscribers?.total || 0,
      sub: `${stats?.subscribers?.active || 0} active recipients`,
      icon: Mail,
      color: "#0071BC",
      tab: "subscribers",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Contact Messages",
      count: stats?.contacts?.total || 0,
      sub: `${stats?.contacts?.new || 0} unread / new`,
      icon: MessageSquare,
      color: "#39B54A",
      tab: "contacts",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0071BC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#86efac] mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#39B54A]" />
              <span>Live Production Data</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Blickwinkle Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor incoming client service requests, student course admissions, and newsletter subscriber broadcasts in real time.
            </p>
          </div>

          <button
            onClick={() => onRefresh(true)}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.sub}
                  </span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </h3>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  {card.count}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0071BC] group-hover:text-[#39B54A] transition-colors">
                <span>Manage {card.title.split(" ")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Split Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Service Enquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071BC] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Recent Service Enquiries</h2>
            </div>
            <button
              onClick={() => onNavigateTab("services")}
              className="text-xs font-bold text-[#0071BC] hover:underline"
            >
              View all &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {!recent?.services?.length ? (
              <p className="py-6 text-center text-xs text-slate-400">No service enquiries yet.</p>
            ) : (
              recent.services.map((item: ServiceEnquiry) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{item.service_name} &bull; {item.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Course Enrollments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#39B54A] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Recent Course Applications</h2>
            </div>
            <button
              onClick={() => onNavigateTab("courses")}
              className="text-xs font-bold text-[#39B54A] hover:underline"
            >
              View all &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {!recent?.courses?.length ? (
              <p className="py-6 text-center text-xs text-slate-400">No course enrollments yet.</p>
            ) : (
              recent.courses.map((item: CourseEnrollment) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{item.course_name} &bull; {item.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "enrolled"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
