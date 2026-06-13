import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResetMessage('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user is an admin in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // If not admin, sign them out immediately
                await signOut(auth);
                setError('Unauthorized: Admin access required.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Please enter your email address above to receive a password reset link.');
            return;
        }

        setResetLoading(true);
        setError('');
        setResetMessage('');

        try {
            // We do not query the 'users' collection here because unauthenticated 
            // users will get a Firestore permissions error. We rely on standard Auth.
            // If they reset and log in, handleLogin will still block non-admins.
            await sendPasswordResetEmail(auth, email);
            setResetMessage('If an account exists, a secure reset link has been sent.');
        } catch (err) {
            console.error("Password reset error:", err);
            if (err.code === 'auth/user-not-found') {
                // Prevent email enumeration attacks by showing a success message anyway
                setResetMessage('If an account exists, a secure reset link has been sent.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Failed to process password reset request.');
            }
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />

            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#0F3024] font-bold transition-colors group"
            >
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span>Back to Website</span>
            </Link>

            <div className="w-full max-w-md">
                <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 border border-gray-100/50 backdrop-blur-xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 bg-[#0F3024] rounded-3xl shadow-xl shadow-emerald-900/20 mb-6">
                            <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-12 h-12 rounded-full" />
                        </div>
                        <h1 className="text-3xl font-black text-[#0F3024] tracking-tighter">Admin Portal</h1>
                        <p className="text-gray-400 mt-2 font-medium">Please sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {resetMessage && (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span>{resetMessage}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#0F3024] uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F3024] transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#0F3024]/10 transition-all font-semibold placeholder:text-gray-300"
                                    placeholder="admin@lyceum.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-black text-[#0F3024] uppercase tracking-widest">Password</label>
                                <button 
                                    type="button" 
                                    onClick={handlePasswordReset}
                                    disabled={resetLoading}
                                    className="text-xs font-bold text-[#E85D04] hover:text-[#cc5203] transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                    {resetLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : null}
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F3024] transition-colors" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#0F3024]/10 transition-all font-semibold placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || resetLoading}
                            className="w-full bg-[#E85D04] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-900/20 hover:bg-[#cc5203] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <span>Sign In to Dashboard</span>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-10 text-gray-400 text-sm font-medium">
                    &copy; {new Date().getFullYear()} Lyceum Laundromat. Authorized Personnel Only.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
