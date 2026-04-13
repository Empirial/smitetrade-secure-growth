import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { MOCK_STORES, USE_MOCK_DATA } from '@/lib/constants';
import { User, Store } from '@/types';

export function useStores(user: User | null, isLoading: boolean) {
    const [stores, setStores] = useState<Store[]>([]);
    const [currentStore, setCurrentStore] = useState<Store | null>(null);
    // True once we know which store is active (or user doesn't need one).
    // Data hooks wait for this before attaching Firestore listeners.
    const [storesResolved, setStoresResolved] = useState(false);

    // Clear currentStore on logout
    useEffect(() => {
        if (!user) {
            setCurrentStore(null);
            setStoresResolved(false);
        }
    }, [user]);

    // Stores listener — waits for auth to resolve
    useEffect(() => {
        if (USE_MOCK_DATA) {
            setStores(MOCK_STORES as Store[]);
            setStoresResolved(true);
            return;
        }
        if (isLoading || !user) return;

        const q = query(collection(db, "stores"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Store[]);
        }, (error) => {
            console.error("[useStores] stores listener error:", error.code, error.message);
        });
        return () => unsubscribe();
    }, [user, isLoading]);

    // Restore active store selection when stores list loads
    useEffect(() => {
        if (!user || USE_MOCK_DATA || !stores.length) return;
        if (!(user.role === "owner" || user.role === "cashier" || user.role === "admin")) {
            // Roles that don't need a store (driver, customer, lender, etc.)
            setStoresResolved(true);
            return;
        }

        const savedStoreId = localStorage.getItem("smite_active_store_id");
        const preferred =
            (savedStoreId && stores.find(s => s.id === savedStoreId)) ||
            (user.storeId && stores.find(s => s.id === user.storeId)) ||
            stores[0];

        if (!preferred || currentStore?.id === preferred.id) {
            // Already on the right store — mark as resolved
            setStoresResolved(true);
            return;
        }
        setCurrentStore(preferred);
        setStoresResolved(true);
    }, [user, stores, currentStore?.id]);

    const switchStore = (store: Store) => {
        setCurrentStore(store);
        localStorage.setItem('smite_active_store_id', store.id);
        toast.success(`Switched to ${store.name}`);
    };

    return { stores, currentStore, storesResolved, setCurrentStore, switchStore };
}
