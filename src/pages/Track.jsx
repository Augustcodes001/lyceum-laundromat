import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
    Search, 
    Clock, 
    Package, 
    ShipWheel, 
    Truck, 
    CheckCircle2, 
    AlertCircle,
    Loader2,
    RefreshCw
} from 'lucide-react';

const STEPS = [
    { label: 'Placed',           icon: Clock       },
    { label: 'Pickup',           icon: Package     },
    { label: 'Washing/Ironing',  icon: ShipWheel   },
    { label: 'Delivery',         icon: Truck       },
    { label: 'Completed',        icon: CheckCircle2},
];

const STEP_LABELS = STEPS.map(s => s.label);

// Normalize Firestore status strings to canonical STEP_LABELS
const normalizeStatus = (status = '') => {
    const s = status.toLowerCase().trim();
    if (s.includes('place') || s === 'order placed' || s === 'pending') return 'Placed';
    if (s.includes('pick')) return 'Pickup';
    if (s.includes('wash') || s.includes('iron')) return 'Washing/Ironing';
    if (s === 'delivery' || s.includes('out for delivery') || s.includes('delivering')) return 'Delivery';
    if (s.includes('complet') || s === 'delivered' || s.includes('done')) return 'Completed';
    // Try exact match last
    const exact = STEP_LABELS.find(l => l.toLowerCase() === s);
    return exact || null;
};


export default function Track({ isLoggedIn, onOpenAuth }) {
    const navigate = useNavigate();
    const { id: urlId } = useParams();

    const [trackingId, setTrackingId] = useState(urlId || '');
    const [loading, setLoading]       = useState(false);
    const [order, setOrder]           = useState(null);
    const [error, setError]           = useState('');
    const [justUpdated, setJustUpdated] = useState(false);

    // Holds the active Firestore unsubscribe fn
    const unsubRef = useRef(null);

    const [recentTracks, setRecentTracks] = useState(() => {
        const saved = localStorage.getItem('lyceum_recent_tracks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (urlId) startLiveTracking(urlId);
        return () => { if (unsubRef.current) unsubRef.current(); };
    }, [urlId]);

    const startLiveTracking = (rawId) => {
        if (!rawId.trim()) return;

        // Preserve case-sensitivity for doc IDs, but format legacy LY-ABCD codes
        const id = rawId.includes('-') ? rawId.trim().toUpperCase() : rawId.trim();

        // Tear down previous listener
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        const handleSuccess = (newOrder) => {
            // Flash "updated" indicator when status changes after first load
            setOrder(prev => {
                if (prev && prev.status !== newOrder.status) {
                    setJustUpdated(true);
                    setTimeout(() => setJustUpdated(false), 3000);
                }
                return newOrder;
            });

            // Save to recent searches
            setRecentTracks(prev => {
                if (!prev.includes(id)) {
                    const updated = [id, ...prev].slice(0, 5);
                    localStorage.setItem('lyceum_recent_tracks', JSON.stringify(updated));
                    return updated;
                }
                return prev;
            });
        };

        const handleError = (err) => {
            console.error("Track listener error:", err);
            setLoading(false);
            if (err.code === 'permission-denied') {
                setError("Access Denied. Ask Admin to open Firebase rules.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        };

        // Determine if they used a direct Vercel Share Link (Doc ID) or manual typed code (LY-...)
        const isDocumentId = id.length > 15 && !id.includes('-');

        if (isDocumentId) {
            // Direct Document Real-Time Fetch (Bypasses collection-level security sweeps)
            const unsub = onSnapshot(doc(db, "orders", id), (docSnap) => {
                setLoading(false);
                if (!docSnap.exists()) {
                    setError("Order not found or invalid reference.");
                    setOrder(null);
                } else {
                    handleSuccess({ id: docSnap.id, ...docSnap.data() });
                }
            }, handleError);
            unsubRef.current = unsub;
        } else {
            // Manual Custom Tracking Code (LY-ABCD) fetch
            const q = query(collection(db, "orders"), where("trackingId", "==", id));
            const unsub = onSnapshot(q, (snapshot) => {
                setLoading(false);
                if (snapshot.empty) {
                    setError("Order not found. Please check your tracking ID.");
                    setOrder(null);
                } else {
                    const docSnap = snapshot.docs[0];
                    handleSuccess({ id: docSnap.id, ...docSnap.data() });
                }
            }, handleError);
            unsubRef.current = unsub;
        }
    };

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        const id = trackingId.trim();
        if (!id) return;
        if (urlId === id) {
            startLiveTracking(id);
        } else {
            navigate(`/track/${id}`);
        }
    };

    const handleClearRecent = () => {
        setRecentTracks([]);
        localStorage.removeItem('lyceum_recent_tracks');
    };

    const progressWidth = () => {
        const normalized = normalizeStatus(order?.status);
        const idx = STEP_LABELS.indexOf(normalized);
        if (idx < 0) return '0%';
        const pct = (idx / (STEPS.length - 1)) * 100;
        return `${pct}%`;
    };


    return (
        <div className="bg-gray-50/50 min-h-screen pb-28 font-sans">
            {/* ── Header ── */}
            <div className="relative pt-16 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[#0F3024]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#E85D04]/20 rounded-full blur-3xl -mr-32 -mt-32 mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-overlay"></div>
                
                <div className="relative z-10 flex flex-col gap-4 max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/5">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-2xl font-black text-white tracking-tight border-l-2 border-[#E85D04]/60 pl-4 py-1">Order Tracking</h1>
                        {order && (
                            <span className="ml-auto flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                Live
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-12 relative z-40 space-y-8">

                {/* ── Search Card ── */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E85D04] to-orange-400 text-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-500/30">
                        <Search className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black text-[#0F3024] text-center mb-2 tracking-tight">Locate laundry</h2>
                    <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Enter your tracking code or 20-character reference ID to receive live status updates.</p>
                    
                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                        <input 
                            value={trackingId} 
                            onChange={(e) => setTrackingId(e.target.value)} 
                            placeholder="LY-ABCD" 
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-5 text-center text-lg font-extrabold text-[#0F3024] tracking-widest uppercase focus:border-[#E85D04] focus:ring-4 focus:ring-[#E85D04]/10 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#E85D04] text-white py-5 rounded-[20px] font-black group shadow-[0_10px_30px_rgba(232,93,4,0.25)] hover:shadow-[0_15px_35px_rgba(232,93,4,0.35)] hover:-translate-y-1 hover:bg-[#d15303] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Track Now
                        </button>
                    </form>
                </div>

                {/* ── Live Status Card ── */}
                {order && (
                    <div className={`bg-[#0F3024] rounded-[40px] p-8 shadow-2xl text-white relative overflow-hidden transition-all duration-500 ${justUpdated ? 'ring-4 ring-emerald-400/50 scale-[1.01]' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        {/* Updated flash banner */}
                        {justUpdated && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-20 animate-bounce">
                                <RefreshCw className="w-3 h-3" />
                                Status Updated!
                            </div>
                        )}

                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10 space-y-8">
                            {/* Status Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Current Status</p>
                                    <h3 className="text-2xl font-black">{order.status}</h3>
                                    {order.type === 'walk-in' && (
                                        <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mt-1">Walk-in Order</p>
                                    )}
                                </div>
                                <div className="bg-[#E85D04] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                    {order.trackingId}
                                </div>
                            </div>

                            {/* Visual Stepper */}
                            <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E85D04] z-0 transition-all duration-1000" style={{ width: progressWidth() }}></div>
                                
                                {STEPS.map((step, i) => {
                                    const StatusIcon = step.icon;
                                    const currentIdx = STEP_LABELS.indexOf(normalizeStatus(order.status));
                                    const isPast   = currentIdx >= i;
                                    const isActive = currentIdx === i;
                                    return (
                                        <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#E85D04] scale-125 shadow-lg shadow-orange-500/50' : isPast ? 'bg-[#E85D04]/40' : 'bg-white/10'}`}>
                                                <StatusIcon className={`w-5 h-5 ${isPast ? 'text-white' : 'text-white/20'}`} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-wider text-center leading-tight w-12 hidden sm:block ${isPast ? 'text-white/60' : 'text-white/20'} ${isActive ? '!text-[#E85D04]' : ''}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Details */}
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Customer</span>
                                    <span className="font-black">{order.customerName || "Member User"}</span>
                                </div>
                                {order.customerPhone && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Contact</span>
                                        <span className="font-black">{order.customerPhone}</span>
                                    </div>
                                )}
                                {order.deliveryDate && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400/80 font-bold uppercase tracking-widest text-[10px]">Expected Delivery</span>
                                        <span className="font-black text-emerald-400">
                                            {new Date(order.deliveryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Total Order</span>
                                    <div className="flex flex-col items-end">
                                        {Math.abs(order.deliveryFee || 0) > 0 && order.deliveryFeeWaived && (
                                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-1 animate-in fade-in slide-in-from-right-4 duration-500">
                                                🎉 Lyceum Waived Delivery!
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {Math.abs(order.deliveryFee || 0) > 0 && order.deliveryFeeWaived && (
                                                <span className="text-white/30 line-through text-xs font-bold">
                                                    ₦{((order.total || 0) + (order.deliveryFee || 0)).toLocaleString()}
                                                </span>
                                            )}
                                            <span className="font-black text-[#E85D04] text-lg">₦{order.total?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {order.description && (
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-1">Order Details</p>
                                        <p className="text-white/70 text-sm font-medium">{order.description}</p>
                                    </div>
                                )}
                                {order.items && order.items.length > 0 && (
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-2">Items</p>
                                        <div className="space-y-1.5">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs">
                                                    <span className="text-white/70 font-medium">{item.qty}× {item.name} <span className="text-white/30">({item.service})</span></span>
                                                    <span className="text-[#E85D04] font-black">₦{(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Live indicator */}
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                                </span>
                                <span className="text-[9px] font-black text-emerald-400/70 uppercase tracking-widest">Updating in real-time</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Error State ── */}
                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-center gap-4 animate-in duration-300">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <p className="text-red-700 text-sm font-bold">{error}</p>
                    </div>
                )}

                {/* ── Login / Navigation Prompt (Moved Up for better visibility) ── */}
                {!isLoggedIn ? (
                    <div className="bg-[#0F3024] relative overflow-hidden rounded-[40px] p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E85D04]/20 rounded-full blur-2xl -ml-16 -mb-16"></div>
                        
                        <div className="relative z-10 w-full">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-3xl shadow-inner border border-white/5 mx-auto backdrop-blur-md">
                                ✨
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Unlock Premium Care</h3>
                            <p className="text-[14px] text-emerald-100/70 font-medium mb-8 px-2 max-w-[280px] leading-relaxed mx-auto">Get full access to your order history, direct customer support, and seamless pickup bookings.</p>
                            <button 
                                onClick={onOpenAuth}
                                className="bg-[#E85D04] text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#d15303] hover:scale-105 shadow-[0_10px_30px_rgba(232,93,4,0.3)] transition-all active:scale-95 w-full flex items-center justify-center gap-3"
                            >
                                Log In / Sign Up
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
                        <p className="text-[10px] text-gray-400 font-black mb-4 uppercase tracking-[0.2em]">Logged into Lyceum</p>
                        <button 
                            onClick={() => navigate('/orders')}
                            className="bg-gray-50 text-[#0F3024] px-8 py-4 border border-gray-200 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 w-full"
                        >
                            View Full Dashboard
                        </button>
                    </div>
                )}

                {/* ── Recent Tracks ── */}
                {recentTracks.length > 0 && (
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#0F3024] flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Recent Searches
                            </h3>
                            <button onClick={handleClearRecent} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider">Clear</button>
                        </div>
                        <div className="space-y-2">
                            {recentTracks.map(id => (
                                <div 
                                    key={id} 
                                    onClick={() => navigate(`/track/${id}`)}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors border border-transparent hover:border-emerald-100 group"
                                >
                                    <span className="font-bold text-gray-700 group-hover:text-emerald-700 font-mono">{id}</span>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
