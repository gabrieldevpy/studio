
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
// Check if an app is already initialized to avoid errors during hot-reloading
if (!admin.apps.length) {
  // A robust check to ensure the service account is fully defined
  if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    } catch (error: any) {
      console.error('Firebase Admin Initialization Error:', error.message);
    }
  } else {
    console.warn('Firebase Admin SDK service account credentials are not fully set in .env file. Skipping Admin SDK initialization.');
  }
}

const db = admin.firestore();

export { db, admin };
