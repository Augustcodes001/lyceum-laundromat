import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

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

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLoginView) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up & Create Profile
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Auto-create profile in users collection
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          address: "",
          phone: "",
          state: "Edo State"
        });
      }

      onLoginSuccess();
      onClose();
    } catch (error) {
      setErrorMsg(getFriendlyErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/user-disabled':
        return "This account has been disabled.";
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return "Invalid email or password.";
      case 'auth/email-already-in-use':
        return "This email is already registered. Try logging in.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/network-request-failed':
        return "Network error. Please check your connection.";
      case 'auth/popup-closed-by-user':
        return "Login cancelled.";
      default:
        return "An error occurred. Please try again.";
    }
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
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold shadow-inner border border-red-100">
                {errorMsg}
              </div>
            )}

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
              disabled={isLoading}
              className="w-full mt-2 bg-[#0F3024] text-white py-4 rounded-xl font-bold text-[16px] shadow-lg hover:bg-[#1a4a38] transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Log In' : 'Create Account')}
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