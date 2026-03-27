/**
 * useMisc — Miscellaneous features slice of StoreContext
 *
 * Provides: issues, reportIssue, toggleWishlist
 *
 * issues      → driver/owner issue reporting (stored locally in state)
 * toggleWishlist → adds/removes a productId from user.wishlist (persisted via updateUser)
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useMisc = () => {
    const { issues, reportIssue, toggleWishlist } = useStore();
    return { issues, reportIssue, toggleWishlist };
};
