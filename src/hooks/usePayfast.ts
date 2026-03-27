import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/context/StoreContext';
import {
  buildPaymentParams,
  buildSubscriptionParams,
  submitPayfastForm,
  generatePayfastRef,
  PayfastPaymentParams,
  PayfastSubscriptionParams,
} from '@/lib/payfast';

// ─── Record pending transaction before redirect ─────────────────────────────
const recordPending = async (
  userId: string,
  reference: string,
  amount: number,
  email: string,
  type: 'payment' | 'subscription',
  meta?: Record<string, unknown>
) => {
  try {
    await addDoc(collection(db, 'transactions'), {
      userId,
      reference,
      amount,
      email,
      type,
      status: 'pending',
      currency: 'ZAR',
      provider: 'payfast',
      meta: meta || {},
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to record pending transaction:', err);
  }
};

// ─── Hook ───────────────────────────────────────────────────────────────────
export const usePayfast = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useStore();

  // One-time payment
  const pay = useCallback(
    async (params: PayfastPaymentParams) => {
      setLoading(true);
      const reference = params.mPaymentId || generatePayfastRef();
      const finalParams: PayfastPaymentParams = { ...params, mPaymentId: reference };

      try {
        if (user?.uid) {
          await recordPending(user.uid, reference, params.amount, params.emailAddress, 'payment', {
            itemName: params.itemName,
            portal: params.customStr1,
            storeId: params.customStr2,
          });
        }
        toast.info('Redirecting to PayFast secure payment...');
        submitPayfastForm(buildPaymentParams(finalParams));
      } catch {
        toast.error('Payment failed to initialize. Please try again.');
        setLoading(false);
      }
    },
    [user]
  );

  // Recurring subscription payment
  const subscribe = useCallback(
    async (params: PayfastSubscriptionParams) => {
      setLoading(true);
      const reference = params.mPaymentId || generatePayfastRef();
      const finalParams: PayfastSubscriptionParams = { ...params, mPaymentId: reference };

      try {
        if (user?.uid) {
          await recordPending(user.uid, reference, params.amount, params.emailAddress, 'subscription', {
            itemName: params.itemName,
            frequency: params.frequency,
            cycles: params.cycles,
          });
        }
        toast.info('Redirecting to PayFast for subscription setup...');
        submitPayfastForm(buildSubscriptionParams(finalParams));
      } catch {
        toast.error('Subscription failed to initialize. Please try again.');
        setLoading(false);
      }
    },
    [user]
  );

  return { pay, subscribe, loading };
};
