"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  MessageCircle,
  MessageSquare,
  Bot,
  User,
  ExternalLink,
} from "lucide-react";
import { ChatbotLead } from "@/types/admin";
import { downloadCSV } from "@/lib/exportCsv";

interface ChatbotTabProps {
  onDataChange?: () => void;
}

interface ParsedMessage {
  id?: string;
  sender: "bot" | "user";
  text: string;
  timestamp?: string;
}

function renderFormattedMessage(text: string, isBot = true) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-black ${isBot ? "text-slate-900" : "text-white"}`}
        >
          {content}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ChatbotTab({ onDataChange }: ChatbotTabProps = {}) {
  const [items, setItems] = useState<ChatbotLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ChatbotLead | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (courseFilter !== "all") params.set("course", courseFilter);

      const res = await fetch(`/api/admin/chatbot-leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, courseFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/chatbot-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          notes: notes !== undefined ? notes : selectedItem?.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Status updated successfully.");
        setTimeout(() => setFeedback(null), 3000);
        fetchItems();
        onDataChange?.();
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem((prev) =>
            prev
              ? {
                  ...prev,
                  status: status as ChatbotLead["status"],
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
    if (!confirm("Are you sure you want to permanently delete this chatbot conversation record?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/chatbot-leads?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Conversation record deleted.");
        setTimeout(() => setFeedback(null), 3000);
        if (selectedItem?.id === id) setSelectedItem(null);
        fetchItems();
        onDataChange?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseConversation = (raw: string): ParsedMessage[] => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [{ sender: "bot", text: raw }];
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = [
      "ID",
      "Session ID",
      "Name",
      "Phone",
      "Email",
      "Interested Course",
      "Interested (Yes/No)",
      "Status",
      "Notes",
      "Created At",
      "Full Conversation Transcript",
    ];

    const rows = items.map((i) => {
      const msgs = parseConversation(i.conversation);
      const transcript = msgs
        .map((m) => `[${m.sender.toUpperCase()}]: ${m.text}`)
        .join(" | ");

      return [
        i.id,
        i.session_id,
        i.name || "Anonymous",
        i.phone || "",
        i.email || "",
        i.course_name || "None selected",
        i.interested,
        i.status,
        i.notes || "",
        i.created_at,
        transcript,
      ];
    });

    downloadCSV(
      `blickwinkle_shiya_chatbot_leads_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    );
  };

  // Metrics
  const totalCount = items.length;
  const interestedCount = items.filter((i) => i.interested === "yes").length;
  const newFollowups = items.filter((i) => i.status === "new").length;
  const enrolledCount = items.filter((i) => i.status === "enrolled").length;

  return (
    <div className="space-y-6">
      {/* ── 1. Top Action Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0071BC] to-[#39B54A] p-0.5 shadow-sm overflow-hidden shrink-0">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden p-1">
              <Image src="/shiya.png" alt="SHIYA" width={42} height={42} className="object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">SHIYA Chatbot Leads</h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black uppercase">
                AI Inquiries
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time student inquiries, captured contact details, and complete conversational transcripts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            disabled={items.length === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 disabled:opacity-40"
            title="Export all chatbot leads to CSV"
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

      {/* ── 2. KPI Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Inquiries
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            Interested Leads
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{interestedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
            Pending Follow-up
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{newFollowups}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071BC] block">
            Enrolled Students
          </span>
          <span className="text-2xl font-black text-[#0071BC] mt-1 block">{enrolledCount}</span>
        </div>
      </div>

      {/* ── 3. Filter & Search Bar ────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, phone, email, course, or chat content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Status" },
            { id: "new", label: "New Leads" },
            { id: "contacted", label: "Contacted" },
            { id: "enrolled", label: "Enrolled" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#0071BC] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Table / Cards Container ─────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0071BC]" />
            <span>Loading SHIYA conversation records...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No chatbot leads matching your filter.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Student / Contact</th>
                    <th className="py-3.5 px-4">Interested Course</th>
                    <th className="py-3.5 px-4">Interest</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0071BC] font-bold text-xs flex items-center justify-center shrink-0">
                            {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">
                              {item.name || <span className="text-slate-400 italic font-normal">Anonymous Visitor</span>}
                            </p>
                            {item.email && <p className="text-slate-500 text-xs">{item.email}</p>}
                            {item.phone && (
                              <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                                <span>{item.phone}</span>
                                <a
                                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline text-[10px] font-bold"
                                  title="Open WhatsApp chat"
                                >
                                  WhatsApp
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {item.course_name || <span className="text-slate-400 italic">None selected</span>}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            item.interested === "yes"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : item.interested === "no"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.interested === "yes" ? "Interested" : item.interested === "no" ? "Not Interested" : "Exploring"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          disabled={updating}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                            item.status === "new"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : item.status === "contacted"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : item.status === "enrolled"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setNotesInput(item.notes || "");
                            }}
                            className="p-2 rounded-xl bg-blue-50 text-[#0071BC] hover:bg-blue-100 transition-colors cursor-pointer"
                            title="View complete conversation transcript"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {item.name || <span className="text-slate-400 italic">Anonymous Visitor</span>}
                      </p>
                      <p className="text-xs font-semibold text-[#0071BC] mt-0.5">
                        {item.course_name || "None selected"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.interested === "yes"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.interested === "no"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.interested === "yes" ? "Interested" : item.interested === "no" ? "Not Interested" : "Exploring"}
                    </span>
                  </div>

                  {item.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.phone}</span>
                    </p>
                  )}
                  {item.email && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.email}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setNotesInput(item.notes || "");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0071BC] text-xs font-bold cursor-pointer"
                      >
                        View Transcript
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 cursor-pointer"
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

      {/* ── 5. Conversation Transcript Modal ───────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-sm">
                  <Image src="/shiya.png" alt="SHIYA" fill sizes="40px" className="object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Conversation with {selectedItem.name || "Anonymous Visitor"}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Course: <strong>{selectedItem.course_name || "None"}</strong> &bull;{" "}
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                {selectedItem.phone && (
                  <a
                    href={`tel:${selectedItem.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:text-[#0071BC]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0071BC]" />
                    <span>Call {selectedItem.phone}</span>
                  </a>
                )}
                {selectedItem.phone && (
                  <a
                    href={`https://wa.me/${selectedItem.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {selectedItem.email && (
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:text-[#0071BC]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0071BC]" />
                    <span>{selectedItem.email}</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Status:</span>
                <select
                  value={selectedItem.status}
                  onChange={(e) => handleUpdateStatus(selectedItem.id, e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Chat Transcript View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-3">
                &mdash; Chat Session Transcript &mdash;
              </span>

              {parseConversation(selectedItem.conversation).map((msg, idx) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}
                  >
                    {isBot && (
                      <div className="relative w-7 h-7 rounded-xl bg-white p-0.5 border border-slate-200 shrink-0 shadow-xs overflow-hidden mt-0.5">
                        <Image src="/shiya.png" alt="SHIYA" fill sizes="28px" className="object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs whitespace-pre-line ${
                        isBot
                          ? "bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm"
                          : "bg-[#0071BC] text-white rounded-br-sm font-medium"
                      }`}
                    >
                      {renderFormattedMessage(msg.text, isBot)}
                      {msg.timestamp && (
                        <span
                          className={`text-[9px] block mt-1 ${
                            isBot ? "text-slate-400 text-left" : "text-blue-100 text-right"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Notes Section */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Counselor / Admin Notes</label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record call outcome, admission batch, counseling details..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedItem.id, selectedItem.status, notesInput)}
                  disabled={updating}
                  className="px-4 rounded-xl bg-[#0071BC] hover:bg-[#005f9e] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
