import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, AlertCircle, Info, X } from 'lucide-react';

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses & Suits", "Traditional", "Household", "Accessories", "Shoes & Bags", "Other"];

const ItemIcon = ({ name }) => {
    const itemName = (name || '').toLowerCase();
    const strokeProps = { stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

    if (itemName.includes('polo') || itemName.includes('shirt') || itemName.includes('hoodie') || itemName.includes('cardigan') || itemName.includes('top') || itemName.includes('singlet')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>;
    }
    if (itemName.includes('jean') || itemName.includes('trouser') || itemName.includes('short') || itemName.includes('jogger') || itemName.includes('boxer')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M6 4h12l-1 18h-3l-2-8-2 8H8L7 4z" /></svg>;
    }
    if (itemName.includes('shoe') || itemName.includes('socks')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M4 14l3-3h4l4 2 4 1a2 2 0 011 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" /></svg>;
    }
    if (itemName.includes('bed') || itemName.includes('duvet') || itemName.includes('blanket')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M3 14h18M3 10h18M5 6h14v4H5V6zM3 18h18" /></svg>;
    }
    if (itemName.includes('rug') || itemName.includes('towel') || itemName.includes('curtain')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M4 8h16M4 16h16" /></svg>;
    }
    if (itemName.includes('suit') || itemName.includes('agbada') || itemName.includes('gown') || itemName.includes('jumpsuit') || itemName.includes('safari') || itemName.includes('skirt') || itemName.includes('native')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M8 3h8l4 6-2 12H6L4 9l4-6z" /><path d="M12 3v18M8 9h8" /></svg>;
    }
    if (itemName.includes('bag')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" /></svg>;
    }
    return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
};

const DEFAULT_CATALOG = [
    { id: 'dc_polo', name: 'Polo', category: 'Tops', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_short', name: 'Short', category: 'Bottoms', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_jeantrouser', name: 'Jean trouser', category: 'Bottoms', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_jeantop', name: 'Jean top', category: 'Tops', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_joggers', name: 'Joggers', category: 'Bottoms', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_completejean', name: 'Complete Jean', category: 'Bottoms', image: '', services: { 'washing': 600, 'dry-cleaning': 1000, 'ironing': 500 } },
    { id: 'dc_hoodie', name: 'Hoodie', category: 'Tops', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_gown', name: 'Gown', category: 'Dresses & Suits', image: '', services: { 'washing': 400, 'dry-cleaning': 800, 'ironing': 400 } },
    { id: 'dc_skirt', name: 'Skirt', category: 'Bottoms', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_jumpsuits', name: 'Jumpsuits', category: 'Dresses & Suits', image: '', services: { 'washing': 400, 'dry-cleaning': 800, 'ironing': 400 } },
    { id: 'dc_cardigan', name: 'Cardigan', category: 'Tops', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_tshirt', name: 'T-Shirt', category: 'Tops', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_trouser', name: 'Trouser', category: 'Bottoms', image: '', services: { 'washing': 350, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_native', name: 'Native up and down', category: 'Traditional', image: '', services: { 'washing': 500, 'dry-cleaning': 1000, 'ironing': 500 } },
    { id: 'dc_agbada', name: 'Complete Agbada', category: 'Traditional', image: '', services: { 'washing': 800, 'dry-cleaning': 1800, 'ironing': 800 } },
    { id: 'dc_bedspread', name: 'Bedspread', category: 'Household', image: '', services: { 'washing': 500, 'dry-cleaning': 500, 'ironing': 300 } },
    { id: 'dc_whitebedspread', name: 'White bedspread', category: 'Household', image: '', services: { 'washing': 700, 'dry-cleaning': 700, 'ironing': 400 } },
    { id: 'dc_bigtowel', name: 'Big towel', category: 'Household', image: '', services: { 'washing': 700, 'dry-cleaning': 700 } },
    { id: 'dc_whitebigtowel', name: 'White big towel', category: 'Household', image: '', services: { 'washing': 800, 'dry-cleaning': 800 } },
    { id: 'dc_smalltowel', name: 'Small towel', category: 'Household', image: '', services: { 'washing': 400, 'dry-cleaning': 400 } },
    { id: 'dc_whitesmalltowel', name: 'White small towel', category: 'Household', image: '', services: { 'washing': 500, 'dry-cleaning': 500 } },
    { id: 'dc_safari', name: 'Jalavia(safari)', category: 'Traditional', image: '', services: { 'washing': 400, 'dry-cleaning': 800, 'ironing': 400 } },
    { id: 'dc_suit', name: 'Complete suit', category: 'Dresses & Suits', image: '', services: { 'washing': 800, 'dry-cleaning': 1800, 'ironing': 800 } },
    { id: 'dc_cap', name: 'Cap', category: 'Accessories', image: '', services: { 'washing': 200, 'dry-cleaning': 400 } },
    { id: 'dc_boxer', name: 'Boxer', category: 'Accessories', image: '', services: { 'washing': 200, 'dry-cleaning': 300 } },
    { id: 'dc_singlet', name: 'Singlet', category: 'Tops', image: '', services: { 'washing': 200, 'dry-cleaning': 300 } },
    { id: 'dc_socks', name: 'Socks', category: 'Accessories', image: '', services: { 'washing': 100, 'dry-cleaning': 200 } },
    { id: 'dc_scarf', name: 'Scarf', category: 'Accessories', image: '', services: { 'washing': 100, 'dry-cleaning': 200 } },
    { id: 'dc_schoolbag', name: 'School bag', category: 'Shoes & Bags', image: '', services: { 'washing': 1500, 'dry-cleaning': 1500 } },
    { id: 'dc_travelbag', name: 'Travelling bags', category: 'Shoes & Bags', image: '', services: { 'washing': 3000, 'dry-cleaning': 3000 } },
    { id: 'dc_curtain', name: 'Curtains', category: 'Household', image: '', services: { 'washing': 1200, 'dry-cleaning': 1200 } },
    { id: 'dc_shoe', name: 'Pair of Shoe', category: 'Shoes & Bags', image: '', services: { 'washing': 1000, 'dry-cleaning': 1000 } },
    { id: 'dc_duvet', name: 'Duvet', category: 'Household', image: '', services: { 'washing': 2000, 'dry-cleaning': 2000 } },
    { id: 'dc_whiteduvet', name: 'White duvet', category: 'Household', image: '', services: { 'washing': 2500, 'dry-cleaning': 2500 } },
    { id: 'dc_centerrug', name: 'Center rug', category: 'Household', image: '', services: { 'washing': 7000, 'dry-cleaning': 7000 } }
];

export default function UserPricing() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeModalItem, setActiveModalItem] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('lyceum_pricing_config');
        return saved ? JSON.parse(saved) : null;
    });

    const [itemQuantities, setItemQuantities] = useState(() => {
        const saved = localStorage.getItem('antigravity_pricing_quantities');
        return saved ? JSON.parse(saved) : {};
    });
    const [selectedServices, setSelectedServices] = useState(() => {
        const saved = localStorage.getItem('antigravity_pricing_services');
        return saved ? JSON.parse(saved) : {};
    });

    // ── Dynamic Config Fetch ──
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "global"), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setConfig(data);
                localStorage.setItem('lyceum_pricing_config', JSON.stringify(data));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Persistence ──
    useEffect(() => {
        localStorage.setItem('antigravity_pricing_quantities', JSON.stringify(itemQuantities));
    }, [itemQuantities]);

    useEffect(() => {
        localStorage.setItem('antigravity_pricing_services', JSON.stringify(selectedServices));
    }, [selectedServices]);

    const servicesMeta = config?.services || {};
    const itemsData = config?.items || [];
    const shopStatus = config?.shop || { isOpen: true, announcement: "" };

    // ── Handlers ──
    const handleOpenModal = (item) => {
        setActiveModalItem(item);
    };

    const handleCloseModal = () => {
        setActiveModalItem(null);
    };

    const toggleService = (itemId, serviceId) => {
        setSelectedServices(prev => {
            const current = prev[itemId] || [];
            const isSelected = current.includes(serviceId);
            const next = isSelected 
                ? current.filter(id => id !== serviceId)
                : [...current, serviceId];
            
            return { ...prev, [itemId]: next };
        });
    };

    const handleMasterItemIncrement = (item, delta, e) => {
        e.stopPropagation();
        
        setItemQuantities(prev => {
            const current = prev[item.id] || 0;
            const next = Math.max(0, current + delta);
            
            // Auto-select if going 0 -> 1
            if (current === 0 && next === 1) {
                // Default to wash-fold/washing or first available if it doesn't have it
                if (!selectedServices[item.id] || selectedServices[item.id].length === 0) {
                    const available = Object.keys(item.services);
                    const defaultSrv = available.find(s => s === 'wash-fold' || s === 'washing') || available[0];
                    setSelectedServices(sPrev => ({ ...sPrev, [item.id]: [defaultSrv] }));
                }
            }

            const updated = { ...prev };
            if (next === 0) {
                delete updated[item.id];
            } else {
                updated[item.id] = next;
            }
            return updated;
        });
    };

    // Generate formatted cart data
    const generateCartData = () => {
        let cartArray = [];
        Object.entries(itemQuantities).forEach(([itemId, qty]) => {
            const services = selectedServices[itemId] || [];
            if (qty > 0 && services.length > 0) {
                // Check merged map for the item
                const allMapped = new Map();
                DEFAULT_CATALOG.forEach(i => allMapped.set(i.id, i));
                if (Array.isArray(itemsData)) itemsData.forEach(i => allMapped.set(i.id, i));
                
                const item = allMapped.get(itemId);
                if (!item) return;
                
                // Group all services into one line item
                const combinedServiceName = services
                    .map(sid => servicesMeta[sid]?.name || sid)
                    .join(', ');
                
                const combinedPrice = services.reduce((total, sid) => {
                    return total + (item.services[sid]?.price || item.services[sid] || 0);
                }, 0);

                cartArray.push({
                    id: `${itemId}_combined`,
                    name: item.name,
                    service: combinedServiceName,
                    price: combinedPrice,
                    qty: qty,
                    image: item.image
                });
            }
        });
        return cartArray;
    };

    // Search & Category filter utilizing merged logic
    const filteredItems = useMemo(() => {
        const mergedMap = new Map();
        
        // Add defaults first
        DEFAULT_CATALOG.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
        
        // Let admin overrides win while preserving category
        if (Array.isArray(itemsData)) {
            itemsData.forEach(item => {
                const existing = mergedMap.get(item.name.toLowerCase());
                mergedMap.set(item.name.toLowerCase(), { ...item, category: item.category || existing?.category || 'Other' });
            });
        }

        const consolidated = Array.from(mergedMap.values());
        consolidated.sort((a,b) => a.name.localeCompare(b.name));

        return consolidated.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [itemsData, searchQuery, activeCategory]);

    const totalItemsCount = Object.values(itemQuantities).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans">

            {/* ── Top Header & Search ── */}
            <div className="bg-[#0F3024] pt-28 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden lg:rounded-none">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-white/5 opacity-50 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col mt-4 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-6">Price List</h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for T-shirts, dresses, suits..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 outline-none focus:bg-white focus:text-[#0F3024] focus:placeholder-gray-400 transition-all duration-300 shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Announcement Banner */}
            {shopStatus.announcement && (
                <div className="max-w-2xl mx-auto mt-6 px-4">
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-[24px] flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E85D04]/10 text-[#E85D04] rounded-full flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5" />
                        </div>
                        <p className="text-orange-900 text-xs font-bold leading-relaxed">{shopStatus.announcement}</p>
                    </div>
                </div>
            )}

            {/* Shop Closed Warning */}
            {(!shopStatus.isOpen && !loading) && (
                <div className="max-w-2xl mx-auto mt-6 px-4">
                    <div className="bg-red-50 border border-red-100 p-4 rounded-[24px] flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-red-900 text-xs font-black uppercase tracking-widest">Shop is Currently Closed</p>
                            <p className="text-red-700 text-[10px] font-bold">You can still browse prices, but order placement is temporarily disabled.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center items-center py-12 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading price list...</span>
                </div>
            )}

            {/* ── Category Pills ── */}
            {!loading && (
                <div className="mt-6 w-full">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex overflow-x-auto gap-2 pb-3 px-6 sm:px-4">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full font-extrabold text-[11px] sm:text-xs tracking-wide uppercase whitespace-nowrap shrink-0 transition-all duration-300 border ${activeCategory === cat ? 'bg-[#0F3024] border-[#0F3024] text-white shadow-[0_4px_15px_rgba(15,48,36,0.3)]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                            {/* Spacer to definitively ensure the right edge padding isn't eaten by the scrollbar */}
                            <div className="w-6 sm:w-2 shrink-0 border border-transparent"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Grid Layout ── */}
            {!loading && (
                <div className="px-4 mt-6 max-w-2xl mx-auto">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 font-medium bg-white rounded-[32px] border border-gray-100">
                            No items found in {activeCategory}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                            {filteredItems.map(item => {
                                const qty = itemQuantities[item.id] || 0;
                                return (
                                    <div 
                                        key={item.id} 
                                        onClick={() => handleOpenModal(item)}
                                        className={`relative bg-white rounded-[24px] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm border transition-all duration-300 cursor-pointer group ${qty > 0 ? 'border-[#E85D04]/30 shadow-orange-50/50 hover:border-[#E85D04]/60' : 'border-gray-100 hover:shadow-md hover:border-[#0F3024]/20'}`}
                                    >
                                        {qty > 0 && (
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#E85D04] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white z-10 animate-in zoom-in">
                                                {qty}
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 mb-2 sm:mb-3 ${qty > 0 ? 'bg-[#E85D04]/10 text-[#E85D04]' : 'bg-[#0F3024]/5 text-[#0F3024] group-hover:bg-[#0F3024]/10'}`}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-500 group-hover:scale-110"><ItemIcon name={item.name} /></div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[#0F3024] text-[12px] sm:text-[14px] leading-tight mb-1 sm:mb-1.5">{item.name}</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400"></span>
                                            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-gray-400 font-extrabold">{Object.keys(item.services || {}).length} Services</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Fullscreen/Overlay Selected Item Modal ── */}
            {activeModalItem && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0F3024]/60 backdrop-blur-sm sm:items-center p-0 sm:p-4">
                    <div className="absolute inset-0 z-0" onClick={handleCloseModal}></div>
                    <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col relative z-10 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        
                        {/* Modal Header */}
                        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0F3024]/5 flex items-center justify-center text-[#0F3024]">
                                    {activeModalItem.image ? (
                                        <img src={activeModalItem.image} alt={activeModalItem.name} className="w-7 h-7 object-contain" />
                                    ) : (
                                        <div className="w-6 h-6"><ItemIcon name={activeModalItem.name} /></div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#0F3024] tracking-tight">{activeModalItem.name}</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeModalItem.category || 'Other'}</p>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-[#0F3024] transition-colors shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="p-6 overflow-y-auto">
                            
                            {/* Master Quantity Controls */}
                            <div className="flex items-center justify-between bg-orange-50 border border-orange-100/50 p-4 rounded-[24px] mb-8">
                                <div>
                                    <span className="block font-black text-orange-900 text-xs uppercase tracking-wide">Adjust Quantity</span>
                                    <span className="block text-orange-800/60 text-[10px] font-bold mt-0.5">Services sync to all</span>
                                </div>
                                <div className="flex items-center bg-white rounded-full border border-orange-100 shadow-sm p-1">
                                    <button
                                        onClick={(e) => handleMasterItemIncrement(activeModalItem, -1, e)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${itemQuantities[activeModalItem.id] > 0 ? 'text-[#E85D04] hover:bg-orange-50 active:scale-95' : 'text-gray-300'}`}
                                        disabled={!itemQuantities[activeModalItem.id]}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                    </button>
                                    <div className="w-8 text-center font-black text-lg text-[#0F3024]">
                                        {itemQuantities[activeModalItem.id] || 0}
                                    </div>
                                    <button
                                        onClick={(e) => handleMasterItemIncrement(activeModalItem, 1, e)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full text-[#E85D04] hover:bg-orange-50 transition-all active:scale-95"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Service Selection List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modify Options</h3>
                                {Object.entries(activeModalItem.services || {}).map(([serviceId, serviceData]) => {
                                    const meta = servicesMeta[serviceId] || { 
                                        name: serviceId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
                                        desc: '' 
                                    };
                                    const isSelected = selectedServices[activeModalItem.id]?.includes(serviceId);

                                    return (
                                        <div 
                                            key={serviceId} 
                                            onClick={() => toggleService(activeModalItem.id, serviceId)}
                                            className={`group flex items-center justify-between p-4 rounded-[20px] border transition-all cursor-pointer ${isSelected ? 'bg-[#E85D04] border-[#E85D04] shadow-lg shadow-[#E85D04]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                    {(serviceId === 'wash-fold' || serviceId === 'washing') && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                                                    {serviceId === 'ironing' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                                    {(serviceId === 'dry-clean' || serviceId === 'dry-cleaning') && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-[14px] leading-tight ${isSelected ? 'text-white' : 'text-[#0F3024]'}`}>{meta?.name || serviceId}</h4>
                                                    <p className={`font-black text-sm mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#E85D04]'}`}>₦{(serviceData?.price || serviceData || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {isSelected ? (
                                                    <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center transition-colors group-hover:bg-red-500">
                                                        <svg className="w-4 h-4 group-hover:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                        <svg className="w-4 h-4 hidden group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-[#E85D04]/30 transition-colors"></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button onClick={handleCloseModal} className="flex-1 py-4 flex items-center justify-center gap-2 rounded-[20px] bg-[#0F3024] text-white font-bold text-sm shadow-xl shadow-[#0F3024]/20 hover:bg-[#0a2018] active:scale-[0.98] transition-all">
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Floating "View Cart" Button ── */}
            <div className={`fixed bottom-[88px] left-0 right-0 px-4 z-40 transition-all duration-500 ease-in-out lg:ml-64 ${totalItemsCount > 0 && shopStatus.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-2xl mx-auto">
                    <Link to="/cart" state={{ cartItems: generateCartData() }} className="bg-[#0F3024] shadow-2xl text-white rounded-2xl p-4 flex items-center justify-between hover:bg-[#0a2018] hover:scale-[1.02] transition-all">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#E85D04] text-white font-black w-10 h-10 rounded-[14px] flex items-center justify-center shadow-inner">
                                {totalItemsCount}
                            </div>
                            <span className="font-bold text-[15px]">Items added</span>
                        </div>
                        <div className="flex items-center gap-2 font-black tracking-wide uppercase text-sm">
                            Review Cart
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}