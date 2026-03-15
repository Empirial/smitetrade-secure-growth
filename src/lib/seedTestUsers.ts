/**
 * Test Users Seed Script
 * Creates one account per role for end-to-end testing.
 * Visit /test-setup while the app is running to trigger this.
 * DELETE this file before going live.
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface SeedResult {
  role: string;
  email: string;
  password: string;
  success: boolean;
  error?: string;
}

const TEST_STORE_ID = 'test-store-001';

async function createUser(
  email: string,
  password: string,
  userData: Record<string, unknown>
): Promise<{ uid: string }> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  await setDoc(doc(db, 'users', uid), { ...userData, uid, id: uid, email, createdAt: new Date().toISOString() });
  return { uid };
}

export const seedTestUsers = async (): Promise<SeedResult[]> => {
  const results: SeedResult[] = [];

  const users = [
    {
      role: 'owner',
      email: 'owner@test.smitetrade.co.za',
      password: 'Test1234!',
      userData: { name: 'Test Owner', role: 'owner', storeId: TEST_STORE_ID, storeName: 'Test Spaza Shop' },
    },
    {
      role: 'cashier',
      email: 'cashier@test.smitetrade.co.za',
      password: 'Test1234!',
      userData: { name: 'Test Cashier', role: 'cashier', storeId: TEST_STORE_ID },
    },
    {
      role: 'driver',
      email: 'driver@test.smitetrade.co.za',
      password: 'Test1234!',
      userData: { name: 'Test Driver', role: 'driver' },
    },
    {
      role: 'customer',
      email: 'customer@test.smitetrade.co.za',
      password: 'Test1234!',
      userData: { name: 'Test Customer', role: 'customer' },
    },
    {
      role: 'lender',
      email: 'lender@test.smitetrade.co.za',
      password: 'Test1234!',
      userData: { name: 'Test Lender', role: 'lender' },
    },
  ];

  // Create the test store first
  try {
    await setDoc(doc(db, 'stores', TEST_STORE_ID), {
      id: TEST_STORE_ID,
      name: 'Test Spaza Shop',
      ownerId: 'placeholder', // updated after owner is created
      address: '1 Test Street',
      suburb: 'Soweto',
      city: 'Johannesburg',
      province: 'Gauteng',
      status: 'Active',
      createdAt: new Date().toISOString(),
    });
  } catch {
    // store may already exist
  }

  for (const u of users) {
    try {
      const { uid } = await createUser(u.email, u.password, u.userData);

      // Update store ownerId after owner is created
      if (u.role === 'owner') {
        await setDoc(doc(db, 'stores', TEST_STORE_ID), { ownerId: uid }, { merge: true });
      }

      // Add cashier/driver to staff collection too
      if (u.role === 'cashier' || u.role === 'driver') {
        const staffRef = doc(collection(db, 'staff'));
        await setDoc(staffRef, {
          name: u.userData.name,
          email: u.email,
          role: u.role,
          storeId: TEST_STORE_ID,
          createdAt: new Date().toISOString(),
        });
      }

      results.push({ role: u.role, email: u.email, password: u.password, success: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ role: u.role, email: u.email, password: u.password, success: false, error: msg });
    }
  }

  return results;
};
