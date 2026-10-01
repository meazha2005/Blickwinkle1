"use client";

import React, { useState, useEffect, useRef } from "react";
import LaptopBaseKeyboard from "./LaptopBaseKeyboard";

export default function ConstructionScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [coneBounced, setConeBounced] = useState(false);
  const [gearSpeedMultiplier, setGearSpeedMultiplier] = useState(1);

  // Smooth mouse move 3D tilt tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      // Clamp values and apply smooth tilt angles (max 14 degrees)
      const clampedX = Math.max(-1, Math.min(1, mouseX));
      const clampedY = Math.max(-1, Math.min(1, mouseY));

      setRotate({
        x: -clampedY * 10, // vertical tilt
        y: clampedX * 12,  // horizontal tilt
      });
    };

    const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, []);

  const handleConeClick = () => {
    setConeBounced(true);
    setTimeout(() => setConeBounced(false), 800);
  };

  const handleGearClick = () => {
    setGearSpeedMultiplier((prev) => (prev === 1 ? 2.5 : 1));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[620px] lg:max-w-[700px] aspect-[1.12/1] select-none perspective-1000 flex items-center justify-center p-2 sm:p-4"
    >
      {/* 3D Transform Pivot Card */}
      <div
        className="relative w-full h-full preserve-3d transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Soft dynamic ambient floor shadow */}
        <div
          className="absolute -bottom-6 w-3/4 h-12 bg-slate-900/10 rounded-full blur-2xl transition-all duration-300"
          style={{
            transform: `translateZ(-30px) translateY(${rotate.x * 0.8}px) scale(${
              isHovered ? 1.08 : 1
            })`,
          }}
        />

        {/* =========================================================================
            LAYER -1 (translateZ(-25px)): BACKGROUND CRANE & BLUEPRINT SCAFFOLDING
            ========================================================================= */}
        <div
          className="absolute top-0 right-10 sm:right-16 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none transition-transform duration-500 ease-out"
          style={{ transform: "translateZ(-25px)" }}
        >
          <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-70 animate-crane-sway"
          >
            {/* Crane Tower / Mast */}
            <path
              d="M140 240V70M155 240V70"
              stroke="#0071BC"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeOpacity="0.4"
            />
            {/* Scaffolding Cross-bracing */}
            <path
              d="M140 220L155 200M140 200L155 220M140 180L155 160M140 160L155 180M140 140L155 120M140 120L155 140M140 100L155 80M140 80L155 100"
              stroke="#0071BC"
              strokeWidth="1.8"
              strokeOpacity="0.35"
            />
            {/* Operator Cabin */}
            <rect
              x="132"
              y="60"
              width="24"
              height="20"
              rx="3"
              fill="#0071BC"
              fillOpacity="0.25"
              stroke="#0071BC"
              strokeWidth="2"
            />
            {/* Crane Boom / Jib (Horizontal arm) */}
            <path
              d="M30 65H230"
              stroke="#0071BC"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M60 45L147 65L200 45"
              stroke="#0071BC"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            {/* Counterweight */}
            <rect
              x="200"
              y="55"
              width="24"
              height="18"
              rx="3"
              fill="#0071BC"
              stroke="#005a96"
              strokeWidth="2"
            />
            {/* Trolley and Hoist Cable */}
            <rect x="75" y="63" width="12" height="6" fill="#1e293b" rx="1" />
            <line
              x1="81"
              y1="69"
              x2="81"
              y2="135"
              stroke="#0071BC"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            {/* Hoist Hook carrying a digital wireframe block */}
            <path
              d="M77 135C77 140 85 140 85 137"
              stroke="#39B54A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <g className="animate-float-slow">
              <rect
                x="65"
                y="142"
                width="32"
                height="22"
                rx="4"
                fill="#39B54A"
                fillOpacity="0.85"
                stroke="#2ea03d"
                strokeWidth="1.5"
              />
              <path
                d="M72 153H90M72 150H84M72 156H80"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Ambient Plus Symbols in 3D Space */}
        <div
          className="absolute top-12 left-8 text-[#0071BC]/40 font-black text-2xl select-none animate-float-slow pointer-events-none"
          style={{ transform: "translateZ(-10px)" }}
        >
          +
        </div>
        <div
          className="absolute top-4 right-1/4 text-[#39B54A]/40 font-black text-3xl select-none animate-float-reverse pointer-events-none"
          style={{ transform: "translateZ(10px)" }}
        >
          +
        </div>
        <div
          className="absolute bottom-16 right-6 text-[#0071BC]/30 font-bold text-xl select-none animate-float-slow pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        >
          +
        </div>
        <div
          className="absolute bottom-32 left-12 text-[#39B54A]/30 font-bold text-2xl select-none animate-float-reverse pointer-events-none"
          style={{ transform: "translateZ(-15px)" }}
        >
          +
        </div>

        {/* =========================================================================
            LAYER 0 (translateZ(0px)): 3D ISOMETRIC LAPTOP & DISPLAY MOCKUP
            ========================================================================= */}
        <div
          className="relative w-[92%] sm:w-[86%] max-w-[560px] preserve-3d transition-all duration-300"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Desktop Monitor Screen Assembly */}
          <div className="relative mx-auto w-[90%] aspect-[16/10] bg-[#1e2433] rounded-2xl p-2.5 sm:p-3 shadow-2xl border-2 border-[#333c4e] flex flex-col justify-between">
            {/* Top Bezel with Camera & Status Indicator */}
            <div className="flex items-center justify-between pb-1 px-2">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]/80" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/80" />
                <div className="w-2 h-2 rounded-full bg-[#10b981]/80" />
              </div>
              {/* Webcam & Indicator */}
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <div className="w-1 h-1 rounded-full bg-[#39B54A] animate-ping" />
              </div>
              <div className="w-8" />
            </div>

            {/* Inner Screen Display (Website Wireframe / Dashboard) */}
            <div className="relative flex-1 bg-[#f8fafc] rounded-lg overflow-hidden border border-slate-200 shadow-inner flex flex-col">
              {/* Simulated Browser Bar */}
              <div className="h-5 sm:h-6 bg-slate-100 border-b border-slate-200 flex items-center px-2.5 space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <div className="h-3 flex-1 max-w-[180px] bg-white rounded-full border border-slate-200/80 px-2 flex items-center">
                  <span className="text-[7px] sm:text-[8px] text-slate-400 font-mono truncate">
                    https://blickwinkle.com/preview
                  </span>
                </div>
              </div>

              {/* Wireframe Mockup Layout Grid (matches reference image layout) */}
              <div className="flex-1 p-2 sm:p-3 grid grid-cols-12 gap-2 bg-gradient-to-b from-white to-slate-50/80">
                {/* Left Column / Wireframe Content */}
                <div className="col-span-5 flex flex-col justify-between space-y-2 py-1">
                  <div className="space-y-1.5">
                    <div className="h-3 w-3/4 bg-[#0071BC]/20 rounded-md animate-pulse" />
                    <div className="h-2 w-full bg-slate-200 rounded" />
                    <div className="h-2 w-5/6 bg-slate-200 rounded" />
                    <div className="h-2 w-2/3 bg-slate-200 rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-5 w-16 bg-[#39B54A]/30 rounded border border-[#39B54A]/40" />
                    <div className="h-1.5 w-12 bg-slate-200 rounded" />
                  </div>
                </div>

                {/* Right Column / Wireframe Dashboard Cards */}
                <div className="col-span-7 flex flex-col space-y-2">
                  <div className="h-10 bg-gradient-to-r from-[#0071BC]/10 to-[#39B54A]/10 rounded-md border border-slate-200/70 p-2 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-[#0071BC]/25 flex items-center justify-center text-[9px] font-bold text-[#0071BC]">
                      BW
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-16 bg-slate-300 rounded" />
                      <div className="h-1.5 w-24 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div className="bg-slate-100/90 rounded border border-slate-200/60 p-1.5 flex flex-col justify-between">
                      <div className="h-2 w-8 bg-slate-300 rounded" />
                      <div className="h-4 w-full bg-[#0071BC]/15 rounded" />
                    </div>
                    <div className="bg-slate-100/90 rounded border border-slate-200/60 p-1.5 flex flex-col justify-between">
                      <div className="h-2 w-10 bg-[#39B54A]/30 rounded" />
                      <div className="h-4 w-full bg-[#39B54A]/15 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Glossy Screen Glare Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
            </div>

            {/* Monitor Bottom Chin & Power Indicator */}
            <div className="flex items-center justify-center pt-1.5 pb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071BC] shadow-[0_0_8px_#0071BC] animate-pulse" />
            </div>
          </div>

          {/* Desktop Monitor Stand, Wired Keyboard (no touchpad) & Wired Mouse */}
          <div className="relative w-full -mt-2 z-10">
            <LaptopBaseKeyboard />
          </div>

          {/* =========================================================================
              LAYER 1 (translateZ(40px)): HAZARD CAUTION TAPE
              Stretched diagonally across the laptop screen with 3D drop shadow
              ========================================================================= */}
          <div
            className="absolute top-[32%] sm:top-[30%] -left-[6%] -right-[6%] pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: "translateZ(40px) rotate(-6deg)",
            }}
          >
            {/* Caution Tape Shadow */}
            <div className="absolute inset-0 bg-slate-900/35 blur-md translate-y-3" />

            {/* Caution Hazard Tape Strip */}
            <div className="relative hazard-tape h-10 sm:h-12 rounded-sm border-y-2 border-amber-600/60 shadow-2xl flex items-center justify-between px-3 overflow-hidden">
              {/* Subtle light sheen sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

              <div className="w-full flex items-center justify-around font-black tracking-widest text-[9px] sm:text-[11px] text-slate-900 drop-shadow-sm uppercase">
                <span className="bg-amber-400/90 px-2 py-0.5 rounded shadow-sm">
                  🚧 UNDER CONSTRUCTION
                </span>
                <span className="hidden sm:inline bg-amber-400/90 px-2 py-0.5 rounded shadow-sm">
                  DO NOT CROSS ⚡
                </span>
                <span className="bg-amber-400/90 px-2 py-0.5 rounded shadow-sm">
                  WORK IN PROGRESS 🚧
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: TOP LAPTOP WORKER / DEVELOPER (SITTING ON SCREEN BEZEL)
            ========================================================================= */}
        <div
          className="absolute top-2 sm:top-4 left-[20%] sm:left-[24%] w-24 sm:w-28 h-28 sm:h-32 pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: "translateZ(48px)" }}
        >
          <svg
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-lg"
          >
            {/* Developer Yellow Safety Helmet */}
            <path
              d="M48 24C48 16 58 16 66 22C71 25 71 30 71 30H45C45 30 45 27 48 24Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <path
              d="M42 30H74C75 30 76 31 75 32C73 34 68 34 44 34C42 34 41 31 42 30Z"
              fill="#D97706"
            />

            {/* Head & Face */}
            <circle cx="58" cy="35" r="7" fill="#FCD34D" />
            <path
              d="M59 36C60 37 62 37 63 36"
              stroke="#B45309"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Torso / Orange Work Safety Jacket */}
            <path
              d="M47 43C49 41 67 41 69 43L74 65H42L47 43Z"
              fill="#EA580C"
            />
            {/* Reflective Safety Stripes */}
            <path
              d="M46 51H70M45 57H71"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.9"
            />

            {/* Pants / Legs dangling down the laptop screen */}
            <path
              d="M43 65L39 88C39 90 44 91 46 89L50 65H43Z"
              fill="#1E293B"
            />
            <path
              d="M52 65L55 88C55 90 60 90 62 88L65 65H52Z"
              fill="#0F172A"
            />
            {/* Shoes */}
            <ellipse cx="42" cy="90" rx="4.5" ry="2.5" fill="#334155" />
            <ellipse cx="58" cy="90" rx="4.5" ry="2.5" fill="#334155" />

            {/* Arms holding laptop with typing animation */}
            <g className="animate-typing">
              <path
                d="M45 47L35 60L45 64"
                stroke="#EA580C"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M68 47L72 58L60 64"
                stroke="#EA580C"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Small Mini-Laptop on Lap */}
              <polygon
                points="36,66 60,66 58,62 38,62"
                fill="#94A3B8"
              />
              <polygon
                points="38,62 58,62 57,50 39,50"
                fill="#0071BC"
                stroke="#005a96"
                strokeWidth="1"
              />
              {/* Screen Glow */}
              <rect
                x="41"
                y="52"
                width="14"
                height="8"
                rx="1"
                fill="#E0F2FE"
                className="animate-pulse"
              />
            </g>
          </svg>
        </div>

        {/* =========================================================================
            LAYER 2: ROTATING MECHANICAL GEARS (BRAND GREEN & BRAND BLUE)
            ========================================================================= */}
        {/* Gear 1: Large Brand Green Gear (Left) */}
        <div
          onClick={handleGearClick}
          title="Click to accelerate gears!"
          className="absolute -left-2 sm:left-2 bottom-20 sm:bottom-28 w-20 sm:w-28 h-20 sm:h-28 cursor-pointer transition-transform duration-300 hover:scale-110 drop-shadow-xl"
          style={{ transform: "translateZ(55px)" }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{
              animation: `spinClockwise ${18 / gearSpeedMultiplier}s linear infinite`,
            }}
          >
            {/* Gear Cog Teeth (12 teeth) */}
            <g fill="#39B54A" stroke="#2ea03d" strokeWidth="2">
              <rect x="44" y="2" width="12" height="14" rx="2" />
              <rect x="44" y="84" width="12" height="14" rx="2" />
              <rect x="2" y="44" width="14" height="12" rx="2" />
              <rect x="84" y="44" width="14" height="12" rx="2" />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(30 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(60 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(120 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(150 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(210 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(240 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(300 50 50)"
              />
              <rect
                x="44"
                y="2"
                width="12"
                height="14"
                rx="2"
                transform="rotate(330 50 50)"
              />
              {/* Gear Body Circle */}
              <circle cx="50" cy="50" r="38" fill="#39B54A" />
            </g>
            {/* Gear Inner Hollow & Bevel */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="#ffffff"
              stroke="#2ea03d"
              strokeWidth="3"
            />
            <circle cx="50" cy="50" r="10" fill="#39B54A" />
          </svg>
        </div>

        {/* Gear 2: Golden / Brand Blue Secondary Gear (Upper Right) */}
        <div
          onClick={handleGearClick}
          className="absolute right-4 sm:right-10 top-12 sm:top-16 w-14 sm:w-18 h-14 sm:h-18 cursor-pointer transition-transform duration-300 hover:scale-110 drop-shadow-md"
          style={{ transform: "translateZ(30px)" }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{
              animation: `spinCounterClockwise ${12 / gearSpeedMultiplier}s linear infinite`,
            }}
          >
            <g fill="#F59E0B" stroke="#D97706" strokeWidth="2">
              <rect x="44" y="4" width="12" height="12" rx="2" />
              <rect x="44" y="84" width="12" height="12" rx="2" />
              <rect x="4" y="44" width="12" height="12" rx="2" />
              <rect x="84" y="44" width="12" height="12" rx="2" />
              <rect
                x="44"
                y="4"
                width="12"
                height="12"
                rx="2"
                transform="rotate(45 50 50)"
              />
              <rect
                x="44"
                y="4"
                width="12"
                height="12"
                rx="2"
                transform="rotate(135 50 50)"
              />
              <rect
                x="44"
                y="4"
                width="12"
                height="12"
                rx="2"
                transform="rotate(225 50 50)"
              />
              <rect
                x="44"
                y="4"
                width="12"
                height="12"
                rx="2"
                transform="rotate(315 50 50)"
              />
              <circle cx="50" cy="50" r="36" fill="#F59E0B" />
            </g>
            <circle
              cx="50"
              cy="50"
              r="18"
              fill="#ffffff"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="50" r="8" fill="#F59E0B" />
          </svg>
        </div>

        {/* =========================================================================
            LAYER 3: 3D TRAFFIC SAFETY CONE (FOREGROUND LEFT)
            Interactive click: wobbles and bounces playfully!
            ========================================================================= */}
        <div
          onClick={handleConeClick}
          title="Click to bump the safety cone!"
          className={`absolute left-[12%] sm:left-[16%] -bottom-2 sm:bottom-0 w-24 sm:w-36 h-28 sm:h-40 cursor-pointer transition-all duration-300 drop-shadow-2xl z-20 ${
            coneBounced ? "animate-bounce" : "hover:-translate-y-2"
          }`}
          style={{ transform: "translateZ(65px)" }}
        >
          <svg
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Cone Cast Shadow */}
            <ellipse
              cx="60"
              cy="126"
              rx="48"
              ry="10"
              fill="#0f172a"
              fillOpacity="0.22"
            />

            {/* Square Base */}
            <path
              d="M15 118L60 134L105 118L60 105L15 118Z"
              fill="#EA580C"
              stroke="#C2410C"
              strokeWidth="2"
            />
            <path
              d="M15 118L60 134V138L15 122V118Z"
              fill="#9A3412"
            />
            <path
              d="M105 118L60 134V138L105 122V118Z"
              fill="#7C2D12"
            />

            {/* Orange Cone Body (Lower section) */}
            <path
              d="M28 113L38 88H82L92 113C82 118 38 118 28 113Z"
              fill="#F97316"
            />
            <path
              d="M28 113L38 88H60V116C46 116 34 114 28 113Z"
              fill="#FB923C"
            />

            {/* White Reflective Stripe 1 (Lower) */}
            <path
              d="M38 88L44 68H76L82 88C74 91 46 91 38 88Z"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="1"
            />

            {/* Orange Cone Body (Middle section) */}
            <path
              d="M44 68L48 52H72L76 68C70 70 50 70 44 68Z"
              fill="#F97316"
            />

            {/* White Reflective Stripe 2 (Upper) */}
            <path
              d="M48 52L52 38H68L72 52C67 54 53 54 48 52Z"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="1"
            />

            {/* Orange Cone Tip */}
            <path
              d="M52 38L58 14C58 12 62 12 62 14L68 38C64 40 56 40 52 38Z"
              fill="#EA580C"
            />
            {/* Top Hole */}
            <ellipse cx="60" cy="14" rx="2.5" ry="1" fill="#7C2D12" />

            {/* 3D Specular Highlight down the left side */}
            <path
              d="M53 38L59 15L57 15L51 38Z"
              fill="#ffffff"
              fillOpacity="0.4"
            />
            <path
              d="M45 68L49 52L47 52L43 68Z"
              fill="#ffffff"
              fillOpacity="0.4"
            />
          </svg>
        </div>

        {/* =========================================================================
            LAYER 3: FOREGROUND RIGHT WORKER WITH MEGAPHONE & BLUEPRINT
            ========================================================================= */}
        <div
          className="absolute -right-2 sm:right-2 -bottom-4 sm:bottom-0 w-28 sm:w-36 h-36 sm:h-48 pointer-events-none transition-transform duration-300 ease-out z-20"
          style={{ transform: "translateZ(60px)" }}
        >
          <svg
            viewBox="0 0 120 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xl"
          >
            {/* Ground Shadow */}
            <ellipse
              cx="65"
              cy="154"
              rx="32"
              ry="6"
              fill="#0f172a"
              fillOpacity="0.2"
            />

            {/* Safety Helmet */}
            <path
              d="M50 32C50 22 62 21 72 28C77 32 77 38 77 38H46C46 38 46 34 50 32Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <path
              d="M44 38H80C81 38 82 39 81 40C79 43 72 43 45 43C43 43 42 40 44 38Z"
              fill="#D97706"
            />

            {/* Head & Ear */}
            <circle cx="63" cy="46" r="9" fill="#FCD34D" />
            <circle cx="72" cy="46" r="2.5" fill="#FBBF24" />

            {/* Safety Jacket Body */}
            <path
              d="M48 57C52 54 74 54 78 57L85 96H42L48 57Z"
              fill="#EA580C"
            />
            {/* Reflective Stripes */}
            <path
              d="M46 68H81M44 78H83"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeOpacity="0.95"
            />

            {/* Blue Work Pants */}
            <path
              d="M44 96L46 142H58L59 104L67 104L68 142H80L82 96H44Z"
              fill="#1E293B"
            />
            {/* Work Boots */}
            <rect x="42" y="142" width="18" height="8" rx="3" fill="#334155" />
            <rect x="68" y="142" width="18" height="8" rx="3" fill="#334155" />

            {/* Left Arm holding Loudspeaker / Megaphone */}
            <path
              d="M48 60L32 72L24 70"
              stroke="#EA580C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Megaphone / Bullhorn */}
            <g>
              <polygon
                points="12,62 26,67 26,75 12,80"
                fill="#EA580C"
                stroke="#C2410C"
                strokeWidth="1.5"
              />
              <rect
                x="8"
                y="60"
                width="4"
                height="22"
                rx="1.5"
                fill="#39B54A"
                stroke="#2ea03d"
                strokeWidth="1"
              />
              <path
                d="M26,71 L30,71 L30,78 L26,76"
                fill="#334155"
              />
              {/* Soundwaves pulsing */}
              <path
                d="M5 67C3 69 3 73 5 75"
                stroke="#39B54A"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d="M1 63C-2 67 -2 75 1 79"
                stroke="#0071BC"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-ping"
              />
            </g>

            {/* Right Arm holding Blueprint / Documents */}
            <path
              d="M78 60L88 78L84 96"
              stroke="#EA580C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Rolled Blueprint */}
            <g transform="rotate(-15 88 92)">
              <rect
                x="84"
                y="85"
                width="22"
                height="15"
                rx="2"
                fill="#ffffff"
                stroke="#0071BC"
                strokeWidth="1.5"
              />
              <line
                x1="87"
                y1="89"
                x2="102"
                y2="89"
                stroke="#0071BC"
                strokeWidth="1"
              />
              <line
                x1="87"
                y1="93"
                x2="98"
                y2="93"
                stroke="#0071BC"
                strokeWidth="1"
              />
              <line
                x1="87"
                y1="97"
                x2="103"
                y2="97"
                stroke="#39B54A"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
