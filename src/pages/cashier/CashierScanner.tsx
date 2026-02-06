import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CashierScanner = () => {
    return (
        <DashboardLayout role="cashier">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Product Scanner</h1>
                    <p className="text-muted-foreground">Align barcode within the frame</p>
                </div>

                <div className="relative aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-slate-900/10">
                    {/* Simulated Camera Feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/50 animate-pulse text-sm">Camera Feed Active</div>
                    </div>

                    {/* Scanner Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="w-full aspect-square border-2 border-emerald-500/80 rounded-lg relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-500 -mt-0.5 -ml-0.5" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-500 -mt-0.5 -mr-0.5" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-500 -mb-0.5 -ml-0.5" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-500 -mb-0.5 -mr-0.5" />

                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/80 w-full animate-scancode" />
                        </div>
                        <p className="text-white text-sm mt-4 font-mono bg-black/50 px-2 py-1 rounded">Scanning...</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Manual Entry</label>
                            <div className="flex gap-2">
                                <Input placeholder="Enter barcode number" />
                                <Button size="icon"><Search size={18} /></Button>
                            </div>
                        </div>

                        <Link to="/cashier/pos">
                            <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                                Go to POS <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <style>{`
        @keyframes scancode {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scancode {
          animation: scancode 2s infinite linear;
        }
      `}</style>
        </DashboardLayout>
    );
};

export default CashierScanner;
