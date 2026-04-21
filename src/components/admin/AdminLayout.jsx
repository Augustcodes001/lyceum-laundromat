import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    UserPlus, 
    Wallet, 
    Settings, 
    LogOut,
    Menu,
    X,
    Star
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Walk-ins', path: '/admin/walkins', icon: UserPlus },
        { name: 'Finance', path: '/admin/finance', icon: Wallet },
        { name: 'Feedback', path: '/admin/reviews', icon: Star },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            
            {/* 🖥️ Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-[#0F3024] flex-col fixed inset-y-0 shadow-2xl z-50">
                <div className="p-8 flex items-center gap-3">
                    <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-10 h-10 rounded-full" />
                    <span className="text-white font-black text-xl tracking-tighter">ADMIN</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                ${isActive 
                                    ? 'bg-[#E85D04] text-white shadow-lg shadow-orange-900/20' 
                                    : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="font-semibold">{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* 📱 Mobile Top Header */}
            <header className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-8 h-8 rounded-full" />
                    <span className="text-[#0F3024] font-black tracking-tight uppercase text-sm">Lyceum Admin</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* 📱 Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 flex justify-around items-center z-50 rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 p-2 rounded-2xl transition-all
                            ${isActive ? 'text-[#E85D04]' : 'text-gray-400'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* 🧩 Main Content Area */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 pb-28 lg:pb-10">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
