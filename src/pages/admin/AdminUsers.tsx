
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, UserRole } from "@/context/StoreContext";
import { toast } from "sonner";
import { CheckCircle, XCircle, RefreshCw, Mail } from "lucide-react";

// Extend User type locally if needed for extra fields like 'status' or 'createdAt'
interface AdminUser extends User {
    status?: 'active' | 'banned' | 'pending';
    createdAt?: string;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AdminUser[];
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'banned') => {
        try {
            await updateDoc(doc(db, "users", userId), { status: newStatus });
            setUsers(prev => prev.map(u => u.uid === userId || u.id === userId ? { ...u, status: newStatus } : u));
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'banned'} successfully.`);
        } catch (error) {
            toast.error("Failed to update user status.");
        }
    };

    const handlePasswordReset = (email: string) => {
        // In a real app, trigger Firebase sendPasswordResetEmail
        toast.info(`Password reset email sent to ${email} (simulated)`);
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'owner': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-red-100 text-red-800';
            case 'driver': return 'bg-blue-100 text-blue-800';
            case 'cashier': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Oversee all registered users and their roles.</p>
                    </div>
                    <Button onClick={fetchUsers} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Store (if Owner)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">No users found.</TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.uid || user.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getRoleBadgeColor(user.role)} variant="secondary">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === 'banned' ? 'destructive' : 'outline'}>
                                                    {user.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{user.storeName || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handlePasswordReset(user.email)}
                                                        title="Reset Password"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </Button>
                                                    {user.status !== 'banned' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleStatusChange(user.uid || user.id, 'banned')}
                                                            title="Ban User"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                                            onClick={() => handleStatusChange(user.uid || user.id, 'active')}
                                                            title="Activate User"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
