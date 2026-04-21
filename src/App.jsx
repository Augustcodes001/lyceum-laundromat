import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Home from './pages/Home';
import ServicesPricing from './pages/ServicesPricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Orders from './pages/Orders';
import Account from './pages/Account';
import Track from './pages/Track';
import UserPricing from './pages/UserPricing';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import Reviews from './pages/Reviews';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminWalkInPOS from './pages/admin/AdminWalkInPOS';
import AdminFinance from './pages/admin/AdminFinance';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReviews from './pages/admin/AdminReviews';

// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import SupportWidget from './components/SupportWidget';
import Sidebar from './components/Sidebar';

// Admin Components
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  // New Native App States
  const [isSplashLoading, setIsSplashLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // 👈 We use this to check what page we are on!

  // 🛑 Dynamic Layout Logic
  const isHomePage = location.pathname === '/';
  const isAdminPath = location.pathname.startsWith('/admin');
  const showSidebar = isLoggedIn && !isHomePage && !isAdminPath; // Only show user sidebar if logged in, not on home, and NOT on admin
  const showUserLayout = !isAdminPath;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setIsSplashLoading(true);

    setTimeout(() => {
      setIsSplashLoading(false);

      // If they tried to click a restricted link before logging in, send them there. Otherwise, Dashboard!
      if (pendingRoute) {
        navigate(pendingRoute);
        setPendingRoute(null);
      } else {
        navigate('/orders');
      }
    }, 1500);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isAuthChecking) {
    return (
        <div className="min-h-screen bg-[#0F3024] flex items-center justify-center">
            <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-32 h-auto rounded-full animate-pulse" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🚀 SPLASH SCREEN */}
      {isSplashLoading && (
        <div className="fixed inset-0 bg-[#0F3024] z-[10000] flex flex-col items-center justify-center">
          <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-32 h-auto rounded-full animate-pulse" />
        </div>
      )}

      {/* 🛑 LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-black text-[#0F3024] mb-2">Log out?</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to return to the home screen?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 bg-gray-100 text-[#0F3024] py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 bg-[#E85D04] text-white py-3 rounded-xl font-bold hover:bg-[#cc5203] transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Header if logged out, OR if we are on the Home Page (But never on Admin pages) */}
      {showUserLayout && (!isLoggedIn || isHomePage) && (
        <Header
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* 🚀 NEW DESKTOP SIDEBAR (Uses our new showSidebar variable) */}
      {showSidebar && <Sidebar onPromptLogout={() => setIsLogoutModalOpen(true)} />}

      {/* We wrap the routes in a layout container. (Uses our new showSidebar variable) */}
      <div className={`${showSidebar ? 'lg:ml-64' : ''} ${showUserLayout ? 'sm:pb-0 pb-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<ServicesPricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/:id" element={<Track />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Logged-In Routes */}
          <Route path="/orders" element={<Orders isLoggedIn={isLoggedIn} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/user-pricing" element={<UserPricing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/community" element={<Reviews />} />

          {/* 🔐 Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="walkins" element={<AdminWalkInPOS />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>

      {/* MOBILE BOTTOM NAV (User Portal only) */}
      {showUserLayout && (
        <BottomNav
          onOpenAuth={(route) => {
            setPendingRoute(route);
            setIsAuthModalOpen(true);
          }}
          isLoggedIn={isLoggedIn}
          onPromptLogout={() => setIsLogoutModalOpen(true)}
        />
      )}

      {showUserLayout && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {showUserLayout && <SupportWidget />}
    </div>
  );
}

// 🛑 THIS IS REQUIRED SO MAIN.JSX CAN FIND THE COMPONENT
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}