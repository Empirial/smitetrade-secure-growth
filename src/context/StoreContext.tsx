
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
    runTransaction,
    where
} from 'firebase/firestore';
import { OrderSchema } from '@/lib/schemas';

import { MOCK_USER, MOCK_LENDER, MOCK_PRODUCTS, MOCK_ORDERS, USE_MOCK_DATA, MOCK_STORES, MOCK_STORE_ID } from '@/lib/constants';

import { User, Product, Order, CartItem, UserRole, Supplier, StaffMember, Shift, Issue, Customer, Expense, Store } from "@/types";

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

    // Stores (multi-tenant)
    stores: Store[];
    currentStore: Store | null;

    // Inventory
    products: Product[];
    allProducts: Product[]; // All products across all stores (for customer e-commerce)
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
    isLoading: boolean;

    // Suppliers
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id' | 'status'>) => void;

    // Staff
    staff: StaffMember[];
    addStaff: (staff: Omit<StaffMember, 'id'>) => void;
    updateStaff: (id: string, updates: Partial<StaffMember>) => void;
    deleteStaff: (id: string) => void;

    // Shifts
    shifts: Shift[];
    currentShift: Shift | null;
    startShift: (float: number) => void;
    endShift: (closingCash: number) => void;
    recordCashDrop: (amount: number, reason: string) => void;

    // Wishlist
    toggleWishlist: (productId: string) => void;

    // Issues
    issues: Issue[];
    reportIssue: (issue: Omit<Issue, 'id' | 'timestamp' | 'status'>) => void;

    // Customers
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'totalSpend' | 'tabBalance' | 'lastVisit'>) => Promise<void>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    settleCustomerTab: (id: string, amount: number) => Promise<void>;

    // Expenses
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'date' | 'loggedBy'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [currentStore, setCurrentStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
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

    // --- New States ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    // --- Auth Listener ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            console.log("StoreContext: Using Mock Data Mode");
            setUser(MOCK_USER);
            setStores(MOCK_STORES as Store[]);
            setCurrentStore(MOCK_STORES[0] as Store);
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    const userData = { ...userDoc.data(), id: firebaseUser.uid, uid: firebaseUser.uid } as User;
                    setUser(userData);

                    // If user has a storeId, fetch that store
                    if (userData.storeId) {
                        const storeDoc = await getDoc(doc(db, "stores", userData.storeId));
                        if (storeDoc.exists()) {
                            setCurrentStore({ id: storeDoc.id, ...storeDoc.data() } as Store);
                        }
                    }
                } else {
                    console.error("User profile not found");
                }
            } else {
                setUser(null);
                setCurrentStore(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Stores Listener (for customers browsing all stores) ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            setStores(MOCK_STORES as Store[]);
            return;
        }

        const q = query(collection(db, "stores"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const storesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Store[];
            setStores(storesData);
        });
        return () => unsubscribe();
    }, []);

    // --- Products Listener (store-scoped for owners, all for customers) ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            // For owners: show only their store's products
            if (user?.role === 'owner' || user?.role === 'cashier') {
                setProducts(MOCK_PRODUCTS.filter(p => p.storeId === user.storeId));
            } else {
                setProducts(MOCK_PRODUCTS);
            }
            // All products always available for e-commerce
            setAllProducts(MOCK_PRODUCTS.filter(p => p.stock > 0));
            return;
        }

        if (!user) return;

        // Owner/Cashier: fetch only their store's products
        if ((user.role === 'owner' || user.role === 'cashier') && user.storeId) {
            const q = query(
                collection(db, "products"),
                where("storeId", "==", user.storeId),
                orderBy("name")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            });

            // Also fetch all products for e-commerce view
            const allQ = query(collection(db, "products"), orderBy("name"));
            const unsubAll = onSnapshot(allQ, (snapshot) => {
                setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            });

            return () => { unsubscribe(); unsubAll(); };
        }

        // Customer/Driver/Admin: fetch all products
        const q = query(collection(db, "products"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(productsData);
            setAllProducts(productsData);
        });
        return () => unsubscribe();
    }, [user]);

    // --- Orders Listener (role-scoped) ---
    useEffect(() => {
        if (USE_MOCK_DATA) {
            if (user?.role === 'owner' || user?.role === 'cashier') {
                setOrders(MOCK_ORDERS.filter(o => o.storeId === user.storeId));
            } else if (user?.role === 'driver') {
                setOrders(MOCK_ORDERS.filter(o => o.status === 'Ready' || o.driverId === user.id));
            } else if (user?.role === 'customer') {
                setOrders(MOCK_ORDERS.filter(o => o.userId === user.id));
            } else {
                setOrders(MOCK_ORDERS); // admin sees all
            }
            return;
        }

        if (!user) return;

        let q;
        if (user.role === 'owner' && user.storeId) {
            q = query(collection(db, "orders"), where("storeId", "==", user.storeId), orderBy("date", "desc"));
        } else if (user.role === 'customer') {
            q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("date", "desc"));
        } else if (user.role === 'driver') {
            // Drivers see Ready orders + their assigned orders
            q = query(collection(db, "orders"), orderBy("date", "desc"));
        } else {
            q = query(collection(db, "orders"), orderBy("date", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
            // Client-side filter for drivers
            if (user.role === 'driver') {
                ordersData = ordersData.filter(o => o.status === 'Ready' || o.driverId === user.id);
            }
            setOrders(ordersData);
        });
        return () => unsubscribe();
    }, [user]);

    // --- Other collections listener ---
    useEffect(() => {
        if (!user) return;
        if (USE_MOCK_DATA) return;

        const storeId = user.storeId;
        const unsubs: (() => void)[] = [];

        // Store-scoped collections
        if (storeId && (user.role === 'owner' || user.role === 'cashier' || user.role === 'admin')) {
            const customersQ = storeId && user.role !== 'admin'
                ? query(collection(db, "customers"), where("storeId", "==", storeId), orderBy("name"))
                : query(collection(db, "customers"), orderBy("name"));
            unsubs.push(onSnapshot(customersQ, (snapshot) => {
                setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Customer[]);
            }));

            const expensesQ = storeId && user.role !== 'admin'
                ? query(collection(db, "expenses"), where("storeId", "==", storeId), orderBy("date", "desc"))
                : query(collection(db, "expenses"), orderBy("date", "desc"));
            unsubs.push(onSnapshot(expensesQ, (snapshot) => {
                setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]);
            }));

            const suppliersQ = storeId && user.role !== 'admin'
                ? query(collection(db, "suppliers"), where("storeId", "==", storeId), orderBy("name"))
                : query(collection(db, "suppliers"), orderBy("name"));
            unsubs.push(onSnapshot(suppliersQ, (snapshot) => {
                setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplier[]);
            }));

            const staffQ = storeId && user.role !== 'admin'
                ? query(collection(db, "staff"), where("storeId", "==", storeId), orderBy("name"))
                : query(collection(db, "staff"), orderBy("name"));
            unsubs.push(onSnapshot(staffQ, (snapshot) => {
                setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as StaffMember[]);
            }));

            const shiftsQ = storeId && user.role !== 'admin'
                ? query(collection(db, "shifts"), where("storeId", "==", storeId), orderBy("startTime", "desc"))
                : query(collection(db, "shifts"), orderBy("startTime", "desc"));
            unsubs.push(onSnapshot(shiftsQ, (snapshot) => {
                setShifts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shift[]);
            }));
        }

        // Issues (driver or owner/admin)
        if (user.role === 'driver' || user.role === 'owner' || user.role === 'admin') {
            const issuesQ = query(collection(db, "issues"), orderBy("timestamp", "desc"));
            unsubs.push(onSnapshot(issuesQ, (snapshot) => {
                setIssues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Issue[]);
            }));
        }

        return () => unsubs.forEach(u => u());
    }, [user]);

    // --- Local Storage (Cart Only) ---
    useEffect(() => localStorage.setItem('smite_cart', JSON.stringify(cart)), [cart]);
    useEffect(() => {
        if (currentShift) {
            localStorage.setItem('smite_current_shift', JSON.stringify(currentShift));
        } else {
            localStorage.removeItem('smite_current_shift');
        }
    }, [currentShift]);

    // --- Auth Actions ---
    const login = async (email: string, password: string, roleFallback?: UserRole) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockUser: User = {
                id: "mock-user-123",
                uid: "mock-user-123",
                name: "Mock User",
                email: email,
                role: roleFallback || 'owner',
                storeName: roleFallback === 'owner' ? "Soweto Central Spaza" : undefined,
                storeId: roleFallback === 'owner' || roleFallback === 'cashier' ? MOCK_STORE_ID : undefined
            };
            if (roleFallback === 'lender') {
                setUser(MOCK_LENDER);
            } else {
                setUser(mockUser);
                if (mockUser.storeId) {
                    const store = MOCK_STORES.find(s => s.id === mockUser.storeId);
                    if (store) setCurrentStore(store as Store);
                }
            }
            toast.success("Mock Login Successful!");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (error) {
            console.error("Login error:", error);
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

                    // Create store if owner
                    if (roleFallback === 'owner') {
                        const storeRef = doc(collection(db, "stores"));
                        const storeData = {
                            ownerId: firebaseUser.uid,
                            name: "Test Store",
                            address: "",
                            suburb: "",
                            city: "",
                            province: "",
                            status: "Active",
                            createdAt: new Date().toISOString()
                        };
                        await setDoc(storeRef, storeData);
                        await updateDoc(doc(db, "users", firebaseUser.uid), { storeId: storeRef.id });
                    }

                    // Create user role
                    await setDoc(doc(db, "user_roles", firebaseUser.uid), { role: roleFallback });

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
            const newStoreId = "mock-store-" + Date.now();
            const mockUser: User = {
                id: "mock-new-user-" + Date.now(),
                uid: "mock-new-user-" + Date.now(),
                name: name,
                email: email,
                role: role,
                storeName: storeName,
                storeId: role === 'owner' ? newStoreId : undefined
            };
            setUser(mockUser);

            if (role === 'owner' && storeName) {
                const newStore: Store = {
                    id: newStoreId,
                    ownerId: mockUser.id,
                    name: storeName,
                    address: "",
                    suburb: "",
                    city: "",
                    province: "",
                    status: "Active",
                    createdAt: new Date().toISOString()
                };
                setStores(prev => [...prev, newStore]);
                setCurrentStore(newStore);
            }

            toast.success("Mock Registration Successful!");
            return;
        }

        try {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

            const userData: Omit<User, 'id' | 'uid'> = {
                name,
                email,
                role,
                ...(storeName && { storeName })
            };

            // Create store document if owner
            let storeId: string | undefined;
            if (role === 'owner' && storeName) {
                const storeRef = doc(collection(db, "stores"));
                storeId = storeRef.id;
                const storeData = {
                    ownerId: firebaseUser.uid,
                    name: storeName,
                    address: "",
                    suburb: "",
                    city: "",
                    province: "",
                    status: "Active",
                    createdAt: new Date().toISOString()
                };
                await setDoc(storeRef, storeData);
                (userData as any).storeId = storeId;
            }

            await setDoc(doc(db, "users", firebaseUser.uid), userData);

            // Create user role entry
            await setDoc(doc(db, "user_roles", firebaseUser.uid), { role });

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
            setCurrentStore(null);
            setCart([]);
            toast.info("Mock Logout Successful");
            return;
        }

        try {
            await signOut(auth);
            setCart([]);
            setCurrentStore(null);
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

    // --- Inventory Actions (store-scoped) ---
    const addProduct = async (productData: Omit<Product, 'id' | 'status'>) => {
        const storeId = user?.storeId || MOCK_STORE_ID;
        const storeName = currentStore?.name || user?.storeName || "Unknown Store";

        if (USE_MOCK_DATA) {
            const status = productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock';
            const newProduct: Product = {
                ...productData,
                id: "mock-prod-" + Date.now(),
                status,
                storeId,
                storeName
            };
            setProducts(prev => [...prev, newProduct]);
            setAllProducts(prev => [...prev, newProduct]);
            toast.success("Product added (Mock)");
            return;
        }

        try {
            const status = productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock';
            await addDoc(collection(db, "products"), {
                ...productData,
                status,
                storeId,
                storeName,
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
            const updateFn = (prev: Product[]) => prev.map(p => {
                if (p.id === id) {
                    const merged = { ...p, ...updates };
                    if (updates.stock !== undefined) {
                        merged.status = updates.stock > 20 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
                    }
                    return merged;
                }
                return p;
            });
            setProducts(updateFn);
            setAllProducts(updateFn);
            toast.success("Product updated (Mock)");
            return;
        }

        try {
            const productRef = doc(db, "products", id);
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
            setAllProducts(prev => prev.filter(p => p.id !== id));
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
                // Enforce single-store cart
                if (existing.storeId !== product.storeId) {
                    toast.error("You can only order from one store at a time. Clear your cart first.");
                    return prev;
                }
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            // Check if cart has items from a different store
            if (prev.length > 0 && prev[0].storeId !== product.storeId) {
                toast.error("You can only order from one store at a time. Clear your cart first.");
                return prev;
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

    // --- Order Actions (store-scoped) ---
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

        // Determine storeId from cart items or explicit param
        const storeId = customerDetails.storeId || (orderItems.length > 0 ? orderItems[0].storeId : user?.storeId) || MOCK_STORE_ID;
        const store = stores.find(s => s.id === storeId);
        const storeName = store?.name || "Unknown Store";

        if (orderItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }
        if (USE_MOCK_DATA) {
            const newOrder: Order = {
                id: "mock-order-" + Date.now(),
                customerName: customerDetails.name,
                customerAddress: customerDetails.address,
                items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                total: orderTotal,
                status: "Pending",
                date: new Date().toISOString(),
                driverId: undefined,
                userId: user?.uid,
                storeId,
                storeName
            };

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
            if (!customerDetails.items) clearCart();
            toast.success("Mock Order Placed!");
            return;
        }

        try {
            await runTransaction(db, async (transaction) => {
                for (const item of orderItems) {
                    const productRef = doc(db, "products", item.id);
                    const productDoc = await transaction.get(productRef);
                    if (!productDoc.exists()) throw new Error(`Product ${item.name} not found`);
                    const currentStock = productDoc.data().stock;
                    if (currentStock < item.quantity) throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);
                }

                for (const item of orderItems) {
                    const productRef = doc(db, "products", item.id);
                    const productDoc = await transaction.get(productRef);
                    const newStock = productDoc.data()!.stock - item.quantity;
                    const newStatus = newStock > 20 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock';
                    transaction.update(productRef, { stock: newStock, status: newStatus });
                }

                const orderData = {
                    customerName: customerDetails.name,
                    customerAddress: customerDetails.address,
                    items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                    total: orderTotal,
                    status: "Pending",
                    date: new Date().toISOString(),
                    userId: user?.uid || "guest",
                    storeId,
                    storeName
                };

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
            await updateDoc(doc(db, "orders", orderId), { driverId, status: 'Out for Delivery' });
            toast.info(`Order assigned to driver`);
        } catch (error) {
            toast.error("Failed to assign driver");
            throw error;
        }
    };

    // --- Supplier Actions (store-scoped) ---
    const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'status'>) => {
        const storeId = user?.storeId;
        if (USE_MOCK_DATA) {
            const newSupplier: Supplier = {
                ...supplierData,
                id: `supp-${Date.now()}`,
                status: 'Active',
                storeId
            };
            setSuppliers(prev => [...prev, newSupplier]);
            toast.success("Supplier added successfully (Mock)");
            return;
        }

        try {
            await addDoc(collection(db, "suppliers"), {
                ...supplierData,
                status: 'Active',
                storeId,
                createdAt: new Date().toISOString()
            });
            toast.success("Supplier added successfully");
        } catch (error) {
            toast.error("Failed to add supplier");
            throw error;
        }
    };

    // --- Staff Actions (store-scoped) ---
    const addStaff = async (staffData: Omit<StaffMember, 'id'>) => {
        const storeId = user?.storeId;
        if (USE_MOCK_DATA) {
            const newStaff: StaffMember = {
                ...staffData,
                id: `staff-${Date.now()}`,
                storeId
            };
            setStaff(prev => [...prev, newStaff]);
            toast.success("Staff member added successfully (Mock)");
            return;
        }

        try {
            await addDoc(collection(db, "staff"), {
                ...staffData,
                storeId,
                createdAt: new Date().toISOString()
            });
            toast.success("Staff member added successfully");
        } catch (error) {
            toast.error("Failed to add staff");
            throw error;
        }
    };

    const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
        if (USE_MOCK_DATA) {
            setStaff(prev => prev.map(member => member.id === id ? { ...member, ...updates } : member));
            toast.success("Staff profile updated (Mock)");
            return;
        }

        try {
            await updateDoc(doc(db, "staff", id), updates);
            toast.success("Staff profile updated");
        } catch (error) {
            toast.error("Failed to update staff");
            throw error;
        }
    };

    const deleteStaff = async (id: string) => {
        if (USE_MOCK_DATA) {
            setStaff(prev => prev.filter(member => member.id !== id));
            toast.success("Staff member removed (Mock)");
            return;
        }

        try {
            await deleteDoc(doc(db, "staff", id));
            toast.success("Staff member removed");
        } catch (error) {
            toast.error("Failed to delete staff");
            throw error;
        }
    };

    // --- Shift Actions ---
    const startShift = async (float: number) => {
        if (currentShift) {
            toast.error("Shift already active");
            return;
        }

        const newShiftData = {
            cashierId: user?.id || 'unknown',
            cashierName: user?.name || 'Unknown',
            startTime: new Date().toISOString(),
            openingFloat: float,
            totalSales: 0,
            status: 'Open',
            storeId: user?.storeId
        };

        if (USE_MOCK_DATA) {
            setCurrentShift({ id: `shift-${Date.now()}`, ...newShiftData } as Shift);
            toast.success("Shift started (Mock)");
            return;
        }

        try {
            const shiftRef = await addDoc(collection(db, "shifts"), newShiftData);
            setCurrentShift({ id: shiftRef.id, ...newShiftData } as Shift);
            toast.success("Shift started");
        } catch (error) {
            toast.error("Failed to start shift");
            throw error;
        }
    };

    const endShift = async (closingCash: number) => {
        if (!currentShift) return;

        const closedData = {
            endTime: new Date().toISOString(),
            closingCash,
            status: 'Closed'
        };

        if (USE_MOCK_DATA) {
            const closedShift: Shift = { ...currentShift, ...closedData } as Shift;
            setShifts(prev => [closedShift, ...prev]);
            setCurrentShift(null);
            toast.success("Shift closed and report saved (Mock)");
            return;
        }

        try {
            await updateDoc(doc(db, "shifts", currentShift.id), closedData);
            setCurrentShift(null);
            toast.success("Shift closed and report saved");
        } catch (error) {
            toast.error("Failed to close shift");
            throw error;
        }
    };

    const recordCashDrop = async (amount: number, reason: string) => {
        if (!currentShift) {
            toast.error("No active shift to record drop against.");
            return;
        }

        if (USE_MOCK_DATA) {
            toast.success(`Cash drop of R${amount.toFixed(2)} recorded for: ${reason} (Mock)`);
            return;
        }

        try {
            await addDoc(collection(db, `shifts/${currentShift.id}/cashDrops`), {
                amount,
                reason,
                timestamp: new Date().toISOString()
            });
            toast.success(`Cash drop of R${amount.toFixed(2)} recorded for: ${reason}`);
        } catch (error) {
            toast.error("Failed to record cash drop");
            throw error;
        }
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

    // --- Customer Actions (store-scoped) ---
    const addCustomer = async (customer: Omit<Customer, 'id' | 'totalSpend' | 'tabBalance' | 'lastVisit'>) => {
        const storeId = user?.storeId;
        if (USE_MOCK_DATA) {
            const newCustomer: Customer = {
                ...customer,
                id: `cust-${Date.now()}`,
                totalSpend: 0,
                tabBalance: 0,
                lastVisit: new Date().toISOString(),
                storeId
            };
            setCustomers(prev => [...prev, newCustomer]);
            toast.success("Customer added successfully (Mock)");
            return;
        }

        try {
            await addDoc(collection(db, "customers"), {
                ...customer,
                totalSpend: 0,
                tabBalance: 0,
                lastVisit: new Date().toISOString(),
                storeId
            });
            toast.success("Customer added successfully");
        } catch (error) {
            toast.error("Failed to add customer");
            throw error;
        }
    };

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        if (USE_MOCK_DATA) {
            setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            toast.success("Customer updated (Mock)");
            return;
        }

        try {
            await updateDoc(doc(db, "customers", id), updates);
            toast.success("Customer updated");
        } catch (error) {
            toast.error("Failed to update customer");
            throw error;
        }
    };

    const settleCustomerTab = async (id: string, amount: number) => {
        if (USE_MOCK_DATA) {
            setCustomers(prev => prev.map(c => {
                if (c.id === id) {
                    const newBalance = Math.max(0, c.tabBalance - amount);
                    return { ...c, tabBalance: newBalance };
                }
                return c;
            }));
            toast.success(`Tab settled by R${amount.toFixed(2)} (Mock)`);
            return;
        }

        try {
            const customerRef = doc(db, "customers", id);
            const customerSnap = await getDoc(customerRef);

            if (customerSnap.exists()) {
                const currentBalance = customerSnap.data().tabBalance || 0;
                const newBalance = Math.max(0, currentBalance - amount);
                await updateDoc(customerRef, { tabBalance: newBalance });
                toast.success(`Tab settled by R${amount.toFixed(2)}`);
            }
        } catch (error) {
            toast.error("Failed to settle tab");
            throw error;
        }
    };

    // --- Expense Actions (store-scoped) ---
    const addExpense = async (expense: Omit<Expense, 'id' | 'date' | 'loggedBy'>) => {
        const storeId = user?.storeId;
        if (USE_MOCK_DATA) {
            const newExpense: Expense = {
                ...expense,
                id: `exp-${Date.now()}`,
                date: new Date().toISOString(),
                loggedBy: user?.name || 'Unknown',
                storeId
            };
            setExpenses(prev => [...prev, newExpense]);
            toast.success("Expense logged (Mock)");
            return;
        }

        try {
            await addDoc(collection(db, "expenses"), {
                ...expense,
                date: new Date().toISOString(),
                loggedBy: user?.name || 'Unknown',
                userId: user?.uid || 'unknown',
                storeId
            });
            toast.success("Expense logged");
        } catch (error) {
            toast.error("Failed to log expense");
            throw error;
        }
    };

    const deleteExpense = async (id: string) => {
        if (USE_MOCK_DATA) {
            setExpenses(prev => prev.filter(e => e.id !== id));
            toast.success("Expense removed (Mock)");
            return;
        }

        try {
            await deleteDoc(doc(db, "expenses", id));
            toast.success("Expense removed");
        } catch (error) {
            toast.error("Failed to delete expense");
            throw error;
        }
    };

    return (
        <StoreContext.Provider value={{
            user, login, register, logout, updateUser,
            stores, currentStore,
            products, allProducts, addProduct, updateProduct, deleteProduct,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
            orders, placeOrder, updateOrderStatus, assignDriver, isLoading,
            suppliers, addSupplier,
            staff, addStaff, updateStaff, deleteStaff,
            shifts, currentShift, startShift, endShift, recordCashDrop,
            toggleWishlist,
            issues, reportIssue,
            customers, addCustomer, updateCustomer, settleCustomerTab,
            expenses, addExpense, deleteExpense
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
