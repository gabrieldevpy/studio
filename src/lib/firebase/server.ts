
import * as admin from 'firebase-admin';

// These variables are not prefixed with NEXT_PUBLIC_ so they are only available on the server side
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key must be a single line. Replace literal \n with actual newlines
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
// Check if an app is already initialized to avoid errors during hot-reloading
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db, admin };
