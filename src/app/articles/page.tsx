"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
  User,
  Share2,
  RefreshCw,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShiyaChatbot from "@/components/ShiyaChatbot";
import { Article } from "@/types/admin";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchArticles();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#0071BC] selection:text-white">
      <Header />

      {/* ── Top Hero Banner ───────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-gradient-to-b from-white via-blue-50/40 to-[#F8FAFC] relative overflow-hidden">
        {/* Ambient decorative blur glows */}
        <div
          className="absolute top-10 right-0 w-[450px] h-[450px] rounded-full pointer-events-none transform-gpu"
          style={{
            background: "radial-gradient(circle, rgba(0,113,188,0.08) 0%, rgba(0,113,188,0) 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none transform-gpu"
          style={{
            background: "radial-gradient(circle, rgba(57,181,74,0.06) 0%, rgba(57,181,74,0) 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Articles &amp; Industry <span className="text-gradient">Insights</span>
          </h1>

          <p className="mt-4 text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Expert viewpoints, career guidance, and actionable tech strategies crafted by the Blickwinkle team.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title, keyword, or topic..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/20 focus:border-[#0071BC] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Articles List Section ────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="w-9 h-9 border-3 border-[#0071BC] border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-slate-600">Loading articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0071BC] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">No Articles Available Yet</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
              {search
                ? `No articles matched your search for "${search}". Try searching for another keyword or clear the search.`
                : "Our editorial team is preparing insightful articles, career roadmaps, and industry guides. Please check back soon!"}
            </p>
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="mt-6 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Show All Articles
              </button>
            ) : (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                  Explore Our Courses
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {articles.map((item) => {
              const articleUrl = `/articles/${item.id}`;
              const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch"
                >
                  {/* Left: Image Container (Clickable) */}
                  <Link
                    href={articleUrl}
                    className="relative w-full md:w-80 lg:w-96 aspect-[16/10] md:aspect-auto shrink-0 overflow-hidden bg-slate-100 block cursor-pointer"
                  >
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 384px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        unoptimized={item.image_url.startsWith("http")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:hidden pointer-events-none" />
                  </Link>

                  {/* Right: Content Container (Title + Summary + Read More) */}
                  <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                    <div>
                      {/* Meta Pill: Date & Author */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mb-2.5">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-[#0071BC]" />
                          {formattedDate}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[#0071BC] font-bold">
                          {item.author || "Blickwinkle Team"}
                        </span>
                      </div>

                      {/* Title (Clickable) */}
                      <Link href={articleUrl} className="block group-hover:text-[#0071BC] transition-colors">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight line-clamp-2 leading-snug">
                          {item.title}
                        </h2>
                      </Link>

                      {/* Content Preview / Summary */}
                      <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                        {item.summary || item.content.slice(0, 200)}
                      </p>
                    </div>

                    {/* Bottom Row: Read More Link */}
                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={articleUrl}
                        className="inline-flex items-center gap-2 text-sm font-black text-[#0071BC] hover:text-[#005f9e] transition-all group/btn"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>

                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Full Article &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <ShiyaChatbot />
    </div>
  );
}
