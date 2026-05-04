import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { getAuthErrorMessage } from '@/lib/authErrors';
import {
    onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup,
    signOut, createUserWithEmailAndPassword, sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { googleProvider } from '@/lib/firebase';
import { MOCK_USER, MOCK_LENDER, USE_MOCK_DATA, MOCK_STORE_ID } from '@/lib/constants';
import { User, UserRole } from '@/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isRegistering = useRef(false);
    const loginRoleRef = useRef<UserRole | null>(null);

    // Auth state listener
    useEffect(() => {
        if (USE_MOCK_DATA) {
            setUser(MOCK_USER);
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    if (isRegistering.current) {
                        setIsLoading(false);
                        return;
                    }
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    // Force token refresh so Firestore rules have a validated token
                    // before any snapshot listeners are attached. Without this, there
                    // is a race window where listeners fire with an unverified token.
                    await firebaseUser.getIdToken(true);
                    if (userDoc.exists()) {
                        const userData = { ...userDoc.data(), id: firebaseUser.uid, uid: firebaseUser.uid, emailVerified: firebaseUser.emailVerified } as User;
                        const intendedRole = loginRoleRef.current ?? (sessionStorage.getItem('smite_active_role') as UserRole | null);
                        loginRoleRef.current = null;
                        if (intendedRole) {
                            const userRoles: UserRole[] = userData.roles || [userData.role];
                            if (userRoles.includes(intendedRole)) {
                                userData.role = intendedRole;
                            } else {
                                await signOut(auth);
                                toast.error(`You don't have ${intendedRole} access. Please register for this portal first.`);
                                setIsLoading(false);
                                return;
                            }
                        }
                        setUser(userData);
                    } else if (!isRegistering.current) {
                        await signOut(auth);
                        toast.error("Account setup incomplete. Please register again.");
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth state error:", err);
                await signOut(auth);
                toast.error("Unable to load your account. Please check your connection and try again.");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string, roleFallback?: UserRole) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (roleFallback === 'lender') {
                setUser(MOCK_LENDER);
            } else {
                setUser({
                    id: "mock-user-123", uid: "mock-user-123",
                    name: "Mock User", email,
                    role: roleFallback || 'owner',
                    storeName: roleFallback === 'owner' ? "Soweto Central Spaza" : undefined,
                    storeId: (roleFallback === 'owner' || roleFallback === 'cashier') ? MOCK_STORE_ID : undefined,
                });
            }
            toast.success("Mock Login Successful!");
            return;
        }
        try {
            loginRoleRef.current = roleFallback || null;
            if (roleFallback) sessionStorage.setItem('smite_active_role', roleFallback);
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(getAuthErrorMessage(error));
            throw error;
        }
    };

    const loginWithGoogle = async (role: UserRole) => {
        try {
            isRegistering.current = true;
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            await firebaseUser.getIdToken(true); // ensure token propagated to Firestore before reads
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                const userData: any = {
                    name: firebaseUser.displayName || "Google User",
                    email: firebaseUser.email || "",
                    role, roles: [role],
                };
                await setDoc(userRef, userData);
                await setDoc(doc(db, "user_roles", firebaseUser.uid), { role, roles: [role] });
                isRegistering.current = false;
                sessionStorage.setItem('smite_active_role', role);
                setUser({ ...userData, id: firebaseUser.uid, uid: firebaseUser.uid });
                toast.success("Account created with Google!");
            } else {
                const existingData = userSnap.data();
                const existingRoles: UserRole[] = existingData.roles || [existingData.role];
                const updates: any = {};
                if (!existingRoles.includes(role)) {
                    existingRoles.push(role);
                    updates.roles = existingRoles;
                    await updateDoc(userRef, updates);
                }
                isRegistering.current = false;
                sessionStorage.setItem('smite_active_role', role);
                setUser({ ...existingData, ...updates, id: firebaseUser.uid, uid: firebaseUser.uid, role, roles: existingRoles } as User);
                toast.success("Signed in with Google!");
            }
        } catch (error: any) {
            isRegistering.current = false;
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error("Google sign-in error:", error);
                toast.error(getAuthErrorMessage(error));
            }
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string, role: UserRole, storeName?: string) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser({
                id: "mock-new-user-" + Date.now(),
                uid: "mock-new-user-" + Date.now(),
                name, email, role,
                storeName: role === 'owner' ? storeName : undefined,
                storeId: role === 'owner' ? MOCK_STORE_ID : undefined,
            });
            toast.success("Mock Registration Successful!");
            return;
        }

        try {
            isRegistering.current = true;
            let firebaseUser: import('firebase/auth').User;
            let isExistingUser = false;

            try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                firebaseUser = result.user;
            } catch (createError: any) {
                if (createError.code === 'auth/email-already-in-use') {
                    // Try to sign in to add a new role to the existing account.
                    // If the password is wrong, show a clear message instead of a
                    // cryptic auth/invalid-credential error.
                    try {
                        const result = await signInWithEmailAndPassword(auth, email, password);
                        firebaseUser = result.user;
                        isExistingUser = true;
                    } catch (signInError: any) {
                        isRegistering.current = false;
                        toast.error("An account with this email already exists. Please use the correct password to add a new role, or log in instead.");
                        throw signInError;
                    }
                } else {
                    throw createError;
                }
            }

            if (isExistingUser) {
                const userRef = doc(db, "users", firebaseUser!.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const existingData = userSnap.data();
                    const existingRoles: UserRole[] = existingData.roles || [existingData.role];
                    if (!existingRoles.includes(role)) existingRoles.push(role);
                    const updates: any = { roles: existingRoles };

                    let storeId = existingData.storeId;
                    if (role === 'owner' && storeName && !storeId) {
                        const storeRef = doc(collection(db, "stores"));
                        storeId = storeRef.id;
                        const createdAt = new Date().toISOString();
                        await setDoc(storeRef, {
                            ownerId: firebaseUser!.uid, name: storeName,
                            address: "", suburb: "", city: "", province: "",
                            status: "Pending", createdAt
                        });
                        await addDoc(collection(db, "applications"), {
                            storeId, ownerId: firebaseUser!.uid,
                            name: storeName, owner: existingData.name || name, email,
                            phone: "", location: "", description: "", documents: [], messages: [],
                            status: "Pending", date: createdAt.split("T")[0], createdAt
                        });
                        updates.storeId = storeId;
                        updates.storeName = storeName;
                    }
                    await updateDoc(userRef, updates);
                    isRegistering.current = false;
                    setUser({ ...existingData, ...updates, id: firebaseUser!.uid, uid: firebaseUser!.uid, role, roles: existingRoles } as User);
                    toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} role added to your account!`);
                    return;
                }
            }

            const userData: any = { name, email, role, roles: [role], ...(storeName && { storeName }) };
            await setDoc(doc(db, "users", firebaseUser!.uid), userData);
            await setDoc(doc(db, "user_roles", firebaseUser!.uid), { role, roles: [role] });

            if (role === 'owner' && storeName) {
                const storeRef = doc(collection(db, "stores"));
                const storeId = storeRef.id;
                const createdAt = new Date().toISOString();
                await setDoc(storeRef, {
                    ownerId: firebaseUser!.uid, name: storeName,
                    address: "", suburb: "", city: "", province: "",
                    status: "Pending", createdAt
                });
                await addDoc(collection(db, "applications"), {
                    storeId, ownerId: firebaseUser!.uid,
                    name: storeName, owner: name, email,
                    phone: "", location: "", description: "", documents: [], messages: [],
                    status: "Pending", date: createdAt.split("T")[0], createdAt
                });
                await updateDoc(doc(db, "users", firebaseUser!.uid), { storeId });
                userData.storeId = storeId;
            }

            isRegistering.current = false;

            if (role === 'owner' || role === 'customer') {
                await sendEmailVerification(firebaseUser!);
                await signOut(auth);
                setUser(null);
                toast.success("Account created! Check your email to verify before logging in.");
                return;
            }

            setUser({ ...userData, id: firebaseUser!.uid, uid: firebaseUser!.uid });
            toast.success("Account created successfully!");
        } catch (error) {
            isRegistering.current = false;
            console.error("Registration error:", error);
            toast.error(getAuthErrorMessage(error));
            throw error;
        }
    };

    const logout = async () => {
        if (USE_MOCK_DATA) {
            setUser(null);
            toast.info("Mock Logout Successful");
            return;
        }
        try {
            sessionStorage.removeItem('smite_active_role');
            await signOut(auth);
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;
        if (USE_MOCK_DATA) {
            setUser(prev => prev ? { ...prev, ...updates } : null);
            toast.success("Profile updated (Mock)");
            return;
        }
        try {
            await updateDoc(doc(db, "users", user.uid), updates);
            setUser(prev => prev ? { ...prev, ...updates } : null);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Failed to update profile");
            throw error;
        }
    };

    const toggleWishlist = (productId: string) => {
        if (!user) return;
        const currentWishlist = user.wishlist || [];
        const exists = currentWishlist.includes(productId);
        const newWishlist = exists
            ? currentWishlist.filter(id => id !== productId)
            : [...currentWishlist, productId];
        if (exists) toast.info("Removed from wishlist");
        else toast.success("Added to wishlist");
        updateUser({ wishlist: newWishlist });
    };

    return { user, isLoading, login, loginWithGoogle, register, logout, updateUser, toggleWishlist };
}
