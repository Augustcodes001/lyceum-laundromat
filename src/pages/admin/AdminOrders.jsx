import { useState, useEffect, useMemo } from 'react';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    getDoc, 
    updateDoc, 
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
    ShoppingBag, 
    Search, 
    Filter, 
    MoreVertical, 
    CheckCircle2, 
    ChevronDown, 
    User, 
    Calendar, 
    Clock, 
    ArrowRight,
    Loader2,
    X,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    ChevronRight,
    Package
} from 'lucide-react';

const STATUS_OPTIONS = [
    { label: 'Placed', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { label: 'Pickup', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: 'Washing/Ironing', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { label: 'Delivery', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [userCache, setUserCache] = useState({});
    const [batchStatus, setBatchStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    
    // ── Search & Filter State ──
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Completed', or specific status
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // The order object for side panel

    // ── Real-Time Data Flow ──
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(fetchedOrders);
            setLoading(false);
            
            // Sync user names for missing IDs
            fetchMissingUserNames(fetchedOrders);
        });

        return () => unsubscribe();
    }, []);

    const fetchMissingUserNames = async (currentOrders) => {
        const uids = [...new Set(currentOrders.map(o => o.userId))];
        const newCache = { ...userCache };
        let updated = false;

        for (const uid of uids) {
            if (!newCache[uid] && uid) {
                try {
                    const userDoc = await getDoc(doc(db, "users", uid));
                    if (userDoc.exists()) {
                        newCache[uid] = userDoc.data().name || "Unknown Customer";
                        updated = true;
                    } else {
                        newCache[uid] = "Guest User";
                        updated = true;
                    }
                } catch (e) {
                    console.error("Error fetching user name:", e);
                }
            }
        }

        if (updated) setUserCache(newCache);
    };

    // ── Filtered Orders Logic ──
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const userName = (userCache[order.userId] || order.customerName || "").toLowerCase();
            const trackingId = (order.trackingId || order.id || "").toLowerCase();
            const phone = (order.customerPhone || "").toLowerCase();
            const matchesSearch = 
                userName.includes(searchTerm.toLowerCase()) || 
                trackingId.includes(searchTerm.toLowerCase()) ||
                phone.includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (statusFilter === 'All') return true;
            if (statusFilter === 'Active') return order.status !== 'Completed';
            if (statusFilter === 'Completed') return order.status === 'Completed';
            return order.status === statusFilter;
        });
    }, [orders, searchTerm, statusFilter, userCache]);

    // ── Selection Logic ──
    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const toggleSelectOrder = (id) => {
        setSelectedOrders(prev => 
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    // ── Update Logic ──
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { 
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            // If panel is open for this order, update local state too
            if (selectedOrderDetails?.id === orderId) {
                setSelectedOrderDetails(prev => ({ ...prev, status: newStatus }));
            }
        } catch (e) {
            console.error("Single update error:", e);
            alert("Failed to update status.");
        }
    };

    const handleBatchUpdate = async () => {
        if (!batchStatus || selectedOrders.length === 0) return;
        setIsUpdating(true);

        try {
            const batch = writeBatch(db);
            selectedOrders.forEach(id => {
                const ref = doc(db, "orders", id);
                batch.update(ref, { 
                    status: batchStatus,
                    updatedAt: serverTimestamp()
                });
            });
            await batch.commit();
            setSelectedOrders([]);
            setBatchStatus('');
        } catch (e) {
            console.error("Batch update error:", e);
            alert("Batch update failed.");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        return STATUS_OPTIONS.find(s => s.label === status)?.color || 'bg-gray-100 text-gray-500';
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#0F3024] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Command Center...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            
            {/* ── Batch Actions Bar (Slide In) ── */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${selectedOrders.length > 0 ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
                <div className="bg-[#0F3024] text-white px-6 py-4 rounded-[32px] shadow-2xl border border-white/10 flex items-center gap-6 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#E85D04] rounded-full flex items-center justify-center font-black text-sm">
                            {selectedOrders.length}
                        </div>
                        <span className="font-bold text-sm uppercase tracking-tight">Selected</span>
                    </div>

                    <div className="h-6 w-px bg-white/20" />

                    <div className="flex items-center gap-3">
                        <select 
                            value={batchStatus}
                            onChange={(e) => setBatchStatus(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
                        >
                            <option value="" className="text-gray-900">Choose Status...</option>
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.label} value={opt.label} className="text-gray-900">{opt.label}</option>
                            ))}
                        </select>

                        <button 
                            onClick={handleBatchUpdate}
                            disabled={!batchStatus || isUpdating}
                            className="bg-[#E85D04] hover:bg-[#cc5203] disabled:opacity-50 text-white px-6 py-2 rounded-xl font-black text-sm uppercase tracking-tighter transition-all flex items-center gap-2"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Update Batch
                        </button>
                    </div>

                    <button 
                        onClick={() => setSelectedOrders([])}
                        className="text-white/40 hover:text-white transition-colors p-2"
                    >
                        <ChevronDown className="w-5 h-5 rotate-180" />
                    </button>
                </div>
            </div>

            {/* ── Order Detail Side Panel (Slide Over) ── */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-[1000] p-0 transform transition-transform duration-500 ease-in-out ${selectedOrderDetails ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedOrderDetails && (
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="p-8 bg-[#0F3024] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                            <button onClick={() => setSelectedOrderDetails(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Order Details</p>
                                <h2 className="text-3xl font-black tracking-tight">#{selectedOrderDetails.trackingId || selectedOrderDetails.id.slice(-6)}</h2>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-4 ${getStatusColor(selectedOrderDetails.status)}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    {selectedOrderDetails.status}
                                </div>
                            </div>
                        </div>

                        {/* Panel Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                            {/* Customer Section */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#E85D04]" /> Customer Information
                                </h3>
                                <div className="bg-gray-50 rounded-[32px] p-6 space-y-4 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                                            <span className="text-[#0F3024] font-black text-lg">{(userCache[selectedOrderDetails.userId] || selectedOrderDetails.customerName || "G")[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-[#0F3024]">{userCache[selectedOrderDetails.userId] || selectedOrderDetails.customerName || "Guest User"}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID: {selectedOrderDetails.userId?.slice(-6) || 'WALK-IN'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200/50">
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <Phone className="w-4 h-4 text-emerald-500" /> {selectedOrderDetails.customerPhone || "Linked to Account"}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <Mail className="w-4 h-4 text-emerald-500" /> {selectedOrderDetails.customerEmail || "N/A"}
                                        </div>
                                        <div className="flex items-start gap-3 text-sm font-medium text-gray-600">
                                            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                                            <span>{selectedOrderDetails.address || "Walk-in Drop-off"}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Order Items */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#E85D04]" /> Items & Services
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrderDetails.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 text-[#0F3024] rounded-xl flex items-center justify-center font-black text-xs">
                                                    {item.qty}x
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#0F3024] text-sm">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{item.service}</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-[#0F3024]">₦{(item.price * item.qty).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="p-6 bg-[#0F3024] text-white rounded-3xl flex justify-between items-center shadow-xl shadow-emerald-900/40">
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Total Value</p>
                                            <h4 className="text-2xl font-black">₦{selectedOrderDetails.total?.toLocaleString()}</h4>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Payment</p>
                                            <p className="font-black text-sm">{selectedOrderDetails.paymentMethod || 'Unspecified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Management Actions */}
                            <section className="space-y-4 pt-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lifecycle Management</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button 
                                            key={opt.label}
                                            onClick={() => handleStatusUpdate(selectedOrderDetails.id, opt.label)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedOrderDetails.status === opt.label ? 'bg-orange-50 border-[#E85D04] ring-2 ring-[#E85D04]/10 scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className={`text-xs font-black uppercase tracking-widest ${selectedOrderDetails.status === opt.label ? 'text-[#E85D04]' : 'text-gray-400'}`}>{opt.label}</span>
                                            {selectedOrderDetails.status === opt.label && <CheckCircle2 className="w-4 h-4 text-[#E85D04]" />}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for Side Panel */}
            {selectedOrderDetails && (
                <div onClick={() => setSelectedOrderDetails(null)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] animate-in fade-in duration-500"></div>
            )}

            {/* ── Header Area ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">Orders</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and track customer laundry cycles in real-time.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-3xl">
                    {/* Search Field */}
                    <div className="relative group flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F3024] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by Tracking ID, Name or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 pl-12 pr-6 py-4 rounded-[24px] text-sm font-bold focus:ring-[10px] focus:ring-[#0F3024]/5 outline-none transition-all w-full shadow-sm" 
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-white p-1.5 rounded-[24px] shadow-sm border border-gray-100 w-fit shrink-0">
                        {['All', 'Active', 'Completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab ? 'bg-[#0F3024] text-white shadow-lg' : 'text-gray-400 hover:text-[#0F3024]'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Desktop View (Table) ── */}
            <div className="hidden lg:block bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-6 w-12 text-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-5 h-5 rounded border-gray-300 text-[#E85D04] focus:ring-[#E85D04]" 
                                />
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Time</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Services</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <p className="text-gray-400 font-bold">No orders found matching your criteria.</p>
                                </td>
                            </tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className={`group hover:bg-emerald-50/30 transition-colors ${selectedOrders.includes(order.id) ? 'bg-emerald-50/50' : ''}`}>
                                <td className="p-6 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => toggleSelectOrder(order.id)}
                                        className="w-5 h-5 rounded border-gray-200 text-[#E85D04] focus:ring-[#E85D04]" 
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-black text-[#E85D04] text-sm uppercase tracking-tight">#{order.trackingId || order.id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-black text-[#0F3024] text-sm">{userCache[order.userId] || order.customerName || "Loading..."}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[150px]">{order.address?.split(',')[0] || 'Walk-in'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#0F3024]">{order.createdAt?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {order.items?.map((item, i) => (
                                            <span key={i} className="text-[9px] font-black bg-gray-100 text-[#0F3024] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                {item.service}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-black text-[#0F3024] text-sm">
                                    ₦{order.total?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black border tracking-tighter transition-all outline-none ${getStatusColor(order.status)}`}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.label} value={opt.label} className="bg-white text-gray-900">{opt.label}</option>
                                        ))}
                                        <option value="Completed" className="bg-white text-gray-900">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setSelectedOrderDetails(order)} className="p-3 bg-gray-50 text-gray-400 hover:text-[#0F3024] hover:bg-gray-100 rounded-xl transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile View (Cards) ── */}
            <div className="lg:hidden space-y-4 pb-20">
                {filteredOrders.map((order) => (
                    <div 
                        key={order.id} 
                        onClick={() => setSelectedOrderDetails(order)}
                        className={`bg-white p-6 rounded-[32px] shadow-sm border transition-all active:scale-[0.98] ${selectedOrders.includes(order.id) ? 'border-[#E85D04] ring-4 ring-[#E85D04]/5' : 'border-gray-100'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={selectedOrders.includes(order.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleSelectOrder(order.id);
                                    }}
                                    className="w-5 h-5 rounded border-gray-200 text-[#E85D04] focus:ring-[#E85D04]" 
                                />
                                <div>
                                    <p className="text-[10px] font-black text-[#E85D04] uppercase tracking-widest">#{order.trackingId || order.id.slice(-6)}</p>
                                    <h3 className="font-black text-[#0F3024] text-lg leading-tight">{userCache[order.userId] || order.customerName || "Loading..."}</h3>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" /> Placed On
                                </p>
                                <p className="font-bold text-[#0F3024]">{order.createdAt?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <CreditCard className="w-2.5 h-2.5" /> Total Pay
                                </p>
                                <p className="font-bold text-[#0F3024]">₦{order.total?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex-shrink-0 bg-emerald-50 text-[#0F3024] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight border border-emerald-100">
                                        {item.service}
                                    </div>
                                ))}
                            </div>
                            <div className="flex-shrink-0 text-[#E85D04]">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
