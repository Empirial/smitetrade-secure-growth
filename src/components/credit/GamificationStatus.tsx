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
                </div>
                <div className={`p-4 rounded-full bg-white shadow-lg border-2 ${details.color.replace('text', 'border')}`}>
                    <Icon className={`h-8 w-8 ${details.color}`} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Performance Category</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                    {tier === 'Gold' ? 'Maintain early payments to keep Gold!' : 'Pay earlier next month to level up!'}
                </p>
            </div>
        </div>
    );
};

export default GamificationStatus;
