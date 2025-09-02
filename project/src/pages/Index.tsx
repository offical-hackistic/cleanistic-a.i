import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { Footer } from "@/components/Footer";
import { StarBackground } from "@/components/StarBackground";

const Index = () => {
  return (
    <main className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
