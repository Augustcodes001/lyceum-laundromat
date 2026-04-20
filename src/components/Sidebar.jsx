import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onPromptLogout }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { name: 'Dashboard', path: '/orders', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { name: 'Price list', path: '/user-pricing', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
        { name: 'Cart', path: '/cart', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { name: 'Account', path: '/account', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    ];

    return (
        <div className="hidden lg:flex flex-col w-64 bg-[#0F3024] shadow-2xl min-h-screen fixed left-0 top-0 bottom-0 z-40">

            {/* Sidebar Header / Logo */}
            <div className="p-8 flex items-center justify-center border-b border-white/10">
                <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-32 h-auto rounded-full" />
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-8 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-white/10 text-white font-bold border-l-4 border-[#E85D04]'
                                : 'text-white/60 hover:bg-white/5 hover:text-white font-medium border-l-4 border-transparent'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                                {item.icon}
                            </svg>
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onPromptLogout}
                    className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-white/60 hover:bg-white/5 hover:text-white font-medium transition-all"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                </button>
            </div>
        </div>
    );
}