// src/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

const DEFAULT_PERMISSIONS = {
    orders: true,
    finance: false,
    walkins: true,
    reviews: false,
    settings: false,
};

export function AdminProvider({ children }) {
    const [adminProfile, setAdminProfile] = useState(null);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    useEffect(() => {
        let profileUnsub = null;

        const authUnsub = onAuthStateChanged(auth, (user) => {
            if (profileUnsub) profileUnsub();

            if (!user) {
                setAdminProfile(null);
                setLoadingAdmin(false);
                return;
            }

            // Listen to this admin's profile in /adminUsers
            profileUnsub = onSnapshot(doc(db, 'adminUsers', user.uid), (snap) => {
                if (snap.exists()) {
                    setAdminProfile({ uid: user.uid, email: user.email, ...snap.data() });
                } else {
                    // No adminUsers record — treat as legacy admin with full access
                    setAdminProfile({
                        uid: user.uid,
                        email: user.email,
                        role: 'super_admin',
                        permissions: {
                            orders: true,
                            finance: true,
                            walkins: true,
                            reviews: true,
                            settings: true,
                        },
                        receiveOrderEmails: true,
                    });
                }
                setLoadingAdmin(false);
            }, (err) => {
                console.error('AdminContext error:', err);
                setLoadingAdmin(false);
            });
        });

        return () => {
            authUnsub();
            if (profileUnsub) profileUnsub();
        };
    }, []);

    const isSuperAdmin = adminProfile?.role === 'super_admin';
    const permissions = adminProfile?.permissions || DEFAULT_PERMISSIONS;
    const can = (perm) => isSuperAdmin || !!permissions[perm];

    return (
        <AdminContext.Provider value={{ adminProfile, loadingAdmin, isSuperAdmin, permissions, can }}>
            {children}
        </AdminContext.Provider>
    );
}
