import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Scan, CreditCard, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
    return (
        <DashboardLayout role="cashier">
            <div className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Welcome, Cashier</h1>
                <p className="text-muted-foreground">Ready to start your shift.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/cashier/pos">
                    <Card className="hover:border-emerald-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Sale</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Open POS</div>
                            <p className="text-xs text-muted-foreground">Start a new transaction</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/cashier/scanner">
                    <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quick Scan</CardTitle>
                            <Scan className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Scan Item</div>
                            <p className="text-xs text-muted-foreground">Check price or add to cart</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/cashier/credit-review">
                    <Card className="hover:border-amber-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Credit Check</CardTitle>
                            <CreditCard className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Review Credit</div>
                            <p className="text-xs text-muted-foreground">Lookup customer SpazaScore</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Sales processed during this session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">{i}</div>
                                    <div>
                                        <p className="text-sm font-medium">Receipt #00{i}</p>
                                        <p className="text-xs text-muted-foreground">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="font-medium text-sm">R 45.00</div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 gap-2">
                        <RotateCcw size={16} /> View Refund History
                    </Button>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default CashierDashboard;
