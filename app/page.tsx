import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import WhyChooseSection from "./components/landing/WhyChooseSection";
import IntegrationsSection from "./components/landing/IntegrationsSection";
import HowItWorksSection from "./components/landing/HowItWorksSection";
import StatsSection from "./components/landing/StatsSection";
import MoreFeaturesSection from "./components/landing/MoreFeaturesSection";
import CTASection from "./components/landing/CTASection";
import Pricing from "./pricing/page";
import FAQSection from "./components/landing/FAQSection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#0D0D0D] relative overflow-hidden font-sans">
      {/* Soft Warm Radial Gradient Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[1000px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at top, #F3E9CC 0%, #F8F6F1 50%, #F8F6F1 100%)",
        }}
      />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <WhyChooseSection />
        <IntegrationsSection />
        <HowItWorksSection />
        <StatsSection />
        <MoreFeaturesSection />
        <Pricing />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
