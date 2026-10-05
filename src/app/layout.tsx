import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blickwinkle | Digital Marketing, Web Development & EduTech",
  description:
    "Blickwinkle is your full-stack digital partner. From strategic digital marketing and social media management to custom software, web development, automation, and EduTech courses — we build and grow your complete digital presence.",
  keywords: [
    "digital marketing",
    "social media management",
    "web development",
    "software development",
    "automation",
    "edutech courses",
    "online courses",
    "Blickwinkle",
  ],
  openGraph: {
    title: "Blickwinkle | Digital Innovation",
    description: "Your full-stack digital growth partner.",
    url: "https://blickwinkle.com",
    siteName: "Blickwinkle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blickwinkle | Digital Innovation",
    description: "Your full-stack digital growth partner.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-[#0071BC]/20 selection:text-[#0071BC]">
        {children}
      </body>
    </html>
  );
}
