
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type UserData = {
    // Adicione outros campos do usuário aqui conforme necessário
    [key: string]: any;
};

export function useUserData() {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userSub: (() => void) | undefined;
        let adminSub: (() => void) | undefined;

        const fetchUserData = () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                userSub = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
                    } else {
                        setUserData(null);
                    }
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                });

                const adminRef = doc(db, 'admins', user.uid);
                adminSub = onSnapshot(adminRef, (docSnap) => {
                    setIsAdmin(docSnap.exists() && docSnap.data()?.role === 'admin');
                    setLoading(false); // Consider loading finished once we know admin status
                }, (error) => {
                    console.error("Error fetching admin status:", error);
                    setIsAdmin(false);
                    setLoading(false);
                });

            } else {
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            }
        };

        fetchUserData();

        // Cleanup the listeners when the component unmounts or user changes
        return () => {
            if (userSub) userSub();
            if (adminSub) adminSub();
        };
    }, [user]);

    return { user, userData, isAdmin, loading };
}
