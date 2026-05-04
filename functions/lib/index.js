"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalCaptureOrder = exports.paypalCreateOrder = exports.aiChat = exports.payfastITN = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const v2_1 = require("firebase-functions/v2");
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const querystring = __importStar(require("querystring"));
const https = __importStar(require("https"));
const anthropicKey = (0, params_1.defineSecret)('ANTHROPIC_API_KEY');
const paypalClientId = (0, params_1.defineSecret)('PAYPAL_CLIENT_ID');
const paypalClientSecret = (0, params_1.defineSecret)('PAYPAL_CLIENT_SECRET');
admin.initializeApp();
const db = admin.firestore();
// ─── Config — set these env vars in Firebase Console or .env.local ──────────
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';
const IS_SANDBOX = process.env.PAYFAST_SANDBOX !== 'false';
// ─── Verify PayFast Signature ───────────────────────────────────────────────
function verifySignature(data, receivedSig) {
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
function validateWithPayfast(data) {
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
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve(body.trim() === 'VALID'));
        });
        req.on('error', () => resolve(false));
        req.write(postData);
        req.end();
    });
}
// ─── ITN Handler ─────────────────────────────────────────────────────────────
exports.payfastITN = (0, https_1.onRequest)({ cors: false }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const data = req.body;
    const { m_payment_id: reference, payment_status: status, amount_gross: amountGross, item_name: itemName, email_address: email, custom_str1: portal, custom_str2: storeId, custom_str3: orderId, signature, } = data;
    v2_1.logger.info('PayFast ITN received', { reference, status, portal });
    // 1. Verify signature
    if (!verifySignature(data, signature)) {
        v2_1.logger.warn('PayFast ITN: invalid signature', { reference });
        res.status(400).send('Invalid signature');
        return;
    }
    // 2. Validate with PayFast servers
    const isValid = await validateWithPayfast(data);
    if (!isValid) {
        v2_1.logger.warn('PayFast ITN: server validation failed', { reference });
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
        const updateData = {
            status: isPaid ? 'completed' : status === 'FAILED' ? 'failed' : 'pending',
            payfastStatus: status,
            amountGross: parseFloat(amountGross || '0'),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (!txQuery.empty) {
            await txQuery.docs[0].ref.update(updateData);
        }
        else {
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
        v2_1.logger.info('PayFast ITN processed', { reference, status, portal });
        res.status(200).send('');
    }
    catch (err) {
        v2_1.logger.error('PayFast ITN Firestore error', err);
        res.status(500).send('Internal error');
    }
});
// ─── AI Chat Proxy ────────────────────────────────────────────────────────────
exports.aiChat = (0, https_1.onRequest)({ cors: true, secrets: [anthropicKey] }, async (req, res) => {
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
    }
    catch {
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
        const { default: Anthropic } = await Promise.resolve().then(() => __importStar(require('@anthropic-ai/sdk')));
        const client = new Anthropic({ apiKey: anthropicKey.value() });
        const response = await client.messages.create({
            model,
            max_tokens,
            ...(system ? { system } : {}),
            messages,
        });
        res.status(200).json(response);
    }
    catch (err) {
        v2_1.logger.error('AI chat error', err);
        res.status(500).json({ error: 'AI request failed' });
    }
});
// ─── PayPal Helpers ───────────────────────────────────────────────────────────
const PAYPAL_API = process.env.PAYPAL_SANDBOX !== 'false'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
async function getPayPalAccessToken() {
    const credentials = Buffer.from(`${paypalClientId.value()}:${paypalClientSecret.value()}`).toString('base64');
    const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    if (!res.ok)
        throw new Error(`PayPal auth failed: ${res.status}`);
    const data = await res.json();
    return data.access_token;
}
// ─── PayPal: Create Order ─────────────────────────────────────────────────────
exports.paypalCreateOrder = (0, https_1.onRequest)({ cors: true, secrets: [paypalClientId, paypalClientSecret] }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        await admin.auth().verifyIdToken(idToken);
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    const { amount, itemName, itemDescription, portal, storeId, orderId, currency = 'USD' } = req.body;
    if (!amount || !itemName) {
        res.status(400).json({ error: 'amount and itemName are required' });
        return;
    }
    try {
        const accessToken = await getPayPalAccessToken();
        const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                        reference_id: orderId || `SMITE-${Date.now()}`,
                        custom_id: JSON.stringify({ portal, storeId, orderId }),
                        description: itemDescription || itemName,
                        amount: {
                            currency_code: currency,
                            value: Number(amount).toFixed(2),
                        },
                    }],
            }),
        });
        if (!orderRes.ok) {
            const err = await orderRes.text();
            v2_1.logger.error('PayPal create order error', { err });
            res.status(502).json({ error: 'PayPal order creation failed' });
            return;
        }
        const order = await orderRes.json();
        v2_1.logger.info('PayPal order created', { id: order.id });
        res.status(200).json({ id: order.id, status: order.status });
    }
    catch (err) {
        v2_1.logger.error('paypalCreateOrder error', err);
        res.status(500).json({ error: 'Internal error' });
    }
});
// ─── PayPal: Capture Order ────────────────────────────────────────────────────
exports.paypalCaptureOrder = (0, https_1.onRequest)({ cors: true, secrets: [paypalClientId, paypalClientSecret] }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        await admin.auth().verifyIdToken(idToken);
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    const { paypalOrderId } = req.body;
    if (!paypalOrderId) {
        res.status(400).json({ error: 'paypalOrderId is required' });
        return;
    }
    try {
        const accessToken = await getPayPalAccessToken();
        const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!captureRes.ok) {
            const err = await captureRes.text();
            v2_1.logger.error('PayPal capture error', { err });
            res.status(502).json({ error: 'PayPal capture failed' });
            return;
        }
        const capture = await captureRes.json();
        const unit = capture.purchase_units?.[0];
        const meta = unit?.custom_id ? JSON.parse(unit.custom_id) : {};
        const captured = unit?.payments?.captures?.[0];
        const amountValue = parseFloat(captured?.amount?.value || '0');
        const currency = captured?.amount?.currency_code || 'USD';
        const { portal, storeId, orderId } = meta;
        // Write to Firestore — same schema as PayFast transactions
        const txData = {
            reference: capture.id,
            status: capture.status === 'COMPLETED' ? 'completed' : 'pending',
            paypalStatus: capture.status,
            amountGross: amountValue,
            currency,
            provider: 'paypal',
            portal: portal || '',
            storeId: storeId || '',
            orderId: orderId || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('transactions').add(txData);
        // Per-portal post-payment logic (mirrors PayFast ITN)
        if (capture.status === 'COMPLETED') {
            if (portal === 'subscription' && storeId) {
                await db.collection('stores').doc(storeId).update({
                    subscriptionStatus: 'active',
                    subscriptionRef: capture.id,
                    subscriptionUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            if (portal === 'lender_disburse' && orderId) {
                await db.collection('loans').doc(orderId).update({
                    status: 'disbursed',
                    disbursedAt: admin.firestore.FieldValue.serverTimestamp(),
                    disbursementRef: capture.id,
                });
            }
            if (portal === 'lender_repayment' && orderId) {
                await db.collection('loans').doc(orderId).update({
                    lastPaymentRef: capture.id,
                    lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastPaymentAmount: amountValue,
                });
            }
            if (portal === 'driver_payout' && storeId) {
                await db.collection('driver_payouts').add({
                    driverId: storeId,
                    reference: capture.id,
                    amount: amountValue,
                    status: 'processed',
                    processedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }
        v2_1.logger.info('PayPal order captured', { id: capture.id, status: capture.status, portal });
        res.status(200).json({ id: capture.id, status: capture.status, portal, storeId, orderId });
    }
    catch (err) {
        v2_1.logger.error('paypalCaptureOrder error', err);
        res.status(500).json({ error: 'Internal error' });
    }
});
//# sourceMappingURL=index.js.map