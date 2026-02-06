import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, CreditCard, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from "lucide-react";

const Login = () => {
    const portals = [
        {
            title: "Owner Portal",
            description: "Manage your spaza shop, inventory, and sales.",
            icon: Store,
            link: "/owner/login",
            color: "text-blue-500",
        },
        {
            title: "Cashier Portal",
            description: "Process sales and handle customer transactions.",
            icon: CreditCard,
            link: "/cashier/login",
            color: "text-green-500",
        },
        {
            title: "Customer Portal",
            description: "Shop for products and track your orders.",
            icon: ShoppingBag,
            link: "/customer/login",
            color: "text-purple-500",
        },
        {
            title: "Driver Portal",
            description: "View and deliver assigned orders.",
            icon: Truck,
            link: "/driver/login",
            color: "text-orange-500",
        },
        {
            title: "Admin Portal",
            description: "System administration and monitoring.",
            icon: ShieldCheck,
            link: "/admin/login",
            color: "text-red-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="z-10 w-full max-w-5xl">
                <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Select Your Portal</h1>
                    <p className="text-lg text-muted-foreground">Choose the appropriate portal to log in to your account.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portals.map((portal, index) => (
                        <motion.div
                            key={portal.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Link to={portal.link}>
                                <div className="group h-full bg-card hover:bg-accent/5 transition-all duration-300 border border-border/50 hover:border-foreground/20 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md">
                                    <div className={`p-4 rounded-full bg-background mb-4 group-hover:scale-110 transition-transform duration-300 ${portal.color} bg-opacity-10`}>
                                        <portal.icon className={`h-8 w-8 ${portal.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{portal.title}</h3>
                                    <p className="text-muted-foreground text-sm">{portal.description}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
