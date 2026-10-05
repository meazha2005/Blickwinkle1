"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  Globe,
  Rss,
  AtSign,
  MessageSquare,
} from "lucide-react";

const footerLinks = {
  Services: [
    "Digital Marketing",
    "Social Media Management",
    "Web Development",
    "Software Solutions",
    "Automation",
    "EduTech Courses",
  ],
  Company: ["About Us", "Our Team", "Careers", "Blog", "Case Studies"],
  Support: ["Contact Us", "FAQ", "Privacy Policy", "Terms of Service"],
};

const socials = [
  { icon: AtSign,       label: "Twitter / X"  },
  { icon: Globe,        label: "LinkedIn"      },
  { icon: MessageSquare,label: "Instagram"     },
  { icon: Rss,          label: "YouTube"       },
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
                  Digital Innovation
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Your full-stack digital partner. We build, grow, and educate — helping businesses thrive in the digital world.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Mail,   text: "hello@blickwinkle.com" },
                { icon: Phone,  text: "+91 98765 43210"       },
                { icon: MapPin, text: "Chennai, India"        },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors cursor-default">
                  <Icon className="w-4 h-4 text-[#0071BC] shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-1">
              {socials.map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-[#0071BC] hover:to-[#39B54A] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wide">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-slate-400 hover:text-[#39B54A] transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#39B54A]" />
                      {link}
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
