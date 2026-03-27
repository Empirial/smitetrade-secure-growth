/**
 * useShifts — Cashier shift management slice of StoreContext
 *
 * Provides: shifts, currentShift, startShift, endShift, recordCashDrop
 *
 * currentShift is persisted to localStorage under 'smite_current_shift'
 * so an active shift survives a page refresh.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useShifts = () => {
    const { shifts, currentShift, startShift, endShift, recordCashDrop } = useStore();
    return { shifts, currentShift, startShift, endShift, recordCashDrop };
};
