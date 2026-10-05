"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  X,
  Send,
  Check,
  Sparkles,
  ChevronUp,
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
  const [activeView, setActiveView] = useState<"showcase" | "footer">("showcase");
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const footerContainerRef = useRef<HTMLDivElement>(null);
  const total = SERVICES.length;
  const currentService = SERVICES[currentIndex];

  // Preload all service images immediately upon mount for instantaneous slide decoding
  useEffect(() => {
    SERVICES.forEach((service) => {
      const img = new window.Image();
      img.src = service.image;
    });
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex >= total - 1) {
      // Completed all slides: Proceed smoothly to Footer
      setActiveView("footer");
      return;
    }
    setIsTransitioning(true);
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 380);
  }, [currentIndex, isTransitioning, total]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 380);
  }, [currentIndex, isTransitioning]);

  const goToIndex = useCallback(
    (target: number) => {
      if (target === currentIndex || isTransitioning) return;
      setIsTransitioning(true);
      setDirection(target > currentIndex ? 1 : -1);
      setCurrentIndex(target);
      if (activeView === "footer") {
        setActiveView("showcase");
      }
      setTimeout(() => setIsTransitioning(false), 380);
    },
    [activeView, currentIndex, isTransitioning]
  );

  const goToSlides = useCallback(
    (index: number = total - 1) => {
      setCurrentIndex(index);
      setDirection(-1);
      setActiveView("showcase");
    },
    [total]
  );

  // Wheel handling for Showcase mode
  useEffect(() => {
    if (activeView !== "showcase") return;

    let lastWheelTime = 0;
    const cooldown = 380;

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
  }, [activeView, goToNext, goToPrev]);

  // Touch handling for Showcase mode (snappy, butter-smooth with 30px threshold)
  useEffect(() => {
    if (activeView !== "showcase") return;

    let startY = 0;
    let startX = 0;
    let lastTouchTime = 0;
    const cooldown = 380;

    const handleTouchStart = (e: TouchEvent) => {
      if (modalOpen) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (modalOpen) return;
      const now = Date.now();
      if (now - lastTouchTime < cooldown) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = endY - startY;
      const deltaX = endX - startX;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -30) {
          lastTouchTime = now;
          goToNext();
        } else if (deltaY > 30) {
          lastTouchTime = now;
          goToPrev();
        }
      } else {
        if (deltaX < -30) {
          lastTouchTime = now;
          goToNext();
        } else if (deltaX > 30) {
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
  }, [activeView, goToNext, goToPrev, modalOpen]);

  // Footer scroll back-to-slides listener
  useEffect(() => {
    if (activeView !== "footer") return;
    const el = footerContainerRef.current;
    if (!el) return;

    let startY = 0;
    let lastWheelTime = 0;
    const cooldown = 400;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;
      if (el.scrollTop <= 5 && deltaY > 60) {
        goToSlides(total - 1);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < cooldown) return;
      if (el.scrollTop <= 5 && e.deltaY < -25) {
        lastWheelTime = now;
        goToSlides(total - 1);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeView, goToSlides, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) return;
      if (activeView === "showcase") {
        if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
          e.preventDefault();
          goToNext();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
          e.preventDefault();
          goToPrev();
        }
      } else if (activeView === "footer") {
        if (
          e.key === "Escape" ||
          ((e.key === "ArrowUp" || e.key === "PageUp") &&
            footerContainerRef.current &&
            footerContainerRef.current.scrollTop <= 5)
        ) {
          goToSlides(total - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, goToNext, goToPrev, goToSlides, modalOpen, total]);

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

  // Hardware-accelerated slide variants (Pure translateX, no scale calculation overhead)
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
      transition: {
        x: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.28, ease: "easeOut" },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.25, ease: "easeIn" },
      },
    }),
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white text-slate-900 select-none">
      {/* ── Global Header ────────────────────────────────────────────── */}
      <Header />

      <AnimatePresence mode="wait">
        {activeView === "showcase" ? (
          /* ================================================================
             VIEW 1: SERVICES SHOWCASE STAGE (PPT Directional Transition)
             ================================================================ */
          <motion.div
            key="showcase-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex flex-col justify-between overflow-hidden touch-none"
          >
            {/* ── Ambient Radial Lighting (Zero blur GPU load) ──────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
              <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(0,113,188,0.11)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(57,181,74,0.09)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.35)_0%,transparent_70%)] pointer-events-none" />

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

            {/* ── Main Interactive Showcase Stage (mode="popLayout" for zero lag) ─ */}
            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-2 sm:pb-4 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={currentService.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full max-h-[580px] sm:max-h-[640px] lg:max-h-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center transform-gpu will-change-transform"
                >
                  {/* ── Left Column: Narrative, Title & Action ─────────────── */}
                  <div className="md:col-span-1 lg:col-span-6 flex flex-col justify-center gap-2 sm:gap-3 lg:gap-4 order-2 md:order-1 max-w-xl">
                    {/* Category Pill */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#0071BC]/10 text-[#0071BC] border border-[#0071BC]/20">
                        {currentService.category}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                        Service {currentService.id} of {total}
                      </span>
                    </div>

                    {/* Service Title */}
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
                    <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] max-w-sm sm:max-w-md lg:max-w-none rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xl shadow-blue-900/10">
                      <Image
                        src={currentService.image}
                        alt={currentService.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        className="object-cover"
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
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              {/* HUD Controls Bar */}
              <div className="flex items-center justify-between gap-4">
                {/* Left Arrow Button */}
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  aria-label="Previous Service"
                  className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs sm:text-sm font-bold transition-all duration-200 group active:scale-95 ${
                    currentIndex === 0
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-[#0071BC] hover:text-[#0071BC]"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Interactive Slide Dots / Thumbnails (All 11) */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-2 max-w-[220px] sm:max-w-md scrollbar-none">
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

                {/* Right Arrow / Footer Advance Button */}
                <button
                  onClick={goToNext}
                  aria-label={currentIndex === total - 1 ? "Go to Footer" : "Next Service"}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-white shadow-sm hover:shadow-md text-xs sm:text-sm font-bold transition-all duration-200 group active:scale-95 ${
                    currentIndex === total - 1
                      ? "bg-gradient-to-r from-[#0071BC] to-[#39B54A]"
                      : "bg-gradient-to-r from-[#0071BC] to-[#005f9e] hover:from-[#0062a3]"
                  }`}
                >
                  <span className="hidden sm:inline">
                    {currentIndex === total - 1 ? "Complete & Footer" : "Next"}
                  </span>
                  {currentIndex === total - 1 ? (
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-y-1" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </div>
            </footer>
          </motion.div>
        ) : (
          /* ================================================================
             VIEW 2: SERVICES FOOTER VIEW (Revealed after all 11 slides complete)
             ================================================================ */
          <motion.div
            key="footer-view"
            ref={footerContainerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-[100dvh] overflow-y-auto overscroll-contain bg-slate-950 text-slate-400 scroll-smooth"
          >
            {/* ── Top Return Action Header ───────────────────────────────── */}
            <div className="sticky top-16 sm:top-20 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <button
                  onClick={() => goToSlides(total - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700/80 hover:border-[#0071BC] text-white text-xs sm:text-sm font-bold transition-all group active:scale-95 shadow-sm"
                >
                  <ChevronUp className="w-4 h-4 text-[#39B54A] transition-transform group-hover:-translate-y-0.5" />
                  <span>Back to Services Slides</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#39B54A] animate-pulse" />
                  <span className="hidden sm:inline">All 11 Services Explored</span>
                  <span className="sm:hidden">11/11 Explored</span>
                </div>
              </div>
            </div>

            {/* ── Pre-Footer High-Impact Consultation Banner ───────────── */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 max-w-7xl mx-auto text-center flex flex-col items-center">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#0071BC]/10 blur-3xl pointer-events-none" />

              <span className="relative z-10 px-3.5 py-1 rounded-full text-xs font-bold bg-[#0071BC]/20 text-blue-400 border border-[#0071BC]/30 mb-4 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#39B54A]" />
                Ready to Accelerate Growth?
              </span>

              <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-2xl leading-tight">
                Turn Your Vision Into High-Performing Digital Reality
              </h2>

              <p className="relative z-10 text-slate-400 text-sm sm:text-base max-w-xl mt-4 mb-8 leading-relaxed">
                From strategic digital marketing and brand systems to custom software and autonomous AI workflows — we build, launch, and grow your complete digital presence.
              </p>

              <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 btn-shimmer active:scale-95"
                >
                  Book a Free Strategy Consultation
                </button>
                <button
                  onClick={() => goToSlides(0)}
                  className="px-6 py-3.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all active:scale-95"
                >
                  Review All Services
                </button>
              </div>
            </section>

            {/* ── Official Company Footer ──────────────────────────────── */}
            <Footer />

            {/* ── Floating "Back to Top / Slides" Pill ─────────────────── */}
            <button
              onClick={() => goToSlides(total - 1)}
              aria-label="Back to Services Slides"
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white text-xs font-bold shadow-2xl shadow-blue-500/40 hover:-translate-y-1 transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Slides</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
