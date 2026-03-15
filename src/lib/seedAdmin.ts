/**
 * Admin Seed Script
 *
 * Creates the first admin user in Firebase Auth + Firestore.
 * Call seedAdminUser() once from the browser console or a setup page.
 *
 * Usage (browser console while app is running):
 *   import { seedAdminUser } from '@/lib/seedAdmin';
 *   seedAdminUser('admin@smitetrade.co.za', 'YourSecurePassword123!', 'Smitetrade Admin');
 *
 * After the first admin is created, secure this file by removing or restricting access.
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const seedAdminUser = async (
  email: string,
  password: string,
  name: string = 'Smitetrade Admin'
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if an admin already exists
    const adminCheckRef = doc(db, 'admin_seed', 'status');
    const adminCheck = await getDoc(adminCheckRef);

    if (adminCheck.exists() && adminCheck.data().seeded === true) {
      return {
        success: false,
        message: 'Admin already seeded. To create another admin, use the Admin portal → Users.',
      };
    }

    // Create Firebase Auth account
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Create Firestore user document
    await setDoc(doc(db, 'users', uid), {
      uid,
      id: uid,
      name,
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    // Mark seed as done to prevent duplicate admin creation
    await setDoc(adminCheckRef, {
      seeded: true,
      adminUid: uid,
      seededAt: new Date().toISOString(),
    });

    console.log(`✅ Admin user created: ${email} (uid: ${uid})`);
    return { success: true, message: `Admin account created for ${email}` };
  } catch (error: any) {
    const message =
      error.code === 'auth/email-already-in-use'
        ? 'That email is already registered. Use the login page.'
        : error.code === 'auth/weak-password'
        ? 'Password is too weak. Use at least 8 characters.'
        : error.message;

    console.error('❌ Admin seed failed:', message);
    return { success: false, message };
  }
};

/**
 * Seed initial lender offers into Firestore (safe to run multiple times — skips if exists).
 */
export const seedLenderOffers = async (): Promise<void> => {
  const offersRef = collection(db, 'lender_offers');
  const existing = await getDocs(offersRef);
  if (!existing.empty) {
    console.log('Lender offers already seeded.');
    return;
  }

  const offers = [
    {
      name: 'Swift Capital',
      rate: '12%',
      term: '30 Days',
      maxAmount: 5000,
      minScore: 650,
      features: ['Instant Approval', 'No hidden fees'],
      description: 'Swift Capital provides fast and reliable funding for Spaza shops needing quick inventory restocks.',
    },
    {
      name: 'Growth Fund',
      rate: '10.5%',
      term: '14 Days',
      maxAmount: 3000,
      minScore: 700,
      features: ['Low Rates', 'Flexible Repayment'],
      description: 'Growth Fund offers highly competitive interest rates for shop owners with excellent repayment histories.',
    },
    {
      name: 'EasyAccess Loans',
      rate: '15%',
      term: '60 Days',
      maxAmount: 10000,
      minScore: 600,
      features: ['High Limits', 'Longer Terms'],
      description: 'Designed for larger capital investments like equipment upgrades or bulk purchasing.',
    },
    {
      name: 'Community Trust',
      rate: '11%',
      term: '45 Days',
      maxAmount: 7500,
      minScore: 680,
      features: ['Community Focus', 'Grace Period'],
      description: 'A lender dedicated to local business growth with a generous grace period.',
    },
  ];

  for (const offer of offers) {
    await addDoc(offersRef, { ...offer, createdAt: new Date().toISOString() });
  }

  console.log('✅ Lender offers seeded.');
};
