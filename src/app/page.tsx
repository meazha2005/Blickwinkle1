import Header    from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer     from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
