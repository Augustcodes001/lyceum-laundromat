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
    updateDoc,
    serverTimestamp,
    deleteDoc
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
    Users,
    Truck,
    Star,
    LogOut,
    XCircle,
    Clock,
    Mail
} from 'lucide-react';
import ItemIcon from '../../components/ItemIcon';
import { useAdmin } from '../../context/AdminContext';

const AdminSettings = () => {
    // ── Global State ──
    const { isSuperAdmin } = useAdmin();
    const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'security', 'team'
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // ── Security Tab State ──
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // ── Custom Modal State ──
    const [confirmState, setConfirmState] = useState({ isOpen: false, type: null, targetId: null, targetEmail: null });
    const [authLoading, setAuthLoading] = useState(false);

    // ── Team Tab State ──
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('admin');
    const [receiveOrderEmails, setReceiveOrderEmails] = useState(false);
    const [invitePermissions, setInvitePermissions] = useState({
        orders: true,
        finance: false,
        walkins: true,
        reviews: false,
        settings: false,
    });
    const [admins, setAdmins] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [inviting, setInviting] = useState(false);
    const [revoking, setRevoking] = useState(null);

    useEffect(() => {
        // ── Fetch Global Config ──
        const unsubscribeConfig = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Ensure legacy configs get the new delivery schema automatically
                if (!data.delivery) {
                    data.delivery = {
                        baseFee: 1500,
                        pricePerKm: 200,
                        companyLat: 6.3986,
                        companyLng: 5.6179,
                    };
                }
                setConfig(data);
            } else {
                const defaults = {
                    services: {
                        'wash-fold': { name: 'Wash & Fold', desc: 'Washed, dried, and neatly folded', icon: 'wash-fold-icon' },
                        'ironing': { name: 'Ironing Only', desc: 'Professionally pressed and hung', icon: 'ironing-icon' },
                        'dry-clean': { name: 'Dry Clean', desc: 'Premium stain removal & care', icon: 'dry-clean-icon' },
                    },
                    items: [
                        { id: 'polo', name: 'Polo / T-Shirt', services: { 'wash-fold': 350, 'ironing': 200, 'dry-clean': 500 } },
                        { id: 'trouser', name: 'Jean / Trouser', services: { 'wash-fold': 400, 'ironing': 200, 'dry-clean': 500 } },
                        { id: 'short', name: 'Short', services: { 'wash-fold': 300, 'ironing': 150, 'dry-clean': 500 } },
                        { id: 'native', name: 'Native Up and Down', services: { 'wash-fold': 600, 'ironing': 400, 'dry-clean': 1000 } },
                        { id: 'agbada', name: 'Complete Agbada', services: { 'wash-fold': 1000, 'ironing': 700, 'dry-clean': 1800 } },
                        { id: 'suit', name: 'Complete Suit', services: { 'wash-fold': 1000, 'ironing': 700, 'dry-clean': 1800 } },
                        { id: 'shoe', name: 'Pair of Shoe', services: { 'wash-fold': 1000, 'ironing': 0, 'dry-clean': 1500 } },
                        { id: 'duvet', name: 'Duvet', services: { 'wash-fold': 2000, 'ironing': 0, 'dry-clean': 3000 } },
                        { id: 'white-duvet', name: 'White Duvet', services: { 'wash-fold': 2500, 'ironing': 0, 'dry-clean': 3500 } },
                        { id: 'center-rug', name: 'Center Rug', services: { 'wash-fold': 7000, 'ironing': 0, 'dry-clean': 10000 } },
                    ],
                    shop: { isOpen: true, announcement: "Welcome to Lyceum Laundromat!" },
                    delivery: {
                        baseFee: 1500,
                        pricePerKm: 200,
                        companyLat: 6.3986,
                        companyLng: 5.6179,
                    }
                };
                // ── Auto-seed defaults into Firestore so all components stay in sync ──
                setDoc(doc(db, "settings", "global"), { ...defaults, seededAt: new Date().toISOString() })
                    .then(() => console.log("✅ Default config seeded to Firestore"))
                    .catch(err => console.error("Failed to seed defaults:", err));
                setConfig(defaults);
            }
            setLoading(false);
        });

        // ── Fetch Current Admins ──
        const qAdm = query(collection(db, "adminUsers"));
        const unsubscribeAdmins = onSnapshot(qAdm, (snapshot) => {
            const admList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdmins(admList);
        });

        // ── Fetch Pending Invites ──
        const qInvites = query(collection(db, "adminInvites"), where("status", "==", "pending"));
        const unsubscribeInvites = onSnapshot(qInvites, (snapshot) => {
            const inviteList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setPendingInvites(inviteList);
        });

        return () => {
            unsubscribeConfig();
            unsubscribeAdmins();
            unsubscribeInvites();
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

    const handleAddItem = () => {
        const newItem = {
            id: `item-${Date.now()}`,
            name: 'New Service Item',
            services: {}
        };
        // Initialize all service categories to 0
        Object.keys(config.services || {}).forEach(srvId => {
            newItem.services[srvId] = 0;
        });

        setConfig({ ...config, items: [newItem, ...config.items] });
    };

    const handleDeleteItem = (itemId) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        const updatedItems = config.items.filter(item => item.id !== itemId);
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
            const token = crypto.randomUUID 
                ? crypto.randomUUID() 
                : Math.random().toString(36).substring(2) + Date.now().toString(36);
            
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 48);

            await addDoc(collection(db, "adminInvites"), {
                email: inviteEmail.toLowerCase(),
                role: inviteRole,
                permissions: invitePermissions,
                receiveOrderEmails,
                invitedBy: auth.currentUser.email,
                inviteToken: token,
                status: 'pending',
                expiresAt
            });

            const apiBase = import.meta.env.VITE_APP_URL || 'https://lyceumlaundromat.com.ng';
            const sentAt = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });

            // 1. Email to the invited person
            await fetch(`${apiBase}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'admin_invite',
                    payload: {
                        email: inviteEmail.toLowerCase(),
                        role: inviteRole,
                        invitedBy: auth.currentUser.email,
                        token,
                        permissions: invitePermissions
                    }
                })
            });

            // 2. Security confirmation back to the Super Admin
            await fetch(`${apiBase}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'admin_invite_confirmation',
                    payload: {
                        adminEmail: auth.currentUser.email,
                        invitedEmail: inviteEmail.toLowerCase(),
                        role: inviteRole,
                        invitedAt: sentAt
                    }
                })
            });

            setMessage({ type: 'success', text: `✅ Invite sent to ${inviteEmail}! A confirmation has been sent to your email.` });
            setInviteEmail('');
            setInvitePermissions({ orders: true, finance: false, walkins: true, reviews: false, settings: false });
            setReceiveOrderEmails(false);
        } catch (err) {
            console.error("Invite Error:", err);
            setMessage({ type: 'error', text: 'Failed to send invitation. Check your connection and try again.' });
        } finally {
            setInviting(false);
            setTimeout(() => setMessage(null), 7000);
        }
    };

    // ── Logic: Revoke Pending Invite ──
    const handleRevokeInvite = (inviteId, inviteEmail) => {
        setConfirmState({ isOpen: true, type: 'revoke', targetId: inviteId, targetEmail: inviteEmail });
    };

    const executeRevokeInvite = async (inviteId, inviteEmail) => {
        setRevoking(inviteId);
        try {
            await updateDoc(doc(db, 'adminInvites', inviteId), {
                status: 'expired',
                revokedBy: auth.currentUser.email,
                revokedAt: serverTimestamp()
            });
            setMessage({ type: 'success', text: `Invite for ${inviteEmail} has been revoked.` });
            setTimeout(() => setMessage(null), 5000);
        } catch (err) {
            console.error('Revoke error:', err);
            setMessage({ type: 'error', text: 'Failed to revoke invite.' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setRevoking(null);
            setConfirmState({ isOpen: false, type: null, targetId: null, targetEmail: null });
        }
    };

    // ── Logic: Remove Admin ──
    const handleRemoveAdmin = (adminId, adminEmail) => {
        setConfirmState({ isOpen: true, type: 'remove', targetId: adminId, targetEmail: adminEmail });
    };

    const executeRemoveAdmin = async (adminId, adminEmail) => {
        setRevoking(adminId); // reuse revoking state for loading UI
        try {
            await deleteDoc(doc(db, 'adminUsers', adminId));
            setMessage({ type: 'success', text: `Admin access revoked for ${adminEmail}.` });
            setTimeout(() => setMessage(null), 5000);
        } catch (err) {
            console.error('Revoke admin error:', err);
            setMessage({ type: 'error', text: 'Failed to remove admin account. Check permissions.' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setRevoking(null);
            setConfirmState({ isOpen: false, type: null, targetId: null, targetEmail: null });
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
                    {(activeTab === 'shop' || activeTab === 'delivery') && (
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
            <div className="flex bg-white/50 p-1.5 rounded-[24px] border border-gray-100 w-fit overflow-x-auto max-w-full">
                {[
                    { id: 'shop', label: 'Shop Config', icon: Store },
                    { id: 'delivery', label: 'Delivery', icon: Truck },
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
                                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E85D04]/5 text-[#E85D04] rounded-xl flex items-center justify-center">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black text-[#0F3024]">Service Pricing</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Search items..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-[#0F3024] focus:ring-2 focus:ring-[#E85D04]/20 outline-none w-48 placeholder:text-gray-400"
                                        />
                                        <button 
                                            onClick={handleAddItem}
                                            className="flex items-center gap-2 text-xs font-black text-[#E85D04] uppercase tracking-widest hover:text-[#cc5203] transition-colors shrink-0"
                                        >
                                            <Plus className="w-4 h-4" /> Add Item
                                        </button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {config.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                        <div key={item.id} className="p-8 hover:bg-gray-50/50 transition-all group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-3 border border-gray-100 group-hover:bg-emerald-50 transition-colors text-[#0F3024] opacity-80 overflow-hidden relative">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ItemIcon name={item.name} className="w-full h-full" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 max-w-xs">
                                                        <input 
                                                            type="text" 
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const updated = config.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i);
                                                                setConfig({ ...config, items: updated });
                                                            }}
                                                            className="font-black text-[#0F3024] bg-transparent border-none p-0 focus:ring-0 text-lg w-full"
                                                        />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Custom Image URL (Optional)"
                                                            value={item.imageUrl || ''}
                                                            onChange={(e) => {
                                                                const updated = config.items.map(i => i.id === item.id ? { ...i, imageUrl: e.target.value } : i);
                                                                setConfig({ ...config, items: updated });
                                                            }}
                                                            className="text-[10px] font-bold text-gray-400 bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-gray-300 mt-1"
                                                        />
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
                                                <button 
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-3 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🚚 TAB: DELIVERY CONFIG */}
                    {activeTab === 'delivery' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-12 h-12 bg-[#25D366]/5 text-[#25D366] rounded-2xl flex items-center justify-center">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F3024]">Delivery Settings</h2>
                                        <p className="text-gray-400 text-sm font-medium">Configure dynamic kilometer-based delivery pricing.</p>
                                    </div>
                                </div>

                                <div className="space-y-8 max-w-xl">
                                    {/* Financials */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Base Fee (₦)</label>
                                            <input 
                                                type="number" 
                                                value={config?.delivery?.baseFee || 0}
                                                onChange={(e) => setConfig({ ...config, delivery: { ...config.delivery, baseFee: parseFloat(e.target.value) || 0 } })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Price Per KM (₦)</label>
                                            <input 
                                                type="number" 
                                                value={config?.delivery?.pricePerKm || 0}
                                                onChange={(e) => setConfig({ ...config, delivery: { ...config.delivery, pricePerKm: parseFloat(e.target.value) || 0 } })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Coordinates */}
                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="text-xs font-black text-[#0F3024] uppercase tracking-widest mb-4">Company Location (Origin)</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] px-1">Latitude</label>
                                                <input 
                                                    type="number" 
                                                    step="0.00000001"
                                                    value={config?.delivery?.companyLat || 0}
                                                    onChange={(e) => setConfig({ ...config, delivery: { ...config.delivery, companyLat: parseFloat(e.target.value) || 0 } })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] px-1">Longitude</label>
                                                <input 
                                                    type="number" 
                                                    step="0.00000001"
                                                    value={config?.delivery?.companyLng || 0}
                                                    onChange={(e) => setConfig({ ...config, delivery: { ...config.delivery, companyLng: parseFloat(e.target.value) || 0 } })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3024]/10 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mt-4">These coordinates dictate the center point for calculating km-distance when users click "Use My Location".</p>
                                    </div>
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
                            {!isSuperAdmin ? (
                                <div className="bg-red-50 p-10 rounded-[40px] text-center border border-red-100 flex flex-col items-center">
                                    <ShieldCheck className="w-16 h-16 text-red-400 mb-4" />
                                    <h2 className="text-2xl font-black text-red-900 mb-2">Access Denied</h2>
                                    <p className="text-red-700/80 font-medium max-w-md">You do not have permission to manage the team. Only Super Admins can issue invitations and modify access levels.</p>
                                </div>
                            ) : (
                                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                <UserPlus className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-[#0F3024]">Add Team Member</h2>
                                                <p className="text-gray-400 text-sm font-medium">Configure access and invite colleagues.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleInviteAdmin} className="space-y-8 bg-gray-50/50 p-6 md:p-8 rounded-[32px] border border-gray-100 mb-12">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    required
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#E85D04] transition-all outline-none text-[#0F3024]"
                                                    placeholder="colleague@lyceum.com"
                                                />
                                            </div>
                                        <div class="space-y-2">
                                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Assign Role</label>
                                                                <select
                                                                    value={inviteRole}
                                                                    onChange={(e) => setInviteRole(e.target.value)}
                                                                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#E85D04] transition-all outline-none text-[#0F3024] cursor-pointer"
                                                                >
                                                                    <option value="admin">Administrator</option>
                                                                </select>
                                                                <p className="text-[10px] text-gray-400 px-1 font-medium mt-1">Super Admin is disabled.</p>
                                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-gray-200/60">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Specific Permissions</label>
                                                
                                                <label className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#E85D04] transition-colors">
                                                    <input 
                                                        type="checkbox"
                                                        checked={receiveOrderEmails}
                                                        onChange={(e) => setReceiveOrderEmails(e.target.checked)}
                                                        className="w-5 h-5 rounded border-gray-300 text-[#E85D04] focus:ring-[#E85D04]" 
                                                    />
                                                    <span className="text-sm font-bold text-[#0F3024]">Receive New Order Emails</span>
                                                </label>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {Object.keys(invitePermissions).map(key => (
                                                    <label key={key} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${invitePermissions[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                        <input 
                                                            type="checkbox"
                                                            checked={invitePermissions[key]}
                                                            onChange={(e) => setInvitePermissions({...invitePermissions, [key]: e.target.checked})}
                                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 shrink-0" 
                                                        />
                                                        <span className={`text-xs font-black uppercase ${invitePermissions[key] ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                            {key}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button 
                                                type="submit"
                                                disabled={inviting || !inviteEmail}
                                                className="bg-[#E85D04] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#E85D04]/20 hover:bg-[#cc5203] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                            >
                                                {inviting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                                Send Professional Invite
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-6">

                                        {/* ── Pending Invites ── */}
                                        {pendingInvites.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-1">
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                    <h3 className="text-sm font-black text-[#0F3024] uppercase tracking-widest">Pending Invitations</h3>
                                                    <span className="ml-1 bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">
                                                        {pendingInvites.length} awaiting
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {pendingInvites.map((inv) => {
                                                        // Safely compute expiry time label
                                                        let expiryLabel = '48h window';
                                                        try {
                                                            const raw = inv.expiresAt;
                                                            const exp = raw?.toDate ? raw.toDate() : raw?.seconds ? new Date(raw.seconds * 1000) : new Date(raw);
                                                            if (!isNaN(exp?.getTime())) {
                                                                const hrs = Math.max(0, Math.round((exp - new Date()) / 36e5));
                                                                expiryLabel = hrs > 0 ? `Expires in ~${hrs}h` : 'Expiring soon';
                                                            }
                                                        } catch {}

                                                        return (
                                                            <div key={inv.id} className="flex items-center justify-between bg-amber-50/60 border border-amber-100 rounded-2xl px-5 py-4 gap-4">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="w-9 h-9 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-sm shrink-0">
                                                                        <Mail className="w-4 h-4" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-black text-[#0F3024] truncate">{inv.email}</p>
                                                                        <p className="text-[10px] text-amber-600 font-bold">{expiryLabel} · Invited by {inv.invitedBy?.split('@')[0]}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRevokeInvite(inv.id, inv.email)}
                                                                    disabled={revoking === inv.id}
                                                                    title="Revoke this invite immediately"
                                                                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                                                >
                                                                    {revoking === inv.id
                                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                        : <XCircle className="w-3.5 h-3.5" />
                                                                    }
                                                                    Revoke
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Active Admins ── */}
                                        <div className="flex items-center gap-3 px-1">
                                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                                            <h3 className="text-sm font-black text-[#0F3024] uppercase tracking-widest">Active Administrators</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {admins.map((adm) => (
                                                <div key={adm.id} className={`p-6 rounded-[24px] border border-gray-100 flex flex-col gap-4 relative overflow-hidden group transition-all ${adm.role === 'super_admin' ? 'bg-[#0F3024] text-white shadow-xl' : 'bg-white hover:border-[#E85D04]/30 shadow-sm'}`}>
                                                    
                                                    {adm.role === 'super_admin' && (
                                                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                                                    )}

                                                    <div className="flex items-start justify-between relative z-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${adm.role === 'super_admin' ? 'bg-white/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                                                {adm.name?.charAt(0).toUpperCase() || adm.email?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-black flex items-center gap-2 ${adm.role === 'super_admin' ? 'text-white' : 'text-[#0F3024]'}`}>
                                                                    {adm.name || 'Admin User'}
                                                                    {adm.role === 'super_admin' && <Star className="w-3 h-3 text-emerald-400" fill="currentColor" />}
                                                                </p>
                                                                <p className={`text-[10px] font-bold mt-0.5 ${adm.role === 'super_admin' ? 'text-white/60' : 'text-gray-400'}`}>
                                                                    {adm.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${adm.role === 'super_admin' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                            {adm.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                        </div>
                                                        {isSuperAdmin && adm.role !== 'super_admin' && (
                                                            <button
                                                                onClick={() => handleRemoveAdmin(adm.id, adm.email)}
                                                                disabled={revoking === adm.id}
                                                                title="Revoke Admin Access"
                                                                className="absolute top-0 right-0 mt-2 mr-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                                            >
                                                                {revoking === adm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Role Chips */}
                                                    {adm.role !== 'super_admin' && adm.permissions && (
                                                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 mt-2">
                                                            {Object.entries(adm.permissions).filter(([, val]) => val).map(([k]) => (
                                                                <span key={k} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 text-[8px] font-black uppercase tracking-widest">
                                                                    {k}
                                                                </span>
                                                            ))}
                                                            {adm.receiveOrderEmails && (
                                                                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                                    <LogOut className="w-2 h-2 rotate-180" /> Emails
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
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

            {/* 🛑 CONFIRMATION MODAL */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-[#0F3024] mb-2">
                            {confirmState.type === 'revoke' ? 'Revoke Invite?' : 'Remove Admin?'}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            {confirmState.type === 'revoke' 
                                ? (
                                    <>Are you sure you want to revoke the invite for <span className="font-bold text-[#0F3024]">{confirmState.targetEmail}</span>? The link will stop working immediately.</>
                                ) : (
                                    <>Are you sure you want to permanently remove admin access for <span className="font-bold text-[#0F3024]">{confirmState.targetEmail}</span>?</>
                                )}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmState({ isOpen: false, type: null, targetId: null, targetEmail: null })}
                                className="flex-1 bg-gray-100 text-[#0F3024] py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmState.type === 'revoke') {
                                        executeRevokeInvite(confirmState.targetId, confirmState.targetEmail);
                                    } else {
                                        executeRemoveAdmin(confirmState.targetId, confirmState.targetEmail);
                                    }
                                }}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                            >
                                {confirmState.type === 'revoke' ? 'Revoke' : 'Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
