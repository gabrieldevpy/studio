
import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';

async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; uid: string | null; error?: string }> {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return { isAdmin: false, uid: null, error: 'No authorization token.' };
  }
  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken, true); // true for checkRevoked
    
    // For added security, check the user document in Firestore as well.
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || !userDoc.data()?.admin) {
        return { isAdmin: false, uid: decodedToken.uid, error: 'User is not an admin in Firestore.' };
    }

    return { isAdmin: true, uid: decodedToken.uid };
  } catch (error: any) {
    console.error('Error verifying admin token:', error.code, error.message);
    return { isAdmin: false, uid: null, error: `Token verification failed: ${error.message}` };
  }
}

export async function GET(request: NextRequest) {
  const { isAdmin: is_admin, uid, error } = await verifyAdmin(request);

  if (!is_admin) {
    console.warn(`Admin access check failed for UID ${uid}: ${error}`);
    return new NextResponse(JSON.stringify({ error: 'Unauthorized', details: error }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (dbError) {
    console.error('Error fetching all users:', dbError);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
