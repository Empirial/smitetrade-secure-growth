import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, User, Scan, CreditCard, LogOut, Menu, Truck, ShieldCheck, Box, Users, Settings, BarChart3, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "owner" | "cashier" | "customer" | "driver" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const ownerLinks = [
        { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/owner/pos", label: "POS System", icon: ShoppingCart },
        { href: "/owner/orders", label: "Orders", icon: Box },
        { href: "/owner/inventory", label: "Inventory", icon: Package },
        { href: "/owner/pricing", label: "Pricing", icon: CreditCard },
        { href: "/owner/suppliers", label: "Suppliers", icon: Truck },
        { href: "/owner/staff", label: "Staff", icon: Users },
        { href: "/owner/reports", label: "Reports", icon: BarChart3 },
        { href: "/owner/alerts", label: "Alerts", icon: ShieldCheck },
        { href: "/owner/settings", label: "Settings", icon: Settings },
        { href: "/owner/profile", label: "Profile", icon: User },
    ];

    const cashierLinks = [
        { href: "/cashier/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/cashier/pos", label: "POS System", icon: ShoppingCart },
        { href: "/cashier/scanner", label: "Scanner", icon: Scan },
        { href: "/cashier/shift", label: "Shift Mgmt", icon: User },
        { href: "/cashier/receipts", label: "Receipts", icon: Box },
        { href: "/cashier/credit-review", label: "Credit Review", icon: CreditCard },
    ];

    // Placeholder links for new roles - will populate as I implement them
    const customerLinks = [
        { href: "/customer/products", label: "Shop", icon: ShoppingCart },
        { href: "/customer/tracking", label: "Tracking", icon: Truck },
        { href: "/customer/cart", label: "My Cart", icon: ShoppingCart },
        { href: "/customer/credit-review", label: "Credit Score", icon: ShieldCheck },
        { href: "/customer/support", label: "Support", icon: Users },
        { href: "/customer/profile", label: "Profile", icon: User },
    ];

    const driverLinks = [
        { href: "/driver/orders", label: "My Orders", icon: Box },
        { href: "/driver/out-to-deliver", label: "Active Deliveries", icon: Truck },
        { href: "/driver/issues", label: "Report Issue", icon: ShieldCheck },
    ];

    const adminLinks = [
        { href: "/admin/applications", label: "Applications", icon: User },
        { href: "/admin/pos-monitor", label: "POS Monitor", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
        { href: "/admin/disputes", label: "Disputes", icon: ShieldCheck },
    ];


    let links = ownerLinks;
    if (role === "cashier") links = cashierLinks;
    if (role === "customer") links = customerLinks;
    if (role === "driver") links = driverLinks;
    if (role === "admin") links = adminLinks;

    const NavContent = () => (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground p-4">
            <div className="mb-8 p-2">
                <Link to="/">
                    <h1 className="text-xl font-bold tracking-wider font-[Orbitron] text-primary">SMITETRADE</h1>
                </Link>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{role} Portal</p>
            </div>
            <nav className="space-y-1 flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 border border-transparent ${isActive
                                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-sm">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="pt-4 border-t border-sidebar-border">
                <Link to="/">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent gap-2">
                        <LogOut size={18} />
                        Logout
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 z-20">
                <NavContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-30 flex items-center px-4 justify-between">
                <span className="font-bold text-primary font-[Orbitron]">SMITETRADE</span>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-border">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:pt-0 pt-16">
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
