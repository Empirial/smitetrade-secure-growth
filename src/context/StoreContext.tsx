import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// --- Types ---
export type UserRole = 'owner' | 'cashier' | 'customer' | 'driver' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    storeName?: string; // For Owners
}

export interface Product {
    id: number;
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
    id: number;
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
    login: (email: string, role: UserRole) => void;
    logout: () => void;

    // Inventory
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
    updateProduct: (id: number, updates: Partial<Product>) => void;
    deleteProduct: (id: number) => void;

    // Cart
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateCartQuantity: (productId: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;

    // Orders
    orders: Order[];
    placeOrder: (customerDetails: { name: string; address: string }) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    assignDriver: (orderId: string, driverId: string) => void;
    isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- Initial Mock Data ---
const INITIAL_PRODUCTS: Product[] = [
    { id: 1, name: "Maize Meal 10kg", price: 120.00, category: "Staples", stock: 50, image: "🌽", status: "In Stock" },
    { id: 2, name: "Cooking Oil 2L", price: 85.00, category: "Pantry", stock: 20, image: "🌻", status: "In Stock" },
    { id: 3, name: "White Sugar 2kg", price: 45.00, category: "Pantry", stock: 5, image: "🍬", status: "Critical" },
    { id: 4, name: "Tea Bags 100s", price: 35.00, category: "Beverages", stock: 100, image: "☕", status: "In Stock" },
    { id: 5, name: "Full Cream Milk 1L", price: 18.00, category: "Dairy", stock: 12, image: "🥛", status: "Low Stock" },
    { id: 6, name: "Brown Bread", price: 16.00, category: "Bakery", stock: 0, image: "🍞", status: "Out of Stock" },
];

const INITIAL_ORDERS: Order[] = [
    {
        id: "ORD-101",
        customerName: "Thabo Molefe",
        customerAddress: "45 Zone 6, Diepkloof",
        items: [{ id: 1, name: "Maize Meal 10kg", quantity: 1, price: 120.00 }],
        total: 120.00,
        status: "Pending",
        date: new Date().toISOString()
    },
    {
        id: "ORD-102",
        customerName: "Lerato Nkosi",
        customerAddress: "88 Fox St, JHB CBD",
        items: [{ id: 2, name: "Cooking Oil 2L", quantity: 2, price: 85.00 }],
        total: 170.00,
        status: "Ready",
        date: new Date().toISOString()
    }
];

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    // --- State Initialization (Lazy Load from LocalStorage) ---
    const [isLoading, setIsLoading] = useState(true);

    // Simulate initial data fetch
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('smite_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('smite_products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });

    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('smite_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('smite_orders');
        return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    });

    // --- Persistence Effects ---
    useEffect(() => localStorage.setItem('smite_user', JSON.stringify(user)), [user]);
    useEffect(() => localStorage.setItem('smite_products', JSON.stringify(products)), [products]);
    useEffect(() => localStorage.setItem('smite_cart', JSON.stringify(cart)), [cart]);
    useEffect(() => localStorage.setItem('smite_orders', JSON.stringify(orders)), [orders]);

    // --- Auth Actions ---
    const login = (email: string, role: UserRole) => {
        const fakeUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0], // Mock name from email
            email,
            role,
            storeName: role === 'owner' ? "My Spaza Shop" : undefined
        };
        setUser(fakeUser);
        toast.success(`Welcome back, ${fakeUser.name}!`);
    };

    const logout = () => {
        setUser(null);
        toast.info("Logged out successfully");
    };

    // --- Inventory Actions ---
    const addProduct = (productData: Omit<Product, 'id' | 'status'>) => {
        const newProduct: Product = {
            ...productData,
            id: Date.now(),
            status: productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock'
        };
        setProducts(prev => [...prev, newProduct]);
        toast.success("Product added to inventory");
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates };
                // Re-calc status if stock changed
                if (updates.stock !== undefined) {
                    updated.status = updated.stock > 20 ? 'In Stock' : updated.stock > 0 ? 'Low Stock' : 'Out of Stock';
                }
                return updated;
            }
            return p;
        }));
    };

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success("Product removed");
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

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId: number, delta: number) => {
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
    const placeOrder = (customerDetails: { name: string; address: string }) => {
        const newOrder: Order = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName: customerDetails.name,
            customerAddress: customerDetails.address,
            items: cart.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
            total: cartTotal,
            status: "Pending",
            date: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        toast.success(`Order ${newOrder.id} placed successfully!`);
    };

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        toast.info(`Order ${orderId} updated to ${status}`);
    };

    const assignDriver = (orderId: string, driverId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, driverId, status: 'Out for Delivery' } : o));
        toast.info(`Order assigned to driver`);
    };

    return (
        <StoreContext.Provider value={{
            user, login, logout,
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
