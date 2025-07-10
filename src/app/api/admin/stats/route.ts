
import { NextResponse, type NextRequest } from 'next/server';
import { db, admin } from '@/lib/firebase/server';
import { headers } from 'next/headers';

// This function checks if the user making the request is an admin
async function isAdmin(request: NextRequest): Promise<{is_admin: boolean, uid: string | null}> {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return {is_admin: false, uid: null};
  }
  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return {is_admin: false, uid: decodedToken.uid};
    }

    return {is_admin: userDoc.data()?.admin === true, uid: decodedToken.uid};
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return {is_admin: false, uid: null};
  }
}

export async function GET(request: NextRequest) {
  const { is_admin, uid } = await isAdmin(request);
  if (!is_admin || !uid) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  try {
    // Fetch all stats in parallel
    const [usersSnapshot, routesSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('routes').get(),
    ]);

    const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    let proPlans = 0;
    let basicPlans = 0;
    let freePlans = 0;
    usersData.forEach((user: any) => {
      if (user.plan === 'Pro') proPlans++;
      else if (user.plan === 'Basic') basicPlans++;
      else freePlans++;
    });

    const stats = {
      totalUsers: usersSnapshot.size,
      totalRoutes: routesSnapshot.size,
      proPlans,
      basicPlans,
      freePlans,
    };
    
    // Get recent users separately
    const recentUsersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').limit(5).get();
    const recentUsers = recentUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ stats, recentUsers });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
