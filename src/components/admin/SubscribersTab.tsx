"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Trash2,
  Mail,
  Send,
  CheckCircle2,
  X,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import { Subscriber } from "@/types/admin";
import { downloadCSV } from "@/lib/exportCsv";

interface SubscribersTabProps {
  onDataChange?: () => void;
}

export default function SubscribersTab({ onDataChange }: SubscribersTabProps = {}) {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Broadcast modal state
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
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

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "unsubscribed" : "active";
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Subscriber status changed to ${nextStatus}.`);
        setTimeout(() => setFeedback(null), 3000);
        fetchItems();
        onDataChange?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Subscriber removed.");
        setTimeout(() => setFeedback(null), 3000);
        fetchItems();
        onDataChange?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;

    setBroadcastSending(true);
    setBroadcastResult(null);

    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send broadcast email.");
      }

      setBroadcastResult(data.message || "Broadcast sent successfully!");
      setBroadcastSubject("");
      setBroadcastMessage("");
      setTimeout(() => {
        setBroadcastOpen(false);
        setBroadcastResult(null);
      }, 2500);
    } catch (err: unknown) {
      setBroadcastResult(`Error: ${err instanceof Error ? err.message : "Failed to send broadcast"}`);
    } finally {
      setBroadcastSending(false);
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = ["ID", "Email", "Status", "Welcome Sent", "Subscribed At"];
    const rows = items.map((i) => [
      i.id,
      i.email || "",
      i.status,
      i.confirmation_sent ? "Yes" : "No",
      i.created_at,
    ]);

    downloadCSV(
      `blickwinkle_subscribers_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    );
  };

  const activeCount = items.filter((i) => i.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Subscribed Mail Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified mailing list subscribers receiving weekly digital insights &amp; course announcements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setBroadcastOpen(true)}
            disabled={activeCount === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0071BC] to-[#39B54A] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Email to Subscribers</span>
          </button>
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
            placeholder="Search subscriber by email address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "all", label: `All (${items.length})` },
            { id: "active", label: `Active (${activeCount})` },
            { id: "unsubscribed", label: "Unsubscribed" },
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

      {/* Subscribers Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0071BC]" />
            <span>Loading subscribers...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No subscribers found.
          </div>
        ) : (
          <>
            {/* Desktop / Tablet View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Subscriber Email</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Welcome Email</th>
                    <th className="py-3.5 px-4">Date Subscribed</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-slate-900">{item.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                            item.status === "active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Click to toggle status"
                        >
                          {item.status === "active" ? "Active" : "Unsubscribed"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 text-xs break-all">{item.email}</p>
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border ${
                        item.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Joined: {new Date(item.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Broadcast Email Modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#0071BC]" />
                  <span>Send Broadcast Email</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sends directly to all {activeCount} active subscriber(s) via Gmail SMTP
                </p>
              </div>
              <button
                onClick={() => setBroadcastOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {broadcastResult && (
              <div
                className={`mt-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  broadcastResult.startsWith("Error")
                    ? "bg-rose-50 text-rose-800 border border-rose-200"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {broadcastResult.startsWith("Error") ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>{broadcastResult}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. 🚀 Blickwinkle Weekly Digest: Top AI & Marketing Trends"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Message Body
                </label>
                <textarea
                  rows={6}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Write your announcement or newsletter update here... HTML line breaks will be preserved."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0071BC] shrink-0" />
                <span>
                  Dispatched from <strong>founder@ztoitech.com</strong> to {activeCount} recipient(s).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={broadcastSending || activeCount === 0}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {broadcastSending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching emails...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to {activeCount} Subscribers</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-500 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
