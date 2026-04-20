import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Star, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';

export default function Account() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const isGoogleUser = auth.currentUser?.providerData.some(p => p.providerId === 'google.com');
    const isProfileIncomplete = !phone || !address;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) return;
            try {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone || '');
                    setAddress(data.address || '');
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.currentUser) {
            fetchUserData();
        } else {
            // Auth listener catch
            const unsubscribe = auth.onAuthStateChanged(user => {
                if (user) fetchUserData();
                else navigate('/');
            });
            return () => unsubscribe();
        }
    }, [navigate]);

    const handleUpdateDetails = async () => {
        if (!auth.currentUser) return;
        setIsUpdating(true);
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                name,
                phone,
                address
            });
            alert('Account details updated successfully.');
        } catch (error) {
            alert('Update failed: ' + error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!auth.currentUser || !newPass || !currentPass) {
            return alert("Please enter both current and new passwords.");
        }
        if (newPass.length < 6) return alert("New password must be at least 6 characters.");
        
        setIsUpdating(true);
        try {
            // Secure Re-authentication
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
            await reauthenticateWithCredential(auth.currentUser, credential);
            
            await updatePassword(auth.currentUser, newPass);
            alert('Password updated securely.');
            setCurrentPass('');
            setNewPass('');
        } catch (error) {
            let msg = error.message;
            if (error.code === 'auth/wrong-password') msg = "The current password you entered is incorrect.";
            alert('Password update failed: ' + msg);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-28 font-sans">
            {/* Header Area */}
            <div className="bg-[#0F3024] pt-12 pb-16 px-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-white tracking-wide border-l border-white/20 pl-4 py-1">Profile</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8 relative z-40 space-y-6">
                
                {/* ── Completion Prompt ── */}
                {isProfileIncomplete && (
                    <div className="bg-[#E85D04]/10 border border-[#E85D04]/20 p-5 rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-12 h-12 bg-[#E85D04] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-[#0F3024] text-sm">Finish Setting Up</h4>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed">Add your phone and address to enable laundry pickups.</p>
                        </div>
                    </div>
                )}

                {/* ── Profile Details Section ── */}
                <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-black text-[#0F3024] flex items-center gap-2 uppercase tracking-tight">
                            <ShieldCheck className="w-5 h-5 text-[#E85D04]" />
                            Profile Information
                        </h2>
                        {isGoogleUser && (
                            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Google Verified</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Connected Email</label>
                            <input value={email} disabled className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#0F3024] uppercase tracking-widest mb-1.5">Full Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#0F3024] focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#0F3024] uppercase tracking-widest mb-1.5">Phone Number <span className="text-gray-400 font-bold lowercase tracking-normal">(Required)</span></label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 08012345678" type="tel" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#0F3024] focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-all shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#0F3024] uppercase tracking-widest mb-1.5">Delivery Address <span className="text-gray-400 font-bold lowercase tracking-normal">(Required)</span></label>
                            <input value={address} onChange={e => setAddress(e.target.value)} autoComplete="street-address" type="text" placeholder="House No. & Street Name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#0F3024] focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-all shadow-sm" />
                        </div>
                        
                        <button 
                            onClick={handleUpdateDetails} 
                            disabled={isUpdating}
                            className="w-full mt-4 bg-[#0F3024] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0F3024]/20 hover:bg-[#0a2018] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving Changes...' : 'Save Profile Details'}
                        </button>
                    </div>
                </div>

                {/* ── Security Section (Only for Email Users) ── */}
                {!isGoogleUser && (
                    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-black text-[#0F3024] mb-6 flex items-center gap-2 uppercase tracking-tight">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Security & Password
                        </h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-[#0F3024] uppercase tracking-widest mb-1.5">Current Password</label>
                                <input value={currentPass} onChange={e => setCurrentPass(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#0F3024] uppercase tracking-widest mb-1.5">New Password</label>
                                <input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-all" />
                            </div>
                            
                            <button 
                                onClick={handleUpdatePassword} 
                                disabled={isUpdating}
                                className="w-full mt-4 bg-gray-50 text-[#0F3024] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-[0.98] border border-gray-200 disabled:opacity-50"
                            >
                                {isUpdating ? 'Securing...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Logout Section ── */}
                <div className="pt-4">
                    <button 
                        onClick={() => {
                            if (window.confirm("Are you sure you want to log out?")) {
                                auth.signOut().then(() => navigate('/'));
                            }
                        }}
                        className="w-full bg-red-50 text-red-600 py-4 rounded-[24px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-500/5 active:scale-[0.98]"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out Session
                    </button>
                </div>

            </div>
        </div>
    );
}