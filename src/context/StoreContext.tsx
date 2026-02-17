
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    User as FirebaseUser
} from 'firebase/auth';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    setDoc,
    getDoc,
    runTransaction
} from 'firebase/firestore';
import { OrderSchema } from '@/lib/schemas';

import { MOCK_USER, MOCK_LENDER, MOCK_PRODUCTS, MOCK_ORDERS, USE_MOCK_DATA } from '@/lib/constants';

import { User, Product, Order, CartItem, UserRole, Supplier, StaffMember, Shift, Issue } from "@/types";

interface FirebaseError extends Error {
    code: string;
}

interface StoreContextType {
    // Auth
    user: User | null;
    login: (email: string, password: string, roleFallback?: UserRole) => Promise<void>;
    register: (email: string, password: string, name: string, role: UserRole, storeName?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;

    // Inventory
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Cart (Local for now)
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;

    // Orders
    orders: Order[];
    placeOrder: (customerDetails: {
        name: string;
        address: string;
        items?: CartItem[];
        paymentMethod?: string;
        storeId?: string;
    }) => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    assignDriver: (orderId: string, driverId: string) => Promise<void>;
    assignDriver: (orderId: string, driverId: string) => Promise<void>;
    isLoading: boolean;

    // Suppliers
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id' | 'status'>) => void;

    // Staff
    staff: StaffMember[];
    addStaff: (staff: Omit<StaffMember, 'id'>) => void;

    // Shifts
    shifts: Shift[];
    currentShift: Shift | null;
    startShift: (float: number) => void;
    endShift: (closingCash: number) => void;

    // Wishlist
    toggleWishlist: (productId: string) => void;

    // Issues
    issues: Issue[];
    reportIssue: (issue: Omit<Issue, 'id' | 'timestamp' | 'status'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('smite_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(true);

    // --- Snag List State ---
    const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
        const saved = localStorage.getItem('smite_suppliers');
        return saved ? JSON.parse(saved) : [];
    });
    const [staff, setStaff] = useState<StaffMember[]>(() => {
        const saved = localStorage.getItem('smite_staff');
        return saved ? JSON.parse(saved) : [];
    });
    const [shifts, setShifts] = useState<Shift[]>(() => {
        const saved = localStorage.getItem('smite_shifts');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentShift, setCurrentShift] = useState<Shift | null>(() => {
        const saved = localStorage.getItem('smite_current_shift');
        return saved ? JSON.parse(saved) : null;
    });
    const [issues, setIssues] = useState<Issue[]>(() => {
        const saved = localStorage.getItem('smite_issues');
        return saved ? JSON.parse(saved) : [];
    });

    // --- Auth Listener ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            console.log("StoreContext: Using Mock Data Mode");
            // Simulate persistent login if previously "logged in" (simplified: just auto-login as owner for testing)
            // Or just start as null and let them click login.
            // Let's auto-login for convenience if requested, but standard is start null.
            // Actually, for "disable login", maybe we just want to BE logged in?
            // The user said "disable login... so I can test it out". 
            // Let's auto-login as Owner to make it easy.
            setUser(MOCK_USER);
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...userDoc.data(), id: firebaseUser.uid, uid: firebaseUser.uid } as User);
                } else {
                    // Fallback or handle missing profile
                    console.error("User profile not found");
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Real-time Data Listeners ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            setProducts(MOCK_PRODUCTS);
            return;
        }

        const q = query(collection(db, "products"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setOrders(MOCK_ORDERS);
            return;
        }

        // In a real app, query based on role (Owner sees all, Customer sees theirs)
        // For simple MVP, Fetch all orders sorted by date
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            setOrders(ordersData);
        });
        return () => unsubscribe();
    }, []);

    // --- Persistence Effects ---
    useEffect(() => localStorage.setItem('smite_cart', JSON.stringify(cart)), [cart]);
    useEffect(() => localStorage.setItem('smite_suppliers', JSON.stringify(suppliers)), [suppliers]);
    useEffect(() => localStorage.setItem('smite_staff', JSON.stringify(staff)), [staff]);
    useEffect(() => localStorage.setItem('smite_shifts', JSON.stringify(shifts)), [shifts]);
    useEffect(() => {
        if (currentShift) {
            localStorage.setItem('smite_current_shift', JSON.stringify(currentShift));
        } else {
            localStorage.removeItem('smite_current_shift');
        }
    }, [currentShift]);
    useEffect(() => localStorage.setItem('smite_issues', JSON.stringify(issues)), [issues]);

    // --- Auth Actions ---
    const login = async (email: string, password: string, roleFallback?: UserRole) => {
        if (USE_MOCK_DATA) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Mock Login Success
            const mockUser: User = {
                id: "mock-user-123",
                uid: "mock-user-123",
                name: "Mock User",
                email: email,
                role: roleFallback || 'owner',
                storeName: roleFallback === 'owner' ? "Mock Store" : undefined
            };
            if (roleFallback === 'lender') {
                setUser(MOCK_LENDER);
            } else {
                setUser(mockUser);
            }
            toast.success("Mock Login Successful!");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (error) {
            console.error("Login error:", error);
            // Auto-Register Fallback for "Random Login" testing
            if (roleFallback && error instanceof Error && ((error as FirebaseError).code === 'auth/user-not-found' || (error as FirebaseError).code === 'auth/invalid-credential')) {
                try {
                    toast.info("Account not found. Creating test account...");
                    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

                    const userData: Omit<User, 'id' | 'uid'> = {
                        name: "Test " + roleFallback.charAt(0).toUpperCase() + roleFallback.slice(1),
                        email,
                        role: roleFallback,
                        storeName: roleFallback === 'owner' ? "Test Store" : undefined
                    };

                    await setDoc(doc(db, "users", firebaseUser.uid), userData);
                    setUser({ ...userData, id: firebaseUser.uid, uid: firebaseUser.uid });
                    toast.success("Test account created & logged in!");
                    return;
                } catch (regError) {
                    console.error("Auto-registration failed:", regError);
                    toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
                    throw error;
                }
            }
            toast.error("Failed to login: " + (error instanceof Error ? error.message : "Unknown error"));
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string, role: UserRole, storeName?: string) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockUser: User = {
                id: "mock-new-user-" + Date.now(),
                uid: "mock-new-user-" + Date.now(),
                name: name,
                email: email,
                role: role,
                storeName: storeName
            };
            setUser(mockUser);
            toast.success("Mock Registration Successful!");
            return;
        }

        try {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Create user profile in Firestore
            const userData: Omit<User, 'id' | 'uid'> = {
                name,
                email,
                role,
                ...(storeName && { storeName })
            };

            await setDoc(doc(db, "users", firebaseUser.uid), userData);

            // Force set user state immediately for better UX
            setUser({ ...userData, id: firebaseUser.uid, uid: firebaseUser.uid });
            toast.success("Account created successfully!");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Failed to create account: " + (error instanceof Error ? error.message : "Unknown error"));
            throw error;
        }
    };

    const logout = async () => {
        if (USE_MOCK_DATA) {
            setUser(null);
            setCart([]);
            toast.info("Mock Logout Successful");
            return;
        }

        try {
            await signOut(auth);
            setCart([]); // Clear cart on logout
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // --- User Updates ---
    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;

        if (USE_MOCK_DATA) {
            setUser(prev => prev ? { ...prev, ...updates } : null);
            toast.success("Profile updated (Mock)");
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, updates);
            setUser(prev => prev ? { ...prev, ...updates } : null);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Failed to update profile");
            throw error;
        }
    };

    // --- Inventory Actions ---
    const addProduct = async (productData: Omit<Product, 'id' | 'status'>) => {
        if (USE_MOCK_DATA) {
            const status = productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock';
            const newProduct: Product = {
                ...productData,
                id: "mock-prod-" + Date.now(),
                status
            };
            setProducts(prev => [...prev, newProduct]);
            toast.success("Product added (Mock)");
            return;
        }

        try {
            const status = productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock';
            await addDoc(collection(db, "products"), {
                ...productData,
                status,
                createdAt: new Date().toISOString()
            });
            toast.success("Product added to inventory");
        } catch (error) {
            toast.error("Failed to add product");
            throw error;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        if (USE_MOCK_DATA) {
            setProducts(prev => prev.map(p => {
                if (p.id === id) {
                    const merged = { ...p, ...updates };
                    if (updates.stock !== undefined) {
                        merged.status = updates.stock > 20 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
                    }
                    return merged;
                }
                return p;
            }));
            toast.success("Product updated (Mock)");
            return;
        }

        try {
            const productRef = doc(db, "products", id);
            // Re-calc status if stock changed
            if (updates.stock !== undefined) {
                updates.status = updates.stock > 20 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
            }
            await updateDoc(productRef, updates);
            toast.success("Product updated");
        } catch (error) {
            toast.error("Failed to update product");
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        if (USE_MOCK_DATA) {
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success("Product removed (Mock)");
            return;
        }

        try {
            await deleteDoc(doc(db, "products", id));
            toast.success("Product removed");
        } catch (error) {
            toast.error("Failed to delete product");
            throw error;
        }
    };

    // --- Cart Actions ---
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success(`Added ${product.name} to cart`);
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // --- Order Actions ---
    const placeOrder = async (customerDetails: {
        name: string;
        address: string;
        items?: CartItem[];
        paymentMethod?: string;
        storeId?: string;
    }) => {
        const orderItems = customerDetails.items || cart;
        const orderTotal = customerDetails.items
            ? customerDetails.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            : cartTotal;

        if (orderItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }
        if (USE_MOCK_DATA) {
            // Mock Order Placement
            const newOrder: Order = {
                id: "mock-order-" + Date.now(),
                customerName: customerDetails.name,
                customerAddress: customerDetails.address,
                items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                total: orderTotal,
                status: "Pending",
                date: new Date().toISOString(),
                driverId: undefined
            };

            // Update Mock Stock (simple filter/map)
            setProducts(prev => prev.map(p => {
                const cartItem = orderItems.find(c => c.id === p.id);
                if (cartItem) {
                    const newStock = p.stock - cartItem.quantity;
                    const newStatus = newStock > 20 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock';
                    return { ...p, stock: newStock, status: newStatus as Product['status'] };
                }
                return p;
            }));

            setOrders(prev => [newOrder, ...prev]);
            if (!customerDetails.items) clearCart(); // Only clear global cart if that was used
            toast.success("Mock Order Placed!");
            return;
        }

        try {
            await runTransaction(db, async (transaction) => {
                // 1. Check stock for all items
                for (const item of orderItems) {
                    const productRef = doc(db, "products", item.id);
                    const productDoc = await transaction.get(productRef);

                    if (!productDoc.exists()) {
                        throw new Error(`Product ${item.name} not found`);
                    }

                    const currentStock = productDoc.data().stock;
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);
                    }
                }

                // 2. Decrement stock
                for (const item of orderItems) {
                    const productRef = doc(db, "products", item.id);
                    const productDoc = await transaction.get(productRef); // cached read
                    const newStock = productDoc.data()!.stock - item.quantity;
                    const newStatus = newStock > 20 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock';

                    transaction.update(productRef, {
                        stock: newStock,
                        status: newStatus
                    });
                }

                // 3. Create Order
                const orderData = {
                    customerName: customerDetails.name,
                    customerAddress: customerDetails.address,
                    items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                    total: orderTotal,
                    status: "Pending",
                    date: new Date().toISOString(),
                    userId: user?.uid || "guest"
                };

                // Validate with Zod
                const validation = OrderSchema.safeParse(orderData);
                if (!validation.success) {
                    throw new Error("Validation Failed: " + validation.error.errors.map(e => e.message).join(", "));
                }

                const newOrderRef = doc(collection(db, "orders"));
                transaction.set(newOrderRef, orderData);
            });



            if (!customerDetails.items) clearCart();
            toast.success(`Order placed successfully!`);
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Failed to place order: " + (error instanceof Error ? error.message : "Unknown error"));
            throw error;
        }
    };

    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        if (USE_MOCK_DATA) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            toast.info(`Order updated to ${status} (Mock)`);
            return;
        }

        try {
            await updateDoc(doc(db, "orders", orderId), { status });
            toast.info(`Order updated to ${status}`);
        } catch (error) {
            toast.error("Failed to update order");
            throw error;
        }
    };

    const assignDriver = async (orderId: string, driverId: string) => {
        if (USE_MOCK_DATA) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, driverId, status: 'Out for Delivery' } : o));
            toast.info("Order assigned to driver (Mock)");
            return;
        }

        try {
            await updateDoc(doc(db, "orders", orderId), {
                driverId,
                status: 'Out for Delivery'
            });
            toast.info(`Order assigned to driver`);
        } catch (error) {
            toast.error("Failed to assign driver");
            throw error;
        }
    };

    // --- Snag List Actions ---
    const addSupplier = (supplierData: Omit<Supplier, 'id' | 'status'>) => {
        const newSupplier: Supplier = {
            ...supplierData,
            id: `supp-${Date.now()}`,
            status: 'Active'
        };
        setSuppliers(prev => [...prev, newSupplier]);
        toast.success("Supplier added successfully");
    };

    const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
        const newStaff: StaffMember = {
            ...staffData,
            id: `staff-${Date.now()}`
        };
        setStaff(prev => [...prev, newStaff]);
        toast.success("Staff member added successfully");
    };

    const startShift = (float: number) => {
        if (currentShift) {
            toast.error("Shift already active");
            return;
        }
        const newShift: Shift = {
            id: `shift-${Date.now()}`,
            cashierId: user?.id || 'unknown',
            cashierName: user?.name || 'Unknown',
            startTime: new Date().toISOString(),
            openingFloat: float,
            totalSales: 0,
            status: 'Open'
        };
        setCurrentShift(newShift);
        toast.success("Shift started");
    };

    const endShift = (closingCash: number) => {
        if (!currentShift) return;

        // Calculate sales from orders during this shift (mock calculation for now, or just use current session sales)
        // ideally we filter orders by time range of shift.
        // For simplicity, we just save the shift record.

        const closedShift: Shift = {
            ...currentShift,
            endTime: new Date().toISOString(),
            closingCash,
            status: 'Closed'
        };

        setShifts(prev => [closedShift, ...prev]);
        setCurrentShift(null);
        toast.success("Shift closed and report saved");
    };

    const toggleWishlist = (productId: string) => {
        if (!user) return;

        const currentWishlist = user.wishlist || [];
        const exists = currentWishlist.includes(productId);

        let newWishlist;
        if (exists) {
            newWishlist = currentWishlist.filter(id => id !== productId);
            toast.info("Removed from wishlist");
        } else {
            newWishlist = [...currentWishlist, productId];
            toast.success("Added to wishlist");
        }

        updateUser({ wishlist: newWishlist });
    };

    const reportIssue = (issueData: Omit<Issue, 'id' | 'timestamp' | 'status'>) => {
        const newIssue: Issue = {
            ...issueData,
            id: `issue-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Open'
        };
        setIssues(prev => [newIssue, ...prev]);
        toast.success("Issue reported successfully");
    };

    return (
        <StoreContext.Provider value={{
            user, login, register, logout, updateUser,
            products, addProduct, updateProduct, deleteProduct,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
            orders, placeOrder, updateOrderStatus, assignDriver, isLoading,
            suppliers, addSupplier,
            staff, addStaff,
            shifts, currentShift, startShift, endShift,
            toggleWishlist,
            issues, reportIssue
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
