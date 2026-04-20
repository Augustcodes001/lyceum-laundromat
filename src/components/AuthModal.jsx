import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create initial profile for new Google user
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          address: "",
          phone: "",
          state: "Edo State",
          createdAt: new Date().toISOString()
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

           {/* Divider */}
           <div className="flex items-center my-6">
             <div className="flex-1 h-px bg-gray-200"></div>
             <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
             <div className="flex-1 h-px bg-gray-200"></div>
           </div>

           {/* Google Sign In Button */}
           <button
             onClick={handleGoogleSignIn}
             disabled={isLoading}
             className="w-full bg-white border-2 border-gray-100 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-[#E85D04]/20 transition-all group disabled:opacity-70"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
             </svg>
             <span className="font-bold text-[#0F3024] group-hover:text-[#E85D04] transition-colors">Continue with Google</span>
           </button>

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