import { useState, useCallback, useEffect } from 'react';
import { generateReference, PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { toast } from 'sonner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/context/StoreContext';

interface UsePaystackOptions {
  amount: number; // in ZAR
  email?: string;
  description?: string;
  orderId?: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

// Ensure PayStack script is loaded once
let scriptLoaded = false;
let scriptLoading = false;

const loadPaystackScript = (): Promise<void> => {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (scriptLoaded) { clearInterval(check); resolve(); }
      }, 100);
    });
  }

  scriptLoading = true;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => { scriptLoaded = true; scriptLoading = false; resolve(); };
    script.onerror = () => { scriptLoading = false; reject(new Error('Failed to load PayStack')); };
    document.head.appendChild(script);
  });
};

const recordTransaction = async (
  userId: string,
  reference: string,
  amount: number,
  email: string,
  description?: string,
  orderId?: string
) => {
  try {
    await addDoc(collection(db, 'transactions'), {
      userId,
      reference,
      amount,
      email,
      description: description || 'Payment',
      orderId: orderId || null,
      status: 'success',
      currency: 'ZAR',
      provider: 'paystack',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to record transaction:', err);
  }
};

export const usePaystack = ({ amount, email, description, orderId, onSuccess, onClose }: UsePaystackOptions) => {
  const [processing, setProcessing] = useState(false);
  const { user } = useStore();

  useEffect(() => {
    loadPaystackScript().catch(() => {
      console.warn('PayStack script failed to load — will retry on pay');
    });
  }, []);

  const pay = useCallback(async () => {
    setProcessing(true);

    try {
      await loadPaystackScript();
    } catch {
      toast.error('Payment service unavailable. Please try again.');
      setProcessing(false);
      return;
    }

    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      toast.error('Payment service unavailable.');
      setProcessing(false);
      return;
    }

    const ref = generateReference();
    const payerEmail = email || user?.email || 'customer@smitetrade.co.za';

    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: payerEmail,
      amount: Math.round(amount * 100), // ZAR to cents
      currency: 'ZAR',
      ref,
      callback: async (response: any) => {
        setProcessing(false);
        toast.success(`Payment successful! Ref: ${response.reference}`);

        // Record to Firestore
        if (user?.uid) {
          await recordTransaction(user.uid, response.reference, amount, payerEmail, description, orderId);
        }

        onSuccess?.(response.reference);
      },
      onClose: () => {
        setProcessing(false);
        toast.info('Payment cancelled.');
        onClose?.();
      },
    });

    handler.openIframe();
  }, [amount, email, description, orderId, onSuccess, onClose, user]);

  return { pay, processing };
};
