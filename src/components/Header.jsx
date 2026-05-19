// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PickupPill from './PickupPill'; // 🌟 Import shared PickupPill

// ── Desktop Nav Link ──
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    className="
      relative flex items-center px-4 py-2 rounded-full
      text-[16px] font-[500] tracking-[-0.01em]
      text-[#0F3024] transition-all duration-250
      hover:text-[#E85D04] hover:bg-[#0F3024]/[0.06]
      after:block after:content-[''] after:absolute after:bottom-[6px] after:left-4 after:right-4
      after:h-[2px] after:bg-[#E85D04] after:rounded-full
      after:scale-x-0 after:origin-center
      after:transition-transform after:duration-300
      hover:after:scale-x-100
    "
  >
    {children}
  </Link>
);

export default function Header({ onOpenAuth, isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileAddress, setMobileAddress] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // Helper to navigate to homepage sections from anywhere
  const navigateToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Not on homepage: navigate to "/" with hash
      navigate(`/#${sectionId}`);
    } else {
      // Already on homepage: scroll smoothly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Close mobile menu if open
    setIsHamburgerOpen(false);
  };

  // Handle hash scrolling when arriving on homepage with a hash
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-[72px] w-full bg-white hidden sm:block"></div>

      <header className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 app-element">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer z-50">
              <img
                src="/Lyceum-official-logo.jpg"
                alt="Lyceum Laundromat"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/">Home</NavLink>

              {/* About Link (now using button + navigateToSection) */}
              <button
                onClick={() => navigateToSection('about')}
                className="relative flex items-center px-4 py-2 rounded-full text-[16px] font-[500] tracking-[-0.01em] text-[#0F3024] transition-all hover:text-[#E85D04] hover:bg-[#0F3024]/[0.06]"
              >
                About
              </button>

              {/* Delivery Link */}
              <button
                onClick={() => navigateToSection('delivery-updates')}
                className="relative flex items-center px-4 py-2 rounded-full text-[16px] font-[500] tracking-[-0.01em] text-[#0F3024] transition-all hover:text-[#E85D04] hover:bg-[#0F3024]/[0.06]"
              >
                Delivery
              </button>

              <NavLink to="/pricing">Services/Pricing</NavLink>
            </nav>

            {/* DESKTOP RIGHT SIDE */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* 🌟 Replaced DesktopPickupPill with shared PickupPill */}
              <PickupPill onOpenAuth={onOpenAuth} />

              {/* Desktop Auth Buttons */}
                 <div className="hidden lg:flex items-center gap-6 ml-4">
                {/* <button
                  onClick={() => onOpenAuth()}
                  className="text-[#0F3024] font-bold hover:text-[#E85D04] transition-colors"
                >
                  Log In
                </button> */}
                <button
                  onClick={() => onOpenAuth()}
                  className="flex items-center justify-center bg-[#0F3024] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1a4a38] transition-colors shadow-md"
                >
                  Log In
                </button>
              </div>
            </div>

            {/* TABLET & MOBILE RIGHT SIDE */}
            <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openSupport'))}
                className="p-2 text-[#0F3024] hover:bg-gray-100 rounded-full transition-colors"
                title="Support"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                </svg>
              </button>

              <button onClick={() => setIsLocationModalOpen(true)} className="p-2 text-[#0F3024] hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* MOBILE AUTH PILL */}
              {isLoggedIn ? (
                <button onClick={onLogout} className="bg-gray-100 text-[#0F3024] border border-gray-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm mx-1 hover:bg-gray-200 transition-colors hidden sm:block">
                  Log out
                </button>
              ) : (
                <button onClick={() => onOpenAuth()} className="bg-[#0F3024] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm mx-1 hover:bg-[#1a4a38] transition-colors hidden sm:block">
                  Log in
                </button>
              )}

              {/* TAPERED HAMBURGER ICON */}
              <button onClick={() => setIsHamburgerOpen(true)} className="p-2 text-[#0F3024] hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h12M4 18h8" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* PREMIUM WHITE SLIDE-OUT DRAWER (Slides from Right) */}
      <div
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-300 lg:hidden ${isHamburgerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsHamburgerOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white z-[201] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isHamburgerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="h-8 w-auto object-contain" />
          <button onClick={() => setIsHamburgerOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col flex-1 overflow-y-auto p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-5 mb-8">
            <Link
              to="/"
              onClick={() => setIsHamburgerOpen(false)}
              className="text-xl font-bold text-[#0F3024] hover:text-[#E85D04] transition-colors"
            >
              Home
            </Link>

            <button
              onClick={() => navigateToSection('about')}
              className="text-xl font-bold text-[#0F3024] hover:text-[#E85D04] transition-colors text-left"
            >
              About Us
            </button>

            <button
              onClick={() => navigateToSection('delivery-updates')}
              className="text-xl font-bold text-[#0F3024] hover:text-[#E85D04] transition-colors text-left"
            >
              Delivery
            </button>

            <Link
              to="/pricing"
              onClick={() => setIsHamburgerOpen(false)}
              className="text-xl font-bold text-[#0F3024] hover:text-[#E85D04] transition-colors"
            >
              Pricing & Services
            </Link>
          </nav>

          <div className="h-px bg-gray-100 w-full mb-8"></div>

          {/* Location Field inside Menu */}
          {/* <div className="mb-6">
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#0F3024] mb-2">Delivery Location</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-center shadow-inner">
              <svg className="w-5 h-5 text-[#E85D04] mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter address..."
                value={mobileAddress}
                onChange={(e) => setMobileAddress(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px] text-[#0F3024] placeholder-gray-400"
              />
            </div>
          </div> */}

          {/* MOBILE HAMBURGER MENU AUTH BUTTONS */}
          <div className="mt-12 pt-4 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsHamburgerOpen(false)}
                  className="w-full text-center bg-gray-100 text-[#0F3024] px-4 py-3 rounded-xl text-[16px] font-bold transition-colors hover:bg-gray-200"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsHamburgerOpen(false);
                  }}
                  className="w-full text-center border border-gray-200 text-[#0F3024] px-4 py-3 rounded-xl text-[16px] font-bold transition-colors hover:bg-gray-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsHamburgerOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-[#0F3024] text-white py-3.5 rounded-full font-bold text-[16px] shadow-md hover:bg-[#1a4a38] transition-colors mb-3"
              >
                Sign Up / Log In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE LOCATION BOTTOM SHEET */}
      <div
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-300 lg:hidden ${isLocationModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsLocationModalOpen(false)}
      ></div>
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl z-[201] p-6 shadow-2xl transition-transform duration-300 lg:hidden ${isLocationModalOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#0F3024]">Where to?</h3>
          <button onClick={() => setIsLocationModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center shadow-inner">
          <svg className="w-5 h-5 text-[#E85D04] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            placeholder="Enter your address..."
            value={mobileAddress}
            onChange={(e) => setMobileAddress(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[16px] text-[#0F3024] placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="w-full mt-4 bg-[#E85D04] text-white py-3.5 rounded-xl font-bold text-[16px] shadow-md"
        >
          Confirm Location
        </button>
      </div>
    </>
  );
}