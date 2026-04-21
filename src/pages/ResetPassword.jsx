import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    confirmPasswordReset, 
    verifyPasswordResetCode 
} from 'firebase/auth';
import { auth } from '../firebase';
import { 
    Lock, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    ArrowRight,
    KeyRound
} from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const oobCode = searchParams.get('oobCode');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('verifying'); // verifying, form, success, error
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!oobCode) {
            setStatus('error');
            setErrorMsg('Missing reset code. Please request a new link.');
            return;
        }

        // Verify the code is valid on mount
        const verifyCode = async () => {
            try {
                await verifyPasswordResetCode(auth, oobCode);
                setStatus('form');
            } catch (error) {
                console.error("Link verification failed:", error);
                setStatus('error');
                setErrorMsg('This password reset link is invalid or has expired.');
            }
        };

        verifyCode();
    }, [oobCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (password.length < 6) {
            setErrorMsg('Password should be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setStatus('success');
        } catch (error) {
            console.error("Password reset failed:", error);
            setErrorMsg('Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'verifying') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-12 h-12 text-[#E85D04] animate-spin mb-6" />
                <h2 className="text-white font-black text-2xl tracking-tight">Verifying Secure Link</h2>
                <p className="text-emerald-100/60 mt-2 font-medium">Please wait while we validate your reset request...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-red-500/20">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-white font-black text-3xl tracking-tight max-w-sm">Reset Link Invalid</h2>
                <p className="text-emerald-100/60 mt-4 max-w-xs font-medium leading-relaxed">{errorMsg}</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-10 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                >
                    Return to Homepage
                </button>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-500/30 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-white font-black text-4xl tracking-tight">Password Updated!</h2>
                <p className="text-emerald-100/60 mt-4 max-w-xs font-medium leading-relaxed">Your account is now secure. You can log in using your new password.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-10 bg-[#E85D04] text-white px-10 py-5 rounded-[24px] font-black shadow-2xl shadow-orange-950/40 hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
                >
                    Back to Login <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-white p-2 rounded-full mb-4 shadow-2xl">
                        <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-full h-full rounded-full" />
                    </div>
                    <h1 className="text-white font-black text-3xl tracking-tighter uppercase">LYCEUM</h1>
                    <p className="text-emerald-400/80 font-black text-[10px] tracking-[0.3em] uppercase mt-1">Garment Care Excellence</p>
                </div>

                <div className="bg-white rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#E85D04]/5 rounded-full"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <KeyRound className="w-6 h-6 text-[#E85D04]" />
                            <h2 className="text-3xl font-black text-[#0F3024] tracking-tight">Security Reset</h2>
                        </div>
                        <p className="text-gray-500 text-[15px] mb-8 font-medium">Create a strong new password to protect your Lyceum account.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMsg && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-wider border border-red-100 flex items-center gap-3">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-[#0F3024] font-bold outline-none focus:border-[#E85D04] transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input 
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-[#0F3024] font-bold outline-none focus:border-[#E85D04] transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0F3024] hover:bg-[#1a4a38] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-950/20 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center mt-10 text-emerald-100/40 text-[11px] font-bold uppercase tracking-widest">
                    Secure 256-bit AES Encryption Active
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
