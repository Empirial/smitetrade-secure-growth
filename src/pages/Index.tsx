import HeroSection from "@/components/HeroSection";
import SpazaScoreSection from "@/components/SpazaScoreSection";
import OperationalSection from "@/components/OperationalSection";
import DiscoveryMapSection from "@/components/DiscoveryMapSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SpazaScoreSection />
      <OperationalSection />
      <DiscoveryMapSection />
      <FooterSection />
    </div>
  );
};

export default Index;
