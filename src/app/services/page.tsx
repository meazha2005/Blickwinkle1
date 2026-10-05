"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Lenis from "lenis";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  X,
  Send,
  Check,
} from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  category: "Marketing & Brand" | "Tech & Automation";
  categoryShort: "Marketing" | "Tech";
  tagline: string;
  description: string;
  image: string;
  color: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Marketing",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "Data-Driven Market Domination & Strategic Growth",
    description:
      "Our strategic marketing framework combines consumer psychology, competitive intelligence, and predictive data analytics to establish your business as the definitive leader in your market. We eliminate guesswork by engineering bespoke customer acquisition architectures that map high-value buyer journeys, optimize channel budgets, and scale conversions across multi-channel digital touchpoints. Through continuous multivariate testing and agile execution, we turn marketing into your most dependable revenue generation engine.",
    image: "/services/marketing.jpg",
    color: "#0071BC",
  },
  {
    id: 2,
    title: "Branding",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "Iconic Visual Identities That Command Industry Trust",
    description:
      "A compelling brand is much more than a visual logo; it is the enduring emotional foundation that commands customer loyalty, trust, and premium valuation. We engineer complete visual identity systems and brand positioning architectures that articulate your company's core mission with crystalline clarity. From unified color theories, typography guides, and iconography to comprehensive corporate stationery and tone of voice guidelines, we ensure every touchpoint resonates with authentic authority and leaves an indelible mark.",
    image: "/services/branding.jpg",
    color: "#39B54A",
  },
  {
    id: 3,
    title: "Campaign Strategy",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "High-Converting Full-Funnel Digital Blueprints",
    description:
      "Turn your advertising spend into predictable, compounding business growth with our high-impact campaign strategy blueprints. We orchestrate integrated full-funnel media campaigns that harmonize compelling creative storytelling with advanced programmatic targeting across paid search, social media, and digital display channels. By building tailored conversion funnels, executing real-time attribution modeling, and conducting rigorous A/B split-testing protocols, we eliminate ad waste, drive down acquisition costs, and maximize return on ad spend.",
    image: "/services/campaign.jpg",
    color: "#0071BC",
  },
  {
    id: 4,
    title: "Digital Marketing",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "Accelerated Search Dominance & Paid Media Scale",
    description:
      "Dominate competitive search queries, social feeds, and digital ad networks through our multi-channel performance marketing ecosystem. We execute technical and semantic search engine optimization to capture high-intent organic search volume, paired with precision-targeted Google Ads and paid social funnels that engage prospective buyers at the exact moment of commercial intent. Our continuous conversion rate optimization, dynamic retargeting sequences, and transparent data reporting empower your business to sustainably outrank competitors and scale revenue profitably.",
    image: "/services/digital_marketing.jpg",
    color: "#39B54A",
  },
  {
    id: 5,
    title: "Social Media Management",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "Viral Reach & Dedicated Community Cultivation",
    description:
      "Cultivate a magnetic digital presence that turns casual scrollers into passionate brand evangelists and paying customers. Our social media management studio handles your end-to-end publishing lifecycle—from trend forecasting, editorial calendar planning, and high-production short-form video creation to community moderation and real-time engagement. We amplify your authentic brand narrative across Instagram, LinkedIn, Facebook, and emerging platforms, driving organic viral reach, fostering active community discussions, and building dedicated followings that organically advocate for your products and services.",
    image: "/services/social_media.jpg",
    color: "#39B54A",
  },
  {
    id: 6,
    title: "Content Creation",
    category: "Marketing & Brand",
    categoryShort: "Marketing",
    tagline: "Cinematic Visuals & Scroll-Stopping Conversion Copy",
    description:
      "In an era of endless digital noise, only extraordinary visual craft and persuasive copywriting can arrest attention and drive meaningful action. Our in-house creative production studio delivers studio-caliber commercial photography, cinematic video campaigns, immersive 3D motion graphics, and conversion-focused storytelling tailored specifically for your target demographic. We handle the entire creative pipeline from creative conception and scriptwriting to post-production and multi-format asset delivery, creating visual assets that elevate your perceived market value and inspire decisive consumer engagement.",
    image: "/services/content_creation.jpg",
    color: "#0071BC",
  },
  {
    id: 7,
    title: "Website",
    category: "Tech & Automation",
    categoryShort: "Tech",
    tagline: "Ultra-Fast Modern Digital Flagships That Convert",
    description:
      "Your website is the centerpiece of your digital flagship and the ultimate destination for every marketing initiative. We architect blazing-fast, visually stunning, enterprise-grade web applications engineered with Next.js, React, and modern micro-interactions that captivate visitors from the first millisecond. Every platform we build features bulletproof responsive layouts across mobile, tablet, and widescreen devices, sub-second global page loads, flawless Core Web Vitals compliance, and intuitive conversion pathways designed specifically to turn curious visitors into paying clientele.",
    image: "/services/website.jpg",
    color: "#39B54A",
  },
  {
    id: 8,
    title: "Software",
    category: "Tech & Automation",
    categoryShort: "Tech",
    tagline: "Custom Full-Stack Engineering & Scalable Platforms",
    description:
      "Overcome unique operational bottlenecks and unlock new market opportunities with custom software engineered specifically for your organizational needs. From high-performance internal management dashboards and database architectures to multi-tenant SaaS products and enterprise cloud infrastructure, our engineering team delivers clean, modular, and maintainable codebases. We focus on bulletproof security protocols, high-concurrency API scalability, and intuitive user interfaces that streamline complex organizational workflows, reduce operational overhead, and provide lasting competitive advantages as your business scales.",
    image: "/services/software.jpg",
    color: "#0071BC",
  },
  {
    id: 9,
    title: "Custom Social Media Automation",
    category: "Tech & Automation",
    categoryShort: "Tech",
    tagline: "24/7 Autopilot Social Workflows & Lead Funnels",
    description:
      "Eliminate repetitive manual busywork and never lose an inbound lead again with our tailored social media automation pipelines. We build robust, intelligent webhook and n8n workflow systems that instantly capture inbound direct messages, qualify prospect intent, trigger automated comment responses, and synchronize lead data directly into your CRM around the clock. By establishing seamless cross-platform syncing between Instagram, WhatsApp, Facebook, and email, your business delivers instantaneous customer responses 24/7 without requiring dedicated round-the-clock staffing.",
    image: "/services/social_media.jpg",
    color: "#39B54A",
  },
  {
    id: 10,
    title: "Custom AI Automation",
    category: "Tech & Automation",
    categoryShort: "Tech",
    tagline: "Intelligent Autonomous Agents & Custom LLM Systems",
    description:
      "Supercharge your operational efficiency and customer satisfaction through bespoke artificial intelligence and autonomous agent workflows. We build and deploy customized large language model solutions, intelligent internal knowledge copilots, automated document processing engines, and conversational customer support agents that integrate directly into your existing business stack. By automating labor-intensive workflows and synthesizing complex enterprise data with 99%+ accuracy, our custom AI solutions empower your workforce to accomplish higher-order strategic work while drastically reducing operating overhead.",
    image: "/services/software.jpg",
    color: "#0071BC",
  },
  {
    id: 11,
    title: "CRM",
    category: "Tech & Automation",
    categoryShort: "Tech",
    tagline: "Centralized Customer Lifecycle & Pipeline Intelligence",
    description:
      "Take total command of your customer lifecycle and accelerate sales velocity with custom-architected customer relationship management systems. We design, configure, and integrate unified CRM platforms that centralize prospect communication histories, automate deal stage progressions, and provide real-time pipeline visibility for your sales leadership. With automated lead scoring, multi-channel task reminders, and automated follow-up sequences, our CRM solutions ensure that every qualified opportunity is systematically nurtured, conversion friction is eliminated, and zero revenue slips through the cracks.",
    image: "/services/website.jpg",
    color: "#39B54A",
  },
];

export default function ServicesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const total = SERVICES.length;
  const currentService = SERVICES[currentIndex];

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, total]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, total]);

  const goToIndex = useCallback(
    (target: number) => {
      if (target === currentIndex || isTransitioning) return;
      setIsTransitioning(true);
      setDirection(target > currentIndex ? 1 : -1);
      setCurrentIndex(target);
      setTimeout(() => setIsTransitioning(false), 650);
    },
    [currentIndex, isTransitioning]
  );

  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number = 0;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } catch {
      // Fallback
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    let lastWheelTime = 0;
    const cooldown = 700;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < cooldown) return;
      if (Math.abs(e.deltaY) < 18) return;

      if (e.deltaY > 0) {
        lastWheelTime = now;
        goToNext();
      } else if (e.deltaY < 0) {
        lastWheelTime = now;
        goToPrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev]);

  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let lastTouchTime = 0;
    const cooldown = 600;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchTime < cooldown) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = endY - startY;
      const deltaX = endX - startX;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -35) {
          lastTouchTime = now;
          goToNext();
        } else if (deltaY > 35) {
          lastTouchTime = now;
          goToPrev();
        }
      } else {
        if (deltaX < -35) {
          lastTouchTime = now;
          goToNext();
        } else if (deltaX > 35) {
          lastTouchTime = now;
          goToPrev();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, modalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#0071BC", "#39B54A", "#60a5fa", "#4ade80"],
    });
    setTimeout(() => {
      setModalOpen(false);
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 2800);
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 290, damping: 32 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.45 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring" as const, stiffness: 290, damping: 32 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.4 },
      },
    }),
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 text-slate-900 select-none flex flex-col justify-between">
      {/* ── Global Header ────────────────────────────────────────────── */}
      <Header />

      {/* ── Ambient Background Lighting & Tech Grid ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#0071BC]/7 blur-3xl transform-gpu" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#39B54A]/6 blur-3xl transform-gpu" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-100/25 blur-3xl pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#0071BC 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="absolute right-4 bottom-20 sm:bottom-24 text-[12rem] sm:text-[18rem] lg:text-[22rem] font-black text-slate-900/[0.025] leading-none select-none pointer-events-none font-mono">
          {String(currentService.id).padStart(2, "0")}
        </div>
      </div>

      {/* ── Main Interactive Showcase Stage (Framer Motion AnimatePresence) ─ */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-2 sm:pb-4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentService.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full max-h-[580px] sm:max-h-[640px] lg:max-h-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center"
          >
            {/* ── Left Column: Narrative, Title & Action ─────────────── */}
            <div className="md:col-span-1 lg:col-span-6 flex flex-col justify-center gap-2 sm:gap-3 lg:gap-4 order-2 md:order-1 max-w-xl">
              
              {/* Service Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
                  {currentService.title}
                </h1>
              </div>

              {/* Impact Description (Full 5-6 lines, clean and balanced across all screen sizes) */}
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed font-medium">
                {currentService.description}
              </p>

              {/* Action Bar */}
              <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 btn-shimmer active:scale-95"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Right Column: Heroic Framed Showcase Card ──────────── */}
            <div className="md:col-span-1 lg:col-span-6 relative order-1 md:order-2 flex justify-center items-center">
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] max-w-sm sm:max-w-md lg:max-w-none rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xl shadow-blue-900/10 group">
                <Image
                  src={currentService.image}
                  alt={currentService.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Persistent Bottom Control HUD ─────────────────────────────── */}
      <footer className="relative z-20 pb-4 sm:pb-6 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col gap-2.5 sm:gap-3">
        {/* Continuous Progress Line */}
        <div className="w-full h-1 bg-slate-200/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0071BC] to-[#39B54A]"
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* HUD Controls Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrev}
            aria-label="Previous Service"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-[#0071BC] hover:text-[#0071BC] text-slate-700 text-xs sm:text-sm font-bold transition-all duration-200 group active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Interactive Slide Dots / Thumbnails (All 11) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-2 max-w-[240px] sm:max-w-md scrollbar-none">
            {SERVICES.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => goToIndex(idx)}
                  aria-label={`Go to ${s.title}`}
                  className={`transition-all duration-300 rounded-full flex-shrink-0 ${
                    isActive
                      ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-[#0071BC] to-[#39B54A] shadow-md shadow-blue-500/25"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            aria-label="Next Service"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#005f9e] text-white shadow-sm hover:shadow-md hover:from-[#0062a3] text-xs sm:text-sm font-bold transition-all duration-200 group active:scale-95"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </footer>

      {/* ── Consultation Modal for Active Service ─────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 overflow-hidden"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {formSubmitted ? (
                <div className="py-8 text-center flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-[#39B54A] flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Inquiry Received!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Our strategy team is reviewing your project details for{" "}
                    <span className="font-bold text-[#0071BC]">{currentService.title}</span>. We will
                    reach out within 2 business hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0071BC]/10 text-[#0071BC]">
                      Service Inquiry
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {currentService.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Start Your {currentService.title} Project
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 mb-5">
                    Tell us about your objectives. We will prepare a tailored strategy proposal.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Alex Henderson"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Work Email *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project Scope / Goals
                      </label>
                      <textarea
                        rows={3}
                        placeholder={`Tell us what you want to achieve with ${currentService.title}...`}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Project Inquiry
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
