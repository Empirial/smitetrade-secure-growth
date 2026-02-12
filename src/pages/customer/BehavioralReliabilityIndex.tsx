import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Calendar } from "lucide-react";
import { useCredit } from "@/context/CreditContext";
import GamificationStatus from "@/components/credit/GamificationStatus";
import BRIChart from "@/components/credit/BRIChart";
import { useState } from "react";
import { format } from "date-fns";

const BehavioralReliabilityIndex = () => {
    const { profile, simulatePayment, isLoading } = useCredit();
    const [payAmount, setPayAmount] = useState("");
    const [simDate, setSimDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const handlePay = async () => {
        if (!payAmount) return;
        await simulatePayment(Number(payAmount), new Date(simDate));
        setPayAmount("");
    };

    if (isLoading || !profile) {
        return (
            <DashboardLayout role="customer">
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-pulse text-muted-foreground">Loading Financial Profile...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                        Financial Passport
                    </h1>
                    <p className="text-muted-foreground">Your Behavioral Reliability Index (BRI) unlocks future purchasing power.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Gamification Card */}
                    <Card className="border-t-4 border-t-indigo-500 shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
                        <CardHeader>
                            <CardTitle>SpazaScore Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GamificationStatus tier={profile.tier} score={profile.briScore} />
                        </CardContent>
                    </Card>

                    {/* Credit Limit & Balance */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold font-[Orbitron]">R {(profile.creditLimit - profile.balance).toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Limit: R {profile.creditLimit.toFixed(2)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-100">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <CardTitle className="text-sm font-medium text-red-800">Outstanding Balance</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-700">R {profile.balance.toFixed(2)}</div>
                                <p className="text-xs text-red-600 mt-1 font-medium">Due by: {format(new Date(profile.dueDate), "MMM do, yyyy")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Historical Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reliability History</CardTitle>
                        <CardDescription>Track your BRI improvement over time. Goal: Keep it low (0-3%).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BRIChart />
                    </CardContent>
                </Card>

                {/* Educational Content */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 bg-emerald-50 border-emerald-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-emerald-800">1. Reliability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-emerald-700">
                                Measures how often you pay on time. Calculate: <span className="font-mono bg-white px-1 rounded">Missed Payments / Total Cycles</span>. Lower is better!
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1 bg-blue-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-800">2. Frequency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-700">
                                Rewards regular engagement. Making at least 2 purchases a week boosts your score and unlocks higher tiers.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1 bg-purple-50 border-purple-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-purple-800">3. Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-purple-700">
                                Higher monthly spend demonstrates capacity. Growing your basket size helps increase your credit limit.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Simulation (For Demo) */}
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Simulate Payment
                        </CardTitle>
                        <CardDescription>
                            Test how paying on different dates affects your score.
                            <br />
                            <span className="font-medium text-emerald-600">Try setting date to the 1st (Gold) vs 15th (Silver).</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-2 flex-1">
                            <label className="text-xs font-medium">Simulation Date</label>
                            <Input
                                type="date"
                                value={simDate}
                                onChange={(e) => setSimDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <label className="text-xs font-medium">Amount (R)</label>
                            <Input
                                placeholder="Amount"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                type="number"
                            />
                        </div>
                        <Button onClick={handlePay} className="self-end" disabled={!payAmount}>
                            Pay & Update Score
                        </Button>
                    </CardContent>
                </Card>

                {/* Compliance Footer */}
                <div className="text-xs text-muted-foreground text-center max-w-2xl mx-auto space-y-1 pt-8 border-t">
                    <p className="font-semibold">Smitetrade provides scoring and risk-assessment insights for decision-support purposes only.</p>
                    <p>The platform does not provide credit, approve or decline loans, extend goods on credit, or make tenancy decisions.</p>
                    <p>All lending, goods-on-credit, and rental decisions remain the sole responsibility of the lender, spaza shop owner, or landlord.</p>
                    <p>Smitetrade does not act as a credit provider, financial adviser, or credit bureau.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BehavioralReliabilityIndex;
