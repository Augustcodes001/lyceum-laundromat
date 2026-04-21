import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, AlertCircle, Info } from 'lucide-react';

export default function UserPricing() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItemId, setExpandedItemId] = useState(null);
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
    const toggleExpand = (item) => {
        setExpandedItemId(prev => prev === item.id ? null : item.id);
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
            
            // Auto-expand and default select if going 0 -> 1
            if (current === 0 && next === 1) {
                setExpandedItemId(item.id);
                // Default to wash-fold or first available if it doesn't have it
                if (!selectedServices[item.id] || selectedServices[item.id].length === 0) {
                    const available = Object.keys(item.services);
                    const defaultSrv = available.find(s => s === 'wash-fold') || available[0];
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
                const item = itemsData.find(i => i.id === itemId);
                
                // Group all services into one line item
                const combinedServiceName = services
                    .map(sid => servicesMeta[sid].name)
                    .join(', ');
                
                const combinedPrice = services.reduce((total, sid) => {
                    // Update: pricing is now a number directly in the map
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

    // Search filter
    const filteredItems = useMemo(() => {
        return itemsData.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const totalItemsCount = Object.values(itemQuantities).reduce((a, b) => a + b, 0);
    const totalPrice = generateCartData().reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans">

            {/* ── Top Header & Search ── */}
            <div className="bg-[#0F3024] pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden lg:rounded-none">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-white/5 opacity-50"></div>
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

            {/* ── Unified Items List ── */}
            <div className="px-4 mt-6 max-w-2xl mx-auto space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        No items found matching "{searchQuery}"
                    </div>
                ) : (
                    filteredItems.map(item => {
                        const isExpanded = expandedItemId === item.id;
                        const itemTotalQty = itemQuantities[item.id] || 0;

                        return (
                            <div key={item.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">

                                {/* ── MASTER ITEM HEADER ── */}
                                <div
                                    onClick={() => toggleExpand(item)}
                                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#0F3024]/5 border border-gray-100 flex items-center justify-center shrink-0 p-2">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#0F3024] text-[16px]">{item.name}</h3>
                                            <p className="text-gray-400 text-xs mt-0.5 font-medium">
                                                {Object.keys(item.services).length} services available
                                            </p>
                                        </div>
                                    </div>

                                    {/* Master Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className={`flex items-center rounded-full border transition-all duration-300 ${itemQuantities[item.id] > 0 ? 'border-[#E85D04] bg-orange-50/50' : 'border-gray-200 bg-gray-50'}`}
                                        >
                                            <button
                                                onClick={(e) => handleMasterItemIncrement(item, -1, e)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${itemQuantities[item.id] > 0 ? 'text-[#E85D04] hover:bg-[#E85D04]/10' : 'text-gray-400'}`}
                                                disabled={!itemQuantities[item.id]}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                            </button>

                                            {/* Slide open width transition for the master number */}
                                            <div className={`font-bold text-[#0F3024] flex items-center justify-center overflow-hidden transition-all duration-300 ${itemQuantities[item.id] > 0 ? 'w-6 opacity-100' : 'w-0 opacity-0'}`}>
                                                {itemQuantities[item.id]}
                                            </div>

                                            <button
                                                onClick={(e) => handleMasterItemIncrement(item, 1, e)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full text-[#0F3024] hover:bg-gray-200 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>

                                        {/* Chevron Indicator */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-gray-100 rotate-180' : 'bg-gray-50'}`}>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* ── EXPANDED SERVICES DRAWER ── */}
                                <div className={`transition-all duration-300 ease-in-out ${isExpanded || itemQuantities[item.id] > 0 ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50/30 space-y-3">
                                        
                                        <div className="flex items-center justify-between px-2 py-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Services</p>
                                            {itemQuantities[item.id] > 0 && (
                                                <p className="text-[10px] font-bold text-[#E85D04]">Applies to all {itemQuantities[item.id]} items</p>
                                            )}
                                        </div>

                                        {Object.entries(item.services).map(([serviceId, serviceData]) => {
                                            const meta = servicesMeta[serviceId];
                                            const isSelected = selectedServices[item.id]?.includes(serviceId);

                                            return (
                                                <div 
                                                    key={serviceId} 
                                                    onClick={() => toggleService(item.id, serviceId)}
                                                    className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? 'bg-[#E85D04] border-[#E85D04] shadow-lg shadow-[#E85D04]/20 scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    {/* Service Info */}
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {/* Render icon based on mapping */}
                                                            {serviceId === 'wash-fold' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                                                            {serviceId === 'ironing' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                                            {serviceId === 'dry-clean' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                                                        </div>
                                                        <div>
                                                            <h4 className={`font-bold text-[14px] leading-tight transition-colors ${isSelected ? 'text-white' : 'text-[#0F3024]'}`}>{meta.name}</h4>
                                                            <p className={`text-[11px] font-medium mt-0.5 leading-snug transition-colors ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{meta.desc}</p>
                                                            <p className={`font-bold text-sm mt-1 transition-colors ${isSelected ? 'text-white' : 'text-[#E85D04]'}`}>₦{(serviceData.price || serviceData).toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    {/* Selection State / Checkmark / X */}
                                                    <div className="flex items-center gap-3">
                                                        {isSelected ? (
                                                            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-red-500 transition-colors" title="Unselect">
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
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── Floating "View Cart" Button ── */}
            <div className={`fixed bottom-[88px] left-0 right-0 px-4 z-40 transition-all duration-500 ease-in-out lg:ml-64 ${totalItemsCount > 0 && shopStatus.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-2xl mx-auto">
                    <Link to="/cart" state={{ cartItems: generateCartData() }} className="bg-[#0F3024] shadow-xl text-white rounded-2xl p-4 flex items-center justify-between hover:bg-[#0a2018] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#E85D04] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                                {totalItemsCount}
                            </div>
                            <span className="font-medium">Items selected</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                            Review Cart
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}