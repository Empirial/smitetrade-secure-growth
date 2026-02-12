import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, User, Store, Truck, ShoppingBag, ShieldCheck, Briefcase } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "SpazaScore", href: "#spazascore" },
    { name: "Features", href: "#features" },
    { name: "Network", href: "#network" },
];

const StickyNav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="text-xl font-bold font-[Orbitron] cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        SMITETRADE
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" className="hidden md:flex rounded-full px-6 gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Select Portal</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link to="/customer/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Customer</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/owner/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Store className="mr-2 h-4 w-4" />
                                        <span>Owner</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/cashier/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        <span>Cashier</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/driver/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Truck className="mr-2 h-4 w-4" />
                                        <span>Driver</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/lender/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        <span>Lender</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <Link to="/admin/login">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        <span>Admin</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                            className="md:hidden text-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[60px] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-40 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6 items-center">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.href)}
                                    className="text-lg font-medium text-foreground"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="w-full grid grid-cols-2 gap-3">
                                <Link to="/customer/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <User className="mr-2 h-4 w-4" />
                                        Customer
                                    </Button>
                                </Link>
                                <Link to="/owner/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Store className="mr-2 h-4 w-4" />
                                        Owner
                                    </Button>
                                </Link>
                                <Link to="/cashier/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Cashier
                                    </Button>
                                </Link>
                                <Link to="/driver/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Truck className="mr-2 h-4 w-4" />
                                        Driver
                                    </Button>
                                </Link>
                                <Link to="/lender/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Lender
                                    </Button>
                                </Link>
                                <Link to="/admin/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Admin
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StickyNav;
