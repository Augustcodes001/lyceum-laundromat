import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AdminProtectedRoute = () => {
    const [status, setStatus] = useState('loading'); // 'loading', 'authorized', 'unauthorized'

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        setStatus('authorized');
                    } else {
                        setStatus('unauthorized');
                    }
                } catch (error) {
                    console.error("Error checking admin role:", error);
                    setStatus('unauthorized');
                }
            } else {
                setStatus('unauthorized');
            }
        });

        return () => unsubscribe();
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6 text-center">
                <img 
                    src="/Lyceum-official-logo-white-bg.png" 
                    alt="Lyceum" 
                    className="w-24 h-24 rounded-full animate-pulse mb-6 ring-4 ring-white/10" 
                />
                <h2 className="text-white font-bold text-xl tracking-tight">Verifying Credentials</h2>
                <p className="text-emerald-200/60 text-sm mt-2">Securing your admin session...</p>
            </div>
        );
    }

    if (status === 'unauthorized') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
