import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { USE_MOCK_DATA } from '@/lib/constants';
import { User, Issue } from '@/types';

export function useIssues(user: User | null, storesResolved: boolean) {
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        if (!user || !storesResolved || USE_MOCK_DATA) return;
        if (user.role !== 'driver' && user.role !== 'owner' && user.role !== 'admin') return;

        const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setIssues(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Issue[]);
        });
        return () => unsub();
    }, [user, storesResolved]);

    const reportIssue = async (issueData: Omit<Issue, 'id' | 'timestamp' | 'status'>) => {
        const payload = { ...issueData, timestamp: new Date().toISOString(), status: 'Open' as const };
        if (USE_MOCK_DATA) {
            setIssues(prev => [{ ...payload, id: `issue-${Date.now()}` } as Issue, ...prev]);
            toast.success("Issue reported successfully (Mock)");
            return;
        }
        try {
            await addDoc(collection(db, "issues"), payload);
            toast.success("Issue reported successfully");
        } catch (error) {
            toast.error("Failed to report issue");
            throw error;
        }
    };

    return { issues, reportIssue };
}
