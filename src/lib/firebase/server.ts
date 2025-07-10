
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// These variables are not prefixed with NEXT_PUBLIC_ so they are only available on the server side
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key must be a single line. Replace literal \n with actual newlines
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
// Check if an app is already initialized to avoid errors during hot-reloading
if (!admin.apps.length) {
  // A basic check to ensure service account is not empty
  if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
        });
    } catch (error: any) {
        console.error('Firebase Admin Initialization Error:', error.message);
    }
  } else {
    console.error('Firebase Admin SDK service account credentials are not set in .env file.');
  }
}

const db = admin.firestore();

export { db, admin };
