import { Shield } from "lucide-react";
import logo from "@/assets/smitetrade-logo.jpeg";

const FooterSection = () => {
  return (
    <footer className="py-16 px-4 border-t border-border/50 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald/5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="SMITETRADE" className="w-12 h-12 rounded-lg object-contain" />
          <Shield size={20} className="text-accent" />
        </div>

        <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
          Your business is your intellectual property. We protect it with the SMITETRADE Shield.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-8">
          <span>Founder: <span className="text-foreground font-medium">Clifford Nkanyani</span></span>
          <span className="hidden sm:inline text-border">|</span>
          <span>Lead Developer: <span className="text-foreground font-medium">Lufuno Mphela</span></span>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Built for the future of South African commerce. © 2026 All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
