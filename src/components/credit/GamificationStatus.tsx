import { motion } from 'framer-motion';
import { Trophy, Medal, Award, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GamificationStatusProps {
    tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Default';
    score: number;
}

const GamificationStatus = ({ tier, score }: GamificationStatusProps) => {
    const getTierDetails = () => {
        switch (tier) {
            case 'Platinum':
                return { icon: Trophy, color: 'text-indigo-500', bg: 'bg-indigo-500', label: 'Platinum Status' };
            case 'Gold':
                return { icon: Medal, color: 'text-amber-400', bg: 'bg-amber-400', label: 'Gold Status' };
            case 'Silver':
                return { icon: Award, color: 'text-slate-400', bg: 'bg-slate-400', label: 'Silver Status' };
            case 'Bronze':
                return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-600', label: 'Bronze Status' };
            default:
                return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-600', label: 'Default' };
        }
    };

    const details = getTierDetails();
    const Icon = details.icon;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold font-[Orbitron]">{details.label}</h3>
                    <p className="text-sm text-muted-foreground">
                        Your reliability index is <span className="font-bold text-foreground">{score.toFixed(1)}%</span>
                    </p>
                </div>
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    className={`p-4 rounded-full bg-white shadow-lg border-2 ${details.color.replace('text', 'border')}`}
                >
                    <Icon className={`h-8 w-8 ${details.color}`} />
                </motion.div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Performance</span>
                    <span>Target: 0-3%</span>
                </div>
                {/* Visualizing "Lower is Better" on a progress bar is tricky. 
                    We invert it: 100 - score (clamped) for display purposes if score < 100 */}
                <Progress value={Math.max(0, 100 - Math.min(score, 100))} className={`h-3 ${details.bg}`} />
                <p className="text-xs text-right text-muted-foreground pt-1">
                    {tier === 'Gold' ? 'Maintain early payments to keep Gold!' : 'Pay earlier next month to level up!'}
                </p>
            </div>
        </div>
    );
};

export default GamificationStatus;
