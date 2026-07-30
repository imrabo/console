// src/lib/firebase/seed-admin.ts

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '../constants/COLLECTIONS';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hugged.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

export async function ensureIAdminUser() {
  try {
    let user;

    try {
      user = await adminAuth.getUserByEmail(ADMIN_EMAIL);

      console.log(`✓ Admin exists (${user.uid}), updating...`);

      // Update Auth user
      await adminAuth.updateUser(user.uid, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
      });
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }

      console.log('Admin not found, creating...');

      user = await adminAuth.createUser({
        displayName: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
      });

      console.log(`✓ Admin created successfully (${user.uid})`);
    }

    // Create or overwrite Firestore document
    await adminDb.collection(COLLECTIONS.ADMIN_USERS).doc(user.uid).set(
      {
        uid: user.uid,
        email: ADMIN_EMAIL,
        role: 'super_admin',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      { merge: true }
    );

    console.log(`✓ Admin Firestore document synced (${user.uid})`);

    return user;
  } catch (error) {
    console.error('Failed to ensure admin user:', error);
    throw error;
  }
}
