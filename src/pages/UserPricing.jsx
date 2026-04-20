import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function UserPricing() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [quantities, setQuantities] = useState({}); // Stores quantities as { 'itemId_serviceId': number }

    // ── Service Metadata & Descriptions ──
    const servicesMeta = {
        'wash-fold': { name: 'Wash & Fold', desc: 'Washed, dried, and neatly folded', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        'ironing': { name: 'Ironing Only', desc: 'Professionally pressed and hung', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        'dry-clean': { name: 'Dry Clean', desc: 'Premium stain removal & care', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
    };

    // ── Full Unified Items Data (From ServicesPricing) ──
    const itemsData = [
        {
            id: 'tshirt', name: 'T-Shirt / Polo', image: 'https://img.icons8.com/color/96/t-shirt--v1.png',
            services: { 'wash-fold': { price: 1500 }, 'ironing': { price: 800 }, 'dry-clean': { price: 2500 } }
        },
        {
            id: 'shirt', name: 'Dress Shirt', image: 'https://img.icons8.com/color/96/shirt.png',
            services: { 'wash-fold': { price: 1500 }, 'ironing': { price: 1000 }, 'dry-clean': { price: 2500 } }
        },
        {
            id: 'trouser', name: 'Trousers / Jeans', image: 'https://img.icons8.com/color/96/trousers.png',
            services: { 'wash-fold': { price: 2000 }, 'ironing': { price: 1200 }, 'dry-clean': { price: 3500 } }
        },
        {
            id: 'shorts', name: 'Shorts', image: 'https://img.icons8.com/color/96/shorts.png',
            services: { 'wash-fold': { price: 1000 }, 'ironing': { price: 700 }, 'dry-clean': { price: 2000 } }
        },
        {
            id: 'dress', name: 'Dress', image: 'https://img.icons8.com/color/96/dress-front-view.png',
            services: { 'wash-fold': { price: 2500 }, 'ironing': { price: 1500 }, 'dry-clean': { price: 5000 } }
        },
        {
            id: 'suit', name: '2-Piece Suit', image: 'https://img.icons8.com/color/96/business-suit.png',
            services: { 'dry-clean': { price: 8000 }, 'ironing': { price: 3000 } } // Suits usually don't have standard wash&fold
        },
        {
            id: 'jacket', name: 'Jacket / Coat', image: 'https://img.icons8.com/color/96/jacket.png',
            services: { 'dry-clean': { price: 5000 }, 'ironing': { price: 2500 } }
        },
        {
            id: 'native', name: 'Native Wear', image: 'https://img.icons8.com/color/96/clothes.png',
            services: { 'wash-fold': { price: 3000 }, 'ironing': { price: 2000 }, 'dry-clean': { price: 4000 } }
        },
        {
            id: 'bedsheet', name: 'Bedsheet / Duvet', image: 'https://img.icons8.com/color/96/bed.png',
            services: { 'wash-fold': { price: 3000 }, 'ironing': { price: 2000 }, 'dry-clean': { price: 8000 } }
        }
    ];

    // ── Handlers ──
    const toggleExpand = (itemId) => {
        setExpandedItemId(prev => prev === itemId ? null : itemId);
    };

    // Updates quantity directly inside the expanded service drawer
    const updateServiceQuantity = (itemId, serviceId, delta) => {
        const key = `${itemId}_${serviceId}`;
        setQuantities(prev => {
            const current = prev[key] || 0;
            const next = Math.max(0, current + delta);
            const updated = { ...prev };
            if (next === 0) delete updated[key];
            else updated[key] = next;
            return updated;
        });
    };

    // Master increment: Updates the *first available service* and auto-expands the drawer
    const handleMasterItemIncrement = (item, delta, e) => {
        e.stopPropagation(); // Prevents the row from expanding/collapsing twice

        setQuantities(prev => {
            const updated = { ...prev };

            if (delta === 1) {
                // Find default service (or the one they already have the most of)
                let targetService = Object.keys(item.services)[0];
                let maxQty = 0;

                Object.keys(item.services).forEach(srv => {
                    const q = prev[`${item.id}_${srv}`] || 0;
                    if (q > maxQty) { maxQty = q; targetService = srv; }
                });

                const key = `${item.id}_${targetService}`;
                updated[key] = (updated[key] || 0) + 1;

                // Auto Expand the drawer so they see where it was added
                setExpandedItemId(item.id);

            } else if (delta === -1) {
                // Subtract from the service they have the most of
                let targetService = null;
                let maxQty = 0;

                Object.keys(item.services).forEach(srv => {
                    const q = prev[`${item.id}_${srv}`] || 0;
                    if (q > maxQty) { maxQty = q; targetService = srv; }
                });

                if (targetService) {
                    const key = `${item.id}_${targetService}`;
                    updated[key] = updated[key] - 1;
                    if (updated[key] <= 0) delete updated[key];
                }
            }
            return updated;
        });
    };

    // Calculate how many total services are selected for a specific item top-level
    const getItemTotalQty = (itemId) => {
        return Object.entries(quantities).reduce((sum, [key, qty]) => {
            if (key.startsWith(`${itemId}_`)) return sum + qty;
            return sum;
        }, 0);
    };

    // Generate formatted cart data
    const generateCartData = () => {
        let cartArray = [];
        Object.entries(quantities).forEach(([key, qty]) => {
            if (qty > 0) {
                const [itemId, serviceId] = key.split('_');
                const item = itemsData.find(i => i.id === itemId);
                cartArray.push({
                    id: key,
                    name: item.name,
                    service: servicesMeta[serviceId].name,
                    price: item.services[serviceId].price,
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

    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

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

            {/* ── Unified Items List ── */}
            <div className="px-4 mt-6 max-w-2xl mx-auto space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium">
                        No items found matching "{searchQuery}"
                    </div>
                ) : (
                    filteredItems.map(item => {
                        const isExpanded = expandedItemId === item.id;
                        const itemTotalQty = getItemTotalQty(item.id);

                        return (
                            <div key={item.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">

                                {/* ── MASTER ITEM HEADER ── */}
                                <div
                                    onClick={() => toggleExpand(item.id)}
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
                                            className={`flex items-center rounded-full border transition-all duration-300 ${itemTotalQty > 0 ? 'border-[#E85D04] bg-orange-50/50' : 'border-gray-200 bg-gray-50'}`}
                                        >
                                            <button
                                                onClick={(e) => handleMasterItemIncrement(item, -1, e)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${itemTotalQty > 0 ? 'text-[#E85D04] hover:bg-[#E85D04]/10' : 'text-gray-400'}`}
                                                disabled={itemTotalQty === 0}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                            </button>

                                            {/* Slide open width transition for the master number */}
                                            <div className={`font-bold text-[#0F3024] flex items-center justify-center overflow-hidden transition-all duration-300 ${itemTotalQty > 0 ? 'w-6 opacity-100' : 'w-0 opacity-0'}`}>
                                                {itemTotalQty}
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
                                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50/30 space-y-3">

                                        {Object.entries(item.services).map(([serviceId, serviceData]) => {
                                            const qtyKey = `${item.id}_${serviceId}`;
                                            const qty = quantities[qtyKey] || 0;
                                            const meta = servicesMeta[serviceId];

                                            return (
                                                <div key={serviceId} className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${qty > 0 ? 'bg-white border-[#E85D04]/30 shadow-sm' : 'bg-white border-gray-100'}`}>

                                                    {/* Service Info */}
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${qty > 0 ? 'bg-[#E85D04]/10 text-[#E85D04]' : 'bg-gray-100 text-gray-400'}`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{meta.icon}</svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#0F3024] text-[14px] leading-tight">{meta.name}</h4>
                                                            <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-snug">{meta.desc}</p>
                                                            <p className="text-[#E85D04] font-bold text-sm mt-1">₦{serviceData.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    {/* Individual Service Quantity Adjuster */}
                                                    <div className="flex items-center shrink-0">
                                                        {qty === 0 ? (
                                                            <button
                                                                onClick={() => updateServiceQuantity(item.id, serviceId, 1)}
                                                                className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-[#0F3024] hover:bg-[#E85D04] hover:text-white transition-colors border border-gray-200"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center bg-[#0F3024] rounded-full p-1 shadow-md">
                                                                <button onClick={() => updateServiceQuantity(item.id, serviceId, -1)} className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                                                </button>
                                                                <span className="w-6 text-center text-white font-bold text-sm">{qty}</span>
                                                                <button onClick={() => updateServiceQuantity(item.id, serviceId, 1)} className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                                </button>
                                                            </div>
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
            <div className={`fixed bottom-[88px] left-0 right-0 px-4 z-40 transition-all duration-500 ease-in-out lg:ml-64 ${totalItems > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-2xl mx-auto">
                    <Link to="/cart" state={{ cartItems: generateCartData() }} className="bg-[#0F3024] shadow-xl text-white rounded-2xl p-4 flex items-center justify-between hover:bg-[#0a2018] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#E85D04] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                                {totalItems}
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