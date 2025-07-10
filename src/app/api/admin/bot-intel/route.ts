import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';
import type { GlobalBlocklists } from '@/lib/types';

// This function verifies the Firebase ID token and checks the user's admin status in Firestore.
async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; response?: NextResponse }> {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return { 
        isAdmin: false, 
        response: new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) 
    };
  }

  const idToken = authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists && userDoc.data()?.admin === true) {
      return { isAdmin: true };
    }
    
    return { 
        isAdmin: false, 
        response: new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
    };
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return { 
        isAdmin: false, 
        response: new NextResponse(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    };
  }
}

export async function GET(request: NextRequest) {
    const { isAdmin, response } = await verifyAdmin(request);
    if (!isAdmin) {
        return response;
    }

    try {
        const docRef = db.collection('settings').doc('botIntel');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return NextResponse.json(docSnap.data());
        } else {
            return NextResponse.json({ blockedIps: [], blockedUserAgents: [], blockedAsns: [] });
        }
    } catch (error) {
        console.error("Error in GET /api/admin/bot-intel:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(request: NextRequest) {
    const { isAdmin, response } = await verifyAdmin(request);
    if (!isAdmin) {
        return response;
    }

    try {
        const docRef = db.collection('settings').doc('botIntel');
        const data: GlobalBlocklists = await request.json();
        
        if (!data || !Array.isArray(data.blockedIps) || !Array.isArray(data.blockedUserAgents) || !Array.isArray(data.blockedAsns)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
        }
        
        await docRef.set(data, { merge: true });
        return NextResponse.json({ success: true, message: 'Blocklists updated.' });

    } catch (error) {
        console.error("Error in POST /api/admin/bot-intel:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
