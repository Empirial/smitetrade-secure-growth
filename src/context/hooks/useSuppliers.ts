import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { USE_MOCK_DATA } from '@/lib/constants';
import { User, Supplier, Store } from '@/types';

export function useSuppliers(user: User | null, currentStore: Store | null, storesResolved: boolean) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        if (!user || !storesResolved || USE_MOCK_DATA) return;
        const storeId = currentStore?.id ?? user.storeId;
        if (!storeId || !(user.role === 'owner' || user.role === 'cashier' || user.role === 'admin')) return;

        const q = query(collection(db, "suppliers"), where("storeId", "==", storeId), orderBy("name"));
        const unsub = onSnapshot(q,
            (snapshot) => {
                setSuppliers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Supplier[]);
            },
            (err) => console.error("[useSuppliers] listener error:", err.code, err.message)
        );
        return () => unsub();
    }, [user, currentStore?.id, storesResolved]);

    const addSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'status'>) => {
        const storeId = currentStore?.id ?? user?.storeId;
        if (!storeId) {
            toast.error("No active store found. Please refresh and try again.");
            throw new Error("storeId is undefined");
        }
        if (USE_MOCK_DATA) {
            setSuppliers(prev => [...prev, { ...supplierData, id: `supp-${Date.now()}`, status: 'Active', storeId }]);
            toast.success("Supplier added successfully (Mock)");
            return;
        }
        try {
            await addDoc(collection(db, "suppliers"), { ...supplierData, status: 'Active', storeId, createdAt: new Date().toISOString() });
            toast.success("Supplier added successfully");
        } catch (error) {
            toast.error("Failed to add supplier");
            throw error;
        }
    }, [currentStore, user]);

    const updateSupplier = useCallback(async (id: string, updates: Partial<Supplier>) => {
        if (USE_MOCK_DATA) {
            setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
            toast.success("Supplier updated (Mock)");
            return;
        }
        try {
            await updateDoc(doc(db, "suppliers", id), updates);
            toast.success("Supplier updated");
        } catch (error) {
            toast.error("Failed to update supplier");
            throw error;
        }
    }, []);

    const deleteSupplier = useCallback(async (id: string) => {
        if (USE_MOCK_DATA) {
            setSuppliers(prev => prev.filter(s => s.id !== id));
            toast.success("Supplier removed (Mock)");
            return;
        }
        try {
            await deleteDoc(doc(db, "suppliers", id));
            toast.success("Supplier removed");
        } catch (error) {
            toast.error("Failed to delete supplier");
            throw error;
        }
    }, []);

    return { suppliers, addSupplier, updateSupplier, deleteSupplier };
}
