import HeroSection from "@/components/HeroSection";
import SpazaScoreSection from "@/components/SpazaScoreSection";
import OperationalSection from "@/components/OperationalSection";
import DiscoveryMapSection from "@/components/DiscoveryMapSection";
import FooterSection from "@/components/FooterSection";
import StickyNav from "@/components/StickyNav";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-emerald-500/30">
      <StickyNav />
      <div id="hero"><HeroSection /></div>
      <StatsSection />
      <div id="about"><AboutSection /></div>
      <div id="bri-score"><SpazaScoreSection /></div>
      <div id="features"><OperationalSection /></div>
      <div id="pricing"><PricingSection /></div>
      <div id="faq"><FAQSection /></div>
      <div id="network"><DiscoveryMapSection /></div>
      <FooterSection />
    </div>
  );
};

export default Index;
