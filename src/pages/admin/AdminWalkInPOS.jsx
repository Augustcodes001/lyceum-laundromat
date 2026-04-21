import { useState, useMemo, useEffect } from 'react';
import { 
    collection, 
    addDoc, 
    serverTimestamp,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
    User, 
    Phone, 
    Mail, 
    LayoutGrid, 
    PenLine, 
    Plus, 
    Minus, 
    CheckCircle2, 
    Copy, 
    ExternalLink, 
    ArrowRight,
    Loader2,
    Trash2
} from 'lucide-react';

const AdminWalkInPOS = () => {
    // ── Dynamic Config State ──
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "global"), (snap) => {
            if (snap.exists()) {
                setConfig(snap.data());
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const ITEMS_DATA = config?.items || [];
    const SERVICES_META = config?.services || {};

    // ── Form State ──
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
    const [pricingMode, setPricingMode] = useState('menu'); // 'menu' or 'custom'
    
    // ── Menu Mode State ──
    const [selections, setSelections] = useState({}); // { itemId: qty }
    
    // ── Custom Mode State ──
    const [customDetails, setCustomDetails] = useState({ description: '', price: '' });
    
    // ── Submission State ──
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState(null); // { id, trackingId }

    // ── Calculation ──
    const totalAmount = useMemo(() => {
        if (pricingMode === 'custom') {
            return parseFloat(customDetails.price) || 0;
        }
        return ITEMS_DATA.reduce((sum, item) => {
            // Updated: item.services is now a map, we use 'wash-fold' as POS baseline
            const price = item.services?.['wash-fold'] || Object.values(item.services || {})[0] || 0;
            return sum + (price * (selections[item.id] || 0));
        }, 0);
    }, [pricingMode, selections, customDetails, ITEMS_DATA]);

    // ── Handlers ──
    const updateQty = (id, delta) => {
        setSelections(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta)
        }));
    };

    const generateTrackingId = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid O, 0, I, 1 for clarity
        let result = 'LY-';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (totalAmount <= 0) return alert("Total amount must be greater than ₦0");
        
        setIsSubmitting(true);
        const trackingId = generateTrackingId();

        try {
            const orderData = {
                customerName: customer.name,
                customerPhone: customer.phone,
                customerEmail: customer.email,
                type: 'walk-in',
                status: 'Placed',
                trackingId: trackingId,
                total: totalAmount,
                createdAt: serverTimestamp(),
                paymentMethod: 'Walk-in Pay',
                pricingMode: pricingMode
            };

            if (pricingMode === 'menu') {
                orderData.items = ITEMS_DATA
                    .filter(item => selections[item.id] > 0)
                    .map(item => ({
                        name: item.name,
                        qty: selections[item.id],
                        price: item.services?.['wash-fold'] || Object.values(item.services || {})[0] || 0,
                        service: 'General Walk-in Care'
                    }));
            } else {
                orderData.items = [{
                    name: 'Custom Order',
                    description: customDetails.description,
                    price: totalAmount,
                    qty: 1,
                    service: 'Custom Service'
                }];
                orderData.description = customDetails.description;
            }

            const docRef = await addDoc(collection(db, "orders"), orderData);
            setSuccessData({ id: docRef.id, trackingId });
        } catch (err) {
            console.error("POS Error:", err);
            alert("Failed to create walk-in order. check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyLink = () => {
        const link = `https://lyceum-laundromat.vercel.app/track/${successData.trackingId}`;
        navigator.clipboard.writeText(link);
        alert("Tracking link copied to clipboard!");
    };

    const resetPOS = () => {
        setCustomer({ name: '', phone: '', email: '' });
        setSelections({});
        setCustomDetails({ description: '', price: '' });
        setSuccessData(null);
    };

    const [copied, setCopied] = useState(false);

    const shareMessage = `Hi ${customer.name}, your Lyceum laundry order has been logged! Track your progress in real-time here: https://lyceum-laundromat.vercel.app/track/${successData?.trackingId}`;

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(shareMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
    };

    if (successData) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-6">
                <div className="bg-white rounded-[40px] shadow-2xl border border-emerald-100 p-8 sm:p-12 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>

                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-emerald-50 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    
                    <h1 className="text-4xl font-black text-[#0F3024] mb-3 tracking-tight">Order Logged!</h1>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                        Order for <span className="text-[#0F3024] font-black">{customer.name}</span> is successful. Total: <span className="text-[#E85D04] font-black">₦{totalAmount.toLocaleString()}</span>
                    </p>
                    
                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-[32px] p-8 mb-10 border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Tracking Reference</p>
                        <div className="text-5xl font-black text-[#0F3024] tracking-tighter mb-6 select-all font-mono">
                            {successData.trackingId}
                        </div>
                        
                        <div className="h-px bg-gray-200 w-full mb-6" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={handleWhatsAppShare}
                                className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all active:scale-95 group"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.617 1.435h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.178-1.237-6.164-3.483-8.411z"/></svg>
                                Share WhatsApp
                            </button>
                            <button 
                                onClick={handleCopyMessage}
                                className={`flex items-center justify-center gap-3 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all active:scale-95 border-2 ${copied ? 'bg-[#0F3024] text-white border-[#0F3024]' : 'bg-white text-[#0F3024] border-gray-100 hover:border-gray-200 shadow-sm'}`}
                            >
                                <Copy className="w-5 h-5" />
                                {copied ? 'Copied!' : 'Copy Info'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={resetPOS}
                            className="bg-[#0F3024] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-[#0a2018] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Plus className="w-6 h-6" />
                            Next Customer
                        </button>
                        <button 
                            onClick={() => window.open(`https://lyceum-laundromat.vercel.app/track/${successData.trackingId}`, '_blank')}
                            className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-[#E85D04] transition-colors py-2"
                        >
                            Open Public Tracker
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">Walk-in POS</h1>
                <p className="text-gray-500 font-medium mt-1">Log physical drop-offs and generate instant tracking links.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* ── Left Column: Customer & Mode ── */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-4 h-4 text-[#E85D04]" /> Customer Info
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#0F3024] uppercase ml-1">Full Name *</label>
                                <input 
                                    required
                                    value={customer.name}
                                    onChange={e => setCustomer({...customer, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0F3024]/10 transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#0F3024] uppercase ml-1">Phone Number *</label>
                                <input 
                                    required
                                    type="tel"
                                    value={customer.phone}
                                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0F3024]/10 transition-all"
                                    placeholder="080 1234 5678"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#0F3024] uppercase ml-1">Email <span className="text-gray-300">(Optional)</span></label>
                                <input 
                                    type="email"
                                    value={customer.email}
                                    onChange={e => setCustomer({...customer, email: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0F3024]/10 transition-all"
                                    placeholder="customer@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 flex gap-1">
                        <button 
                            type="button"
                            onClick={() => setPricingMode('menu')}
                            className={`flex-1 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${pricingMode === 'menu' ? 'bg-[#0F3024] text-white shadow-xl' : 'text-gray-400 hover:text-[#0F3024]'}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Menu Mode
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPricingMode('custom')}
                            className={`flex-1 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${pricingMode === 'custom' ? 'bg-[#0F3024] text-white shadow-xl' : 'text-gray-400 hover:text-[#0F3024]'}`}
                        >
                            <PenLine className="w-4 h-4" /> Custom Mode
                        </button>
                    </div>
                </div>

                {/* ── Middle/Right Column: Pricing Engine ── */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 sm:p-10 min-h-[500px] flex flex-col">
                        
                        <div className="flex-1">
                            {pricingMode === 'menu' ? (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-black text-[#0F3024] tracking-tight">Menu Services</h2>
                                        <button 
                                            type="button"
                                            onClick={() => setSelections({})}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {ITEMS_DATA.map(item => {
                                            const price = item.services?.['wash-fold'] || Object.values(item.services || {})[0] || 0;
                                            return (
                                                <div key={item.id} className={`p-4 rounded-3xl border transition-all flex items-center justify-center gap-4 ${selections[item.id] > 0 ? 'bg-emerald-50/50 border-[#0F3024]/20 ring-4 ring-[#0F3024]/5' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                                    <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 border border-gray-50 flex items-center justify-center">
                                                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-[#0F3024] text-sm leading-tight">{item.name}</p>
                                                        <p className="text-[10px] font-black text-[#E85D04] uppercase tracking-widest mt-0.5">₦{price.toLocaleString()}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 shrink-0">
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateQty(item.id, -1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className={`w-8 text-center font-black text-sm ${selections[item.id] > 0 ? 'text-[#0F3024]' : 'text-gray-300'}`}>
                                                            {selections[item.id] || 0}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateQty(item.id, 1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#0F3024] hover:bg-gray-100 transition-all"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="text-xl font-black text-[#0F3024] tracking-tight">Custom Price Mode</h2>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#0F3024] uppercase tracking-widest ml-1">Items Description</label>
                                            <textarea 
                                                required={pricingMode === 'custom'}
                                                value={customDetails.description}
                                                onChange={e => setCustomDetails({...customDetails, description: e.target.value})}
                                                className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-bold focus:ring-2 focus:ring-[#0F3024]/10 transition-all h-44 resize-none"
                                                placeholder="Describe the items being dropped off (e.g. 5 custom traditional outfits, specialized dry cleaning request...)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#0F3024] uppercase tracking-widest ml-1">Total Amount (₦)</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400 group-focus-within:text-[#E85D04] transition-colors text-xl">₦</div>
                                                <input 
                                                    required={pricingMode === 'custom'}
                                                    type="number"
                                                    value={customDetails.price}
                                                    onChange={e => setCustomDetails({...customDetails, price: e.target.value})}
                                                    className="w-full bg-gray-50 border-none rounded-3xl py-6 pl-12 pr-6 text-2xl font-black text-[#0F3024] focus:ring-2 focus:ring-[#0F3024]/10 transition-all placeholder:text-gray-300"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary / Submit Section */}
                        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Calculated Total</p>
                                <h3 className="text-4xl font-black text-[#0F3024] tracking-tighter">₦{totalAmount.toLocaleString()}</h3>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isSubmitting || totalAmount <= 0}
                                className="w-full sm:w-auto bg-[#E85D04] text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-orange-900/40 hover:bg-[#cc5203] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Complete Order</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminWalkInPOS;
