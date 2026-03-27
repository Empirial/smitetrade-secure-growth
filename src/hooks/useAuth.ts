/**
 * useAuth — Authentication slice of StoreContext
 *
 * Provides: user, login, loginWithGoogle, register, logout, updateUser
 *
 * This is a re-export shim. All state lives in StoreContext.
 * Import from here when you only need auth-related values to make
 * the dependency explicit and reduce future cognitive load.
 */
import { useStore } from '@/context/StoreContext';

export const useAuth = () => {
    const { user, login, loginWithGoogle, register, logout, updateUser } = useStore();
    return { user, login, loginWithGoogle, register, logout, updateUser };
};
