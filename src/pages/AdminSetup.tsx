/**
 * AdminSetup — One-time admin account creation page.
 * Accessible at /setup-admin only in development or first-run.
 * Once the admin is seeded, this page shows a success message and locks itself.
 */

import { useState } from "react";
import { seedAdminUser, seedLenderOffers } from "@/lib/seedAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const AdminSetup = () => {
    const [email, setEmail] = useState("admin@smitetrade.co.za");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("Smitetrade Admin");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [seedingOffers, setSeedingOffers] = useState(false);
    const [offersSeeded, setOffersSeeded] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password.length < 8) {
            setResult({ success: false, message: "Password must be at least 8 characters." });
            return;
        }
        setLoading(true);
        setResult(null);
        const res = await seedAdminUser(email, password, name);
        setResult(res);
        setLoading(false);
    };

    const handleSeedOffers = async () => {
        setSeedingOffers(true);
        await seedLenderOffers();
        setOffersSeeded(true);
        setSeedingOffers(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center mb-6">
                    <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-white">Smitetrade Admin Setup</h1>
                    <p className="text-gray-400 text-sm mt-1">Run this once to create the first admin account.</p>
                </div>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Create Admin Account</CardTitle>
                        <CardDescription className="text-gray-400">
                            This will create a Firebase Auth user and Firestore document with role: admin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-gray-300">Admin Name</Label>
                                <Input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Smitetrade Admin"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-gray-300">Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@smitetrade.co.za"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-gray-300">Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min 8 characters"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                />
                            </div>

                            {result && (
                                <div className={`flex items-start gap-2 p-3 rounded-md text-sm ${result.success ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
                                    {result.success
                                        ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                        : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    }
                                    {result.message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || result?.success}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create Admin Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {result?.success && (
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Seed Lender Offers</CardTitle>
                            <CardDescription className="text-gray-400">
                                Populate default lender offers in Firestore (safe to skip if already done).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleSeedOffers}
                                disabled={seedingOffers || offersSeeded}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {seedingOffers
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Seeding...</>
                                    : offersSeeded
                                    ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Offers Seeded</>
                                    : "Seed Lender Offers"
                                }
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {result?.success && (
                    <div className="text-center text-sm text-gray-500">
                        Admin created. Go to{" "}
                        <a href="/admin/login" className="text-green-400 hover:underline">/admin/login</a>
                        {" "}to sign in.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSetup;
