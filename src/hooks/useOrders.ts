/**
 * useOrders — Orders slice of StoreContext
 *
 * Provides: orders, placeOrder, updateOrderStatus, assignDriver, isLoading
 *
 * Orders are role-scoped via Firestore queries:
 *   - owner/cashier → filtered by storeId
 *   - customer      → filtered by userId
 *   - driver        → Ready orders + orders assigned to them
 *   - admin         → all orders
 *
 * updateOrderStatus includes Algorithm 8 (Driver Assignment):
 * when status changes to 'Ready', the least-busy available driver
 * is pre-assigned automatically.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useOrders = () => {
    const { orders, placeOrder, updateOrderStatus, assignDriver, isLoading } = useStore();
    return { orders, placeOrder, updateOrderStatus, assignDriver, isLoading };
};
