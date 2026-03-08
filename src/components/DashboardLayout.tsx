import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, User, Scan, CreditCard, LogOut, Menu, Truck, ShieldCheck, Box, Users, Settings, BarChart3, Package, Banknote, FileText, Bell, AlertTriangle, Search, Heart, Wallet, Receipt, Tag, ClipboardList, Briefcase, ChevronDown, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PageTransition from "@/components/PageTransition";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useStore } from "@/context/StoreContext";
import logo from "@/assets/smitetrade-logo.jpeg";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "owner" | "cashier" | "customer" | "driver" | "admin" | "lender";
}

const getLinks = (role: string) => {
    const ownerLinks = {
        Overview: [
            { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/owner/customers", label: "Customers", icon: Users },
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
            { href: "/owner/expenses", label: "Expenses", icon: Receipt },
            { href: "/owner/staff", label: "Staff & Shifts", icon: Briefcase },
            { href: "/owner/reports", label: "Reports", icon: BarChart3 },
            { href: "/owner/pricing", label: "Pricing & Promos", icon: Tag },
            { href: "/owner/credit-review", label: "Credit Review", icon: ShieldCheck },
        ]
    };

    const cashierLinks = [
        { href: "/cashier/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/cashier/pos", label: "POS System", icon: ShoppingCart },
        { href: "/cashier/scanner", label: "Scanner", icon: Scan },
        { href: "/cashier/inventory", label: "Inventory", icon: Package },
        { href: "/cashier/shift", label: "Shift Mgmt", icon: User },
        { href: "/cashier/receipts", label: "Receipts", icon: Box },
        { href: "/cashier/credit-review", label: "Credit Review", icon: CreditCard },
    ];

    // Placeholder links for new roles - will populate as I implement them
    const customerLinks = [
        { href: "/customer/products", label: "Shop", icon: ShoppingCart },
        { href: "/customer/orders", label: "My Orders", icon: Box },
        { href: "/customer/tracking", label: "Tracking", icon: Truck },
        { href: "/customer/cart", label: "My Cart", icon: ShoppingCart },
        { href: "/customer/apply-credit", label: "Get a Loan", icon: Banknote },
        { href: "/customer/credit-review", label: "Credit Score", icon: ShieldCheck },
        { href: "/customer/alerts", label: "Alerts", icon: Bell },
        { href: "/customer/profile", label: "Profile", icon: User },
    ];

    const driverLinks = [
        { href: "/driver/orders", label: "My Orders", icon: Box },
        { href: "/driver/out-to-deliver", label: "Active Deliveries", icon: Truck },
        { href: "/driver/wallet", label: "Wallet & Earnings", icon: Wallet },
        { href: "/driver/issues", label: "Report Issue", icon: ShieldCheck },
        { href: "/driver/profile", label: "Profile", icon: User },
    ];

    const adminLinks = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/admin/stores", label: "Stores", icon: Settings },
        { href: "/admin/revenue", label: "Revenue", icon: Banknote },
        { href: "/admin/credit-overview", label: "Credit Overview", icon: ShieldCheck },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/support", label: "Support Tickets", icon: Heart },
        { href: "/admin/applications", label: "Applications", icon: User },
        { href: "/admin/pos-monitor", label: "POS Monitor", icon: LayoutDashboard },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
        { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
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

    return { ownerLinks, cashierLinks, customerLinks, driverLinks, adminLinks, lenderLinks, links };
};

const NavContent = ({ role, location, navigate, isOpen, setIsOpen, logout }: any) => {
    const { ownerLinks, cashierLinks, customerLinks, driverLinks, adminLinks, lenderLinks, links } = getLinks(role);
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        OVERVIEW: true,
        OPERATIONS: true,
        MANAGEMENT: true
    });

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground p-4">
            <div className="mb-8 p-2">
                <Link to="/">
                    <img src={logo} alt="SMITETRADE" className="max-w-[150px] h-auto mx-auto md:mx-0" />
                </Link>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{role} Portal</p>
            </div>
            <nav className="space-y-4 flex-1 overflow-y-auto">
                {role === 'owner' ? (
                    Object.entries(ownerLinks).map(([category, items]) => (
                        <div key={category} className="mb-2">
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
                            >
                                {category}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openCategories[category] ? "rotate-180" : ""}`} />
                            </button>

                            {openCategories[category] && (
                                <div className="space-y-1 mt-1 ml-2 border-l border-sidebar-border/50 pl-2">
                                    {items.map((link) => {
                                        const isActive = location.pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${isActive
                                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                            >
                                                <link.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : ""
                                                    }`} />
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
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
                                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                            >
                                                <link.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${location.pathname === link.href ? "text-primary" : ""
                                                    }`} />
                                                {link.label}
                                            </Link>
                                        ))}
                    </div>
                )}
            </nav >

            <div className="px-4 mt-auto pt-4 border-t">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to sign out of your account?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                    navigate('/');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div >
    );
};

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useStore();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 z-20 sticky top-0 h-screen">
                <NavContent role={role} location={location} navigate={navigate} isOpen={isOpen} setIsOpen={setIsOpen} logout={logout} />
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
                        <NavContent role={role} location={location} navigate={navigate} isOpen={isOpen} setIsOpen={setIsOpen} logout={logout} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:pt-0 pt-16">
                <div className="p-4 md:p-10 xl:p-12 max-w-[1600px] mx-auto space-y-8">
                    <ErrorBoundary>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
