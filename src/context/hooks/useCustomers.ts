import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection, query, orderBy, where, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc, runTransaction,
} from 'firebase/firestore';
import { USE_MOCK_DATA } from '@/lib/constants';
import { User, Customer, Expense, Store } from '@/types';

export function useCustomers(user: User | null, currentStore: Store | null, storesResolved: boolean) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (!user || !storesResolved || USE_MOCK_DATA) return;
        const storeId = currentStore?.id ?? user.storeId;
        if (!storeId || !(user.role === 'owner' || user.role === 'cashier' || user.role === 'admin')) return;

        const unsubs: (() => void)[] = [];

        unsubs.push(onSnapshot(
            query(collection(db, "customers"), where("storeId", "==", storeId), orderBy("name")),
            (snapshot) => setCustomers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Customer[])
        ));

        unsubs.push(onSnapshot(
            query(collection(db, "expenses"), where("storeId", "==", storeId), orderBy("date", "desc")),
            (snapshot) => setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Expense[]),
            (error) => {
                console.error("[useCustomers] expenses listener error:", error.code, error.message);
                toast.error("Failed to load expenses. Check console for details.");
            }
        ));

        return () => unsubs.forEach(u => u());
    }, [user, currentStore?.id, storesResolved]);

    const addCustomer = async (customer: Omit<Customer, 'id' | 'totalSpend' | 'tabBalance' | 'lastVisit'>) => {
        const storeId = currentStore?.id ?? user?.storeId;
        if (USE_MOCK_DATA) {
            setCustomers(prev => [...prev, {
                ...customer, id: `cust-${Date.now()}`,
                totalSpend: 0, tabBalance: 0, lastVisit: new Date().toISOString(), storeId,
            }]);
            toast.success("Customer added successfully (Mock)");
            return;
        }
        try {
            await addDoc(collection(db, "customers"), {
                ...customer, totalSpend: 0, tabBalance: 0,
                lastVisit: new Date().toISOString(), storeId,
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
            setCustomers(prev => prev.map(c =>
                c.id === id ? { ...c, tabBalance: Math.max(0, c.tabBalance - amount) } : c
            ));
            toast.success(`Tab settled by R${amount.toFixed(2)} (Mock)`);
            return;
        }
        try {
            const customerRef = doc(db, "customers", id);
            await runTransaction(db, async (transaction) => {
                const snap = await transaction.get(customerRef);
                if (!snap.exists()) throw new Error("Customer not found");
                const newBalance = Math.max(0, (snap.data().tabBalance || 0) - amount);
                transaction.update(customerRef, { tabBalance: newBalance });
            });
            toast.success(`Tab settled by R${amount.toFixed(2)}`);
        } catch (error) {
            toast.error("Failed to settle tab");
            throw error;
        }
    };

    const addExpense = async (expense: Omit<Expense, 'id' | 'date' | 'loggedBy'>) => {
        const storeId = currentStore?.id ?? user?.storeId;
        if (!storeId) {
            console.error("[addExpense] storeId is undefined — currentStore:", currentStore, "user.storeId:", user?.storeId);
            toast.error("No active store found. Please refresh and try again.");
            throw new Error("storeId is undefined");
        }
        if (USE_MOCK_DATA) {
            setExpenses(prev => [...prev, {
                ...expense, id: `exp-${Date.now()}`,
                date: new Date().toISOString(), loggedBy: user?.name || 'Unknown', storeId,
            }]);
            return;
        }
        try {
            await addDoc(collection(db, "expenses"), {
                ...expense, date: new Date().toISOString(),
                loggedBy: user?.name || 'Unknown', userId: user?.uid || 'unknown', storeId,
            });
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

    return { customers, expenses, addCustomer, updateCustomer, settleCustomerTab, addExpense, deleteExpense };
}
