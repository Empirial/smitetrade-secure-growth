// @vitest-environment node
/**
 * Firestore Security Rules Tests
 *
 * Requires the Firebase emulator running before this suite:
 *   firebase emulators:start --only firestore
 *
 * Run with:
 *   npm run test:rules
 */

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
} from 'firebase/firestore';
import { describe, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// ─── Setup ────────────────────────────────────────────────────────────────────

const PROJECT_ID = 'smitetrade-test';
const RULES_PATH = resolve(__dirname, '../../firestore.rules');

let testEnv: RulesTestEnvironment;

// Seed doc IDs
const STORE_A = 'store-a';
const STORE_B = 'store-b';
const OWNER_A_UID = 'owner-a';
const OWNER_B_UID = 'owner-b';
const CASHIER_A_UID = 'cashier-a';
const DRIVER_UID = 'driver-1';
const LENDER_UID = 'lender-1';
const CUSTOMER_UID = 'customer-1';
const ADMIN_UID = 'admin-1';

/** Returns a Firestore client authenticated as a given UID with role/storeId injected */
function asUser(uid: string) {
    return testEnv.authenticatedContext(uid).firestore();
}

function asAnon() {
    return testEnv.unauthenticatedContext().firestore();
}

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
            rules: readFileSync(RULES_PATH, 'utf8'),
            host: '127.0.0.1',
            port: 8088,
        },
    });

    // Seed user profiles so role() helper can resolve them
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();

        const users: Record<string, { role: string; storeId?: string }> = {
            [ADMIN_UID]: { role: 'admin' },
            [OWNER_A_UID]: { role: 'owner', storeId: STORE_A },
            [OWNER_B_UID]: { role: 'owner', storeId: STORE_B },
            [CASHIER_A_UID]: { role: 'cashier', storeId: STORE_A },
            [DRIVER_UID]: { role: 'driver', storeId: STORE_A },
            [LENDER_UID]: { role: 'lender' },
            [CUSTOMER_UID]: { role: 'customer' },
        };

        for (const [uid, data] of Object.entries(users)) {
            await setDoc(doc(db, 'users', uid), data);
        }

        // Seed test store
        await setDoc(doc(db, 'stores', STORE_A), { name: 'Store A', ownerId: OWNER_A_UID });
        await setDoc(doc(db, 'stores', STORE_B), { name: 'Store B', ownerId: OWNER_B_UID });

        // Seed a product in Store A
        await setDoc(doc(db, 'products', 'product-a1'), {
            name: 'Bread', price: 15, stock: 100, storeId: STORE_A,
        });

        // Seed an order in Store A
        await setDoc(doc(db, 'orders', 'order-a1'), {
            storeId: STORE_A,
            userId: CUSTOMER_UID,
            driverId: DRIVER_UID,
            total: 100,
            items: [{ productId: 'product-a1', qty: 1, price: 15 }],
            status: 'Pending',
        });

        // Seed a shift in Store A
        await setDoc(doc(db, 'shifts', 'shift-a1'), {
            storeId: STORE_A, cashierId: CASHIER_A_UID, startTime: new Date().toISOString(),
        });

        // Seed a cash drop
        await setDoc(doc(db, 'shifts', 'shift-a1', 'cashDrops', 'drop-1'), {
            cashierId: CASHIER_A_UID, amount: 500, reason: 'safe drop',
        });

        // Seed a loan
        await setDoc(doc(db, 'loans', 'loan-1'), {
            lenderId: LENDER_UID, borrowerId: CUSTOMER_UID, amount: 1000,
            status: 'active', dueDate: '2026-12-31',
        });

        // Seed a credit profile
        await setDoc(doc(db, 'credit_profiles', CUSTOMER_UID), {
            creditLimit: 5000, balance: 0, score: 75,
        });

        // Seed borrower
        await setDoc(doc(db, 'borrowers', 'borrower-1'), {
            lenderId: LENDER_UID, name: 'Test Borrower',
        });

        // Seed a staff doc
        await setDoc(doc(db, 'staff', CASHIER_A_UID), {
            storeId: STORE_A, name: 'Cashier A', role: 'cashier',
        });

        // Seed expense
        await setDoc(doc(db, 'expenses', 'expense-1'), {
            storeId: STORE_A, amount: 200, description: 'Cleaning',
        });

        // Seed audit log
        await setDoc(doc(db, 'audit_logs', 'log-1'), {
            action: 'login', userId: OWNER_A_UID,
        });
    });
});

afterAll(async () => {
    await testEnv.cleanup();
});

afterEach(async () => {
    // Reset rules after each test — no teardown needed since we don't mutate
});

// ─── USERS ────────────────────────────────────────────────────────────────────

describe('users collection', () => {
    it('unauthenticated cannot read any user', async () => {
        await assertFails(getDoc(doc(asAnon(), 'users', OWNER_A_UID)));
    });

    it('user can read their own doc', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'users', OWNER_A_UID)));
    });

    it('user cannot read another user doc', async () => {
        await assertFails(getDoc(doc(asUser(CUSTOMER_UID), 'users', OWNER_A_UID)));
    });

    it('owner can read any user doc', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'users', CUSTOMER_UID)));
    });

    it('admin can read any user doc', async () => {
        await assertSucceeds(getDoc(doc(asUser(ADMIN_UID), 'users', CUSTOMER_UID)));
    });

    it('user can create their own doc', async () => {
        const newUid = 'new-user-99';
        await assertSucceeds(
            setDoc(doc(asUser(newUid), 'users', newUid), { role: 'customer', name: 'New User' })
        );
    });

    it('user cannot create a doc for another uid', async () => {
        await assertFails(
            setDoc(doc(asUser(CUSTOMER_UID), 'users', 'someone-else'), { role: 'customer' })
        );
    });

    it('user can update their own doc', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(CUSTOMER_UID), 'users', CUSTOMER_UID), { name: 'Updated Name' })
        );
    });

    it('cashier cannot update another user doc', async () => {
        await assertFails(
            updateDoc(doc(asUser(CASHIER_A_UID), 'users', CUSTOMER_UID), { role: 'admin' })
        );
    });

    it('only admin can delete a user doc', async () => {
        await assertFails(deleteDoc(doc(asUser(OWNER_A_UID), 'users', CUSTOMER_UID)));
        await assertSucceeds(deleteDoc(doc(asUser(ADMIN_UID), 'users', 'new-user-99')));
    });
});

// ─── STORES ───────────────────────────────────────────────────────────────────

describe('stores collection', () => {
    it('any authenticated user can read stores', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'stores', STORE_A)));
    });

    it('unauthenticated cannot read stores', async () => {
        await assertFails(getDoc(doc(asAnon(), 'stores', STORE_A)));
    });

    it('owner can create a store with matching ownerId', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(OWNER_A_UID), 'stores', 'store-new'), {
                name: 'New Store', ownerId: OWNER_A_UID,
            })
        );
    });

    it('owner cannot create a store with a different ownerId', async () => {
        await assertFails(
            setDoc(doc(asUser(OWNER_A_UID), 'stores', 'store-fake'), {
                name: 'Fake Store', ownerId: OWNER_B_UID,
            })
        );
    });

    it('cashier cannot create a store', async () => {
        await assertFails(
            setDoc(doc(asUser(CASHIER_A_UID), 'stores', 'store-cashier'), {
                name: 'Bad Store', ownerId: CASHIER_A_UID,
            })
        );
    });

    it('only the owning owner or admin can update a store', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(OWNER_A_UID), 'stores', STORE_A), { name: 'Store A Updated' })
        );
        await assertFails(
            updateDoc(doc(asUser(OWNER_B_UID), 'stores', STORE_A), { name: 'Hijacked' })
        );
    });

    it('only admin can delete a store', async () => {
        await assertFails(deleteDoc(doc(asUser(OWNER_A_UID), 'stores', STORE_A)));
        await assertSucceeds(deleteDoc(doc(asUser(ADMIN_UID), 'stores', 'store-new')));
    });
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

describe('products collection', () => {
    it('any authenticated user can read products', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'products', 'product-a1')));
    });

    it('owner can create a valid product', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(OWNER_A_UID), 'products'), {
                name: 'Milk', price: 20, stock: 50, storeId: STORE_A,
            })
        );
    });

    it('product create fails without required fields (invalid product)', async () => {
        await assertFails(
            addDoc(collection(asUser(OWNER_A_UID), 'products'), {
                name: 'Bad Product', storeId: STORE_A,
                // missing price and stock
            })
        );
    });

    it('cashier cannot create a product', async () => {
        await assertFails(
            addDoc(collection(asUser(CASHIER_A_UID), 'products'), {
                name: 'Milk', price: 20, stock: 50, storeId: STORE_A,
            })
        );
    });

    it('cashier in same store can update a product', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(CASHIER_A_UID), 'products', 'product-a1'), { stock: 90 })
        );
    });

    it('owner of different store cannot update product', async () => {
        await assertFails(
            updateDoc(doc(asUser(OWNER_B_UID), 'products', 'product-a1'), { price: 1 })
        );
    });

    it('customer cannot update or delete a product', async () => {
        await assertFails(
            updateDoc(doc(asUser(CUSTOMER_UID), 'products', 'product-a1'), { price: 1 })
        );
        await assertFails(deleteDoc(doc(asUser(CUSTOMER_UID), 'products', 'product-a1')));
    });

    it('owner can delete own store product, but not other store product', async () => {
        await assertFails(
            deleteDoc(doc(asUser(OWNER_B_UID), 'products', 'product-a1'))
        );
    });
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────

describe('orders collection', () => {
    it('customer can read their own order', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'orders', 'order-a1')));
    });

    it('driver assigned to order can read it', async () => {
        await assertSucceeds(getDoc(doc(asUser(DRIVER_UID), 'orders', 'order-a1')));
    });

    it('owner of the store can read the order', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'orders', 'order-a1')));
    });

    it('a different owner cannot read an order from another store', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_B_UID), 'orders', 'order-a1')));
    });

    it('any authenticated user can create a valid order', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(CUSTOMER_UID), 'orders'), {
                storeId: STORE_A, userId: CUSTOMER_UID, total: 50,
                items: [{ productId: 'product-a1', qty: 1 }], status: 'Pending',
            })
        );
    });

    it('order create fails with invalid status', async () => {
        await assertFails(
            addDoc(collection(asUser(CUSTOMER_UID), 'orders'), {
                storeId: STORE_A, userId: CUSTOMER_UID, total: 50,
                items: [{ productId: 'p1', qty: 1 }], status: 'INVALID_STATUS',
            })
        );
    });

    it('order create fails with empty items list', async () => {
        await assertFails(
            addDoc(collection(asUser(CUSTOMER_UID), 'orders'), {
                storeId: STORE_A, userId: CUSTOMER_UID, total: 0,
                items: [], status: 'Pending',
            })
        );
    });

    it('driver can update their assigned order', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(DRIVER_UID), 'orders', 'order-a1'), { status: 'Delivered' })
        );
    });

    it('cashier from same store can update an order', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(CASHIER_A_UID), 'orders', 'order-a1'), { status: 'Paid' })
        );
    });

    it('only admin can delete an order', async () => {
        await assertFails(deleteDoc(doc(asUser(OWNER_A_UID), 'orders', 'order-a1')));
    });
});

// ─── SHIFTS / CASHDROPS ───────────────────────────────────────────────────────

describe('shifts collection', () => {
    it('cashier can read their own shift', async () => {
        await assertSucceeds(getDoc(doc(asUser(CASHIER_A_UID), 'shifts', 'shift-a1')));
    });

    it('owner of same store can read a shift', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'shifts', 'shift-a1')));
    });

    it('driver cannot read a shift', async () => {
        await assertFails(getDoc(doc(asUser(DRIVER_UID), 'shifts', 'shift-a1')));
    });

    it('customer cannot read a shift', async () => {
        await assertFails(getDoc(doc(asUser(CUSTOMER_UID), 'shifts', 'shift-a1')));
    });

    describe('cashDrops subcollection', () => {
        it('cashier can read their own cash drop', async () => {
            await assertSucceeds(
                getDoc(doc(asUser(CASHIER_A_UID), 'shifts', 'shift-a1', 'cashDrops', 'drop-1'))
            );
        });

        it('owner of same store can read a cash drop', async () => {
            await assertSucceeds(
                getDoc(doc(asUser(OWNER_A_UID), 'shifts', 'shift-a1', 'cashDrops', 'drop-1'))
            );
        });

        it('customer cannot read a cash drop', async () => {
            await assertFails(
                getDoc(doc(asUser(CUSTOMER_UID), 'shifts', 'shift-a1', 'cashDrops', 'drop-1'))
            );
        });

        it('driver cannot read a cash drop', async () => {
            await assertFails(
                getDoc(doc(asUser(DRIVER_UID), 'shifts', 'shift-a1', 'cashDrops', 'drop-1'))
            );
        });

        it('lender cannot read a cash drop', async () => {
            await assertFails(
                getDoc(doc(asUser(LENDER_UID), 'shifts', 'shift-a1', 'cashDrops', 'drop-1'))
            );
        });

        it('cashier can create a cash drop', async () => {
            await assertSucceeds(
                addDoc(collection(asUser(CASHIER_A_UID), 'shifts', 'shift-a1', 'cashDrops'), {
                    cashierId: CASHIER_A_UID, amount: 200, reason: 'safe drop',
                })
            );
        });

        it('customer cannot create a cash drop', async () => {
            await assertFails(
                addDoc(collection(asUser(CUSTOMER_UID), 'shifts', 'shift-a1', 'cashDrops'), {
                    cashierId: CUSTOMER_UID, amount: 9999, reason: 'theft',
                })
            );
        });
    });
});

// ─── CREDIT PROFILES ─────────────────────────────────────────────────────────

describe('credit_profiles collection', () => {
    it('customer can read their own credit profile', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'credit_profiles', CUSTOMER_UID)));
    });

    it('lender can read any credit profile', async () => {
        await assertSucceeds(getDoc(doc(asUser(LENDER_UID), 'credit_profiles', CUSTOMER_UID)));
    });

    it('owner can read a credit profile', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'credit_profiles', CUSTOMER_UID)));
    });

    it('cashier cannot read a credit profile', async () => {
        await assertFails(getDoc(doc(asUser(CASHIER_A_UID), 'credit_profiles', CUSTOMER_UID)));
    });

    it('driver cannot read a credit profile', async () => {
        await assertFails(getDoc(doc(asUser(DRIVER_UID), 'credit_profiles', CUSTOMER_UID)));
    });

    it('user can create their own credit profile', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(CUSTOMER_UID), 'credit_profiles', CUSTOMER_UID), {
                creditLimit: 0, balance: 0, score: 50,
            })
        );
    });

    it('user cannot create a credit profile for someone else', async () => {
        await assertFails(
            setDoc(doc(asUser(CUSTOMER_UID), 'credit_profiles', LENDER_UID), {
                creditLimit: 0, balance: 0,
            })
        );
    });

    it('lender can update a credit profile', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(LENDER_UID), 'credit_profiles', CUSTOMER_UID), { score: 80 })
        );
    });

    it('cashier cannot update a credit profile', async () => {
        await assertFails(
            updateDoc(doc(asUser(CASHIER_A_UID), 'credit_profiles', CUSTOMER_UID), { score: 100 })
        );
    });
});

// ─── LOANS ────────────────────────────────────────────────────────────────────

describe('loans collection', () => {
    it('lender can read their own loans', async () => {
        await assertSucceeds(getDoc(doc(asUser(LENDER_UID), 'loans', 'loan-1')));
    });

    it('borrower can read their own loan', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'loans', 'loan-1')));
    });

    it('admin can read any loan', async () => {
        await assertSucceeds(getDoc(doc(asUser(ADMIN_UID), 'loans', 'loan-1')));
    });

    it('cashier cannot read loans', async () => {
        await assertFails(getDoc(doc(asUser(CASHIER_A_UID), 'loans', 'loan-1')));
    });

    it('driver cannot read loans', async () => {
        await assertFails(getDoc(doc(asUser(DRIVER_UID), 'loans', 'loan-1')));
    });

    it('lender can create a loan', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(LENDER_UID), 'loans'), {
                lenderId: LENDER_UID, borrowerId: CUSTOMER_UID,
                amount: 2000, status: 'active', dueDate: '2026-12-31',
            })
        );
    });

    it('customer cannot create a loan as lender', async () => {
        await assertFails(
            addDoc(collection(asUser(CUSTOMER_UID), 'loans'), {
                lenderId: CUSTOMER_UID, borrowerId: DRIVER_UID,
                amount: 500, status: 'active', dueDate: '2026-12-31',
            })
        );
    });

    it('lender can update their own loan', async () => {
        await assertSucceeds(
            updateDoc(doc(asUser(LENDER_UID), 'loans', 'loan-1'), { status: 'paid' })
        );
    });

    it('borrower cannot update a loan', async () => {
        await assertFails(
            updateDoc(doc(asUser(CUSTOMER_UID), 'loans', 'loan-1'), { amount: 1 })
        );
    });

    it('lender can delete their own loan', async () => {
        await assertFails(deleteDoc(doc(asUser(CUSTOMER_UID), 'loans', 'loan-1')));
        await assertSucceeds(deleteDoc(doc(asUser(LENDER_UID), 'loans', 'loan-1')));
    });
});

// ─── BORROWERS ────────────────────────────────────────────────────────────────

describe('borrowers collection', () => {
    it('lender can read their own borrowers', async () => {
        await assertSucceeds(getDoc(doc(asUser(LENDER_UID), 'borrowers', 'borrower-1')));
    });

    it('another lender or owner cannot read borrowers', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_A_UID), 'borrowers', 'borrower-1')));
    });

    it('cashier cannot read borrowers', async () => {
        await assertFails(getDoc(doc(asUser(CASHIER_A_UID), 'borrowers', 'borrower-1')));
    });

    it('lender can create a borrower', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(LENDER_UID), 'borrowers'), {
                lenderId: LENDER_UID, name: 'New Borrower', phone: '0821234567',
            })
        );
    });

    it('cashier cannot create a borrower', async () => {
        await assertFails(
            addDoc(collection(asUser(CASHIER_A_UID), 'borrowers'), {
                lenderId: CASHIER_A_UID, name: 'Fake', phone: '0821234567',
            })
        );
    });
});

// ─── STAFF ────────────────────────────────────────────────────────────────────

describe('staff collection', () => {
    it('owner of same store can read staff', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'staff', CASHIER_A_UID)));
    });

    it('staff member can read their own doc', async () => {
        await assertSucceeds(getDoc(doc(asUser(CASHIER_A_UID), 'staff', CASHIER_A_UID)));
    });

    it('customer cannot read staff docs', async () => {
        await assertFails(getDoc(doc(asUser(CUSTOMER_UID), 'staff', CASHIER_A_UID)));
    });

    it('owner of different store cannot read staff', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_B_UID), 'staff', CASHIER_A_UID)));
    });

    it('owner can add staff', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(OWNER_A_UID), 'staff'), {
                storeId: STORE_A, name: 'New Cashier', role: 'cashier',
            })
        );
    });

    it('cashier cannot add staff', async () => {
        await assertFails(
            addDoc(collection(asUser(CASHIER_A_UID), 'staff'), {
                storeId: STORE_A, name: 'Bad Hire', role: 'cashier',
            })
        );
    });

    it('owner can delete staff from own store', async () => {
        await assertSucceeds(
            deleteDoc(doc(asUser(OWNER_A_UID), 'staff', CASHIER_A_UID))
        );
        await assertFails(
            deleteDoc(doc(asUser(OWNER_B_UID), 'staff', CASHIER_A_UID))
        );
    });
});

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

describe('expenses collection', () => {
    it('owner of same store can read expenses', async () => {
        await assertSucceeds(getDoc(doc(asUser(OWNER_A_UID), 'expenses', 'expense-1')));
    });

    it('owner of different store cannot read expenses', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_B_UID), 'expenses', 'expense-1')));
    });

    it('cashier cannot read expenses', async () => {
        await assertFails(getDoc(doc(asUser(CASHIER_A_UID), 'expenses', 'expense-1')));
    });

    it('customer cannot read expenses', async () => {
        await assertFails(getDoc(doc(asUser(CUSTOMER_UID), 'expenses', 'expense-1')));
    });

    it('owner can create an expense', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(OWNER_A_UID), 'expenses'), {
                storeId: STORE_A, amount: 100, description: 'Water',
            })
        );
    });

    it('cashier cannot create an expense', async () => {
        await assertFails(
            addDoc(collection(asUser(CASHIER_A_UID), 'expenses'), {
                storeId: STORE_A, amount: 100, description: 'Theft',
            })
        );
    });
});

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

describe('audit_logs collection', () => {
    it('admin can read audit logs', async () => {
        await assertSucceeds(getDoc(doc(asUser(ADMIN_UID), 'audit_logs', 'log-1')));
    });

    it('owner cannot read audit logs', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_A_UID), 'audit_logs', 'log-1')));
    });

    it('cashier cannot read audit logs', async () => {
        await assertFails(getDoc(doc(asUser(CASHIER_A_UID), 'audit_logs', 'log-1')));
    });

    it('any authenticated user can create an audit log', async () => {
        await assertSucceeds(
            addDoc(collection(asUser(CASHIER_A_UID), 'audit_logs'), {
                action: 'product_update', userId: CASHIER_A_UID,
            })
        );
    });

    it('nobody can update an audit log', async () => {
        await assertFails(
            updateDoc(doc(asUser(ADMIN_UID), 'audit_logs', 'log-1'), { action: 'tampered' })
        );
    });

    it('nobody can delete an audit log', async () => {
        await assertFails(deleteDoc(doc(asUser(ADMIN_UID), 'audit_logs', 'log-1')));
    });
});

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

describe('transactions collection', () => {
    beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await setDoc(doc(ctx.firestore(), 'transactions', 'tx-1'), {
                userId: CUSTOMER_UID, amount: 500, storeId: STORE_A,
            });
        });
    });

    it('user can read their own transaction', async () => {
        await assertSucceeds(getDoc(doc(asUser(CUSTOMER_UID), 'transactions', 'tx-1')));
    });

    it('another user cannot read someone else transaction', async () => {
        await assertFails(getDoc(doc(asUser(OWNER_A_UID), 'transactions', 'tx-1')));
    });

    it('only admin can update or delete transactions', async () => {
        await assertFails(
            updateDoc(doc(asUser(CUSTOMER_UID), 'transactions', 'tx-1'), { amount: 1 })
        );
        await assertSucceeds(
            updateDoc(doc(asUser(ADMIN_UID), 'transactions', 'tx-1'), { verified: true })
        );
    });
});
