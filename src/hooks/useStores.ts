/**
 * useStores — Multi-tenant store slice of StoreContext
 *
 * Provides: stores, currentStore, switchStore
 *
 * This is a re-export shim. All state lives in StoreContext.
 * Use this hook in components that only need to read or switch
 * between stores, without pulling in the full context surface.
 */
import { useStore } from '@/context/StoreContext';

export const useStores = () => {
    const { stores, currentStore, switchStore } = useStore();
    return { stores, currentStore, switchStore };
};
