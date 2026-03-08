import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useStore } from '@/context/StoreContext';
import { USE_MOCK_DATA } from '@/lib/constants';

export interface Notification {
    id: string;
    type: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
    targetRoles: string[]; // e.g. ['all'] or ['owner', 'cashier']
    createdAt: string;
    createdBy?: string;
    action?: { label: string; route: string } | null;
}

export interface UserNotificationState {
    id: string;
    userId: string;
    notificationId: string;
    read: boolean;
    dismissed: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'sys-1', type: 'info', title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance on March 12 from 2:00 AM – 4:00 AM. Some services may be temporarily unavailable.',
        targetRoles: ['all'], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        action: null
    },
    {
        id: 'sys-2', type: 'success', title: 'New Feature: Enhanced Reports',
        message: 'We\'ve rolled out improved analytics and reporting across all portals. Check your dashboard for new insights.',
        targetRoles: ['all'], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        action: null
    },
    {
        id: 'sys-3', type: 'warning', title: 'Policy Update: KYC Requirements',
        message: 'Updated KYC verification requirements take effect April 1. Please ensure your profile documents are up to date.',
        targetRoles: ['owner', 'lender'], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        action: null
    },
];

export function useNotifications() {
    const { user } = useStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userStates, setUserStates] = useState<UserNotificationState[]>([]);
    const [loading, setLoading] = useState(true);

    const role = user?.role || '';
    const userId = user?.uid || user?.id || '';

    // Listen to notifications targeted at this user's role
    useEffect(() => {
        if (USE_MOCK_DATA || !userId || !role) {
            const filtered = MOCK_NOTIFICATIONS.filter(n =>
                n.targetRoles.includes('all') || n.targetRoles.includes(role)
            );
            setNotifications(filtered);
            setLoading(false);
            return;
        }

        // Firestore doesn't support OR on array-contains, so we fetch all and filter client-side
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
            const filtered = all.filter((n: Notification) =>
                n.targetRoles?.includes('all') || n.targetRoles?.includes(role)
            ).map((n: any) => ({
                ...n,
                createdAt: n.createdAt instanceof Timestamp ? n.createdAt.toDate().toISOString() : n.createdAt,
            })) as Notification[];
            setNotifications(filtered);
            setLoading(false);
        }, () => setLoading(false));

        return () => unsub();
    }, [userId, role]);

    // Listen to user's read/dismissed states
    useEffect(() => {
        if (USE_MOCK_DATA || !userId) {
            setUserStates([]);
            return;
        }

        const q = query(collection(db, 'user_notifications'), where('userId', '==', userId));
        const unsub = onSnapshot(q, (snap) => {
            setUserStates(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserNotificationState)));
        });

        return () => unsub();
    }, [userId]);

    const isRead = (notificationId: string) => {
        return userStates.some(s => s.notificationId === notificationId && s.read);
    };

    const isDismissed = (notificationId: string) => {
        return userStates.some(s => s.notificationId === notificationId && s.dismissed);
    };

    const markAsRead = async (notificationId: string) => {
        if (USE_MOCK_DATA || !userId) return;
        const existing = userStates.find(s => s.notificationId === notificationId);
        if (existing) {
            await updateDoc(doc(db, 'user_notifications', existing.id), { read: true });
        } else {
            await addDoc(collection(db, 'user_notifications'), {
                userId, notificationId, read: true, dismissed: false
            });
        }
    };

    const dismiss = async (notificationId: string) => {
        if (USE_MOCK_DATA || !userId) return;
        const existing = userStates.find(s => s.notificationId === notificationId);
        if (existing) {
            await updateDoc(doc(db, 'user_notifications', existing.id), { dismissed: true, read: true });
        } else {
            await addDoc(collection(db, 'user_notifications'), {
                userId, notificationId, read: true, dismissed: true
            });
        }
    };

    const markAllAsRead = async () => {
        if (USE_MOCK_DATA || !userId) return;
        for (const n of notifications) {
            if (!isRead(n.id)) await markAsRead(n.id);
        }
    };

    // Admin: create a notification
    const createNotification = async (data: Omit<Notification, 'id' | 'createdAt' | 'createdBy'>) => {
        if (USE_MOCK_DATA || !userId) return;
        await addDoc(collection(db, 'notifications'), {
            ...data,
            createdAt: serverTimestamp(),
            createdBy: userId,
        });
    };

    const visibleNotifications = notifications.filter(n => !isDismissed(n.id));
    const unreadCount = visibleNotifications.filter(n => !isRead(n.id)).length;

    return {
        notifications: visibleNotifications,
        unreadCount,
        loading,
        isRead,
        markAsRead,
        dismiss,
        markAllAsRead,
        createNotification,
    };
}
