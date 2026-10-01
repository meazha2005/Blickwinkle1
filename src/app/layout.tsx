import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Blickwinkle | Website Under Construction",
  description: "We are currently building something amazing. Blickwinkle is coming soon with an extraordinary new digital experience.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-[#0071BC]/20 selection:text-[#0071BC]">
        {children}
      </body>
    </html>
  );
}
