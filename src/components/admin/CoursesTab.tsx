"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  RefreshCw,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";
import { CourseEnrollment } from "@/types/admin";
import { downloadCSV } from "@/lib/exportCsv";

interface CoursesTabProps {
  onDataChange?: () => void;
}

export default function CoursesTab({ onDataChange }: CoursesTabProps = {}) {
  const [items, setItems] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<CourseEnrollment | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/course-enrollments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/course-enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes: notes !== undefined ? notes : selectedItem?.notes }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Enrollment status updated.");
        setTimeout(() => setFeedback(null), 3000);
        fetchItems();
        onDataChange?.();
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem((prev) =>
            prev
              ? {
                  ...prev,
                  status: status as CourseEnrollment["status"],
                  notes: notes !== undefined ? notes : prev.notes,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this course application?")) return;
    try {
      const res = await fetch(`/api/admin/course-enrollments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Application deleted.");
        setTimeout(() => setFeedback(null), 3000);
        if (selectedItem?.id === id) setSelectedItem(null);
        fetchItems();
        onDataChange?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Course", "Background", "Mode", "Status", "Notes", "Created At"];
    const rows = items.map((i) => [
      i.id,
      i.name || "",
      i.email || "",
      i.phone || "",
      i.course_name || "",
      i.background || "",
      i.mode || "",
      i.status,
      i.notes || "",
      i.created_at,
    ]);

    downloadCSV(
      `blickwinkle_course_enrollments_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Course Enrollment Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student applications for IELTS, PTE, Medical Coding, Digital Marketing &amp; Campus Prep
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            disabled={items.length === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => fetchItems()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, phone, course, or college..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A]/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Status" },
            { id: "pending", label: "Pending" },
            { id: "contacted", label: "Contacted" },
            { id: "enrolled", label: "Enrolled" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#39B54A] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#39B54A]" />
            <span>Loading course enrollments...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No course applications matching your filter.
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Applicant</th>
                    <th className="py-3.5 px-4">Course</th>
                    <th className="py-3.5 px-4">Background / Mode</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-extrabold text-slate-900">{item.name}</p>
                        <p className="text-slate-500 text-xs">{item.email}</p>
                        <p className="text-slate-400 text-[11px] font-medium">{item.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{item.course_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <p className="text-slate-700">{item.background || "Not specified"}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {item.mode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                            item.status === "pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : item.status === "contacted"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : item.status === "enrolled"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setNotesInput(item.notes || "");
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#39B54A] hover:bg-green-50 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs font-semibold text-[#39B54A]">{item.course_name}</p>
                    </div>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="text-[11px] font-bold rounded-lg px-2 py-1 border bg-slate-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {item.email}</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {item.phone}</p>
                    <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-slate-400" /> {item.background || "No background noted"} ({item.mode})</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setNotesInput(item.notes || "");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-green-50 text-[#39B54A] font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Full Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Application #{selectedItem.id}
                </h3>
                <span className="text-xs font-bold text-[#39B54A]">
                  {selectedItem.course_name}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Applicant Name</span>
                  <p className="font-extrabold text-slate-900">{selectedItem.name}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Status</span>
                  <p className="font-bold text-[#39B54A] capitalize">{selectedItem.status}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Email</span>
                  <p className="font-medium text-slate-800 break-all">{selectedItem.email}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Phone</span>
                  <p className="font-medium text-slate-800">{selectedItem.phone}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Academic Background</span>
                  <p className="font-medium text-slate-800">{selectedItem.background || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Learning Mode</span>
                  <p className="font-medium text-slate-800">{selectedItem.mode}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Counseling / Staff Notes:
                </span>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record counseling notes, fee discussion, batch timing preference..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#39B54A]/40"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Change Admission Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["pending", "contacted", "enrolled", "rejected"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedItem.id, st, notesInput)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedItem.status === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleUpdateStatus(selectedItem.id, selectedItem.status, notesInput)}
                disabled={updating}
                className="px-5 py-2.5 rounded-full bg-[#39B54A] text-white font-bold text-xs hover:bg-emerald-600 cursor-pointer disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Counseling Notes"}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-full text-slate-500 font-semibold text-xs hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
