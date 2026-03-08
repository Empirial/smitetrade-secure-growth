import { useState, useCallback, useEffect } from 'react';
import { generateReference, PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { toast } from 'sonner';

interface UsePaystackOptions {
  amount: number; // in ZAR
  email?: string;
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

export const usePaystack = ({ amount, email, onSuccess, onClose }: UsePaystackOptions) => {
  const [processing, setProcessing] = useState(false);

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
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email || 'customer@smitetrade.co.za',
      amount: Math.round(amount * 100), // ZAR to cents
      currency: 'ZAR',
      ref,
      callback: (response: any) => {
        setProcessing(false);
        toast.success(`Payment successful! Ref: ${response.reference}`);
        onSuccess?.(response.reference);
      },
      onClose: () => {
        setProcessing(false);
        toast.info('Payment cancelled.');
        onClose?.();
      },
    });

    handler.openIframe();
  }, [amount, email, onSuccess, onClose]);

  return { pay, processing };
};
