// PayStack Test Mode Integration
// Test public key — no real charges will be made
export const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Test card numbers for PayStack sandbox:
// Success: 4084 0840 8408 4081 (any expiry, any CVV)
// Failed:  4084 0840 8408 4082

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo/cents (multiply ZAR by 100)
  currency?: string;
  reference?: string;
  onSuccess: (reference: { reference: string; trans: string; status: string; message: string }) => void;
  onClose: () => void;
}

export const generateReference = (): string => {
  return `SMITE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const initializePaystack = (config: PaystackConfig) => {
  const handler = (window as any).PaystackPop?.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: Math.round(config.amount * 100), // Convert ZAR to cents
    currency: config.currency || "ZAR",
    ref: config.reference || generateReference(),
    callback: (response: any) => {
      config.onSuccess(response);
    },
    onClose: () => {
      config.onClose();
    },
  });

  if (handler) {
    handler.openIframe();
  } else {
    console.error("PayStack SDK not loaded");
  }
};
