import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/smitetrade-logo.jpeg";

interface ComingSoonProps {
  portal?: string;
}

const ComingSoon = ({ portal }: ComingSoonProps) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Emerald glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={logo}
            alt="SmiteTrade"
            className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-emerald-500/20 border border-emerald-500/20"
          />
        </motion.div>

        {/* Lock icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center w-20 h-20 rounded-full border border-emerald-500/30 bg-emerald-500/10"
        >
          <Lock className="w-9 h-9 text-emerald-400" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-3"
        >
          {portal && (
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
              {portal} Portal
            </p>
          )}
          <h1 className="text-5xl font-extrabold tracking-tight">
            Coming <span className="text-emerald-400">Soon</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This portal is under development. We'll notify you when it launches.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-24 h-px bg-emerald-500/40"
        />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Link to="/portals">
            <Button
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 rounded-full px-6 h-11"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portals
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
