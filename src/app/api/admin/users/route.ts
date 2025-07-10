
import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';

// This function verifies the Firebase ID token and checks the user's admin status in Firestore.
async function verifyAdmin(idToken: string): Promise<{ isAdmin: boolean; uid: string | null; error?: string }> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Check the 'admins' collection instead of the 'users' collection field
    const adminDoc = await db.collection('admins').doc(uid).get();

    if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
      return { isAdmin: false, uid, error: 'User is not an admin.' };
    }

    return { isAdmin: true, uid };
  } catch (error: any) {
    console.error('Error verifying admin token:', error.code, error.message);
    if (error.code === 'auth/id-token-expired') {
      return { isAdmin: false, uid: null, error: 'Token has expired.' };
    }
    return { isAdmin: false, uid: null, error: 'Invalid token.' };
  }
}

export async function GET(request: NextRequest) {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized', details: 'Missing or malformed Authorization header.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const idToken = authorization.split('Bearer ')[1];
  const { isAdmin, uid, error } = await verifyAdmin(idToken);

  if (!isAdmin) {
    console.warn(`Admin access denied for UID ${uid}: ${error}`);
    return new NextResponse(JSON.stringify({ error: 'Forbidden', details: error }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    
    // Fetch all admins to mark them in the user list
    const adminsSnapshot = await db.collection('admins').get();
    const adminIds = new Set(adminsSnapshot.docs.map(doc => doc.id));
    
    const users = usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      return { 
        id: doc.id, 
        ...userData,
        admin: adminIds.has(doc.id)
      };
    });

    return NextResponse.json(users);

  } catch (dbError) {
    console.error('Error fetching all users:', dbError);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: 'Failed to fetch users from database.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
