import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, CreditCard, ShoppingBag, Truck, ShieldCheck, ArrowLeft, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { UserRole } from "@/types";

const Login = () => {
    const { login } = useStore();
    const navigate = useNavigate();

    const handleLogin = (role: UserRole, path: string) => {
        // Navigate to the specific login page for the selected role
        navigate(path);
    };

    const handleSeed = async () => {
        const { seedDatabase } = await import('@/lib/seed');
        const success = await seedDatabase();
        if (success) {
            alert("Database seeded successfully!");
        } else {
            alert("Failed to seed database.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col p-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>

            <div className="max-w-4xl mx-auto w-full grid gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Select your Portal</h1>
                    <p className="text-muted-foreground">Who are you logging in as today?</p>
                    <Button variant="ghost" size="sm" onClick={handleSeed} className="mt-2 text-xs text-muted-foreground opacity-50 hover:opacity-100">
                        (Dev: Seed DB)
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Owner */}
                    <motion.div whileHover={{ y: -5 }} className="h-full">
                        <button
                            onClick={() => handleLogin('owner', '/owner/login')}
                            className="w-full text-left h-full"
                        >
                            <div className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                    <Store size={24} />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Store Owner</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Manage inventory, staff, sales reports, and settings.
                                </p>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Owner Login</Button>
                            </div>
                        </button>
                    </motion.div>

                    {/* Cashier */}
                    <motion.div whileHover={{ y: -5 }} className="h-full">
                        <button
                            onClick={() => handleLogin('cashier', '/cashier/login')}
                            className="w-full text-left h-full"
                        >
                            <div className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                    <CreditCard size={24} />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Cashier</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Process sales, scan items, and handle payments.
                                </p>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">Cashier Login</Button>
                            </div>
                        </button>
                    </motion.div>

                    {/* Customer */}
                    <motion.div whileHover={{ y: -5 }} className="h-full">
                        <button
                            onClick={() => handleLogin('customer', '/customer/login')}
                            className="w-full text-left h-full"
                        >
                            <div className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Customer</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Browse products, order delivery, and track packages.
                                </p>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">Customer Login</Button>
                            </div>
                        </button>
                    </motion.div>

                    {/* Driver */}
                    <motion.div whileHover={{ y: -5 }} className="h-full">
                        <button
                            onClick={() => handleLogin('driver', '/driver/login')}
                            className="w-full text-left h-full"
                        >
                            <div className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                                    <Truck size={24} />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Delivery Driver</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    View delivery requests, navigation, and earnings.
                                </p>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">Driver Login</Button>
                            </div>
                        </button>
                    </motion.div>

                    {/* Admin */}
                    <motion.div whileHover={{ y: -5 }} className="h-full">
                        <button
                            onClick={() => handleLogin('admin', '/admin/login')}
                            className="w-full text-left h-full"
                        >
                            <div className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Admin</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Approve shops, monitor system status, and user management.
                                </p>
                                <Button variant="outline" className="w-full">Admin Login</Button>
                            </div>
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
