
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type UserData = {
    admin?: boolean;
    // Adicione outros campos do usuário aqui conforme necessário
    [key: string]: any;
};

export function useUserData() {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const fetchUserData = () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                // Use onSnapshot to listen for real-time updates
                unsubscribe = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
                    } else {
                        console.log("No such user document!");
                        setUserData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                    setLoading(false);
                });
            } else {
                setLoading(false);
                setUserData(null);
            }
        };

        fetchUserData();

        // Cleanup the listener when the component unmounts or user changes
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return { user, userData, loading };
}
