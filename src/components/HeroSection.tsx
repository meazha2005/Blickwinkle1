"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import InteractiveFloatingLogos from "@/components/InteractiveFloatingLogos";
import MobileTabletHeroAccent from "@/components/MobileTabletHeroAccent";
import {
  ArrowRight,
  BarChart2,
  Globe,
  Code2,
  BookOpen,
  Star,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// ─── Service Card ─────────────────────────────────────────────────────────
interface ServiceProps {
  image: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  iconColor: string;
  bg: string;
  delay: number;
}

function ServiceCard({ image, icon: Icon, title, iconColor, bg, delay }: ServiceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(delay, 0.2), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="service-card group rounded-3xl border border-slate-100 bg-white p-5 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform-gpu"
    >
      {/* Service Illustration */}
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
        {/* Floating Icon badge */}
        <div className={`absolute bottom-2.5 left-2.5 w-9 h-9 rounded-xl ${bg} backdrop-blur-md bg-white/95 shadow-md border border-white/80 flex items-center justify-center`}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0071BC] transition-colors">{title}</h3>
      </div>

      <div className="flex items-center gap-1 text-[#0071BC] text-sm font-bold group-hover:gap-2 transition-all pt-1">
        Learn more <ChevronRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#0071BC] to-[#005f9e] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-full bg-[#39B54A]/15 rounded-l-full blur-3xl pointer-events-none transform-gpu" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Ready to Transform Your Digital Presence?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 mt-4 text-base sm:text-lg"
          >
            Let&apos;s build something extraordinary together. Get a free strategy consultation today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 max-w-sm px-5 py-3.5 rounded-full bg-white/15 border border-white/30 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button className="px-7 py-3.5 rounded-full bg-white text-[#0071BC] font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 btn-shimmer">
              Get Free Consultation
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────
const SERVICES: ServiceProps[] = [
  {
    image: "/service_marketing.jpg",
    icon: BarChart2,
    title: "Digital Marketing",
    desc: "Data-driven campaigns that grow your brand across every channel — SEO, PPC, email, and more.",
    iconColor: "#0071BC",
    bg: "bg-blue-50",
    delay: 0,
  },
  {
    image: "/service_social.jpg",
    icon: Globe,
    title: "Social Media Management",
    desc: "Strategic content creation, scheduling, and community management to build a loyal audience.",
    iconColor: "#39B54A",
    bg: "bg-green-50",
    delay: 0.1,
  },
  {
    image: "/service_software.jpg",
    icon: Code2,
    title: "Web Development",
    desc: "Custom websites, apps, and automation solutions built with modern tech for maximum performance.",
    iconColor: "#0071BC",
    bg: "bg-blue-50",
    delay: 0.2,
  },
  {
    image: "/service_courses.jpg",
    icon: BookOpen,
    title: "EduTech Courses",
    desc: "Industry-grade online courses and workshops to upskill your team in digital and tech domains.",
    iconColor: "#39B54A",
    bg: "bg-green-50",
    delay: 0.3,
  },
];

const TAGS = ["Digital Marketing", "Software Solutions"];
const CLIENT_LOGOS = [
  { name: "Ramraj Textiles", src: "/logos/ramraj.png" },
  { name: "Premier Kabadi League", src: "/logos/pkl.png" },
  { name: "Yavi Interiors", src: "/logos/yavi.png" },
  { name: "Nirabi Interiors", src: "/logos/nirabi.png" },
];

// ─── Main Export ──────────────────────────────────────────────────────────
export default function HeroSection() {

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-16 sm:pt-20">

        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/hero_bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-blue-50/60" />
        </div>

        <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-[#0071BC]/6 blur-3xl pointer-events-none transform-gpu" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#39B54A]/5 blur-3xl pointer-events-none transform-gpu" />

        {/* Interactive Floating Logos (9x5 scattered logos falling from above with hover physics) */}
        <InteractiveFloatingLogos />

        {/* Half-circle revolving logos on the right edge (visible only on mobile & tablet at 30% opacity) */}
        <MobileTabletHeroAccent />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-20 pb-32 sm:pb-28 lg:pb-20 -translate-y-2 sm:-translate-y-3 lg:translate-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* ── Left: Copy ──────────────────────────────────────────── */}
            <div className="w-full lg:col-span-5 flex flex-col gap-6">

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-[2.95rem] min-[400px]:text-[3.2rem] sm:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.04] sm:leading-[1.08]"
              >
                We Turn Ideas
                <br />
                <span className="text-gradient">Into Digital</span>
                <br />
                Realities.
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed max-w-lg"
              >
                From strategic digital marketing and social media to custom software, websites, and e-learning — we build and grow your complete digital presence.
              </motion.p>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-2"
              >
                {TAGS.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39B54A]" />
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => scrollTo("#services")}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0071BC] to-[#39B54A] text-white font-bold text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 btn-shimmer"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <div className="flex -space-x-2.5 items-center">
                  {CLIENT_LOGOS.map((logo) => (
                    <div
                      key={logo.name}
                      className="relative w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center p-0.5 hover:scale-125 hover:z-10 transition-transform duration-200 cursor-pointer"
                      title={logo.name}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        fill
                        sizes="32px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    <span className="text-slate-800 font-bold">50+ happy clients</span> across industries
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Right: Laptop (Visible only on laptops and desktops) ───── */}
            <div className="hidden lg:flex lg:col-span-7 items-center justify-center relative">
              <div className="relative w-full max-w-[680px] mx-auto">
                {/* Ambient glow */}
                <div className="absolute inset-10 bg-gradient-to-br from-[#0071BC]/20 to-[#39B54A]/15 rounded-[50%] blur-3xl animate-blob transform-gpu" />

                {/* Laptop */}
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0,  scale: 1   }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full"
                >
                  {/* Screen lid */}
                  <div className="laptop-screen relative w-full" style={{ transformOrigin: "bottom center" }}>
                    <div className="relative mx-auto w-full bg-[#1c2130] rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl border-2 border-[#2a3249]">
                      {/* Top bezel — camera dot only, no traffic-light colours */}
                      <div className="flex items-center justify-center px-3 pb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      </div>

                      {/* Desktop screen */}
                      <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200/30">
                        {/* Generated white wallpaper */}
                        <Image
                          src="/desktop_wallpaper.jpg"
                          alt="Blickwinkle desktop wallpaper"
                          fill
                          sizes="(max-width: 768px) 100vw, 55vw"
                          className="object-cover"
                          priority
                        />

                        {/* Taskbar at bottom — 6 service icons */}
                        <div className="absolute bottom-0 inset-x-0 bg-white/80 backdrop-blur-md border-t border-slate-200/80 flex items-end justify-center gap-3 sm:gap-4 px-4 pt-4 pb-2.5">
                          {[
                            { src: "/icon_marketing.jpg",  label: "Marketing"  },
                            { src: "/icon_content.jpg",    label: "Content"    },
                            { src: "/icon_website.png",    label: "Website"    },
                            { src: "/icon_software.jpg",   label: "Software"   },
                            { src: "/icon_automation.jpg", label: "Automation" },
                            { src: "/icon_courses.jpg",    label: "Courses"    },
                          ].map(({ src, label }) => (
                            <div key={label} className="flex flex-col items-center gap-0.5 group cursor-default">
                              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-xl">
                                <Image
                                  src={src}
                                  alt={label}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-slate-600 text-[15px] sm:text-[12px] font-semibold leading-none pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Subtle screen glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                      </div>

                      {/* Chin LED */}
                      <div className="flex justify-center pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0071BC] shadow-[0_0_10px_#0071BC] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Monitor stand */}
                  <div className="laptop-base relative flex flex-col items-center -mt-1">
                    <div
                      className="w-[10%] h-5 sm:h-6"
                      style={{ background: "linear-gradient(90deg, #475569 0%, #94a3b8 50%, #334155 100%)" }}
                    />
                    <div
                      className="h-3 sm:h-4 rounded-full shadow-lg"
                      style={{ width: "38%", background: "linear-gradient(180deg, #e2e8f0 0%, #94a3b8 100%)" }}
                    />
                    <div className="w-[55%] h-3 rounded-full bg-black/10 blur-md mt-1" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* ================================================================
          SERVICES
          ================================================================ */}
      <section id="services" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#0071BC]/10 text-[#0071BC] text-sm font-bold mb-4"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            >
              Everything You Need to
              <span className="text-gradient"> Grow Online</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 mt-4 text-base sm:text-lg"
            >
              One partner. Full-stack digital solutions from strategy to execution.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc) => (
              <ServiceCard key={svc.title} {...svc} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <CtaSection />
    </>
  );
}
