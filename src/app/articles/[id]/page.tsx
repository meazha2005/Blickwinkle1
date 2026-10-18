"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShiyaChatbot from "@/components/ShiyaChatbot";
import { Article } from "@/types/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        if (data.success && data.article) {
          setArticle(data.article);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error(err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#0071BC] selection:text-white">
      <Header />

      <main className="flex-1 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Breadcrumb & Back Button ────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0071BC] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Articles</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Link href="/" className="hover:text-slate-600">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/articles" className="hover:text-slate-600">Articles</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-600 truncate max-w-[200px]">{article?.title || "Article"}</span>
            </nav>
          </div>

          {loading ? (
            <div className="py-28 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
              <div className="w-9 h-9 border-3 border-[#0071BC] border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-slate-600">Loading article...</span>
            </div>
          ) : !article ? (
            <div className="py-20 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Article Not Found</h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                The article you are looking for may have been moved, updated, or removed.
              </p>
              <Link
                href="/articles"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Browse All Articles
              </Link>
            </div>
          ) : (
            <article className="space-y-8">
              {/* ── Article Header ─────────────────────────────────────── */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0071BC] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071BC]" />
                  Blickwinkle Insights
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {article.title}
                </h1>

                {/* Author & Meta Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0071BC] to-[#39B54A] text-white font-black text-sm flex items-center justify-center shadow-md">
                      {(article.author || "Blickwinkle").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {article.author || "Blickwinkle Team"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0071BC]" />
                          {new Date(article.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {getReadTime(article.content)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Share button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0071BC] hover:border-[#0071BC]/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
                      title="Copy link to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Featured Image ─────────────────────────────────────── */}
              {article.image_url && (
                <div className="relative w-full aspect-video sm:aspect-[21/10] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-lg">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover"
                    unoptimized={article.image_url.startsWith("http")}
                  />
                </div>
              )}

              {/* ── Summary Callout (if available) ────────────────────── */}
              {article.summary && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-emerald-50/50 border border-blue-100/80 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed italic">
                  &ldquo;{article.summary}&rdquo;
                </div>
              )}

              {/* ── Full Content Body ──────────────────────────────────── */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
                <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-wrap font-normal">
                  {article.content}
                </div>
              </div>

              {/* ── Bottom Share & Navigation ──────────────────────────── */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Enjoyed this article?</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Share it with your colleagues or peers on social media.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${article.title}\n\nRead more at: ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* ── CTA Banner ─────────────────────────────────────────── */}
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0071BC] to-[#005f9e] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-emerald-300 text-xs font-black uppercase tracking-wider">
                    Transform Your Career &amp; Business
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">Ready to Upgrade Your Skills?</h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                    Join hundreds of successful professionals and college graduates trained by industry experts at Blickwinkle.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/courses"
                    className="px-6 py-3 rounded-full bg-white text-[#0071BC] font-extrabold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all shadow-md"
                  >
                    Explore Courses
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
      <ShiyaChatbot />
    </div>
  );
}
