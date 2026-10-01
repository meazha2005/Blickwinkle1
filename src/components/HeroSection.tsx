"use client";

import React from "react";
import Image from "next/image";
import ConstructionScene3D from "./ConstructionScene3D";

export default function HeroSection() {

  return (
    <div className="relative min-h-screen w-full bg-white text-slate-900 overflow-x-hidden flex flex-col justify-between selection:bg-[#0071BC]/20 selection:text-[#0071BC]">
      {/* =========================================================================
          BACKGROUND DECORATIVE CURVES & LIGHT EFFECTS (MATCHING REFERENCE IMAGE)
          ========================================================================= */}
      {/* Sweeping organic blue wave in bottom-left & center (from reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft flowing wave background path */}
        <svg
          className="absolute -bottom-10 -left-10 w-[140%] sm:w-[120%] lg:w-[110%] h-[55%] sm:h-[60%] lg:h-[65%] text-[#E8F4FC]/80 transition-all"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-50,450 C220,520 400,280 750,380 C1100,480 1280,260 1500,320 L1500,650 L-50,650 Z"
            fill="currentColor"
          />
          <path
            d="M-50,490 C260,560 520,380 850,440 C1180,500 1320,350 1500,390 L1500,650 L-50,650 Z"
            fill="#EDF8EF"
            fillOpacity="0.6"
          />
        </svg>

        {/* Ambient radial glows in brand colors */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0071BC]/5 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-[#39B54A]/5 blur-3xl animate-pulse-glow" />

        {/* Delicate floating background architectural grid crosshairs */}
        <div className="absolute top-24 left-[15%] text-[#0071BC]/25 font-bold text-2xl select-none animate-float-slow">
          +
        </div>
        <div className="absolute top-36 right-[22%] text-[#39B54A]/25 font-bold text-3xl select-none animate-float-reverse">
          +
        </div>
        <div className="absolute bottom-20 left-[35%] text-[#0071BC]/20 font-bold text-xl select-none animate-float-slow">
          +
        </div>
        <div className="absolute top-1/2 right-[8%] text-[#39B54A]/20 font-bold text-2xl select-none animate-float-reverse">
          +
        </div>
      </div>

      {/* =========================================================================
          TOP NAVIGATION / HEADER BAR
          ========================================================================= */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-2 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Blickwinkle"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0071BC] transition-colors">
              BLICKWINKLE
            </span>
            <span className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase -mt-0.5">
              Digital Innovation
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN HERO SECTION (SPLIT 2-COLUMN LAYOUT)
          ========================================================================= */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-4 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* =====================================================================
              LEFT COLUMN: HERO COPY & CALL TO ACTION
              ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-7 text-left order-2 lg:order-1 pt-2 lg:pt-0">
            
            {/* Main Headline (matches exact layout & essence of reference) */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Website is <br />
                under <br />
                <span className="bg-gradient-to-r from-[#0071BC] via-[#0284c7] to-[#39B54A] bg-clip-text text-transparent">
                  construction
                </span>
              </h1>
            </div>

            {/* Description Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              We are currently re-imagining and rebuilding our website from the
              ground up. Our engineers and creative team are preparing a seamless
              digital experience designed for your speed and satisfaction.
            </p>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: 3D INTERACTIVE HERO ILLUSTRATION
              ===================================================================== */}
          <div className="lg:col-span-7 flex items-center justify-center order-1 lg:order-2 w-full">
            <ConstructionScene3D />
          </div>
        </div>
      </main>

      {/* =========================================================================
          BOTTOM FOOTER BAR
          ========================================================================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100">
        <p className="font-medium text-center sm:text-left">
          © {new Date().getFullYear()} Blickwinkle. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 font-semibold text-slate-600">
          <a
            href="mailto:blickwinkleenterprises@gmail.com"
            className="hover:text-[#0071BC] transition-colors"
          >
            blickwinkleenterprises@gmail.com
          </a>
        </div>
      </footer>

    </div>
  );
}
