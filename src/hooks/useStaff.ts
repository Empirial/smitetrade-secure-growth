/**
 * useStaff — Staff management slice of StoreContext
 *
 * Provides: staff, addStaff, updateStaff, deleteStaff
 *
 * addStaff in live mode creates a real Firebase Auth account for the
 * new staff member using a secondary app instance (so the owner stays
 * signed in), then writes to the 'staff' Firestore collection.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useStaff = () => {
    const { staff, addStaff, updateStaff, deleteStaff } = useStore();
    return { staff, addStaff, updateStaff, deleteStaff };
};
