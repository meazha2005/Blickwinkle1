import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career & Certification Courses | Blickwinkle EduTech",
  description:
    "Accelerate your career with Blickwinkle's certified training programs: Digital Marketing, IELTS, PTE, Campus to Corporate Program, Corporate Communication, and Medical Coding (CPC®). Download brochures and enroll today.",
  openGraph: {
    title: "Career & Certification Courses | Blickwinkle EduTech",
    description: "Industry-accredited programs in IELTS, PTE, Campus to Corporate, Medical Coding & Digital Marketing.",
    url: "https://blickwinkle.com/courses",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
