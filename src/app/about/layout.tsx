import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Blickwinkle Digital Innovation & EduTech",
  description:
    "Discover Blickwinkle's journey, mission, and leadership. We bridge high-performance digital marketing, custom software engineering, and industry-accredited career training for global brands and institutions.",
  openGraph: {
    title: "About Us | Blickwinkle Digital Innovation",
    description: "Discover our mission, team, and institutional partnerships.",
    url: "https://blickwinkle.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
