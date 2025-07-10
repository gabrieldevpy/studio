
import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';
import type { GlobalBlocklists } from '@/lib/types';

// This function verifies the Firebase ID token and checks the user's admin status in Firestore.
async function verifyAdmin(idToken: string): Promise<{ isAdmin: boolean; uid: string | null; error?: string }> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists && userDoc.data()?.admin === true) {
        return { isAdmin: true, uid };
    }

    return { isAdmin: false, uid, error: 'User is not an admin.' };
  } catch (error: any) {
    console.error('Error verifying admin token:', error.code, error.message);
    if (error.code === 'auth/id-token-expired') {
      return { isAdmin: false, uid: null, error: 'Token has expired.' };
    }
    return { isAdmin: false, uid: null, error: 'Invalid token.' };
  }
}

async function handleRequest(request: NextRequest) {
    const authorization = headers().get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    const { isAdmin } = await verifyAdmin(idToken);

    if (!isAdmin) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const docRef = db.collection('settings').doc('botIntel');

    if (request.method === 'GET') {
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return NextResponse.json(docSnap.data());
        } else {
            return NextResponse.json({ blockedIps: [], blockedUserAgents: [], blockedAsns: [] });
        }
    }

    if (request.method === 'POST') {
        const data: GlobalBlocklists = await request.json();
        // Basic validation
        if (!Array.isArray(data.blockedIps) || !Array.isArray(data.blockedUserAgents) || !Array.isArray(data.blockedAsns)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
        }
        await docRef.set(data, { merge: true }); // Use merge to be safe
        return NextResponse.json({ success: true, message: 'Blocklists updated.' });
    }
    
    return new NextResponse(null, { status: 405, statusText: "Method Not Allowed" });
}

export { handleRequest as GET, handleRequest as POST };
