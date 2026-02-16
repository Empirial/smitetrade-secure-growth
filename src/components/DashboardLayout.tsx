import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, User, Scan, CreditCard, LogOut, Menu, Truck, ShieldCheck, Box, Users, Settings, BarChart3, Package, Banknote, FileText, Bell, AlertTriangle, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PageTransition from "@/components/PageTransition";
import { useStore } from "@/context/StoreContext";
import logo from "@/assets/smitetrade-logo.jpeg";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "owner" | "cashier" | "customer" | "driver" | "admin" | "lender";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useStore();

    const ownerLinks = {
        Overview: [
            { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/owner/profile", label: "Profile", icon: User },
            { href: "/owner/alerts", label: "Alerts", icon: Bell },
        ],
        Operations: [
            { href: "/owner/pos", label: "POS System", icon: ShoppingCart },
            { href: "/owner/orders", label: "Orders", icon: Box },
            { href: "/owner/inventory", label: "Inventory", icon: Package },
            { href: "/owner/suppliers", label: "Suppliers", icon: Truck },
            { href: "/owner/lending", label: "Lending (P2P)", icon: Banknote },
        ],
        Management: [
            { href: "/owner/staff", label: "Staff", icon: Users },
            { href: "/owner/reports", label: "Reports", icon: BarChart3 },
            { href: "/owner/pricing", label: "Pricing", icon: CreditCard },
            { href: "/owner/settings", label: "Settings", icon: Settings },
        ]
    };

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
        { href: "/customer/orders", label: "My Orders", icon: Box },
        { href: "/customer/wishlist", label: "Wishlist", icon: Heart },
        { href: "/customer/tracking", label: "Tracking", icon: Truck },
        { href: "/customer/cart", label: "My Cart", icon: ShoppingCart },
        { href: "/customer/apply-credit", label: "Get a Loan", icon: Banknote },
        { href: "/customer/credit-review", label: "Credit Score", icon: ShieldCheck },
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

    const lenderLinks = [
        { href: "/lender/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/lender/clients", label: "My Clients", icon: Users },
        { href: "/lender/loans", label: "Active Loans", icon: Banknote },
        { href: "/lender/applications", label: "Applications", icon: FileText },
        { href: "/lender/collections", label: "Collections", icon: AlertTriangle }, // Changed icon
        { href: "/lender/credit-check", label: "Credit Check", icon: Search },
        { href: "/lender/profile", label: "Profile", icon: User },
    ];

    let links: any[] = [];
    if (role === "cashier") links = cashierLinks;
    if (role === "customer") links = customerLinks;
    if (role === "driver") links = driverLinks;
    if (role === "admin") links = adminLinks;
    if (role === "lender") links = lenderLinks;

    const NavContent = () => (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground p-4">
            <div className="mb-8 p-2">
                <Link to="/">
                    <img src={logo} alt="SMITETRADE" className="max-w-[150px] h-auto mx-auto md:mx-0" />
                </Link>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{role} Portal</p>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
                {role === 'owner' ? (
                    Object.entries(ownerLinks).map(([category, items]) => (
                        <div key={category} className="mb-4">
                            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">{category}</h3>
                            {items.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${location.pathname === link.href
                                            ? "bg-emerald-50 text-emerald-600 font-medium shadow-sm"
                                            : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <link.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${location.pathname === link.href ? "text-emerald-600" : ""
                                            }`} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    // Flat List for Others
                    <div className="space-y-1">
                        {(role === 'cashier' ? cashierLinks :
                            role === 'admin' ? adminLinks :
                                role === 'driver' ? driverLinks :
                                    role === 'lender' ? lenderLinks :
                                        customerLinks).map((link) => (
                                            <Link
                                                key={link.href}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${location.pathname === link.href
                                                    ? "bg-emerald-50 text-emerald-600 font-medium shadow-sm"
                                                    : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
                                                    }`}
                                            >
                                                <link.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${location.pathname === link.href ? "text-emerald-600" : ""
                                                    }`} />
                                                {link.label}
                                            </Link>
                                        ))}
                    </div>
                )}
            </nav >

            <div className="px-4 mt-auto pt-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                        logout();
                        setIsOpen(false);
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div >
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 z-20">
                <NavContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-30 flex items-center px-4 justify-between">
                <img src={logo} alt="SMITETRADE" className="h-10 w-auto" />
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
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
