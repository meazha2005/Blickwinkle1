"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Target,
  Building2,
  GraduationCap,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Compass,
  ChevronDown,
} from "lucide-react";

const STATS = [
  { value: "80+", label: "Global Clients", sub: "Enterprises, SMEs & Startups" },
  { value: "5,000+", label: "Students Trained", sub: "Across Colleges & Bootcamps" },
  { value: "15+", label: "University Partners", sub: "Premier Academic MoUs" },
  { value: "99.8%", label: "Satisfaction Rate", sub: "Excellence in Delivery" },
];

const VALUES = [
  {
    icon: Target,
    title: "Precision Engineering",
    description:
      "We build resilient digital architectures and scalable software without cutting corners. From Next.js web flagships to custom AI automation pipelines, our solutions are engineered for long-term velocity.",
    color: "#0071BC",
  },
  {
    icon: Sparkles,
    title: "Creative Distinction",
    description:
      "In a crowded digital ecosystem, conformity is invisible. We blend data-backed consumer psychology with bold aesthetics, producing brand identities and marketing campaigns that command industry respect.",
    color: "#39B54A",
  },
  {
    icon: GraduationCap,
    title: "Real-World Pedagogy",
    description:
      "Our training programs discard outdated textbook theory in favor of live simulations, direct mentor feedback, and industry certifications (IELTS, PTE, Campus-to-Corporate, Medical Coding).",
    color: "#0071BC",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Integrity",
    description:
      "Whether delivering client milestones or counseling students on global study abroad pathways, we operate with radical transparency, relentless work ethic, and measurable outcomes.",
    color: "#39B54A",
  },
];

const PARTNERS = [
  { name: "Apollo Hospitals", logo: "/logos/apollo.jpg", type: "Healthcare Enterprise" },
  { name: "Loyola College", logo: "/logos/loyola.png", type: "Academic Partner" },
  { name: "Hindustan Institute", logo: "/logos/hindustan.png", type: "University Partner" },
  { name: "Kings College", logo: "/logos/kings.png", type: "Engineering Partner" },
  { name: "New Prince Shri Bhavani", logo: "/logos/new_prince.png", type: "Academic Partner" },
  { name: "Ramraj Textiles", logo: "/logos/ramraj.png", type: "Brand Client" },
  { name: "Premier Kabadi League", logo: "/logos/pkl.png", type: "Sports Client" },
  { name: "Yavi Interiors", logo: "/logos/yavi.png", type: "Corporate Client" },
];

export default function AboutPage() {
  // Preload all partner logos immediately so scrolling never freezes decoding images
  useEffect(() => {
    if (typeof window === "undefined") return;
    PARTNERS.forEach((p) => {
      const img = new window.Image();
      img.src = p.logo;
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Header />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* ── 1. Hero Section (Full Viewport Screen-Fit on all devices) ── */}
        <section className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] flex flex-col justify-between items-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-6 sm:pb-8">
          {/* Subtle Ambient Radial Glows (Zero CSS blur overhead) */}
          <div
            className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full pointer-events-none transform-gpu"
            style={{
              background: "radial-gradient(circle, rgba(0,113,188,0.08) 0%, rgba(0,113,188,0) 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none transform-gpu"
            style={{
              background: "radial-gradient(circle, rgba(57,181,74,0.06) 0%, rgba(57,181,74,0) 70%)",
            }}
          />

          {/* Spacer for top balance */}
          <div className="hidden sm:block sm:h-2" />

          {/* Centered Main Hero Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center my-auto py-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0071BC] text-xs font-bold uppercase tracking-wider mb-5"
            >
              <Compass className="w-3.5 h-3.5" />
              About Blickwinkle
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
            >
              Building Digital Solutions. <br />
              <span className="text-gradient">Empowering Future Careers.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium"
            >
              At Blickwinkle, our purpose is simple: We help businesses grow through custom websites, 
              software, and performance marketing — and we train students and professionals with practical 
              skills in IELTS, PTE, Medical Coding, and placement preparation to build successful global careers.
            </motion.p>

            {/* Clear Dual-Focus Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-[#0071BC]" />
                For Businesses: Websites, Software &amp; Marketing
              </span>
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-[#39B54A]" />
                For Careers: IELTS, PTE &amp; Placement Training
              </span>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
            >
              <Link
                href="/services"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 btn-shimmer"
              >
                Explore Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:border-[#0071BC] hover:text-[#0071BC] hover:-translate-y-0.5 transition-all duration-200"
              >
                View Career Courses
              </Link>
            </motion.div>
          </div>

          {/* Bottom Viewport Anchor / Scroll Cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative z-10 pt-4 pb-1 text-center flex flex-col items-center text-slate-400 text-xs font-semibold"
          >
            <div className="animate-bounce flex flex-col items-center gap-1 cursor-default">
              <span>Scroll to discover our story</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </motion.div>
        </section>

        {/* ── 2. The Blickwinkle Story & Dual Core Ecosystem ─────────── */}
        <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Images Composition */}
              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Primary Team Image */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                    <Image
                      src="/team.jpg"
                      alt="Blickwinkle Team Culture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Overlapping Mentor Card */}
                  <div className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-60 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 hidden min-[480px]:block">
                    <Image
                      src="/mentor.jpg"
                      alt="Blickwinkle Mentor in Action"
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent text-white">
                      <p className="text-xs font-bold leading-tight">Master Mentors</p>
                      <p className="text-[10px] text-slate-300">Industry Practitioners</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Story Content */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#0071BC]">
                    Our Origin & Vision
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                    Bridging Innovation in Industry and Excellence in Education
                  </h2>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  Blickwinkle started with a clear observation: Technology moves fast, and both growing businesses 
                  and aspiring students need practical help. Many companies struggle to build modern websites, 
                  custom software, or run digital marketing that actually generates sales. At the same time, college graduates 
                  often find it tough to clear company interviews because academic degrees rarely teach practical, job-ready skills.
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  We created Blickwinkle to solve both challenges under one roof:
                  Our <strong>Digital Studio</strong> builds high-quality websites, software, and marketing campaigns for growing businesses. 
                  Our <strong>Career Academy</strong> trains students and job-seekers in IELTS, PTE, Campus to Corporate placement prep, 
                  and Medical Coding so they can launch successful global careers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <Laptop className="w-5 h-5 text-[#0071BC] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Digital Studio</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Software, branding, websites, and marketing automation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <GraduationCap className="w-5 h-5 text-[#39B54A] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">EduTech Academy</h3>
                      <p className="text-xs text-slate-500 mt-0.5">IELTS, PTE, Campus to Corporate, Medical Coding certifications.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Core Values & Principles ────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#39B54A]">
                The Blickwinkle Code
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Core Principles Guiding Every Project & Cohort
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3 font-medium">
                We believe in uncompromising standards of delivery, transparent collaboration, and real-world results that speak for themselves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${val.color}15`, color: val.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2.5">{val.title}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Final Call To Action ─────────────────────────────────── */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ready to Transform Your Digital Journey?
            </h2>
            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto font-medium">
              Whether you need strategic software engineering, brand acceleration, or industry-recognized career coaching, our team is eager to partner with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 btn-shimmer"
              >
                Start a Conversation
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all duration-200"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
