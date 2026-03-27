import CryptoJS from 'crypto-js';

// ─── Config ────────────────────────────────────────────────────────────────
const MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100';
const MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || 'q1cd2rdny4a53';
const PASSPHRASE = import.meta.env.VITE_PAYFAST_PASSPHRASE || '';
const IS_SANDBOX = import.meta.env.VITE_PAYFAST_SANDBOX !== 'false';
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8080';
const NOTIFY_URL =
  import.meta.env.VITE_PAYFAST_NOTIFY_URL ||
  'https://us-central1-smitetrade-40643.cloudfunctions.net/payfastITN';

export const PAYFAST_URL = IS_SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process';

export const IS_PAYFAST_SANDBOX = IS_SANDBOX;

// ─── Types ─────────────────────────────────────────────────────────────────
export interface PayfastPaymentParams {
  emailAddress: string;
  amount: number; // ZAR e.g. 99.00
  itemName: string;
  mPaymentId?: string; // auto-generated if omitted
  nameFirst?: string;
  nameLast?: string;
  itemDescription?: string;
  customStr1?: string; // portal / payment type identifier
  customStr2?: string; // storeId
  customStr3?: string; // orderId or any extra ref
  customInt1?: number;
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
}

export interface PayfastSubscriptionParams extends PayfastPaymentParams {
  frequency: 3 | 6; // 3 = monthly, 6 = annual
  cycles?: number;   // 0 = indefinite
  recurringAmount?: number; // if different from initial amount
  billingDate?: string;     // YYYY-MM-DD, defaults to today
}

// ─── Reference Generator ───────────────────────────────────────────────────
export const generatePayfastRef = (): string => {
  const ts = Date.now();
  const rand = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `SMITE-PF-${ts}-${rand}`;
};

// ─── Signature ─────────────────────────────────────────────────────────────
const buildParamString = (params: Record<string, string>): string =>
  Object.entries(params)
    .filter(([, v]) => v !== '' && v != null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, '+')}`)
    .join('&');

const generateSignature = (params: Record<string, string>): string => {
  let str = buildParamString(params);
  if (PASSPHRASE) {
    str += `&passphrase=${encodeURIComponent(PASSPHRASE.trim()).replace(/%20/g, '+')}`;
  }
  return CryptoJS.MD5(str).toString();
};

// ─── Build Base Params ─────────────────────────────────────────────────────
const buildBase = (p: PayfastPaymentParams): Record<string, string> => {
  const ref = p.mPaymentId || generatePayfastRef();
  const raw: Record<string, string> = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: p.returnUrl || `${APP_URL}/payment/success`,
    cancel_url: p.cancelUrl || `${APP_URL}/payment/cancel`,
    notify_url: p.notifyUrl || NOTIFY_URL,
    name_first: p.nameFirst || '',
    name_last: p.nameLast || '',
    email_address: p.emailAddress,
    m_payment_id: ref,
    amount: p.amount.toFixed(2),
    item_name: p.itemName,
    item_description: p.itemDescription || '',
    custom_str1: p.customStr1 || '',
    custom_str2: p.customStr2 || '',
    custom_str3: p.customStr3 || '',
    custom_int1: p.customInt1 != null ? String(p.customInt1) : '',
  };

  // Strip empty fields — PayFast ignores them but clean is safer
  (Object.keys(raw) as (keyof typeof raw)[]).forEach((k) => {
    if (!raw[k]) delete raw[k];
  });

  return raw;
};

// ─── One-Time Payment ──────────────────────────────────────────────────────
export const buildPaymentParams = (p: PayfastPaymentParams): Record<string, string> => {
  const params = buildBase(p);
  params.signature = generateSignature(params);
  return params;
};

// ─── Subscription Payment ──────────────────────────────────────────────────
export const buildSubscriptionParams = (p: PayfastSubscriptionParams): Record<string, string> => {
  const params = buildBase(p);
  params.subscription_type = '1';
  params.frequency = String(p.frequency);
  params.cycles = String(p.cycles ?? 0);
  if (p.recurringAmount != null) params.recurring_amount = p.recurringAmount.toFixed(2);
  if (p.billingDate) params.billing_date = p.billingDate;
  params.signature = generateSignature(params);
  return params;
};

// ─── Submit Form to PayFast ────────────────────────────────────────────────
export const submitPayfastForm = (params: Record<string, string>): void => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST_URL;

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
