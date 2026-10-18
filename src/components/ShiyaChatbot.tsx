"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: { label: string; value: string; color?: string }[];
}

const COURSES = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Performance Marketing, SEO & Generative AI",
    description:
      "Master modern SEO, Google & Meta Ads scaling, content virality, and generative AI marketing automation with live agency client projects.",
    duration: "12 Weeks (120+ Hours)",
    mode: "Online Live & Hybrid Lab",
  },
  {
    id: "ielts",
    title: "IELTS Masterclass",
    tagline: "British Council & IDP Aligned Band 8.0+ Track",
    description:
      "Score-maximizing preparation targeting Band 8.0+ with Cambridge examiner writing templates, 1-on-1 speaking fluency evaluations, and 15+ full-length mock exams.",
    duration: "8 Weeks (Comprehensive) / 4 Weeks (Crash)",
    mode: "Interactive Live Classes / In-Center",
  },
  {
    id: "pte",
    title: "PTE Coaching",
    tagline: "Pearson AI Scoring Engine Decoding (79+ Track)",
    description:
      "Target a score of 79+ for study abroad and PR immigration with high-precision AI practice simulator software and daily oral fluency acoustic diagnostics.",
    duration: "6 Weeks (Intensive)",
    mode: "Online Live with AI Practice Software",
  },
  {
    id: "medical-coding",
    title: "Medical Coding",
    tagline: "Healthcare IT & RCM Training with Placement Track",
    description:
      "Launch a career in US Healthcare Revenue Cycle Management. Master ICD-10-CM, CPT, and HCPCS coding rules with 1,000+ real chart audits and interview opportunities.",
    duration: "16 Weeks (160+ Hours)",
    mode: "Classroom / Online Live Interactive",
  },
  {
    id: "campus-to-corporate",
    title: "Campus to Corporate Program",
    tagline: "Career Acceleration & 100% Placement Bootcamp",
    description:
      "Bridge the critical gap between academic college degrees and corporate hiring standards with quantitative aptitude, GD/PI simulations, and ATS resume branding.",
    duration: "10 Weeks (Bootcamp)",
    mode: "Campus Workshops & Virtual Sessions",
  },
  {
    id: "corporate-communication",
    title: "Corporate Communication",
    tagline: "Executive Leadership & Boardroom Communication",
    description:
      "Elevate verbal and written communication with boardroom presentations, executive proposal writing, high-stakes negotiation, and international client fluency.",
    duration: "6 Weeks (Executive Format)",
    mode: "Live Virtual Executive Cohorts",
  },
];

type FlowStep =
  | "CHOOSE_COURSE"
  | "CONFIRM_INTEREST"
  | "ENTER_NAME"
  | "ENTER_PHONE"
  | "ENTER_EMAIL"
  | "FINISHED";

function renderFormattedMessage(text: string, isBot = true) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-black ${isBot ? "text-slate-900" : "text-white"}`}
        >
          {content}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ShiyaChatbot() {
  const pathname = usePathname();

  // Hide inside admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <ShiyaChatbotInner />;
}

function ShiyaChatbotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [flowStep, setFlowStep] = useState<FlowStep>("CHOOSE_COURSE");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [leadData, setLeadData] = useState<{ name: string; phone: string; email: string }>({
    name: "",
    phone: "",
    email: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronous refs to prevent race conditions or stale closure state
  const messagesRef = useRef<ChatMessage[]>([]);
  const flowStepRef = useRef<FlowStep>("CHOOSE_COURSE");
  const selectedCourseRef = useRef<string>("");
  const leadDataRef = useRef<{ name: string; phone: string; email: string }>({
    name: "",
    phone: "",
    email: "",
  });
  const sessionIdRef = useRef<string>("");

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Save/sync conversation to database
  const syncToDatabase = async (
    currentMessages: ChatMessage[],
    step: FlowStep,
    course: string,
    lead: { name: string; phone: string; email: string },
    interestedVal: "yes" | "no" | "pending"
  ) => {
    try {
      const activeSid = sessionIdRef.current;
      if (!activeSid) return;

      await fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSid,
          name: lead.name || null,
          phone: lead.phone || null,
          email: lead.email || null,
          courseName: course || null,
          interested: interestedVal,
          conversation: currentMessages.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp,
          })),
        }),
      });
    } catch (err) {
      console.error("[SHIYA Chatbot Sync Error]:", err);
    }
  };

  const startFreshConversation = () => {
    const newSid = "shiya_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
    setSessionId(newSid);
    sessionIdRef.current = newSid;

    const courseOptions = COURSES.map((c) => ({
      label: c.title,
      value: c.title,
    }));

    const initialMessages: ChatMessage[] = [
      {
        id: "msg_1",
        sender: "bot",
        text: "Hello! 👋 I'm SHIYA, your personal academic advisor at Blickwinkle.",
        timestamp: formatTime(),
      },
      {
        id: "msg_2",
        sender: "bot",
        text: "What course are you looking for today? Please select an option below to learn more:",
        timestamp: formatTime(),
        options: courseOptions,
      },
    ];

    messagesRef.current = initialMessages;
    setMessages(initialMessages);

    flowStepRef.current = "CHOOSE_COURSE";
    setFlowStep("CHOOSE_COURSE");

    selectedCourseRef.current = "";
    setSelectedCourse("");

    const resetLead = { name: "", phone: "", email: "" };
    leadDataRef.current = resetLead;
    setLeadData(resetLead);

    setInputValue("");
    setIsTyping(false);
  };

  // Initialize Session ID & initial welcome message
  useEffect(() => {
    startFreshConversation();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input automatically whenever text input becomes active
  useEffect(() => {
    if (
      isOpen &&
      (flowStep === "ENTER_NAME" ||
        flowStep === "ENTER_PHONE" ||
        flowStep === "ENTER_EMAIL")
    ) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [flowStep, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // ── Step 1: User chooses a course ─────────────────────────────
  const handleSelectCourse = (courseTitle: string) => {
    const course = COURSES.find((c) => c.title === courseTitle);
    if (!course) return;

    selectedCourseRef.current = courseTitle;
    setSelectedCourse(courseTitle);

    // 1. Add user choice message
    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: courseTitle,
      timestamp: formatTime(),
    };

    const updatedWithUser = [...messagesRef.current, userMsg];
    messagesRef.current = updatedWithUser;
    setMessages(updatedWithUser);
    setIsTyping(true);

    // 2. Bot replies with 2-3 line summary + asks Yes/No
    setTimeout(() => {
      setIsTyping(false);

      const botDetailMsg: ChatMessage = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: `Here are the details for **${course.title}**:\n\n${course.description}`,
        timestamp: formatTime(),
      };

      const botConfirmMsg: ChatMessage = {
        id: "bot_confirm_" + Date.now(),
        sender: "bot",
        text: `Are you interested in ${course.title}?`,
        timestamp: formatTime(),
        options: [
          { label: "Yes, I'm interested! 👍", value: "yes", color: "bg-emerald-600 hover:bg-emerald-700" },
          { label: "No, not right now 👎", value: "no", color: "bg-slate-500 hover:bg-slate-600" },
        ],
      };

      const newHistory = [...messagesRef.current, botDetailMsg, botConfirmMsg];
      messagesRef.current = newHistory;
      setMessages(newHistory);
      flowStepRef.current = "CONFIRM_INTEREST";
      setFlowStep("CONFIRM_INTEREST");

      syncToDatabase(newHistory, "CONFIRM_INTEREST", courseTitle, leadDataRef.current, "pending");
    }, 600);
  };

  // ── Step 2: User answers Yes or No ────────────────────────────
  const handleConfirmInterest = (answer: string) => {
    if (answer === "no") {
      // User requested: "if clicked no means, clear everything and start from first."
      const userMsg: ChatMessage = {
        id: "usr_" + Date.now(),
        sender: "user",
        text: "No, not right now 👎",
        timestamp: formatTime(),
      };

      const updatedWithUser = [...messagesRef.current, userMsg];
      messagesRef.current = updatedWithUser;
      setMessages(updatedWithUser);
      setIsTyping(true);

      syncToDatabase(updatedWithUser, "CHOOSE_COURSE", selectedCourseRef.current, leadDataRef.current, "no");

      setTimeout(() => {
        setIsTyping(false);
        // Start from first with a fresh session
        startFreshConversation();
      }, 700);
      return;
    }

    // User clicked YES
    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: "Yes, I'm interested! 👍",
      timestamp: formatTime(),
    };

    const updatedWithUser = [...messagesRef.current, userMsg];
    messagesRef.current = updatedWithUser;
    setMessages(updatedWithUser);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: "Awesome choice! 🎉 To connect you with our academic counselor, what is your **full name**?",
        timestamp: formatTime(),
      };

      const newHistory = [...messagesRef.current, botMsg];
      messagesRef.current = newHistory;
      setMessages(newHistory);
      flowStepRef.current = "ENTER_NAME";
      setFlowStep("ENTER_NAME");

      syncToDatabase(newHistory, "ENTER_NAME", selectedCourseRef.current, leadDataRef.current, "yes");
    }, 600);
  };

  // ── Step 3, 4, 5: User submits text input (Name, Phone, Email) ──
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    const currentStep = flowStepRef.current;

    if (currentStep === "ENTER_NAME") {
      if (val.length < 2) return;
      const userMsg: ChatMessage = {
        id: "usr_" + Date.now(),
        sender: "user",
        text: val,
        timestamp: formatTime(),
      };

      const updatedLead = { ...leadDataRef.current, name: val };
      leadDataRef.current = updatedLead;
      setLeadData(updatedLead);

      const updatedMessages = [...messagesRef.current, userMsg];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: "bot_" + Date.now(),
          sender: "bot",
          text: `Nice to meet you, **${val}**! 😊\n\nWhat is your **Phone / WhatsApp number** so our counselor can assist you?`,
          timestamp: formatTime(),
        };

        const newHistory = [...messagesRef.current, botMsg];
        messagesRef.current = newHistory;
        setMessages(newHistory);
        flowStepRef.current = "ENTER_PHONE";
        setFlowStep("ENTER_PHONE");
        syncToDatabase(newHistory, "ENTER_PHONE", selectedCourseRef.current, updatedLead, "yes");
      }, 600);
    } else if (currentStep === "ENTER_PHONE") {
      if (val.length < 7) return;
      const userMsg: ChatMessage = {
        id: "usr_" + Date.now(),
        sender: "user",
        text: val,
        timestamp: formatTime(),
      };

      const updatedLead = { ...leadDataRef.current, phone: val };
      leadDataRef.current = updatedLead;
      setLeadData(updatedLead);

      const updatedMessages = [...messagesRef.current, userMsg];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: "bot_" + Date.now(),
          sender: "bot",
          text: `Thanks! And what is your **Email address** so we can send the complete course brochure & syllabus?`,
          timestamp: formatTime(),
        };

        const newHistory = [...messagesRef.current, botMsg];
        messagesRef.current = newHistory;
        setMessages(newHistory);
        flowStepRef.current = "ENTER_EMAIL";
        setFlowStep("ENTER_EMAIL");
        syncToDatabase(newHistory, "ENTER_EMAIL", selectedCourseRef.current, updatedLead, "yes");
      }, 600);
    } else if (currentStep === "ENTER_EMAIL") {
      if (!val.includes("@") || !val.includes(".")) return;
      const userMsg: ChatMessage = {
        id: "usr_" + Date.now(),
        sender: "user",
        text: val,
        timestamp: formatTime(),
      };

      const updatedLead = { ...leadDataRef.current, email: val };
      leadDataRef.current = updatedLead;
      setLeadData(updatedLead);

      const updatedMessages = [...messagesRef.current, userMsg];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: "bot_" + Date.now(),
          sender: "bot",
          text: `Thank you, **${updatedLead.name}**! 🎉\n\nWe have recorded your inquiry for **${selectedCourseRef.current}**.\n\nOur course director will call or WhatsApp you within **2 business hours** with the complete syllabus, batch schedules, and exclusive discount options.\n\nFeel free to explore our website in the meantime!`,
          timestamp: formatTime(),
        };

        const newHistory = [...messagesRef.current, botMsg];
        messagesRef.current = newHistory;
        setMessages(newHistory);
        flowStepRef.current = "FINISHED";
        setFlowStep("FINISHED");
        syncToDatabase(newHistory, "FINISHED", selectedCourseRef.current, updatedLead, "yes");
      }, 700);
    }
  };

  // Determine placeholder & disabled state of the input bar
  const isInputDisabled =
    flowStep === "CHOOSE_COURSE" ||
    flowStep === "CONFIRM_INTEREST" ||
    flowStep === "FINISHED";

  let inputPlaceholder = "Type a message...";
  if (flowStep === "CHOOSE_COURSE") {
    inputPlaceholder = "Please select a course from the options above 👆";
  } else if (flowStep === "CONFIRM_INTEREST") {
    inputPlaceholder = "Please choose Yes or No above 👆";
  } else if (flowStep === "ENTER_NAME") {
    inputPlaceholder = "Enter your full name...";
  } else if (flowStep === "ENTER_PHONE") {
    inputPlaceholder = "Enter your Phone / WhatsApp number...";
  } else if (flowStep === "ENTER_EMAIL") {
    inputPlaceholder = "Enter your email address (e.g. name@gmail.com)...";
  } else if (flowStep === "FINISHED") {
    inputPlaceholder = "Inquiry completed. Thank you! ✨";
  }

  return (
    <>
      {/* ── 1. Floating Chatbot Trigger Button (Bottom Right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Tooltip callout when closed */}
        {!isOpen && (
          <div
            onClick={handleOpen}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-200/90 cursor-pointer hover:scale-105 transition-all animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0071BC]" />
            <span>Need course advice? Ask <strong>SHIYA</strong></span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        <button
          onClick={isOpen ? handleClose : handleOpen}
          aria-label={isOpen ? "Close SHIYA Chatbot" : "Open SHIYA Chatbot"}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0071BC] via-[#005f9e] to-[#39B54A] p-0.5 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group flex items-center justify-center"
        >
          {/* Inner ring */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1.5 relative">
            <Image
              src="/shiya.png"
              alt="SHIYA AI Academic Advisor"
              width={54}
              height={54}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          {/* Online green indicator dot */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </span>

          {/* Badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              1
            </span>
          )}
        </button>
      </div>

      {/* ── 2. Chatbot Dialog Window ───────────────────────── */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-24 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-auto sm:w-[420px] max-w-full h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-sm">
                <Image
                  src="/shiya.png"
                  alt="SHIYA"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-sm tracking-tight">SHIYA</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#39B54A]/20 text-[#86efac] text-[10px] font-bold">
                    Advisor
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Blickwinkle Academic Bot</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={startFreshConversation}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Restart conversation from first"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}
                >
                  {isBot && (
                    <div className="relative w-7 h-7 rounded-xl bg-white p-0.5 border border-slate-200 shrink-0 shadow-xs overflow-hidden mt-0.5">
                      <Image src="/shiya.png" alt="SHIYA" fill sizes="28px" className="object-contain" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isBot
                          ? "bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm whitespace-pre-line"
                          : "bg-gradient-to-r from-[#0071BC] to-[#005f9e] text-white rounded-br-sm font-medium"
                      }`}
                    >
                      {renderFormattedMessage(msg.text, isBot)}
                    </div>

                    {/* Options (Buttons) */}
                    {isBot && msg.options && msg.options.length > 0 && (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              if (flowStep === "CHOOSE_COURSE") {
                                handleSelectCourse(opt.value);
                              } else if (flowStep === "CONFIRM_INTEREST") {
                                handleConfirmInterest(opt.value);
                              }
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border ${
                              opt.color
                                ? `${opt.color} text-white border-transparent`
                                : "bg-white hover:bg-blue-50/80 text-slate-800 hover:text-[#0071BC] border-slate-200 hover:border-[#0071BC]/40"
                            }`}
                          >
                            <span className="flex items-center justify-between">
                              <span>{opt.label}</span>
                              <span className="text-[11px] opacity-70">&rarr;</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <span
                      className={`text-[9px] block text-slate-400 ${
                        isBot ? "text-left pl-1" : "text-right pr-1"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="relative w-7 h-7 rounded-xl bg-white p-0.5 border border-slate-200 shrink-0 shadow-xs overflow-hidden mt-0.5">
                  <Image src="/shiya.png" alt="SHIYA" fill sizes="28px" className="object-contain" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071BC] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#39B54A] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0071BC] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            {/* Finished state prompt */}
            {flowStep === "FINISHED" && (
              <div className="pt-2 text-center">
                <button
                  onClick={startFreshConversation}
                  className="px-4 py-2 rounded-full bg-[#0071BC]/10 text-[#0071BC] hover:bg-[#0071BC]/20 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-[#0071BC]/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ask about another course</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleTextSubmit} className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                disabled={isInputDisabled}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className={`w-full py-2.5 pl-3.5 pr-10 rounded-2xl text-xs sm:text-sm border transition-all ${
                  isInputDisabled
                    ? "bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed italic"
                    : "bg-white text-slate-800 border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0071BC]/40 focus:border-[#0071BC]"
                }`}
              />

              <button
                type="submit"
                disabled={isInputDisabled || !inputValue.trim()}
                aria-label="Send message"
                className={`absolute right-1.5 p-2 rounded-xl transition-all ${
                  isInputDisabled || !inputValue.trim()
                    ? "text-slate-300 cursor-not-allowed"
                    : "bg-[#0071BC] text-white hover:bg-[#005f9e] shadow-sm cursor-pointer"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
              Powered by Blickwinkle AI &bull; Admissions &amp; Courses
            </p>
          </div>
        </div>
      )}
    </>
  );
}
