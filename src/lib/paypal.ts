const IS_SANDBOX = import.meta.env.VITE_PAYPAL_SANDBOX !== 'false';
const FUNCTIONS_BASE =
  import.meta.env.VITE_FUNCTIONS_URL ||
  'https://us-central1-smitetrade-40643.cloudfunctions.net';

export const PAYPAL_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'; // 'sb' = PayPal sandbox test client

export const PAYPAL_CURRENCY = 'ZAR';

export const IS_PAYPAL_SANDBOX = IS_SANDBOX;

export interface PayPalPaymentParams {
  amount: number; // in USD (or chosen currency)
  itemName: string;
  itemDescription?: string;
  portal?: string;   // e.g. 'subscription', 'lender_disburse'
  storeId?: string;
  orderId?: string;
  currency?: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  portal?: string;
  storeId?: string;
  orderId?: string;
}

export const createPayPalOrder = async (
  params: PayPalPaymentParams,
  idToken: string
): Promise<string> => {
  const res = await fetch(`${FUNCTIONS_BASE}/paypalCreateOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create order failed: ${err}`);
  }

  const data: PayPalOrderResponse = await res.json();
  return data.id;
};

export const capturePayPalOrder = async (
  paypalOrderId: string,
  idToken: string
): Promise<PayPalCaptureResponse> => {
  const res = await fetch(`${FUNCTIONS_BASE}/paypalCaptureOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ paypalOrderId }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  return res.json();
};
