/**
 * useProducts — Inventory / product catalogue slice of StoreContext
 *
 * Provides: products, allProducts, addProduct, updateProduct, deleteProduct
 *
 * - products      → store-scoped list (for owner/cashier management views)
 * - allProducts   → full catalogue across all stores (for customer e-commerce)
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useProducts = () => {
    const { products, allProducts, addProduct, updateProduct, deleteProduct } = useStore();
    return { products, allProducts, addProduct, updateProduct, deleteProduct };
};
