import { Lock } from "lucide-react";
import { ReactNode } from "react";

interface CreditComingSoonProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps any credit/loan-related section or page.
 * Content is visible but blurred and non-interactive.
 * Used until NCR registration is complete.
 */
const CreditComingSoon = ({ children, className = "" }: CreditComingSoonProps) => (
  <div className={`relative ${className}`}>
    {/* Content — visible but locked */}
    <div className="pointer-events-none select-none opacity-25 blur-[2px]">
      {children}
    </div>

    {/* Overlay */}
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-background/85 px-10 py-7 shadow-2xl backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <Lock className="h-5 w-5 text-emerald-400" />
        </div>
        <p className="text-base font-semibold text-foreground">Coming Soon</p>
        <p className="max-w-[200px] text-center text-xs text-muted-foreground">
          This feature will be available soon.
        </p>
      </div>
    </div>
  </div>
);

export default CreditComingSoon;
