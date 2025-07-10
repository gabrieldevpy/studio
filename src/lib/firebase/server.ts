
import * as admin from 'firebase-admin';
import type { firestore } from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let db: firestore.Firestore;

// Initialize Firebase Admin SDK
// Check if an app is already initialized to avoid errors during hot-reloading
if (!admin.apps.length) {
  // A robust check to ensure the service account is fully defined
  if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
      db = admin.firestore();
    } catch (error: any) {
      console.error('Firebase Admin Initialization Error:', error.message);
      // If initialization fails, db will remain undefined, preventing further errors.
    }
  } else {
    console.warn('Firebase Admin SDK service account credentials are not fully set in .env file. Skipping Admin SDK initialization.');
  }
} else {
  // If the app is already initialized, just get the firestore instance
  db = admin.firestore();
}


export { db, admin };
