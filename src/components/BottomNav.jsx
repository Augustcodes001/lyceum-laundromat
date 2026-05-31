import { Link, useLocation } from 'react-router-dom';

export default function BottomNav({ onOpenAuth, isLoggedIn, onPromptLogout }) {
    const location = useLocation();
    const currentPath = location.pathname;

    // 🔴 LOGGED OUT NAV ITEMS
    const loggedOutItems = [
        { name: 'Home', path: '/', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { name: 'Services', path: '/pricing', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
        { name: 'Orders', path: '/orders', requiresAuth: true, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2m-4-2h4m-4 2h4" /> },
        { name: 'Account', path: '/account', requiresAuth: true, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    ];

    // 🟢 LOGGED IN NAV ITEMS
    const loggedInItems = [
        { name: 'Dashboard', path: '/orders', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { name: 'Pricelist', path: '/user-pricing', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
        { name: 'Cart', path: '/cart', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { name: 'Community', path: '/community', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { name: 'Account', path: '/account', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    ];

    const navItems = isLoggedIn ? loggedInItems : loggedOutItems;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200/60 bg-white/95 backdrop-blur-md pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-[32px]">
            <div className="flex justify-around items-center h-[72px] px-2">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

                    // Unified colors for both states (crisp and clean)
                    const activeIconColor = 'text-[#E85D04] scale-110';
                    const inactiveIconColor = 'text-[#0F3024]/50 group-hover:text-[#0F3024]/80';

                    const activeTextColor = 'text-[#E85D04] font-bold';
                    const inactiveTextColor = 'text-[#0F3024]/60 font-medium group-hover:text-[#0F3024]/80';

                    // ── If it's a restricted link (Logged out user clicking 'Orders' or 'Account') ──
                    if (item.requiresAuth && !isLoggedIn) {
                        return (
                            <button key={item.name} onClick={() => onOpenAuth(item.path)} className="flex flex-col items-center justify-center w-full h-full space-y-1.5 relative group cursor-pointer transition-all">
                                <svg className={`relative w-6 h-6 transition-all duration-300 ${inactiveIconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{item.icon}</svg>
                                <span className={`text-[10px] tracking-wide transition-all duration-300 ${inactiveTextColor}`}>{item.name}</span>
                            </button>
                        );
                    }

                    // ── Normal Navigation Links ──
                    return (
                        <Link key={item.name} to={item.path} className="flex flex-col items-center justify-center w-full h-full space-y-1.5 relative group cursor-pointer transition-all">
                            <svg className={`relative w-6 h-6 transition-all duration-300 ${isActive ? activeIconColor : inactiveIconColor} ${isActive ? 'drop-shadow-[0_2px_4px_rgba(232,93,4,0.3)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>{item.icon}</svg>

                            <span className={`text-[10px] tracking-wide transition-all duration-300 ${isActive ? activeTextColor : inactiveTextColor}`}>{item.name}</span>

                            {/* Crisp Active Dot Indicator */}
                            <span className={`absolute bottom-0.5 w-1 h-1 rounded-full bg-[#E85D04] transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}