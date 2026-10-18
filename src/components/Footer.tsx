"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "Strategic Marketing", href: "/services?service=marketing" },
      { label: "Social Media & Branding", href: "/services?service=social-media-management" },
      { label: "Web & Software Engineering", href: "/services?service=website" },
      { label: "Custom AI & Automation", href: "/services?service=custom-ai-automation" },
      { label: "All Services (11 Services)", href: "/services" },
    ],
  },
  {
    title: "Courses",
    links: [
      { label: "Digital Marketing", href: "/courses#digital-marketing" },
      { label: "IELTS Masterclass", href: "/courses#ielts" },
      { label: "PTE Coaching", href: "/courses#pte" },
      { label: "Campus to Corporate", href: "/courses#campus-to-corporate" },
      { label: "Corporate Communication", href: "/courses#corporate-communication" },
      { label: "Medical Coding", href: "/courses#medical-coding" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Articles & Insights", href: "/articles" },
      { label: "Our Story & Vision", href: "/about" },
      { label: "College Partnerships", href: "/about" },
      { label: "Contact & Inquiries", href: "/contact" },
      { label: "Course Brochures", href: "/courses" },
    ],
  },
];

const socials = [
  {
    name: "WhatsApp",
    src: "/floatings/whatsapp.png",
    href: "https://wa.me/919791615499?text=Hello%20Blickwinkle%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20services%20and%20courses.",
  },
  {
    name: "Instagram",
    src: "/floatings/insta.png",
    href: "https://www.instagram.com/blickwinkle_learning_academy",
  },
  {
    name: "Facebook",
    src: "/floatings/facebook.png",
    href: "https://www.facebook.com/profile.php?id=61586677483962",
  },
  {
    name: "LinkedIn",
    src: "/floatings/linkedin.png",
    href: "https://www.linkedin.com/company/blickwinkle-enterprises/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                <Image src="/logo.png" alt="Blickwinkle" fill sizes="40px" className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-[#39B54A] transition-colors">
                  BLICKWINKLE
                </span>
                <span className="text-[9px] tracking-widest text-slate-500 font-semibold uppercase">
                  Together We Grow
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Your full-stack digital partner. We build, grow, and educate — helping businesses thrive in the digital world.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:training@blickwinkle.com"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0071BC] shrink-0" />
                <span>training@blickwinkle.com</span>
              </a>
              <a
                href="tel:+919791615499"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0071BC] shrink-0" />
                <span>+91 97916 15499</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-slate-400 cursor-default">
                <MapPin className="w-4 h-4 text-[#0071BC] shrink-0" />
                <span>Chennai, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-1">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/90 flex items-center justify-center p-2 transition-all duration-200 hover:scale-110 shadow-sm group"
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                      src={social.src}
                      alt={social.name}
                      fill
                      sizes="20px"
                      className="object-contain transition-transform duration-200 group-hover:scale-110"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((sec) => (
            <div key={sec.title} className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wide">{sec.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-[#39B54A] transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#39B54A]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Blickwinkle. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> by the Blickwinkle team
          </p>
        </div>
      </div>
    </footer>
  );
}
