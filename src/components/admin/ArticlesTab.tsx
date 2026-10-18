"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  RefreshCw,
  Download,
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  ImageIcon,
} from "lucide-react";
import { Article } from "@/types/admin";
import { downloadCSV } from "@/lib/exportCsv";

interface ArticlesTabProps {
  onDataChange?: () => void;
}

export default function ArticlesTab({ onDataChange }: ArticlesTabProps = {}) {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formAuthor, setFormAuthor] = useState("Blickwinkle Team");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/articles?${params.toString()}`);
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

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormImageUrl("");
    setFormContent("");
    setFormSummary("");
    setFormAuthor("Blickwinkle Team");
    setFormStatus("published");
    setModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingItem(article);
    setFormTitle(article.title);
    setFormImageUrl(article.image_url);
    setFormContent(article.content);
    setFormSummary(article.summary || "");
    setFormAuthor(article.author || "Blickwinkle Team");
    setFormStatus(article.status);
    setModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/articles/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImageUrl(data.url);
        setFeedback("Image uploaded successfully.");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again or paste an Image URL.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter an article title.");
      return;
    }
    if (!formImageUrl.trim()) {
      alert("Please upload an image or provide an image URL.");
      return;
    }
    if (!formContent.trim()) {
      alert("Please enter the full article content.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: editingItem?.id,
        title: formTitle.trim(),
        image_url: formImageUrl.trim(),
        content: formContent.trim(),
        summary: formSummary.trim(),
        author: formAuthor.trim(),
        status: formStatus,
      };

      const url = "/api/admin/articles";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(editingItem ? "Article updated successfully." : "Article published successfully.");
        setTimeout(() => setFeedback(null), 3000);
        setModalOpen(false);
        fetchItems();
        onDataChange?.();
      } else {
        alert(data.error || "Failed to save article.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Article deleted.");
        setTimeout(() => setFeedback(null), 3000);
        fetchItems();
        onDataChange?.();
      } else {
        alert(data.error || "Failed to delete article.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Slug", "Author", "Status", "Image URL", "Summary", "Created At"];
    const rows = items.map((a) => [
      a.id,
      a.title,
      a.slug,
      a.author || "Blickwinkle Team",
      a.status,
      a.image_url,
      a.summary || "",
      new Date(a.created_at).toLocaleString(),
    ]);

    downloadCSV(
      `blickwinkle_articles_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071BC] text-xs font-bold uppercase tracking-wider mb-1.5">
            <FileText className="w-3.5 h-3.5" />
            Content Publishing
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Articles Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Post, edit, and manage articles shown on the public Articles page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh articles"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white text-xs sm:text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Article
          </button>
        </div>
      </div>

      {/* ── Feedback Notification ─────────────────────────────────── */}
      {feedback && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ── Filter & Search Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, content, author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* ── Articles List ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="w-8 h-8 border-3 border-[#0071BC] border-t-transparent rounded-full animate-spin" />
            <span>Loading articles...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0071BC] flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No articles found</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm">
              {search || statusFilter !== "all"
                ? "No articles match your current search or filter."
                : "No articles have been posted yet. Click 'Add New Article' to create your first article."}
            </p>
            {!search && statusFilter === "all" && (
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                Add Your First Article
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Article</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image + Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5 max-w-md">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.title}</h4>
                          <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                            {item.summary || item.content.slice(0, 80)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {item.author || "Blickwinkle Team"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "published" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/articles/${item.id}`}
                          target="_blank"
                          className="p-2 rounded-xl text-slate-500 hover:text-[#0071BC] hover:bg-blue-50 transition-colors"
                          title="View on website"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete article"
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
        )}
      </div>

      {/* ── Add / Edit Article Modal ───────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingItem ? "Edit Article" : "Create New Article"}
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Fill in the details below to {editingItem ? "update this" : "publish a new"} article.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Top 10 High-Income Digital Skills in 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Image Input (Upload + URL) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Article Image <span className="text-rose-500">*</span>
                </label>

                <div className="space-y-3">
                  {/* File Upload Button */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                      id="article-file-upload"
                    />
                    <label
                      htmlFor="article-file-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-sm ${
                        uploadingImage ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      <UploadCloud className="w-4 h-4 text-[#0071BC]" />
                      {uploadingImage ? "Uploading Image..." : "Upload From Device"}
                    </label>
                    <span className="text-xs text-slate-400 font-medium">or paste an image URL below</span>
                  </div>

                  {/* Image URL text input */}
                  <input
                    type="text"
                    required
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/articles/..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white transition-all"
                  />

                  {/* Image Preview */}
                  {formImageUrl && (
                    <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner mt-2">
                      <Image
                        src={formImageUrl}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        unoptimized={formImageUrl.startsWith("http")}
                      />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl("")}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Author & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Blickwinkle Team"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white"
                  >
                    <option value="published">Published (Visible to public)</option>
                    <option value="draft">Draft (Admin only)</option>
                  </select>
                </div>
              </div>

              {/* Summary / Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Short Summary / Excerpt <span className="text-slate-400 font-normal">(Optional preview)</span>
                </label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="A concise 1-2 sentence overview shown in the article card."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white"
                />
              </div>

              {/* Full Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Article Content <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {formContent.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write or paste the full article content here. Paragraphs and line breaks are automatically formatted."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update Article"
                  ) : (
                    "Publish Article"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
