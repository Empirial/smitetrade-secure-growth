import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Store, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 pb-20 pt-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-amber-500/10 blur-[100px] animate-bounce duration-[10s]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
          The Future of Townships
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl"
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sword & Shield</span> for Your Spaza's Future
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-[800px] text-lg text-slate-300 md:text-xl/relaxed lg:text-2xl/relaxed"
        >
          Empowering Owners, Cashiers, and Communities with secure growth, smart inventory, and seamless credit.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row min-w-[300px]"
        >
          <Link to="/owner/login">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25">
              <Store className="mr-2 h-5 w-5" /> Owner Portal
            </Button>
          </Link>
          <Link to="/cashier/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/50">
              Cashier Login
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-4xl pt-12 text-left"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:border-emerald-500/50">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
            <Shield className="h-10 w-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Secure Growth</h3>
            <p className="text-slate-400 mt-2">Bank-ready reports and verified credit profiling.</p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:border-blue-500/50">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
            <Zap className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Fast POS</h3>
            <p className="text-slate-400 mt-2">Lightning fast checkout with integrated scanner.</p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:border-amber-500/50">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />
            <Store className="h-10 w-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Local Connect</h3>
            <p className="text-slate-400 mt-2">Discovery map bringing customers to your door.</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-20" />
    </div>
  );
};

export default HeroSection;
