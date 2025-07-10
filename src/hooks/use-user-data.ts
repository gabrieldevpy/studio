
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
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

        const fetchUserData = async () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
                    } else {
                        // O documento do usuário pode não existir imediatamente após o cadastro
                        // Você pode querer criar um documento padrão aqui
                        console.log("No such user document!");
                        setUserData(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setUserData(null);
            }
        };

        fetchUserData();

    }, [user]);

    return { user, userData, loading };
}
