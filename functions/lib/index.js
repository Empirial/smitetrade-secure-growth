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
exports.payfastITN = void 0;
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const querystring = __importStar(require("querystring"));
const https = __importStar(require("https"));
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
//# sourceMappingURL=index.js.map