import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import * as https from 'https';
const anthropicKey = defineSecret('ANTHROPIC_API_KEY');

admin.initializeApp();
const db = admin.firestore();

// ─── Config — set these env vars in Firebase Console or .env.local ──────────
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';
const IS_SANDBOX = process.env.PAYFAST_SANDBOX !== 'false';

// ─── Verify PayFast Signature ───────────────────────────────────────────────
function verifySignature(data: Record<string, string>, receivedSig: string): boolean {
  const params = { ...data };
  delete params.signature;

  const pfParamString = Object.entries(params)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
    .join('&');

  const stringToHash = PASSPHRASE
    ? `${pfParamString}&passphrase=${encodeURIComponent(PASSPHRASE).replace(/%20/g, '+')}`
    : pfParamString;

  const hash = crypto.createHash('md5').update(stringToHash).digest('hex');
  return hash === receivedSig;
}

// ─── Validate with PayFast servers (anti-replay protection) ─────────────────
function validateWithPayfast(data: Record<string, string>): Promise<boolean> {
  return new Promise((resolve) => {
    const host = IS_SANDBOX ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    const postData = querystring.stringify(data);
    const options = {
      hostname: host,
      port: 443,
      path: '/eng/query/validate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk: string) => (body += chunk));
      res.on('end', () => resolve(body.trim() === 'VALID'));
    });

    req.on('error', () => resolve(false));
    req.write(postData);
    req.end();
  });
}

// ─── ITN Handler ─────────────────────────────────────────────────────────────
export const payfastITN = onRequest({ cors: false }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const data: Record<string, string> = req.body;
  const {
    m_payment_id: reference,
    payment_status: status,
    amount_gross: amountGross,
    item_name: itemName,
    email_address: email,
    custom_str1: portal,
    custom_str2: storeId,
    custom_str3: orderId,
    signature,
  } = data;

  logger.info('PayFast ITN received', { reference, status, portal });

  // 1. Verify signature
  if (!verifySignature(data, signature)) {
    logger.warn('PayFast ITN: invalid signature', { reference });
    res.status(400).send('Invalid signature');
    return;
  }

  // 2. Validate with PayFast servers
  const isValid = await validateWithPayfast(data);
  if (!isValid) {
    logger.warn('PayFast ITN: server validation failed', { reference });
    res.status(400).send('Validation failed');
    return;
  }

  // 3. Update Firestore transaction record
  try {
    const txQuery = await db
      .collection('transactions')
      .where('reference', '==', reference)
      .limit(1)
      .get();

    const isPaid = status === 'COMPLETE';
    const updateData: Record<string, unknown> = {
      status: isPaid ? 'completed' : status === 'FAILED' ? 'failed' : 'pending',
      payfastStatus: status,
      amountGross: parseFloat(amountGross || '0'),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!txQuery.empty) {
      await txQuery.docs[0].ref.update(updateData);
    } else {
      await db.collection('transactions').add({
        reference,
        status: isPaid ? 'completed' : 'failed',
        payfastStatus: status,
        amountGross: parseFloat(amountGross || '0'),
        itemName,
        email,
        portal,
        storeId,
        orderId,
        provider: 'payfast',
        currency: 'ZAR',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 4. Per-portal post-payment logic
    if (isPaid) {
      if (portal === 'subscription' && storeId) {
        await db.collection('stores').doc(storeId).update({
          subscriptionStatus: 'active',
          subscriptionRef: reference,
          subscriptionUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (portal === 'lender_disburse' && orderId) {
        await db.collection('loans').doc(orderId).update({
          status: 'disbursed',
          disbursedAt: admin.firestore.FieldValue.serverTimestamp(),
          disbursementRef: reference,
        });
      }

      if (portal === 'lender_repayment' && orderId) {
        await db.collection('loans').doc(orderId).update({
          lastPaymentRef: reference,
          lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
          lastPaymentAmount: parseFloat(amountGross || '0'),
        });
      }

      if (portal === 'driver_payout' && storeId) {
        await db.collection('driver_payouts').add({
          driverId: storeId,
          reference,
          amount: parseFloat(amountGross || '0'),
          status: 'processed',
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    logger.info('PayFast ITN processed', { reference, status, portal });
    res.status(200).send('');
  } catch (err) {
    logger.error('PayFast ITN Firestore error', err);
    res.status(500).send('Internal error');
  }
});

// ─── AI Chat Proxy ────────────────────────────────────────────────────────────
export const aiChat = onRequest(
  { cors: true, secrets: [anthropicKey] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Verify Firebase Auth token
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      await admin.auth().verifyIdToken(idToken);
    } catch {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const { messages, system, model = 'claude-sonnet-4-6', max_tokens = 1024 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: anthropicKey.value() });
      const response = await client.messages.create({
        model,
        max_tokens,
        ...(system ? { system } : {}),
        messages,
      });

      res.status(200).json(response);
    } catch (err) {
      logger.error('AI chat error', err);
      res.status(500).json({ error: 'AI request failed' });
    }
  }
);
