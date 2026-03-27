/**
 * useCustomers — In-store customer (tab) management slice of StoreContext
 *
 * Provides: customers, addCustomer, updateCustomer, settleCustomerTab
 *
 * These are "walk-in" customers tracked by the owner/cashier portal —
 * distinct from registered app users. Each customer can have a running
 * tab balance that can be settled via settleCustomerTab.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useCustomers = () => {
    const { customers, addCustomer, updateCustomer, settleCustomerTab } = useStore();
    return { customers, addCustomer, updateCustomer, settleCustomerTab };
};
