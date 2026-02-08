
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

// --- Types ---
export type UserRole = 'owner' | 'cashier' | 'customer' | 'driver' | 'admin';

export interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    storeName?: string; // For Owners
}

export interface Product {
    id: string; // Changed to string for Firestore
    name: string;
    price: number;
    category: string;
    stock: number;
    image: string; // Emoji
    status: 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    id: string; // Changed to string
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Paid' | 'Ready' | 'Out for Delivery' | 'Delivered';
    date: string;
    driverId?: string;
}

interface StoreContextType {
    // Auth
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string, role: UserRole, storeName?: string) => Promise<void>;
    logout: () => Promise<void>;

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
    placeOrder: (customerDetails: { name: string; address: string }) => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    assignDriver: (orderId: string, driverId: string) => Promise<void>;
    isLoading: boolean;
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

    // --- Auth Listener ---
    useEffect(() => {
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

    // --- Persistence Effects for Cart ---
    useEffect(() => localStorage.setItem('smite_cart', JSON.stringify(cart)), [cart]);

    // --- Auth Actions ---
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("Failed to login: " + error.message);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string, role: UserRole, storeName?: string) => {
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
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error("Failed to create account: " + error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCart([]); // Clear cart on logout
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // --- Inventory Actions ---
    const addProduct = async (productData: Omit<Product, 'id' | 'status'>) => {
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
    const placeOrder = async (customerDetails: { name: string; address: string }) => {
        try {
            await runTransaction(db, async (transaction) => {
                // 1. Check stock for all items
                for (const item of cart) {
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
                for (const item of cart) {
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
                    items: cart.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                    total: cartTotal,
                    status: "Pending",
                    date: new Date().toISOString(),
                    userId: user?.uid || "guest"
                };

                const newOrderRef = doc(collection(db, "orders"));
                transaction.set(newOrderRef, orderData);
            });

            clearCart();
            toast.success(`Order placed successfully!`);
        } catch (error: any) {
            console.error("Order error:", error);
            toast.error("Failed to place order: " + error.message);
            throw error;
        }
    };

    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { status });
            toast.info(`Order updated to ${status}`);
        } catch (error) {
            toast.error("Failed to update order");
            throw error;
        }
    };

    const assignDriver = async (orderId: string, driverId: string) => {
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

    return (
        <StoreContext.Provider value={{
            user, login, register, logout,
            products, addProduct, updateProduct, deleteProduct,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
            orders, placeOrder, updateOrderStatus, assignDriver, isLoading
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
