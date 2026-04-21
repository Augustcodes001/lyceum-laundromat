import { useState, useEffect } from 'react';
import { 
    doc, 
    getDoc, 
    setDoc, 
    onSnapshot, 
    collection, 
    query, 
    where, 
    addDoc, 
    serverTimestamp 
} from 'firebase/firestore';
import { 
    reauthenticateWithCredential, 
    EmailAuthProvider, 
    updatePassword 
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { 
    Settings, 
    Store, 
    Tag, 
    Save, 
    RefreshCcw, 
    AlertCircle, 
    CheckCircle2,
    Loader2,
    Plus,
    Trash2,
    Image as ImageIcon,
    ShieldCheck,
    UserPlus,
    UserCheck,
    ChevronRight,
    KeyRound,
    Users
} from 'lucide-react';

const AdminSettings = () => {
    // ── Global State ──
    const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'security', 'team'
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // ── Security Tab State ──
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // ── Team Tab State ──
    const [inviteEmail, setInviteEmail] = useState('');
    const [admins, setAdmins] = useState([]);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        // ── Fetch Global Config ──
        const unsubscribeConfig = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            } else {
                const defaults = {
                    services: {
                        'wash-fold': { name: 'Wash & Fold', desc: 'Washed, dried, and neatly folded', icon: 'wash-fold-icon' },
                        'ironing': { name: 'Ironing Only', desc: 'Professionally pressed and hung', icon: 'ironing-icon' },
                        'dry-clean': { name: 'Dry Clean', desc: 'Premium stain removal & care', icon: 'dry-clean-icon' },
                    },
                    items: [
                        { id: 'tshirt', name: 'T-Shirt / Polo', image: 'https://img.icons8.com/color/96/t-shirt--v1.png', services: { 'wash-fold': 1500, 'ironing': 800, 'dry-clean': 2500 } },
                        { id: 'shirt', name: 'Dress Shirt', image: 'https://img.icons8.com/color/96/shirt.png', services: { 'wash-fold': 1500, 'ironing': 1000, 'dry-clean': 2500 } },
                        { id: 'trouser', name: 'Trousers / Jeans', image: 'https://img.icons8.com/color/96/trousers.png', services: { 'wash-fold': 2000, 'ironing': 1200, 'dry-clean': 3500 } }
                    ],
                    shop: { isOpen: true, announcement: "Welcome to Lyceum Laundromat!" }
                };
                setConfig(defaults);
            }
            setLoading(false);
        });

        // ── Fetch Current Admins ──
        const qAdm = query(collection(db, "users"), where("role", "==", "admin"));
        const unsubscribeAdmins = onSnapshot(qAdm, (snapshot) => {
            const admList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdmins(admList);
        });

        return () => {
            unsubscribeConfig();
            unsubscribeAdmins();
        };
    }, []);

    // ── Logic: Shop Configuration ──
    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "global"), {
                ...config,
                updatedAt: new Date().toISOString()
            });
            setMessage({ type: 'success', text: 'Shop configuration updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error("Save Error:", err);
            setMessage({ type: 'error', text: 'Failed to save configuration.' });
        } finally {
            setSaving(false);
        }
    };

    const updateItemPrice = (itemId, serviceId, newPrice) => {
        const updatedItems = config.items.map(item => {
            if (item.id === itemId) {
                return { ...item, services: { ...item.services, [serviceId]: parseInt(newPrice) || 0 } };
            }
            return item;
        });
        setConfig({ ...config, items: updatedItems });
    };

    // ── Logic: Security ──
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setAuthLoading(true);
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            
            // 1. Re-authenticate
            await reauthenticateWithCredential(user, credential);
            
            // 2. Update Password
            await updatePassword(user, newPassword);
            
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error("Auth Error:", err);
            setMessage({ type: 'error', text: err.code === 'auth/wrong-password' ? 'Current password incorrect.' : 'Failed to update password.' });
        } finally {
            setAuthLoading(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    // ── Logic: Team ──
    const handleInviteAdmin = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        setInviting(true);
        try {
            await addDoc(collection(db, "pending_admins"), {
                email: inviteEmail.toLowerCase(),
                invitedBy: auth.currentUser.email,
                invitedAt: serverTimestamp(),
                status: 'pending'
            });
            setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}!` });
            setInviteEmail('');
        } catch (err) {
            console.error("Invite Error:", err);
            setMessage({ type: 'error', text: 'Failed to send invitation.' });
        } finally {
            setInviting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#0F3024] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Systems...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Control security, team hierarchy, and shop parameters.</p>
                </div>
                <div className="flex items-center gap-4">
                    {message && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-in slide-in-from-right-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}
                    {activeTab === 'shop' && (
                        <button 
                            onClick={handleSaveConfig}
                            disabled={saving}
                            className="flex items-center gap-2 bg-[#E85D04] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#E85D04]/20 hover:bg-[#cc5203] transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Config
                        </button>
                    )}
                </div>
            </div>

            {/* ── Tabs Navigation ── */}
            <div className="flex bg-white/50 p-1.5 rounded-[24px] border border-gray-100 w-fit">
                {[
                    { id: 'shop', label: 'Shop Config', icon: Store },
                    { id: 'security', label: 'Security', icon: ShieldCheck },
                    { id: 'team', label: 'Team', icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-sm font-black transition-all ${activeTab === tab.id ? 'bg-[#0F3024] text-white shadow-xl shadow-[#0F3024]/20' : 'text-gray-400 hover:text-[#0F3024] hover:bg-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* ── CONTENT AREA ── */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 🛠️ TAB: SHOP CONFIG */}
                    {activeTab === 'shop' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E85D04]/5 text-[#E85D04] rounded-xl flex items-center justify-center">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black text-[#0F3024]">Service Pricing</h2>
                                    </div>
                                    <button className="flex items-center gap-2 text-xs font-black text-[#E85D04] uppercase tracking-widest hover:text-[#cc5203] transition-colors">
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {config.items.map((item) => (
                                        <div key={item.id} className="p-8 hover:bg-gray-50/50 transition-all group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 group-hover:bg-white transition-colors relative">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                        <button className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-[#E85D04] opacity-0 group-hover:opacity-100 transition-all">
                                                            <ImageIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <input 
                                                            type="text" 
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const updated = config.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i);
                                                                setConfig({ ...config, items: updated });
                                                            }}
                                                            className="font-black text-[#0F3024] bg-transparent border-none p-0 focus:ring-0 text-lg w-full"
                                                        />
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {item.id}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {Object.keys(config.services).map((srvId) => (
                                                        <div key={srvId} className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter block pl-1">{config.services[srvId].name}</label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₦</span>
                                                                <input 
                                                                    type="number" 
                                                                    value={item.services[srvId] || 0}
                                                                    onChange={(e) => updateItemPrice(item.id, srvId, e.target.value)}
                                                                    className="w-full bg-gray-50 border-none rounded-xl pl-6 pr-3 py-2 text-sm font-black text-[#0F3024] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="p-3 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🔐 TAB: SECURITY */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-12 h-12 bg-orange-50 text-[#E85D04] rounded-2xl flex items-center justify-center">
                                        <KeyRound className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F3024]">Security Credentials</h2>
                                        <p className="text-gray-400 text-sm font-medium">Regularly update your password to stay secure.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Current Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Confirm New</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={authLoading}
                                        className="w-full bg-[#0F3024] text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-900/40 hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                        Verify & Update Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* 👥 TAB: TEAM */}
                    {activeTab === 'team' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F3024]">Team Management</h2>
                                        <p className="text-gray-400 text-sm font-medium">Invite trusted colleagues to the admin portal.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleInviteAdmin} className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <div className="flex-1">
                                        <input 
                                            type="email" 
                                            required
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                            placeholder="colleague@lyceum.com"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={inviting}
                                        className="bg-[#E85D04] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#E85D04]/20 hover:bg-[#cc5203] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {inviting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        Send Invite
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Active Administrators</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {admins.map((adm) => (
                                            <div key={adm.id} className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-50 flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">
                                                            {adm.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[#0F3024]">{adm.name || 'Admin User'}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">{adm.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                                    <UserCheck className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* ── SIDEBAR INFO ── */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Operational Switch (Always visible during shop tab) */}
                    {activeTab === 'shop' && (
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-[#0F3024]/5 text-[#0F3024] rounded-xl flex items-center justify-center">
                                    <Store className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-[#0F3024]">Operations</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[24px]">
                                    <div>
                                        <p className="text-sm font-bold text-[#0F3024]">Shop Status</p>
                                        <p className="text-xs text-gray-500">{config.shop.isOpen ? 'Open' : 'Closed'}</p>
                                    </div>
                                    <button 
                                        onClick={() => setConfig({ ...config, shop: { ...config.shop, isOpen: !config.shop.isOpen } })}
                                        className={`w-14 h-8 rounded-full transition-all relative ${config.shop.isOpen ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${config.shop.isOpen ? 'right-1' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Announcement</label>
                                    <textarea 
                                        value={config.shop.announcement}
                                        onChange={(e) => setConfig({ ...config, shop: { ...config.shop, announcement: e.target.value } })}
                                        className="w-full bg-gray-50 border-none rounded-[24px] p-4 text-sm font-medium focus:ring-2 focus:ring-[#0F3024]/10 transition-all min-h-[120px] resize-none outline-none text-[#0F3024]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#0F3024] p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700"></div>
                        <h3 className="text-2xl font-black mb-4 relative z-10">
                            {activeTab === 'security' ? 'Auth Encryption' : activeTab === 'team' ? 'Access Control' : 'Pricing Pro-Tip'}
                        </h3>
                        <p className="text-emerald-100/60 font-medium leading-relaxed mb-8 relative z-10">
                            {activeTab === 'security' ? 'We use end-to-end Firebase Authentication to secure your portal. Changes are reflected across all synced devices.' : activeTab === 'team' ? 'Invitations expire in 48 hours. Ensure your team checks their email folders.' : 'Updating prices here will instantly reflect across the customer portal and POS.'}
                        </p>
                        <ShieldCheck className="w-12 h-12 text-white/20 absolute bottom-8 right-8" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
