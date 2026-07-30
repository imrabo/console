import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Checks if a given environment variable value is configured and not placeholder.
 */
function isConfigured(value?: string): boolean {
  return Boolean(value) && !['xxxxx', 'PLACEHOLDER'].includes(value || '');
}

/**
 * Retrieves the service account credentials from environment variables.
 * @returns An object containing necessary credentials, or null if incomplete.
 */
function getServiceAccount() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!isConfigured(projectId) || !isConfigured(clientEmail) || !privateKey) {
    return null;
  }

  // Note: The original code structure assumes the private key is available and correctly formatted.
  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

const serviceAccount = getServiceAccount();
const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Improved logging: Only log sensitive details in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log('--- Firebase Admin Initialization Check ---');
  console.log({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKeyExists: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    // Only log a snippet of the private key for debugging purposes
    privateKeyStart: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.slice(0, 30) || 'N/A',
  });
}

let adminApp: any; // Use 'any' temporarily if we cannot determine the exact type without full context
try {
  adminApp =
    getApps()[0] ??
    initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      projectId,
    });
} catch (e) {
  console.error('FATAL ERROR: Failed to initialize Firebase Admin SDK.', e);
  // Exit or handle failure gracefully if initialization is critical
  throw new Error('Firebase Admin Initialization Failure');
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
