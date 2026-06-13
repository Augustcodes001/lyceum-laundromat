import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminProtectedRoute = () => {
    const { adminProfile, loadingAdmin } = useAdmin();

    if (loadingAdmin) {
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

    if (!adminProfile) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
