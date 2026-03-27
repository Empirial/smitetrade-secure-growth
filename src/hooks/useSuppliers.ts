/**
 * useSuppliers — Supplier management slice of StoreContext
 *
 * Provides: suppliers, addSupplier
 *
 * Suppliers are store-scoped. New suppliers are written to the
 * 'suppliers' Firestore collection with the owner's storeId.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useSuppliers = () => {
    const { suppliers, addSupplier } = useStore();
    return { suppliers, addSupplier };
};
