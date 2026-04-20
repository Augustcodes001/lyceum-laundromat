import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const mockHistoryContent = [
    {
        id: "AG-0982",
        placedAt: "2026-03-12T10:00:00Z",
        status: "Delivered",
        total: 12500,
        address: "12 Airport Road, GRA, Benin City",
        cartItems: [{ service: 'Wash & Fold' }]
    },
    {
        id: "AG-0145",
        placedAt: "2026-02-28T14:30:00Z",
        status: "Delivered",
        total: 24000,
        address: "42 Siluko Road, Benin City",
        cartItems: [{ service: 'Dry Cleaning' }, { service: 'Iron & Press' }]
    }
];

const trackingStages = ['Order Placed', 'Picking Up', 'Washing', 'Out for Delivery', 'Delivered'];

export default function Orders({ isLoggedIn, onOpenAuth }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [focusedOrderId, setFocusedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [copySuccessId, setCopySuccessId] = useState(null);

    useEffect(() => {
        // Deep Link Auth Check
        const searchParams = new URLSearchParams(location.search);
        const idParam = searchParams.get('id');
        
        if (idParam) {
            setFocusedOrderId(idParam);
            if (!isLoggedIn && onOpenAuth) {
                onOpenAuth();
            }
        }
    }, [location.search, isLoggedIn, onOpenAuth]);

    useEffect(() => {
        if (!auth.currentUser) {
            setOrders([]);
            return;
        }

        const q = query(
            collection(db, "orders"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = [];
            snapshot.forEach((doc) => {
                fetchedOrders.push({ id: doc.id, ...doc.data() });
            });
            setOrders(fetchedOrders);
        }, (error) => {
            console.error("Order snapshot error:", error);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const activeOrders = orders.filter(o => o.status !== "Delivered");
    const historyOrders = orders.filter(o => o.status === "Delivered");

    const getStageIndex = (status) => Math.max(0, trackingStages.indexOf(status));

    const handleCopyLink = (e, orderId) => {
        e.stopPropagation();
        const shareLink = `${window.location.origin}/orders?id=${orderId}`;
        navigator.clipboard.writeText(shareLink);
        setCopySuccessId(orderId);
        setTimeout(() => setCopySuccessId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-28 font-sans">
            <div className="bg-[#0F3024] pt-12 pb-6 px-6 shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-white tracking-wide border-l border-white/20 pl-4 py-1">Your Tracking</h1>
                </div>
                <button onClick={() => navigate('/user-pricing')} className="absolute right-6 top-11 bg-[#E85D04] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-black/20 hover:bg-[#d15303] transition-all active:scale-95">
                    + New Order
                </button>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-6">

                {activeOrders.length === 0 && historyOrders.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center mt-12">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h4 className="text-[#0F3024] font-bold text-lg mb-2">No Orders Yet</h4>
                        <p className="text-gray-500 text-[14px] max-w-sm mb-8">You haven't placed any laundry orders.</p>
                        <button onClick={() => navigate('/user-pricing')} className="bg-[#E85D04] text-white px-8 py-4 rounded-2xl font-bold shadow-[0_4px_15px_rgba(232,93,4,0.3)] w-full">Start an Order</button>
                    </div>
                ) : null}

                {/* ── ACTIVE ORDERS ── */}
                {activeOrders.length > 0 && (
                    <div className="mb-10 space-y-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Active Orders</h2>
                        {activeOrders.map((order, idx) => {
                            const currentStageIdx = getStageIndex(order.status);
                            const isFocused = order.id === focusedOrderId;
                            
                            return (
                                <div key={idx} onClick={() => setSelectedOrder(order)} className={`bg-white rounded-[32px] p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${isFocused ? 'border-[#E85D04] ring-2 ring-[#E85D04]/20' : 'border-gray-100 hover:border-emerald-200'}`}>
                                    <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4">
                                        <div className="flex-1">
                                            <span className="text-xs font-bold text-[#E85D04] uppercase tracking-wide">Order {order.id}</span>
                                            <h3 className="font-extrabold text-[#0F3024] text-lg mt-1">{order.status}</h3>
                                        </div>
                                        <button 
                                            onClick={(e) => handleCopyLink(e, order.id)}
                                            className={`p-2 rounded-xl transition-all ${copySuccessId === order.id ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                            title="Copy Tracking Link"
                                        >
                                            {copySuccessId === order.id ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Detailed Illustration Progress */}
                                    <div className="relative mb-10 mt-2 px-2">
                                        {/* Connecting Line background */}
                                        <div className="absolute top-6 left-8 right-8 h-1 bg-gray-100 -z-10 rounded-full"></div>
                                        {/* Filled Line */}
                                        <div className="absolute top-6 left-8 h-1 bg-[#E85D04] -z-10 rounded-full transition-all duration-700" style={{ width: `calc(${currentStageIdx * 33.33}% - 10px)` }}></div>
                                        
                                        <div className="flex justify-between relative z-10">
                                            {/* Stage 1: Order Placed */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${currentStageIdx === 0 ? 'bg-[#E85D04] text-white shadow-[0_0_20px_rgba(232,93,4,0.4)] ring-4 ring-[#E85D04]/20 scale-110 animate-pulse' : currentStageIdx > 0 ? 'bg-white text-[#E85D04] border-2 border-[#E85D04]/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                </div>
                                                <span className={`text-[10px] font-bold ${currentStageIdx >= 0 ? 'text-[#0F3024]' : 'text-gray-400'}`}>Placed</span>
                                            </div>

                                            {/* Stage 2: Picking Up */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${currentStageIdx === 1 ? 'bg-[#E85D04] text-white shadow-[0_0_20px_rgba(232,93,4,0.4)] ring-4 ring-[#E85D04]/20 scale-110 animate-pulse' : currentStageIdx > 1 ? 'bg-white text-[#E85D04] border-2 border-[#E85D04]/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                                </div>
                                                <span className={`text-[10px] font-bold ${currentStageIdx >= 1 ? 'text-[#0F3024]' : 'text-gray-400'}`}>Pickup</span>
                                            </div>

                                            {/* Stage 3: Washing */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${currentStageIdx === 2 ? 'bg-[#E85D04] text-white shadow-[0_0_20px_rgba(232,93,4,0.4)] ring-4 ring-[#E85D04]/20 scale-110 animate-pulse' : currentStageIdx > 2 ? 'bg-white text-[#E85D04] border-2 border-[#E85D04]/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                                                    <svg className={`w-6 h-6 ${currentStageIdx === 2 ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                </div>
                                                <span className={`text-[10px] font-bold ${currentStageIdx >= 2 ? 'text-[#0F3024]' : 'text-gray-400'}`}>Washing</span>
                                            </div>

                                            {/* Stage 4: Out for Delivery */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${currentStageIdx === 3 ? 'bg-[#E85D04] text-white shadow-[0_0_20px_rgba(232,93,4,0.4)] ring-4 ring-[#E85D04]/20 scale-110 animate-pulse' : currentStageIdx > 3 ? 'bg-white text-[#E85D04] border-2 border-[#E85D04]/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                </div>
                                                <span className={`text-[10px] font-bold ${currentStageIdx >= 3 ? 'text-[#0F3024]' : 'text-gray-400'}`}>Delivery</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                                            <svg className="w-5 h-5 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Exp. Delivery Date</p>
                                            <p className="text-[#0F3024] font-bold text-sm">{order.delivery?.date} • {order.delivery?.time}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── HISTORY ORDERS ── */}
                {historyOrders.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">History</h2>
                        <div className="space-y-3">
                            {historyOrders.map((order, idx) => (
                                <div key={idx} onClick={() => setSelectedOrder(order)} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F3024] text-sm">Order {order.id}</h4>
                                            <p className="text-xs text-gray-400 font-medium mt-0.5">{new Date(order.placedAt).toLocaleDateString()} • {order.items?.map(c => c.service).join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="font-extrabold text-[#0F3024]">₦{order.total.toLocaleString()}</span>
                                        <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── ORDER DETAILS MODAL ── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-center lg:items-center bg-black/60 backdrop-blur-sm p-0 lg:p-4 animate-in fade-in duration-300">
                    <div className="w-full lg:max-w-md bg-white rounded-t-[32px] lg:rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10 shrink-0">
                            <div>
                                <h3 className="font-extrabold text-[#0F3024] text-xl">Order {selectedOrder.id}</h3>
                                <p className="text-sm text-gray-500">{new Date(selectedOrder.placedAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto w-full bg-gray-50">
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                            {item.image && (
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 p-2">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h5 className="font-bold text-[#0F3024] text-sm leading-tight">{item.name || item.service}</h5>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.qty || 1}x • {item.service}</p>
                                            </div>
                                            {item.price && (
                                                <div className="font-bold text-[#0F3024] text-sm">₦{(item.price * (item.qty || 1)).toLocaleString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Logistics</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Pickup</span>
                                        <span className="font-bold text-[#0F3024] text-right">{selectedOrder.pickup?.date || 'N/A'} • {selectedOrder.pickup?.time || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Delivery</span>
                                        <span className="font-bold text-[#0F3024] text-right">{selectedOrder.delivery?.date || 'N/A'} • {selectedOrder.delivery?.time || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                        <span className="text-gray-500 font-medium">Address</span>
                                        <span className="font-bold text-[#0F3024] text-right truncate max-w-[150px]">{selectedOrder.address || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Share Tracking</h4>
                                <button 
                                    onClick={(e) => handleCopyLink(e, selectedOrder.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${copySuccessId === selectedOrder.id ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-100 text-[#0F3024] hover:border-emerald-100 hover:bg-emerald-50/30'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${copySuccessId === selectedOrder.id ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {copySuccessId === selectedOrder.id ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">{copySuccessId === selectedOrder.id ? 'Link Copied!' : 'Copy Tracking Link'}</p>
                                            <p className="text-xs text-gray-500 opacity-80">Share this with anyone to track pickup</p>
                                        </div>
                                    </div>
                                    {copySuccessId !== selectedOrder.id && (
                                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 012 2h8a2 2 0 012-2v-2" /></svg>
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-between items-center bg-[#0F3024] text-white p-5 rounded-2xl shadow-xl">
                                <span className="font-medium text-white/80">Total Paid</span>
                                <span className="font-extrabold text-xl">₦{selectedOrder.total?.toLocaleString()}</span>
                            </div>
                            <div className="pb-10 lg:pb-0"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}