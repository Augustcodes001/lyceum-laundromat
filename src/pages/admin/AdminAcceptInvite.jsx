// src/pages/admin/AdminAcceptInvite.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    collection, query, where, getDocs,
    doc, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Lock, User } from 'lucide-react';

const PERMISSION_LABELS = {
    orders: { label: 'Orders', desc: 'View & manage customer orders' },
    finance: { label: 'Finance', desc: 'Access financial records & reports' },
    walkins: { label: 'Walk-ins', desc: 'Manage walk-in POS entries' },
    reviews: { label: 'Reviews', desc: 'Read customer feedback' },
    settings: { label: 'Settings', desc: 'Modify system configuration' },
};

export default function AdminAcceptInvite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [invite, setInvite] = useState(null);
    const [inviteDocId, setInviteDocId] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, ready, expired, success, error
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) { setStatus('expired'); return; }

        const fetchInvite = async () => {
            try {
                const q = query(
                    collection(db, 'adminInvites'),
                    where('inviteToken', '==', token),
                    where('status', '==', 'pending')
                );
                const snap = await getDocs(q);
                if (snap.empty) { setStatus('expired'); return; }

                const inviteData = snap.docs[0].data();
                const expires = inviteData.expiresAt?.toDate?.() || new Date(inviteData.expiresAt);
                if (new Date() > expires) {
                    await updateDoc(doc(db, 'adminInvites', snap.docs[0].id), { status: 'expired' });
                    setStatus('expired');
                    return;
                }

                setInvite(inviteData);
                setInviteDocId(snap.docs[0].id);
                setStatus('ready');
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };
        fetchInvite();
    }, [token]);

    const handleAccept = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setErrorMsg('Please enter your name.'); return; }
        if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            // 1. Create Firebase user
            const cred = await createUserWithEmailAndPassword(auth, invite.email, password);
            const uid = cred.user.uid;

            // 2. Write admin profile to /adminUsers
            await setDoc(doc(db, 'adminUsers', uid), {
                uid,
                email: invite.email,
                name: name.trim(),
                role: invite.role || 'admin',
                permissions: invite.permissions || {
                    orders: true, finance: false, walkins: true, reviews: false, settings: false
                },
                receiveOrderEmails: invite.receiveOrderEmails || false,
                invitedBy: invite.invitedBy,
                createdAt: serverTimestamp(),
                status: 'active',
            });

            // 3. Mark invite as accepted
            await updateDoc(doc(db, 'adminInvites', inviteDocId), {
                status: 'accepted',
                acceptedAt: serverTimestamp(),
                acceptedByUid: uid,
            });

            setStatus('success');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setErrorMsg('This email already has an account. Please log in directly.');
            } else {
                setErrorMsg(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#E85D04] animate-spin" />
            </div>
        );
    }

    if (status === 'expired') {
        return (
            <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-white font-black text-3xl tracking-tight mb-3">Invite Expired</h1>
                <p className="text-emerald-100/60 max-w-xs font-medium">This invitation link is invalid or has expired. Please ask your admin to resend it.</p>
                <button onClick={() => navigate('/admin/login')} className="mt-10 bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all text-xs uppercase tracking-widest">
                    Go to Admin Login
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
                <h1 className="text-white font-black text-4xl tracking-tight">Welcome Aboard!</h1>
                <p className="text-emerald-100/60 mt-4 max-w-xs font-medium leading-relaxed">Your admin account is active. Log in now to access the Lyceum dashboard.</p>
                <button onClick={() => navigate('/admin/login')} className="mt-10 bg-[#E85D04] text-white px-10 py-5 rounded-[24px] font-black shadow-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest">
                    Log In to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F3024] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-white p-2 rounded-full mb-4 shadow-2xl">
                        <img src="/Lyceum-official-logo-white-bg.png" alt="Lyceum" className="w-full h-full rounded-full" />
                    </div>
                    <h1 className="text-white font-black text-3xl tracking-tighter uppercase">Lyceum Admin</h1>
                    <p className="text-emerald-400/80 font-black text-[10px] tracking-[0.3em] uppercase mt-1">Team Invitation</p>
                </div>

                <div className="bg-white rounded-[40px] p-8 shadow-2xl">
                    {/* Invite info */}
                    <div className="bg-[#0F3024]/5 rounded-[24px] p-5 mb-8 border border-[#0F3024]/10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Invited by</p>
                        <p className="font-black text-[#0F3024]">{invite?.invitedBy}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{invite?.email}</p>
                        <div className="mt-4 pt-4 border-t border-[#0F3024]/10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Access Permissions</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(invite?.permissions || {}).filter(([,v]) => v).map(([k]) => (
                                    <span key={k} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                        {PERMISSION_LABELS[k]?.label || k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-[#0F3024] tracking-tight mb-1 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#E85D04]" /> Set Up Account
                    </h2>
                    <p className="text-gray-500 text-sm font-medium mb-6">Create your password to activate your admin access.</p>

                    <form onSubmit={handleAccept} className="space-y-5">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-wider border border-red-100 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-[#0F3024] outline-none focus:border-[#E85D04] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 pr-12 font-bold text-[#0F3024] outline-none focus:border-[#E85D04] transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#0F3024] hover:bg-[#1a4a38] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            Activate Admin Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
