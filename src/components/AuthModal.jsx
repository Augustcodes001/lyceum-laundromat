import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // 🛑 Stops the entire form from refreshing the page!

    // DUMMY AUTH: In the future, this is where you send data to Firebase/Backend
    console.log("Authenticating:", { email, password });

    // Simulate successful login/signup, tell the app we are logged in, and close modal
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      {/* Dark Frosted Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F3024]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden transform transition-all">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0F3024] to-[#E85D04]"></div>

        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-black text-[#0F3024] tracking-tight mb-2">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-[15px] mb-8">
            {isLoginView ? 'Sign in to manage your laundry orders.' : 'Join Lyceum for premium garment care.'}
          </p>

          {/* 🛑 WE ADDED onSubmit={handleSubmit} HERE */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {!isLoginView && (
              <div>
                <label className="block text-sm font-bold text-[#0F3024] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-[15px] text-[#0F3024] outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#0F3024] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-[15px] text-[#0F3024] outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F3024] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-[15px] text-[#0F3024] outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
              />
            </div>

            {/* Just a normal type="submit" button now! */}
            <button
              type="submit"
              className="w-full mt-2 bg-[#0F3024] text-white py-4 rounded-xl font-bold text-[16px] shadow-lg hover:bg-[#1a4a38] transition-colors"
            >
              {isLoginView ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-6 text-center text-[14px] text-gray-600">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLoginView(!isLoginView)}
              className="font-bold text-[#E85D04] hover:underline"
            >
              {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}