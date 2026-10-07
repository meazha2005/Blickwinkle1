"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Download,
  GraduationCap,
  Calendar,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Send,
  X,
  Check,
  Building2,
  FileText,
  ChevronDown,
  Globe,
  Briefcase,
  Activity,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  badge: string;
  category: "all" | "study-abroad" | "corporate" | "healthcare-tech";
  categoryLabel: string;
  tagline: string;
  description: string;
  duration: string;
  mode: string;
  batches: string;
  highlights: string[];
  brochureFile: string;
  color: string;
  icon: React.ElementType;
}

const COURSES: Course[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    badge: "High Demand",
    category: "healthcare-tech",
    categoryLabel: "Marketing & Growth",
    tagline: "Full-Funnel Performance Marketing, SEO, Social Growth & AI Advertising",
    description:
      "Master modern end-to-end digital marketing architectures. Gain hands-on mastery over organic search engine optimization, Google Ads, Meta ad scaling, content virality, and cutting-edge generative AI workflow automation for global brands and agencies.",
    duration: "12 Weeks (120+ Hours)",
    mode: "Online Live & Hybrid Lab",
    batches: "Weekday & Weekend Cohorts",
    highlights: [
      "Technical & Semantic Search Engine Optimization (SEO)",
      "High-ROI Paid Ad Campaigns on Google Ads & Meta Ads Manager",
      "Short-Form Video Production, Content Strategy & Viral Hook Formulae",
      "AI Marketing Automation with ChatGPT, Claude & Workflow Tools",
      "Live Budget Management & Client Portfolio Capstone Projects",
    ],
    brochureFile: "Blickwinkle College Proposal.pdf",
    color: "#0071BC",
    icon: Globe,
  },
  {
    id: "ielts",
    title: "IELTS Masterclass",
    badge: "Band 8.0+ Track",
    category: "study-abroad",
    categoryLabel: "Study Abroad & Language",
    tagline: "British Council & IDP Aligned Academic & General Training",
    description:
      "Comprehensive score-maximizing preparation designed to help candidates achieve Band 7.5 to 8.5 on their first attempt. Master the exact acoustic models, lexical resources, and structured writing templates evaluated by Cambridge IELTS examiners.",
    duration: "8 Weeks (Comprehensive) / 4 Weeks (Crash)",
    mode: "Interactive Live Classes / In-Center",
    batches: "Morning, Evening & Weekend Batches",
    highlights: [
      "Listening: International accent acclimation & distractor avoidance hacks",
      "Reading: Rapid skimming, keyword scanning & True/False/Not Given shortcuts",
      "Writing Task 1 & 2: Band 9.0 essay architectures, coherence & lexical diversity",
      "Speaking: 1-on-1 personalized fluency evaluations & mock interview practice",
      "15+ Computer-Delivered & Paper-Based Full-Length Diagnostic Mock Exams",
    ],
    brochureFile: "IELTS Brochure - Blickwinkle.pdf",
    color: "#39B54A",
    icon: GraduationCap,
  },
  {
    id: "pte",
    title: "PTE Coaching",
    badge: "Fast-Track Prep",
    category: "study-abroad",
    categoryLabel: "Study Abroad & Language",
    tagline: "Pearson AI Scoring Algorithm Decoding & High-Percentile Drills",
    description:
      "Target score of 79+ (equivalent to IELTS 8.0) for university admissions and PR immigration. Master the Pearson AI scoring engine, oral fluency requirements, phonetic acoustics, and proven speaking and dictation templates.",
    duration: "6 Weeks (Intensive)",
    mode: "Online Live with AI Practice Software",
    batches: "Flexible Daily Practice Batches",
    highlights: [
      "Decoding Pearson's Automated Speech & Grammar Scoring Algorithms",
      "Read Aloud, Repeat Sentence & Summarize Written Text proven templates",
      "Write From Dictation memory hacks & Collocation Fill-in-the-Blanks drills",
      "Unlimited practice on high-precision PTE AI mock simulator software",
      "Daily pronunciation feedback and oral fluency acoustic diagnostics",
    ],
    brochureFile: "PTE Brochure - Blickwinkle.pdf",
    color: "#0071BC",
    icon: Award,
  },
  {
    id: "campus-to-corporate",
    title: "Campus to Corporate Program",
    badge: "100% Placement Track",
    category: "corporate",
    categoryLabel: "Career Acceleration",
    tagline: "Transforming College Graduates into High-Performing Corporate Professionals",
    description:
      "Bridging the critical gap between academic degrees and corporate hiring standards. Tailored for final-year engineering, arts, and science students preparing for top MNC placements, aptitude screenings, and executive interviews.",
    duration: "10 Weeks (Bootcamp)",
    mode: "Experiential Campus Workshops & Virtual Sessions",
    batches: "College Cohort & Open Weekend",
    highlights: [
      "Quantitative Aptitude, Logical Reasoning & Critical Thinking Mastery",
      "Group Discussion (GD) Dominance: Content structure, body language & articulation",
      "Personal Interview (PI) Simulation: HR, Technical & Situational STAR methods",
      "ATS-Optimized Professional Resume Architecture & LinkedIn Personal Branding",
      "Workplace Etiquette, Executive Email Writing & Corporate Conflict Resolution",
    ],
    brochureFile: "Campus to Corporate Broucher.pdf",
    color: "#39B54A",
    icon: Briefcase,
  },
  {
    id: "corporate-communication",
    title: "Corporate Communication",
    badge: "Executive Leadership",
    category: "corporate",
    categoryLabel: "Career Acceleration",
    tagline: "Executive Communication, Boardroom Presentations & Persuasive Negotiation",
    description:
      "Elevate your career trajectory with elite verbal and written communication proficiencies. Designed for ambitious professionals, software engineers, managers, and team leaders interacting with global clients and C-suite executives.",
    duration: "6 Weeks (Evening Executive Format)",
    mode: "Live Virtual Executive Cohorts",
    batches: "Weekday Evenings & Saturday Cohorts",
    highlights: [
      "Commanding Boardroom & Client Presentations with Impressive Deck Storytelling",
      "Executive Email & Proposal Writing: Direct, persuasive, and diplomatically refined",
      "High-Stakes Negotiation & Stakeholder Conflict Resolution frameworks",
      "Cross-Cultural Fluency for North American, European & APAC Client Interaction",
      "Impromptu Public Speaking & Confident Meeting Leadership under pressure",
    ],
    brochureFile: "Corporate Communication.pdf",
    color: "#0071BC",
    icon: Sparkles,
  },
  {
    id: "medical-coding",
    title: "Medical Coding (CPC®)",
    badge: "AAPC Certification Track",
    category: "healthcare-tech",
    categoryLabel: "Healthcare IT & Coding",
    tagline: "AAPC Certified Professional Coder (CPC®) Training with Placement Assistance",
    description:
      "Launch a lucrative career in the thriving US Healthcare Revenue Cycle Management (RCM) industry. Master ICD-10-CM, CPT, and HCPCS Level II coding guidelines with comprehensive mock tests and guaranteed interview opportunities.",
    duration: "16 Weeks (160+ Hours)",
    mode: "Classroom / Online Live Interactive",
    batches: "Weekday Regular & Weekend Intensive",
    highlights: [
      "Human Anatomy, Physiology & Comprehensive Medical Terminology",
      "ICD-10-CM (Diagnosis Coding) & CPT (Procedure Coding) Comprehensive Rules",
      "HCPCS Level II Supplies/Medications Coding & Modifiers Application",
      "US Healthcare Revenue Cycle Management (RCM) & HIPAA Privacy Guidelines",
      "Over 1,000+ Real Surgical Operative Reports & Live Chart Audit Practice",
      "Rigorous AAPC CPC® Mock Exams & Direct Placement Tie-Ups with Top RCM Firms",
    ],
    brochureFile: "Medical Coding Broucher.pdf",
    color: "#39B54A",
    icon: Activity,
  },
];

const FAQS = [
  {
    q: "Are Blickwinkle course certifications recognized by top employers?",
    a: "Yes. Our courses are structured according to global industry benchmarks (such as the British Council / IDP for IELTS, Pearson for PTE, and AAPC for Medical Coding CPC®). Graduates receive Blickwinkle verified credentials alongside official examination prep certifications.",
  },
  {
    q: "How do I download the official course brochure?",
    a: "Every course on this page features a direct 'Download Brochure' button. Clicking it instantly downloads the verified PDF brochure directly from our official curriculum archive.",
  },
  {
    q: "Do you offer placement support for the Campus to Corporate and Medical Coding programs?",
    a: "Yes. Both programs feature dedicated placement drives, resume optimization, mock interviews, and direct referral opportunities with our corporate hiring network and healthcare RCM partners.",
  },
  {
    q: "Can colleges and universities partner with Blickwinkle for on-campus batch training?",
    a: "Absolutely. We currently partner with premier institutions like Loyola College, Hindustan Institute, and Kings Engineering. College principals and placement heads can submit an institutional inquiry to arrange customized on-campus MoUs.",
  },
];

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseName: COURSES[0].title,
    background: "",
    mode: "Online Live",
  });

  const handleOpenEnroll = (course: Course) => {
    setSelectedCourse(course);
    setFormData((prev) => ({ ...prev, courseName: course.title }));
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#0071BC", "#39B54A", "#60a5fa", "#4ade80"],
    });

    setTimeout(() => {
      setModalOpen(false);
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        courseName: COURSES[0].title,
        background: "",
        mode: "Online Live",
      });
    }, 2800);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToTargetCourse = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase().trim();
      const params = new URLSearchParams(window.location.search);
      const courseParam = (params.get("course") || params.get("id") || hash).toLowerCase().trim();

      if (!courseParam) return;

      const target = COURSES.find(
        (c) =>
          c.id.toLowerCase() === courseParam ||
          c.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes(courseParam.replace(/[^a-z0-9]/g, ""))
      );

      if (target) {
        setActiveCategory("all");
        setTimeout(() => {
          const el = document.getElementById(target.id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            el.classList.add("ring-4", "ring-[#0071BC]/40", "shadow-2xl");
            setTimeout(() => {
              el.classList.remove("ring-4", "ring-[#0071BC]/40", "shadow-2xl");
            }, 2500);
          }
        }, 200);
      }
    };

    scrollToTargetCourse();
    window.addEventListener("hashchange", scrollToTargetCourse);
    window.addEventListener("popstate", scrollToTargetCourse);
    return () => {
      window.removeEventListener("hashchange", scrollToTargetCourse);
      window.removeEventListener("popstate", scrollToTargetCourse);
    };
  }, []);

  const filteredCourses =
    activeCategory === "all"
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        {/* ── 1. Hero Section ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-8 pb-14 lg:pb-20">
          <div className="absolute top-0 right-10 w-[500px] h-[500px] rounded-full bg-[#0071BC]/5 blur-3xl pointer-events-none transform-gpu" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-[#39B54A]/5 blur-3xl pointer-events-none transform-gpu" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0071BC] text-xs font-bold uppercase tracking-wider mb-5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Blickwinkle Career Academy
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
              >
                Industry-Accredited Courses. <br />
                <span className="text-gradient">Real-World Career Acceleration.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium mx-auto"
              >
                Trained by seasoned industry practitioners. From British Council-aligned IELTS &amp; PTE masterclasses 
                to AAPC Medical Coding CPC® and corporate placement readiness—download official brochures and launch your global career.
              </motion.p>

            </div>
          </div>
        </section>

        {/* ── 2. Course Cards Grid ────────────────────────────────────── */}
        <section className="py-6 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCourses.map((course) => {
                const Icon = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    id={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="scroll-mt-28 sm:scroll-mt-32 flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 relative group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase"
                          style={{
                            backgroundColor: `${course.color}15`,
                            color: course.color,
                          }}
                        >
                          {course.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {course.categoryLabel}
                        </span>
                      </div>

                      {/* Header Title with Icon */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${course.color}15`,
                            color: course.color,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0071BC] transition-colors leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1 line-clamp-1">
                            {course.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-5">
                        {course.description}
                      </p>

                      {/* Schedule & Duration Meta */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#0071BC] shrink-0" />
                          <span className="font-semibold truncate">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-[#39B54A] shrink-0" />
                          <span className="font-semibold truncate">{course.mode}</span>
                        </div>
                      </div>

                      {/* Key Highlights Bullet points */}
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                          Curriculum Highlights
                        </h4>
                        <ul className="flex flex-col gap-2">
                          {course.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2
                                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                style={{ color: course.color }}
                              />
                              <span className="leading-snug font-medium">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action CTAs */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                      {/* Download Brochure Link */}
                      <a
                        href={`/broucher/${encodeURIComponent(course.brochureFile)}`}
                        download={course.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors group/btn"
                        title={`Download official brochure for ${course.title}`}
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-[#0071BC] transition-colors" />
                        <span>Brochure</span>
                      </a>

                      {/* Enroll / Inquire Button */}
                      <button
                        onClick={() => handleOpenEnroll(course)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Institutional College Training Section ───────────────── */}
        <section className="py-16 sm:py-20 mt-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#0071BC]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#39B54A]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col gap-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#39B54A]">
                  Institutional Campus Partnerships
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Empowering 5,000+ Students Across South India&apos;s Premier Colleges
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                  Blickwinkle partners directly with college placement cells and departments of higher learning 
                  (including Loyola College, Hindustan Institute, Kings College, and New Prince Shri Bhavani) 
                  to deliver structured campus-to-corporate acceleration, medical coding, and IELTS preparatory bootcamps.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="/broucher/Blickwinkle%20College%20Proposal.pdf"
                    download="Blickwinkle College Proposal.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 shadow-xl transition-all"
                  >
                    <Download className="w-4 h-4 text-[#0071BC]" />
                    Download Institutional Proposal (PDF)
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
                  >
                    Schedule Campus MoU Meeting
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center flex flex-col items-center justify-center">
                  <Award className="w-8 h-8 text-[#0071BC] mb-2" />
                  <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
                  <span className="text-xs text-slate-400 mt-1 font-semibold">Placement Drives</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center flex flex-col items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-[#39B54A] mb-2" />
                  <span className="text-2xl sm:text-3xl font-black text-white">5,000+</span>
                  <span className="text-xs text-slate-400 mt-1 font-semibold">Students Upskilled</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center flex flex-col items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#39B54A] mb-2" />
                  <span className="text-2xl sm:text-3xl font-black text-white">15+</span>
                  <span className="text-xs text-slate-400 mt-1 font-semibold">College MoUs</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center flex flex-col items-center justify-center">
                  <FileText className="w-8 h-8 text-[#0071BC] mb-2" />
                  <span className="text-2xl sm:text-3xl font-black text-white">6+</span>
                  <span className="text-xs text-slate-400 mt-1 font-semibold">Core Disciplines</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Frequently Asked Questions (FAQ) ─────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0071BC]">
                Have Questions?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#0071BC] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#0071BC]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── 5. Enrollment & Counseling Modal ─────────────────────────── */}
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 overflow-y-auto max-h-[90dvh] touch-auto"
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
                  <h3 className="text-2xl font-black text-slate-900">Application Received!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Our academic counselor is reviewing your profile for{" "}
                    <span className="font-bold text-[#0071BC]">{selectedCourse.title}</span>. We will 
                    contact you via phone/WhatsApp within 2 business hours.
                  </p>
                </div>
              ) : (
                <>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Enroll in {selectedCourse.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-5 font-medium">
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Course *
                      </label>
                      <select
                        value={formData.courseName}
                        onChange={(e) => {
                          const matched = COURSES.find((c) => c.title === e.target.value);
                          if (matched) setSelectedCourse(matched);
                          setFormData({ ...formData, courseName: e.target.value });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-white font-medium"
                      >
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Rachel Green"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="rachel@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Education / College
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech / Loyola College"
                          value={formData.background}
                          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Mode
                        </label>
                        <select
                          value={formData.mode}
                          onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-white font-medium"
                        >
                          <option value="Online Live">Online Live Virtual</option>
                          <option value="Classroom In-Person">Classroom (In-Person)</option>
                          <option value="Hybrid Format">Hybrid Format</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-3 w-full py-3.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Application / Request Callback
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
