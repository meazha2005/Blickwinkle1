"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Check,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const INQUIRY_TYPES = [
  "Digital Marketing & Growth",
  "Custom Web & Software Development",
  "AI Automation & Workflows",
  "Course Enrollment (IELTS / PTE / Medical Coding)",
  "Campus Placement / College MoU",
  "General Inquiry / Partnership",
];

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Call Direct",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    detail: "Mon - Sat: 9:00 AM - 7:00 PM IST",
    color: "#0071BC",
    action: "Call Now",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Chat",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210?text=Hello%20Blickwinkle%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20services%20and%20courses.",
    detail: "Fast response within 15 minutes",
    color: "#39B54A",
    action: "Start Chat",
  },
  {
    icon: Mail,
    title: "Official Email",
    value: "hello@blickwinkle.com",
    href: "mailto:hello@blickwinkle.com",
    detail: "Admissions & Enterprise Inquiries",
    color: "#0071BC",
    action: "Send Email",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "Chennai, Tamil Nadu",
    href: "https://maps.google.com/?q=Chennai,+Tamil+Nadu,+India",
    detail: "Serving clients & students globally",
    color: "#39B54A",
    action: "View Map",
  },
];

const FAQS = [
  {
    q: "How quickly does the Blickwinkle team respond?",
    a: "We guarantee a response within 2 business hours for email inquiries, and within 15 minutes via direct WhatsApp chat during operating hours (Mon - Sat, 9:00 AM to 7:00 PM IST).",
  },
  {
    q: "Can I schedule a one-on-one virtual consultation for courses?",
    a: "Yes! When submitting your inquiry, select 'Course Enrollment' and request a virtual counseling slot. Our academic counselors will schedule a personalized Google Meet or Zoom consultation.",
  },
  {
    q: "How do colleges arrange an on-campus MoU or training demo?",
    a: "College principals, T&P officers, and HODs can select 'Campus Placement / College MoU' in the inquiry form or download the institutional proposal from our Courses page. Our director of institutional alliances will coordinate directly with your administration.",
  },
  {
    q: "Do you sign non-disclosure agreements (NDAs) for custom software projects?",
    a: "Yes, confidentiality is paramount. We readily sign mutual non-disclosure agreements before reviewing proprietary project blueprints, database schemas, or marketing strategy assets.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: INQUIRY_TYPES[0],
    message: "",
    preferredContact: "Email",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#0071BC", "#39B54A", "#60a5fa", "#4ade80"],
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: INQUIRY_TYPES[0],
        message: "",
        preferredContact: "Email",
      });
    }, 4500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900">
      <Header />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        {/* ── 1. Hero Section ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-8 pb-12 lg:pb-16">
          <div className="absolute top-0 right-10 w-[500px] h-[500px] rounded-full bg-[#0071BC]/5 blur-3xl pointer-events-none transform-gpu" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-[#39B54A]/5 blur-3xl pointer-events-none transform-gpu" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0071BC] text-xs font-bold uppercase tracking-wider mb-5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get in Touch
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
              >
                Let&apos;s Build Something <br />
                <span className="text-gradient">Exceptional Together.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium mx-auto"
              >
                Whether you want to scale your enterprise with custom software &amp; digital marketing, 
                enroll in our elite certification courses, or explore college MoUs—our dedicated specialists are ready to help.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── 2. Quick Connect Direct Action Cards ────────────────────── */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {CONTACT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.title}
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${method.color}15`,
                          color: method.color,
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {method.title}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 group-hover:text-[#0071BC] transition-colors truncate">
                        {method.value}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{method.detail}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0071BC] group-hover:text-[#39B54A] transition-colors">
                      <span>{method.action}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Main Form & Office Info Split Section ────────────────── */}
        <section className="py-6 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              
              {/* Left Column: Interactive Contact Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden">
                <div className="mb-8">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#0071BC]">
                    Inquiry Form
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Fill out the form below. We review all submissions and respond within 2 business hours.
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 text-[#39B54A] flex items-center justify-center">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Message Delivered!</h3>
                    <p className="text-slate-600 text-sm max-w-sm font-medium">
                      Thank you for reaching out to Blickwinkle. Our client strategy &amp; academic team has received your inquiry and will contact you promptly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Inquiry Type Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        What would you like to discuss? *
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-slate-50/50 font-medium"
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. David Miller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-slate-50/50"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Work / Personal Email *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="david@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Message Details */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Project Scope, Course Goal, or Campus Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your requirements, timeline, target batch, or business objectives..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC]/50 focus:border-[#0071BC] bg-slate-50/50 resize-none"
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {["Email", "Phone Call", "WhatsApp"].map((method) => (
                          <label
                            key={method}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              formData.preferredContact === method
                                ? "bg-blue-50 border-[#0071BC] text-[#0071BC]"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method}
                              checked={formData.preferredContact === method}
                              onChange={(e) =>
                                setFormData({ ...formData, preferredContact: e.target.value })
                              }
                              className="hidden"
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-3 w-full py-4 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 btn-shimmer"
                    >
                      <Send className="w-4 h-4" />
                      Submit Project or Admission Inquiry
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Context, Hours & Credibility */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Working Hours Card */}
                <div className="p-7 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#0071BC]/20 blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#39B54A]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Operational Hours</h3>
                      <p className="text-xs text-slate-400">Indian Standard Time (IST)</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Monday – Friday:</span>
                      <span className="font-bold text-white">9:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Saturday:</span>
                      <span className="font-bold text-white">9:30 AM – 6:00 PM</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Sunday:</span>
                      <span className="font-bold text-amber-400">Pre-Booked Counseling Only</span>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#39B54A] shrink-0" />
                    <span>Average response time: under 2 business hours.</span>
                  </div>
                </div>

                {/* College & Enterprise Quick Navigation */}
                <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Looking for Specific Resources?
                  </h3>
                  
                  <Link
                    href="/courses"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-[#0071BC]" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#0071BC] transition-colors">
                          Browse Course Brochures
                        </p>
                        <p className="text-[11px] text-slate-500">IELTS, PTE, Medical Coding, Campus to Corporate</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0071BC] transition-all" />
                  </Link>

                  <Link
                    href="/services"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-green-50 border border-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#39B54A]" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#39B54A] transition-colors">
                          Explore Agency Services
                        </p>
                        <p className="text-[11px] text-slate-500">Full-stack software, branding, AI automation &amp; ads</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#39B54A] transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Frequently Asked Questions (FAQ) ─────────────────────── */}
        <section className="py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0071BC]">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="flex flex-col gap-3.5">
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

      <Footer />
    </div>
  );
}
