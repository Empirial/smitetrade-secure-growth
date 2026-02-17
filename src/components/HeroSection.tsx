import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Store, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pb-20 pt-32 text-foreground">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm font-medium backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-foreground mr-2" />
          The Future of Townships
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl"
        >
          The <span className="text-gradient-gold font-extrabold underline decoration-4 decoration-yellow-500/30 underline-offset-8">Sword & Shield</span> for Your Spaza's Future
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-[800px] text-lg text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed"
        >
          Empowering Owners, Cashiers, Drivers, and Communities with secure growth, smart inventory, and seamless credit.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row min-w-[300px] items-center justify-center"
        >
          <Link to="/customer/login">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-full">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/portals">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-foreground/20 hover:bg-foreground/5 rounded-full">
              View Portals
            </Button>
          </Link>
        </motion.div>

        {/* Minimal Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full max-w-4xl pt-16 text-left"
        >
          <div className="group border-t border-foreground/10 pt-6 transition-all hover:border-foreground/50">
            <Shield className="h-8 w-8 text-foreground mb-4" />
            <h3 className="text-lg font-bold">Secure Growth</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Bank-ready reports and verified credit profiling.</p>
          </div>

          <div className="group border-t border-foreground/10 pt-6 transition-all hover:border-foreground/50">
            <Zap className="h-8 w-8 text-foreground mb-4" />
            <h3 className="text-lg font-bold">Fast POS</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Lightning fast checkout with integrated scanner.</p>
          </div>

          <div className="group border-t border-foreground/10 pt-6 transition-all hover:border-foreground/50">
            <Store className="h-8 w-8 text-foreground mb-4" />
            <h3 className="text-lg font-bold">Local Connect</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Discovery map bringing customers to your door.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
