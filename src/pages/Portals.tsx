import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Store, User, Truck, Briefcase, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const portals = [
    {
        name: "Customer",
        description: "Shop for products, track orders, and manage your account.",
        icon: User,
        link: "/customer/login",
        color: "text-blue-500",
        btnColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
        name: "Owner",
        description: "Manage your shop, inventory, staff, and analytics.",
        icon: Store,
        link: "/owner/login",
        color: "text-emerald-500",
        btnColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
        name: "Cashier",
        description: "Process sales, manage shifts, and handle checkout.",
        icon: ShoppingBag,
        link: "/cashier/login",
        color: "text-orange-500",
        btnColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
        name: "Driver",
        description: "View delivery routes, update order status, and track earnings.",
        icon: Truck,
        link: "/driver/login",
        color: "text-indigo-500",
        btnColor: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
        name: "Lender",
        description: "Manage loan applications, clients, and repayments.",
        icon: Briefcase,
        link: "/lender/login",
        color: "text-purple-500",
        btnColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
        name: "Admin",
        description: "System administration, user management, and dispute resolution.",
        icon: ShieldCheck,
        link: "/admin/login",
        color: "text-red-500",
        btnColor: "bg-red-600 hover:bg-red-700"
    }
];

const Portals = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pb-20 pt-32 text-foreground">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center space-y-8">
                <div className="text-center space-y-4 max-w-3xl">
                    <Link to="/">
                        <Button variant="ghost" className="absolute left-4 top-4 md:left-8 md:top-8 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-sm font-medium backdrop-blur-sm mx-auto"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-foreground mr-2" />
                        Access Your Workspace
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
                    >
                        Select Your <span className="underline decoration-4 decoration-foreground/30 underline-offset-8">Portal</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="max-w-[800px] text-lg text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed mx-auto"
                    >
                        Secure access for customers, owners, staff, and partners.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl pt-8">
                    {portals.map((portal, index) => (
                        <motion.div
                            key={portal.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border border-foreground/10 bg-background/50 backdrop-blur-sm group hover:border-foreground/50">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-foreground/5 mb-4 group-hover:scale-110 transition-transform duration-300 ${portal.color}`}>
                                        <portal.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl">{portal.name}</CardTitle>
                                    <CardDescription className="text-base mt-2 text-muted-foreground">
                                        {portal.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-6">
                                    <Link to={portal.link} className="w-full">
                                        <Button className={`w-full rounded-full h-12 text-base font-medium transition-all duration-300 ${portal.btnColor} hover:opacity-90 hover:scale-[1.02]`}>
                                            Access Portal
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Portals;
