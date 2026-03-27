/**
 * useCart — Shopping cart slice of StoreContext
 *
 * Provides: cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal
 *
 * Cart is persisted to localStorage under the key 'smite_cart'.
 * Single-store rule is enforced in addToCart — items from different
 * stores cannot be mixed in one cart.
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useCart = () => {
    const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useStore();
    return { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal };
};
