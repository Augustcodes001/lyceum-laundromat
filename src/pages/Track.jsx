import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

export default function Track() {
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

    // ── Auto-track when URL has an id ──
    useEffect(() => {
        if (urlId) startLiveTracking(urlId.toUpperCase());
        return () => { if (unsubRef.current) unsubRef.current(); };
    }, [urlId]);

    const startLiveTracking = (id) => {
        if (!id.trim()) return;

        // Tear down previous listener
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        const q = query(collection(db, "orders"), where("trackingId", "==", id));

        const unsub = onSnapshot(q, (snapshot) => {
            setLoading(false);
            if (snapshot.empty) {
                setError("Order not found. Please check your tracking ID.");
                setOrder(null);
            } else {
                const newOrder = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

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
            }
        }, (err) => {
            console.error("Track listener error:", err);
            setLoading(false);
            setError("Something went wrong. Please try again.");
        });

        unsubRef.current = unsub;
    };

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        const id = trackingId.trim().toUpperCase();
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
        const idx = STEP_LABELS.indexOf(order?.status);
        if (idx < 0) return '0%';
        const pct = (idx / (STEPS.length - 1)) * 100;
        return `${pct}%`;
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-28 font-sans">
            {/* ── Header ── */}
            <div className="bg-[#0F3024] pt-12 pb-16 px-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-white tracking-wide border-l border-white/20 pl-4 py-1">Track Order</h1>
                    {order && (
                        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                            Live
                        </span>
                    )}
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-8 relative z-40 space-y-6">

                {/* ── Search Card ── */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100/50">
                    <div className="w-16 h-16 bg-[#E85D04]/10 text-[#E85D04] rounded-full flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#0F3024] text-center mb-2">Locate your laundry</h2>
                    <p className="text-sm text-gray-500 text-center mb-8">Enter your LY-XXXX reference code to track your order in real time.</p>
                    
                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                        <input 
                            value={trackingId} 
                            onChange={(e) => setTrackingId(e.target.value)} 
                            placeholder="LY-ABCD" 
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-center text-lg font-extrabold text-[#0F3024] tracking-widest uppercase focus:border-[#E85D04] focus:ring-4 focus:ring-[#E85D04]/10 outline-none transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#E85D04] text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(232,93,4,0.25)] hover:bg-[#d15303] transition-colors flex items-center justify-center gap-2"
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
                                    const currentIdx = STEP_LABELS.indexOf(order.status);
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
