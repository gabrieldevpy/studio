
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type UserData = {
    // Adicione outros campos do usuário aqui conforme necessário
    admin?: boolean;
    [key: string]: any;
};

export function useUserData() {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (user) {
            setLoading(true);
            const userRef = doc(db, 'users', user.uid);
            unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserData;
                    setUserData(data);
                    setIsAdmin(data.admin === true);
                } else {
                    // User document might not exist yet if they just signed up
                    setUserData(null);
                    setIsAdmin(false);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching user data:", error);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            });
        } else {
            // No user is logged in
            setUserData(null);
            setIsAdmin(false);
            setLoading(false);
        }

        // Cleanup the listener when the component unmounts or user changes
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return { user, userData, isAdmin, loading };
}
