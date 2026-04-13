import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auth, db, firebaseConfig } from '@/lib/firebase';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
    collection, query, orderBy, where, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc, setDoc,
} from 'firebase/firestore';
import { MOCK_STAFF, USE_MOCK_DATA } from '@/lib/constants';
import { User, StaffMember, Shift, Store } from '@/types';

export function useStaff(user: User | null, currentStore: Store | null, storesResolved: boolean) {
    const [staff, setStaff] = useState<StaffMember[]>(USE_MOCK_DATA ? MOCK_STAFF : []);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [currentShift, setCurrentShift] = useState<Shift | null>(() => {
        const saved = localStorage.getItem('smite_current_shift');
        return saved ? JSON.parse(saved) : null;
    });

    // Persist current shift
    useEffect(() => {
        if (currentShift) {
            localStorage.setItem('smite_current_shift', JSON.stringify(currentShift));
        } else {
            localStorage.removeItem('smite_current_shift');
        }
    }, [currentShift]);

    // Staff + shifts listeners
    useEffect(() => {
        if (!user || !storesResolved || USE_MOCK_DATA) return;

        const storeId = currentStore?.id ?? user.storeId;
        if (!storeId || !(user.role === 'owner' || user.role === 'cashier' || user.role === 'admin')) return;

        const unsubs: (() => void)[] = [];

        unsubs.push(onSnapshot(
            query(collection(db, "staff"), where("storeId", "==", storeId)),
            (snapshot) => {
                const members = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as StaffMember[];
                setStaff(members.sort((a, b) => a.name.localeCompare(b.name)));
            },
            (err) => console.error("[useStaff] staff listener error:", err.code, err.message)
        ));

        unsubs.push(onSnapshot(
            query(collection(db, "shifts"), where("storeId", "==", storeId), orderBy("startTime", "desc")),
            (snapshot) => {
                setShifts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Shift[]);
            }
        ));

        return () => unsubs.forEach(u => u());
    }, [user, currentStore?.id, storesResolved]);

    const addStaff = async (staffData: Omit<StaffMember, 'id'>) => {
        const storeId = currentStore?.id ?? user?.storeId;
        if (USE_MOCK_DATA) {
            setStaff(prev => [...prev, { ...staffData, id: `staff-${Date.now()}`, storeId }]);
            toast.success("Staff member added successfully (Mock)");
            return;
        }

        try {
            const { email, password, role: staffRole, name } = staffData as any;
            if (!email || !password) {
                toast.error("Email and password are required to create a staff account");
                return;
            }

            const secondaryApp = initializeApp(firebaseConfig, `staff-create-${Date.now()}`);
            const secondaryAuth = getAuth(secondaryApp);
            const secondaryDb = getFirestore(secondaryApp);

            try {
                const { user: newUser } = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                await setDoc(doc(secondaryDb, "users", newUser.uid), {
                    name: name || staffData.name,
                    email,
                    role: staffRole || staffData.role || 'cashier',
                    storeId,
                    createdAt: new Date().toISOString()
                });
                const staffDocRef = await addDoc(collection(db, "staff"), {
                    ...staffData, uid: newUser.uid, storeId, createdAt: new Date().toISOString()
                });
                const newMember: StaffMember = { ...staffData, id: staffDocRef.id, uid: newUser.uid, storeId } as StaffMember;
                setStaff(prev => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)));
                await signOut(secondaryAuth);
                toast.success("Staff account created — they can now log in");
            } finally {
                deleteApp(secondaryApp).catch(() => {});
            }
        } catch (error: any) {
            const msg = error?.code === 'auth/email-already-in-use'
                ? "An account with this email already exists"
                : error?.code === 'auth/weak-password'
                ? "Password must be at least 6 characters"
                : "Failed to create staff account";
            toast.error(msg);
            throw error;
        }
    };

    const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
        if (USE_MOCK_DATA) {
            setStaff(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
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
            setStaff(prev => prev.filter(m => m.id !== id));
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

    const startShift = async (float: number) => {
        if (currentShift) { toast.error("Shift already active"); return; }
        const newShiftData = {
            cashierId: user?.uid || 'unknown',
            cashierName: user?.name || 'Unknown',
            startTime: new Date().toISOString(),
            openingFloat: float,
            totalSales: 0,
            status: 'Open',
            storeId: currentStore?.id ?? user?.storeId,
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
        const closedData = { endTime: new Date().toISOString(), closingCash, status: 'Closed' };
        if (USE_MOCK_DATA) {
            setShifts(prev => [{ ...currentShift, ...closedData } as Shift, ...prev]);
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
        if (!currentShift) { toast.error("No active shift to record drop against."); return; }
        if (USE_MOCK_DATA) {
            toast.success(`Cash drop of R${amount.toFixed(2)} recorded for: ${reason} (Mock)`);
            return;
        }
        try {
            await addDoc(collection(db, `shifts/${currentShift.id}/cashDrops`), {
                amount, reason, timestamp: new Date().toISOString()
            });
            toast.success(`Cash drop of R${amount.toFixed(2)} recorded for: ${reason}`);
        } catch (error) {
            toast.error("Failed to record cash drop");
            throw error;
        }
    };

    return { staff, shifts, currentShift, addStaff, updateStaff, deleteStaff, startShift, endShift, recordCashDrop };
}
