"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

interface ReviewItem {
  id: number;
  name: string;
  location: string;
  tag: string;
  rating: number;
  initials: string;
  avatarBg: string;
  review: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: "Priya",
    location: "Australia",
    tag: "PTE Academic Coaching",
    rating: 5,
    initials: "P",
    avatarBg: "from-[#0071BC] to-[#00a3ff]",
    review:
      "Thank you so much for your kind wishes and all your support! I’m really happy that I finally got my required score. I really appreciate all the help and guidance from the Blickwinkle team. ❤️ I’ll recommend Blickwinkle to my friends if they need any help with PTE. Thanks again for everything!",
  },
  {
    id: 2,
    name: "Sujee",
    location: "Chennai",
    tag: "English Fluency & Communication",
    rating: 5,
    initials: "S",
    avatarBg: "from-[#39B54A] to-[#10b981]",
    review:
      "Thank you so much for your wonderful support and motivation. Definitely, I will become more confident and fluent in English by the time I meet you again. For that, I will continue to put in my best effort, keep learning, and practice listening and speaking regularly. I’m really grateful for your guidance and encouragement.",
  },
  {
    id: 3,
    name: "GUNA SEELAN",
    location: "Chennai",
    tag: "Campus to Corporate & Soft Skills",
    rating: 5,
    initials: "GS",
    avatarBg: "from-[#0071BC] to-[#39B54A]",
    review:
      "Honestly, one of the best soft skills trainers I've had. Sanjay Krishna sir explains things in a way that's so easy to understand and connect with, and he teaches so well. He's also really friendly and talks with us like a friend, which makes it so much easier to open up. I really enjoyed this class, it was so interesting to learn from, I learned how to create a proper resume, the GD (group discussion) session was so good, and learning about body language and maintaining eye contact while speaking has helped me a lot. At first I thought speaking in English was hard, but after this class, I feel comfortable speaking now. Thank you so much for everything Sanjay Krishna Sir.",
  },
  {
    id: 4,
    name: "M. Sanjay",
    location: "Chennai",
    tag: "Medical Coding & Placement",
    rating: 5,
    initials: "MS",
    avatarBg: "from-[#6366f1] to-[#0071BC]",
    review:
      "I had an excellent experience at Blickwinkle Training Institute. The entire learning journey was well organized and highly informative. The trainers are very knowledgeable, patient, and always willing to clear every doubt with detailed explanations. The course curriculum is designed in a simple and practical way, making it easy to understand even for beginners. Along with technical knowledge, the institute also focuses on communication skills, interview preparation, resume building, and placement support, which helped me gain confidence for my career. The classroom environment is friendly, motivating, and encourages students to learn and improve every day. I sincerely appreciate the dedication and continuous support provided by the faculty and staff throughout the training. I highly recommend Blickwinkle Training Institute to anyone looking to build a successful career in medical coding. Thank you to the entire team for providing such quality training and guidance.",
  },
  {
    id: 5,
    name: "Kevinjoshua Kevin",
    location: "Chennai",
    tag: "Communication Skills",
    rating: 5,
    initials: "KK",
    avatarBg: "from-[#0ea5e9] to-[#39B54A]",
    review:
      "It was a nice experience with our communication trainer sanjay krishna. We like the way of his teaching methods and he used some live example to understand the concept of the communication. Now I have the confidence to speak in english to everyone whether it's right or wrong. Thankyou for given this wonderful opportunity to us and thanks to our trainer sanjay krishna sir.",
  },
  {
    id: 6,
    name: "Magesh",
    location: "Chennai",
    tag: "10-Day Communication Bootcamp",
    rating: 5,
    initials: "M",
    avatarBg: "from-[#39B54A] to-[#0071BC]",
    review:
      "I sincerely thank my trainer, Mr. Sanjay, for conducting this 10-day Communication Skill Training program. The sessions were highly interactive, informative, and engaging. Your teaching style was clear, patient, and easy to understand, which helped us improve our communication, confidence, public speaking, group discussion, interview, and teamwork skills. The practical activities, real-life examples, and continuous encouragement made learning enjoyable and effective. This training has significantly enhanced my confidence in expressing my ideas and interacting with others. Overall, it was a valuable and enriching learning experience, and I truly appreciate Mr. Sanjay's dedication, guidance, and support throughout the training.",
  },
  {
    id: 7,
    name: "Nisha",
    location: "Chennai",
    tag: "Career Training & Support",
    rating: 5,
    initials: "N",
    avatarBg: "from-[#ec4899] to-[#0071BC]",
    review:
      "I had a very good experience at Blickwinkle Training Institute. The trainers are friendly, supportive, and explain the topics clearly in an easy-to-understand way. The sessions were informative and helped me improve my knowledge and confidence. I am happy with my learning experience and would definitely recommend this institute to others. Thank you to the entire team for the great support!",
  },
  {
    id: 8,
    name: "Yuvaraj",
    location: "Chennai",
    tag: "Interactive Communication",
    rating: 5,
    initials: "Y",
    avatarBg: "from-[#0071BC] to-[#10b981]",
    review:
      "I had a great learning experience at Blickwinkle Training Institute. The communication skills training was well-organized, interactive, and easy to understand. The trainer explained every concept clearly and encouraged everyone to participate in activities, discussions, and speaking exercises.",
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const total = REVIEWS.length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef(true);

  // Touch gesture state (tracks X and Y to avoid blocking vertical scrolling)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Detect desktop viewports (>= 1024px). Mobile and tablets (< 1024px) do not auto-slide.
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Pause auto-rotation when section is scrolled out of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2-second auto-rotation in infinite loop - strictly desktop only
  useEffect(() => {
    if (!isDesktop || isPaused) return;

    const interval = setInterval(() => {
      if (isVisibleRef.current) {
        goToNext();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isDesktop, isPaused, goToNext]);

  // Touch gesture handlers for mobile swipe without interfering with vertical scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    // Only navigate if horizontal swipe is dominant and exceeds 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="pt-2 sm:pt-4 pb-8 sm:pb-10 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient background glows with zero blur overhead */}
      <div
        className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none transform-gpu"
        style={{
          background: "radial-gradient(circle, rgba(0,113,188,0.06) 0%, rgba(0,113,188,0) 70%)",
        }}
      />
      <div
        className="absolute bottom-10 left-0 w-[450px] h-[450px] rounded-full pointer-events-none transform-gpu"
        style={{
          background: "radial-gradient(circle, rgba(57,181,74,0.05) 0%, rgba(57,181,74,0) 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full  text-[#0071BC] text-xs font-bold uppercase tracking-wider mb-2">
            
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            What Our Students &amp; Clients Say
            <span className="text-gradient block sm:inline sm:ml-2">About Blickwinkle</span>
          </h2>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm lg:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Real stories of career acceleration, global exam success, and skill excellence from learners across India and abroad.
          </p>
        </div>

        {/* ── 3-Card Carousel Stage ───────────────────────────────── */}
        <div className="relative w-full h-[370px] sm:h-[350px] flex items-center justify-center overflow-hidden">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrev}
            aria-label="Previous review"
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white shadow-xl border border-slate-200/90 text-slate-700 hover:text-[#0071BC] hover:border-[#0071BC]/40 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            aria-label="Next review"
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white shadow-xl border border-slate-200/90 text-slate-700 hover:text-[#0071BC] hover:border-[#0071BC]/40 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          {/* Cards Track */}
          <div className="relative w-full h-full flex items-center justify-center">
            {REVIEWS.map((item, idx) => {
              // Calculate circular offset relative to currentIndex (-total/2 to +total/2)
              let offset = idx - currentIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isHidden = Math.abs(offset) > 1;

              // Compute translate and scale based on offset
              let transformStyle = "";
              let opacity = 0;
              let zIndex = 10;
              let pointerEvents: "auto" | "none" = "none";
              let cursorStyle = "default";

              if (isCenter) {
                transformStyle = "translate3d(-50%, -50%, 0) scale(1)";
                opacity = 1;
                zIndex = 30;
                pointerEvents = "auto";
              } else if (isLeft) {
                // Responsive distance for left peek card
                transformStyle = "translate3d(calc(-50% - min(460px, 86%)), -50%, 0) scale(0.88)";
                opacity = 0.45;
                zIndex = 20;
                pointerEvents = "auto";
                cursorStyle = "pointer";
              } else if (isRight) {
                // Responsive distance for right peek card
                transformStyle = "translate3d(calc(-50% + min(460px, 86%)), -50%, 0) scale(0.88)";
                opacity = 0.45;
                zIndex = 20;
                pointerEvents = "auto";
                cursorStyle = "pointer";
              } else if (offset < -1) {
                transformStyle = "translate3d(calc(-50% - min(700px, 140%)), -50%, 0) scale(0.75)";
                opacity = 0;
                zIndex = 10;
              } else {
                transformStyle = "translate3d(calc(-50% + min(700px, 140%)), -50%, 0) scale(0.75)";
                opacity = 0;
                zIndex = 10;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isLeft) goToPrev();
                    if (isRight) goToNext();
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={`absolute top-1/2 left-1/2 w-[90%] sm:w-[480px] lg:w-[520px] rounded-2xl sm:rounded-3xl bg-white border p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 ease-out will-change-transform select-none ${
                    isCenter
                      ? "shadow-2xl shadow-blue-900/10 border-blue-200/90"
                      : "shadow-md border-slate-200/80"
                  }`}
                  style={{
                    transform: transformStyle,
                    opacity,
                    zIndex,
                    pointerEvents,
                    cursor: cursorStyle,
                  }}
                >
                  {/* Decorative background quote watermark */}
                  <Quote className="absolute right-4 top-4 w-14 h-14 sm:w-16 sm:h-16 text-slate-100/90 pointer-events-none -rotate-12" />

                  {/* Card Header: Stars & Verification Badge */}
                  <div className="flex items-center justify-between gap-2 relative z-10 mb-2.5 sm:mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Learner
                    </span>
                  </div>

                  {/* Review Text Body */}
                  <div className="relative z-10 flex-1 overflow-y-auto max-h-[160px] sm:max-h-[170px] pr-1 scrollbar-thin">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium italic">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>

                  {/* Card Footer: Student Profile */}
                  <div className="relative z-10 pt-3 mt-2 border-t border-slate-100 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.avatarBg} text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {item.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#0071BC] shrink-0" />
                        <span>{item.location}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[#0071BC] font-bold truncate">{item.tag}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Carousel Bottom Navigation Indicators & Controls ──────── */}
        <div className="flex flex-col items-center gap-2.5 mt-3 sm:mt-4">
          <div className="flex items-center gap-3">
            {/* Mobile / Tablet Quick Prev Button */}
            <button
              onClick={goToPrev}
              aria-label="Previous review"
              className="lg:hidden w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 text-slate-700 active:scale-95 flex items-center justify-center cursor-pointer hover:border-[#0071BC]/50 hover:text-[#0071BC] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {REVIEWS.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer rounded-full ${
                    currentIndex === idx
                      ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-[#0071BC] to-[#39B54A]"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Mobile / Tablet Quick Next Button */}
            <button
              onClick={goToNext}
              aria-label="Next review"
              className="lg:hidden w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 text-slate-700 active:scale-95 flex items-center justify-center cursor-pointer hover:border-[#0071BC]/50 hover:text-[#0071BC] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
