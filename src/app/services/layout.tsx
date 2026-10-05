import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Blickwinkle Digital Innovation",
  description:
    "Explore Blickwinkle's full suite of digital services: Strategic Marketing, Brand Architecture, Campaign Strategy, Digital Marketing, Internal HR Branding, Social Media, Content Creation, Web Development, Custom Software, AI Automation, Social Automation, and CRM Solutions.",
  openGraph: {
    title: "Our Services | Blickwinkle Digital Innovation",
    description: "Explore Blickwinkle's full-stack digital marketing and engineering services.",
    url: "https://blickwinkle.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
