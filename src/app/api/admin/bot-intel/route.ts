
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

async function handleGet(request: NextRequest) {
    const docRef = db.collection('settings').doc('botIntel');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return NextResponse.json(docSnap.data());
    } else {
        // Return the structure expected by the client even if the doc doesn't exist
        return NextResponse.json({ blockedIps: [], blockedUserAgents: [], blockedAsns: [] });
    }
}

async function handlePost(request: NextRequest) {
    const docRef = db.collection('settings').doc('botIntel');
    const data: GlobalBlocklists = await request.json();
    // Basic validation
    if (!Array.isArray(data.blockedIps) || !Array.isArray(data.blockedUserAgents) || !Array.isArray(data.blockedAsns)) {
        return new NextResponse(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
    }
    await docRef.set(data, { merge: true }); // Use merge to be safe
    return NextResponse.json({ success: true, message: 'Blocklists updated.' });
}

async function handler(request: NextRequest) {
    const authorization = headers().get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const idToken = authorization.split('Bearer ')[1];
    const { isAdmin } = await verifyAdmin(idToken);

    if (!isAdmin) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'GET') {
        return handleGet(request);
    }

    if (request.method === 'POST') {
        return handlePost(request);
    }
    
    return new NextResponse(null, { status: 405, headers: { 'Allow': 'GET, POST' } });
}

export { handler as GET, handler as POST };
