import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Blickwinkle Digital Innovation & EduTech",
  description:
    "Get in touch with Blickwinkle for custom software engineering, digital marketing, AI automation, or career course admissions (IELTS, PTE, Campus to Corporate, Medical Coding).",
  openGraph: {
    title: "Contact Us | Blickwinkle Digital Innovation",
    description: "Connect with our strategy and admissions teams in Chennai, India.",
    url: "https://blickwinkle.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
