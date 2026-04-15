import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection, query, orderBy, where, onSnapshot,
    addDoc, updateDoc, doc, runTransaction,
} from 'firebase/firestore';
import { OrderSchema } from '@/lib/schemas';
import { MOCK_ORDERS, USE_MOCK_DATA, MOCK_STORE_ID } from '@/lib/constants';
import { User, Order, CartItem, Product, StaffMember, Store } from '@/types';

export function useOrders(
    user: User | null,
    currentStore: Store | null,
    staff: StaffMember[],
    stores: Store[],
    storesResolved: boolean
) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('smite_cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist cart
    useEffect(() => { localStorage.setItem('smite_cart', JSON.stringify(cart)); }, [cart]);

    // Clear cart on logout
    useEffect(() => { if (!user) setCart([]); }, [user]);

    // Orders listener (role-scoped)
    useEffect(() => {
        if (USE_MOCK_DATA) {
            if (user?.role === 'owner' || user?.role === 'cashier') {
                const activeStoreId = currentStore?.id ?? user.storeId;
                setOrders(MOCK_ORDERS.filter(o => o.storeId === activeStoreId));
            } else if (user?.role === 'driver') {
                setOrders(MOCK_ORDERS.filter(o => o.status === 'Ready' || o.driverId === user.id));
            } else if (user?.role === 'customer') {
                setOrders(MOCK_ORDERS.filter(o => o.userId === user.id));
            } else {
                setOrders(MOCK_ORDERS);
            }
            return;
        }

        if (!user) return;
        if (!storesResolved) return;

        const activeStoreId = currentStore?.id ?? user.storeId;

        if ((user.role === 'owner' || user.role === 'cashier') && activeStoreId) {
            const q = query(collection(db, "orders"), where("storeId", "==", activeStoreId), orderBy("date", "desc"));
            const unsub = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[]);
            });
            return () => unsub();
        }

        if (user.role === 'customer') {
            const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("date", "desc"));
            const unsub = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[]);
            });
            return () => unsub();
        }

        if (user.role === 'driver') {
            let readyDocs = new Map<string, Order>();
            let assignedDocs = new Map<string, Order>();
            const mergeAndSet = () => {
                const merged = new Map<string, Order>([...readyDocs, ...assignedDocs]);
                setOrders(Array.from(merged.values()).sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ));
            };
            const unsub1 = onSnapshot(
                query(collection(db, "orders"), where("status", "==", "Ready"), orderBy("date", "desc")),
                (s) => { readyDocs = new Map(s.docs.map(d => [d.id, { id: d.id, ...d.data() } as Order])); mergeAndSet(); }
            );
            const unsub2 = onSnapshot(
                query(collection(db, "orders"), where("driverId", "==", user.uid), orderBy("date", "desc")),
                (s) => { assignedDocs = new Map(s.docs.map(d => [d.id, { id: d.id, ...d.data() } as Order])); mergeAndSet(); }
            );
            return () => { unsub1(); unsub2(); };
        }

        // Admin / lender: all orders
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Order[]);
        });
        return () => unsub();
    }, [user, currentStore?.id, storesResolved]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Cart actions
    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.storeId !== product.storeId) {
                toast.error("You can only order from one store at a time. Clear your cart first.");
                return;
            }
            setCart(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            toast.success(`Added ${product.name} to cart`);
            return;
        }
        if (cart.length > 0 && cart[0].storeId !== product.storeId) {
            toast.error("You can only order from one store at a time. Clear your cart first.");
            return;
        }
        setCart(prev => [...prev, { ...product, quantity: 1 }]);
        toast.success(`Added ${product.name} to cart`);
    };

    const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const clearCart = () => setCart([]);

    // ALGORITHM 8: Least-busy driver assignment
    const findBestAvailableDriver = (): StaffMember | null => {
        const activeDrivers = staff.filter(s => s.role === 'driver' && s.status === 'Active');
        if (activeDrivers.length === 0) return null;
        const activeDeliveries = orders.filter(o => o.status === 'Out for Delivery');
        return activeDrivers
            .map(d => ({ driver: d, load: activeDeliveries.filter(o => o.driverId === d.id).length }))
            .sort((a, b) => a.load - b.load)[0].driver;
    };

    const placeOrder = async (customerDetails: {
        name: string;
        address: string;
        items?: CartItem[];
        paymentMethod?: string;
        storeId?: string;
    }) => {
        const orderItems = customerDetails.items || cart;
        const orderTotal = customerDetails.items
            ? customerDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            : cartTotal;
        const storeId = USE_MOCK_DATA
            ? (customerDetails.storeId || (orderItems.length > 0 ? orderItems[0].storeId : user?.storeId) || MOCK_STORE_ID)
            : (customerDetails.storeId || (orderItems.length > 0 ? orderItems[0].storeId : user?.storeId));
        const store = stores.find(s => s.id === storeId);
        const storeName = store?.name || "Unknown Store";

        if (orderItems.length === 0) { toast.error("Cart is empty"); return; }
        if (!USE_MOCK_DATA && !storeId) { toast.error("Could not determine store for this order. Please try again."); return; }

        if (USE_MOCK_DATA) {
            const newOrder: Order = {
                id: "mock-order-" + Date.now(),
                customerName: customerDetails.name,
                customerAddress: customerDetails.address,
                items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                total: orderTotal, status: "Pending",
                date: new Date().toISOString(), driverId: undefined,
                userId: user?.uid, storeId, storeName,
            };
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
                    if (productDoc.data().stock < item.quantity)
                        throw new Error(`Insufficient stock for ${item.name}. Available: ${productDoc.data().stock}`);
                }
                for (const item of orderItems) {
                    const productRef = doc(db, "products", item.id);
                    const productDoc = await transaction.get(productRef);
                    const newStock = productDoc.data()!.stock - item.quantity;
                    transaction.update(productRef, {
                        stock: newStock,
                        status: newStock > 20 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock',
                    });
                }
                const orderData = {
                    customerName: customerDetails.name,
                    customerAddress: customerDetails.address,
                    items: orderItems.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
                    total: orderTotal, status: "Pending",
                    date: new Date().toISOString(),
                    userId: user?.uid || "guest",
                    storeId, storeName,
                };
                const validation = OrderSchema.safeParse(orderData);
                if (!validation.success)
                    throw new Error("Validation Failed: " + validation.error.errors.map(e => e.message).join(", "));
                transaction.set(doc(collection(db, "orders")), orderData);
            });
            if (!customerDetails.items) clearCart();
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Failed to place order. Please try again.");
            throw error;
        }
    };

    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        const bestDriver = status === 'Ready' ? findBestAvailableDriver() : null;
        if (USE_MOCK_DATA) {
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status, ...(bestDriver ? { driverId: bestDriver.id } : {}) } : o
            ));
            if (bestDriver) toast.info(`Order ready — pre-assigned to ${bestDriver.name}`);
            else toast.info(`Order updated to ${status} (Mock)`);
            return;
        }
        try {
            const updateData: Partial<Order> = { status };
            if (bestDriver) updateData.driverId = bestDriver.id;
            await updateDoc(doc(db, "orders", orderId), updateData);
            if (bestDriver) toast.info(`Order ready — pre-assigned to ${bestDriver.name}`);
            else toast.info(`Order updated to ${status}`);
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
            toast.info("Order assigned to driver");
        } catch (error) {
            toast.error("Failed to assign driver");
            throw error;
        }
    };

    return {
        orders, cart, cartTotal,
        addToCart, removeFromCart, updateCartQuantity, clearCart,
        placeOrder, updateOrderStatus, assignDriver,
    };
}
