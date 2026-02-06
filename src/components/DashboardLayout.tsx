import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, User, Scan, CreditCard, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "owner" | "cashier";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const ownerLinks = [
        { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/owner/pos", label: "POS System", icon: ShoppingCart },
        { href: "/owner/profile", label: "Profile", icon: User },
    ];

    const cashierLinks = [
        { href: "/cashier/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/cashier/pos", label: "POS System", icon: ShoppingCart },
        { href: "/cashier/scanner", label: "Scanner", icon: Scan },
        { href: "/cashier/credit-review", label: "Credit Review", icon: CreditCard },
    ];

    const links = role === "owner" ? ownerLinks : cashierLinks;

    const NavContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white p-4">
            <div className="mb-8 p-2">
                <h1 className="text-xl font-bold tracking-wider font-[Orbitron] text-emerald-400">SMITETRADE</h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{role} Portal</p>
            </div>
            <nav className="space-y-2 flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-emerald-600 text-white font-medium shadow-md shadow-emerald-900/20"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="pt-4 border-t border-slate-800">
                <Link to={role === "owner" ? "/owner/login" : "/cashier/login"}>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2">
                        <LogOut size={18} />
                        Logout
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 shadow-xl z-20">
                <NavContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-30 flex items-center px-4 justify-between shadow-md">
                <span className="font-bold text-emerald-400">SMITETRADE</span>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r-slate-800 bg-slate-900 border-none">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:pt-0 pt-16">
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
