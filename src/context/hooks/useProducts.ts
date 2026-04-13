import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { MOCK_PRODUCTS, USE_MOCK_DATA, MOCK_STORE_ID } from '@/lib/constants';
import { User, Product, Store } from '@/types';

export function useProducts(user: User | null, currentStore: Store | null, storesResolved: boolean) {
    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            if (user?.role === 'owner' || user?.role === 'cashier') {
                const activeStoreId = currentStore?.id ?? user.storeId;
                setProducts(MOCK_PRODUCTS.filter(p => p.storeId === activeStoreId));
            } else {
                setProducts(MOCK_PRODUCTS);
            }
            setAllProducts(MOCK_PRODUCTS.filter(p => p.stock > 0));
            return;
        }

        if (!user) return;
        if (!storesResolved) return;

        const activeStoreId = currentStore?.id ?? user.storeId;
        if ((user.role === 'owner' || user.role === 'cashier') && activeStoreId) {
            const q = query(collection(db, "products"), where("storeId", "==", activeStoreId), orderBy("name"));
            const unsub = onSnapshot(q, (snapshot) => {
                setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            });
            const allQ = query(collection(db, "products"), orderBy("name"));
            const unsubAll = onSnapshot(allQ, (snapshot) => {
                setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            });
            return () => { unsub(); unsubAll(); };
        }

        const q = query(collection(db, "products"), orderBy("name"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(data);
            setAllProducts(data);
        });
        return () => unsub();
    }, [user, currentStore?.id, storesResolved]);

    const addProduct = async (productData: Omit<Product, 'id' | 'status'>) => {
        const storeId = currentStore?.id ?? user?.storeId ?? MOCK_STORE_ID;
        const storeName = currentStore?.name || user?.storeName || "Unknown Store";
        const status = productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock';

        if (USE_MOCK_DATA) {
            const newProduct: Product = { ...productData, id: "mock-prod-" + Date.now(), status, storeId, storeName };
            setProducts(prev => [...prev, newProduct]);
            setAllProducts(prev => [...prev, newProduct]);
            toast.success("Product added (Mock)");
            return;
        }
        try {
            await addDoc(collection(db, "products"), { ...productData, status, storeId, storeName, createdAt: new Date().toISOString() });
            toast.success("Product added to inventory");
        } catch (error) {
            toast.error("Failed to add product");
            throw error;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        if (USE_MOCK_DATA) {
            const fn = (prev: Product[]) => prev.map(p => {
                if (p.id !== id) return p;
                const merged = { ...p, ...updates };
                if (updates.stock !== undefined) {
                    merged.status = updates.stock > 20 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
                }
                return merged;
            });
            setProducts(fn);
            setAllProducts(fn);
            toast.success("Product updated (Mock)");
            return;
        }
        try {
            if (updates.stock !== undefined) {
                updates.status = updates.stock > 20 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
            }
            await updateDoc(doc(db, "products", id), updates);
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

    return { products, allProducts, addProduct, updateProduct, deleteProduct };
}
