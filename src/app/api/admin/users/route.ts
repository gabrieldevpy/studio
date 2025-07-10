
import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';

// This function checks if the user making the request is an admin
async function isAdmin(request: NextRequest): Promise<{is_admin: boolean, error?: string}> {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return {is_admin: false, error: 'No authorization token.'};
  }
  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return {is_admin: false, error: 'User document not found.'};
    }

    const userData = userDoc.data();
    return { is_admin: userData?.admin === true };
  } catch (error: any) {
    console.error('Error verifying admin token:', error);
    return {is_admin: false, error: error.message};
  }
}

export async function GET(request: NextRequest) {
  const { is_admin, error } = await isAdmin(request);

  if (error) {
    console.log(`Admin check failed: ${error}`);
  }
  
  if (!is_admin) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  try {
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
