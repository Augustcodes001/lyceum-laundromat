import { useState, useEffect, useMemo } from 'react';
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    getAggregateFromServer, 
    sum,
    where,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
    Wallet, 
    TrendingUp, 
    CreditCard, 
    Banknote, 
    ArrowUpRight, 
    ArrowDownRight,
    Search,
    Filter,
    Download,
    Calendar,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    X
} from 'lucide-react';

const AdminFinance = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        onlineRevenue: 0,
        walkinRevenue: 0,
        loading: true
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // 'All' or 'Unverified'
    const [verifyingId, setVerifyingId] = useState(null);

    useEffect(() => {
        // ── Fetch Transactions (Latest 50) ──
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(data);
            setLoading(false);
        });

        // ── Fetch Financial Aggregations ──
        const fetchFinancials = async () => {
            try {
                // Total Revenue
                const totalSnap = await getAggregateFromServer(collection(db, "orders"), {
                    totalRevenue: sum('total')
                });
                
                const walkinSnap = await getAggregateFromServer(query(collection(db, "orders"), where("type", "==", "walk-in")), {
                    revenue: sum('total')
                });

                const total = totalSnap.data().totalRevenue || 0;
                const walkin = walkinSnap.data().revenue || 0;

                setStats({
                    totalRevenue: total,
                    onlineRevenue: total - walkin,
                    walkinRevenue: walkin,
                    loading: false
                });
            } catch (err) {
                console.error("Aggregation Error:", err);
            }
        };

        fetchFinancials();
        return () => unsubscribe();
    }, []);

    // ── Reconciliation Logic ──
    const handleVerify = async (orderId) => {
        setVerifyingId(orderId);
        try {
            await updateDoc(doc(db, "orders", orderId), {
                paymentStatus: 'verified',
                reconciledAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Verification error:", err);
            alert("Failed to verify payment.");
        } finally {
            setVerifyingId(null);
        }
    };

    // ── Filtering Logic ──
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = 
                (tx.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tx.trackingId || tx.id || "").toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilter = filter === 'All' || 
                (filter === 'Unverified' && tx.paymentStatus !== 'verified' && tx.paymentMethod === 'Bank Transfer');

            return matchesSearch && matchesFilter;
        });
    }, [transactions, searchTerm, filter]);

    const getPaymentIcon = (method) => {
        if (method === 'Pay with Card') return <CreditCard className="w-4 h-4 text-blue-500" />;
        if (method === 'Bank Transfer') return <Banknote className="w-4 h-4 text-emerald-500" />;
        return <Wallet className="w-4 h-4 text-orange-500" />;
    };

    if (loading || stats.loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#0F3024] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Processing Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">Finance</h1>
                    <p className="text-gray-500 font-medium mt-1">Track revenue, payments, and financial distributions.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl text-sm font-bold text-[#0F3024] hover:bg-gray-50 transition-all">
                        <Calendar className="w-4 h-4" /> This Month
                    </button>
                    <button className="flex items-center gap-2 bg-[#0F3024] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-[#0F3024]/20 hover:bg-[#0a2018] transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0F3024] p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
                    <p className="text-emerald-100/60 text-xs font-black uppercase tracking-[0.2em] mb-2">Gross Revenue</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-4">₦{stats.totalRevenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                        <TrendingUp className="w-4 h-4" />
                        <span>All-time Earnings</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Online Sales</p>
                    <h3 className="text-4xl font-black text-[#0F3024] tracking-tighter mb-4">₦{stats.onlineRevenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-bold bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                        <CreditCard className="w-4 h-4" />
                        <span>Digital Payments</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Walk-in Revenue</p>
                    <h3 className="text-4xl font-black text-[#0F3024] tracking-tighter mb-4">₦{stats.walkinRevenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                        <Banknote className="w-4 h-4" />
                        <span>In-Shop Cash</span>
                    </div>
                </div>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-[#0F3024] tracking-tight">Recent Transactions</h2>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            {['All', 'Unverified'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-[#0F3024] text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search ledger..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border-none rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#0F3024]/10 transition-all w-full lg:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order / Ref</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center text-gray-400 font-bold">No transactions found.</td>
                                </tr>
                            ) : filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'walk-in' ? 'bg-orange-100 text-orange-600' : 'bg-[#0F3024]/5 text-[#0F3024]'}`}>
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#0F3024] text-sm">#{tx.trackingId || tx.id.slice(-6)}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.type || 'Direct'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-[#0F3024] text-sm">{tx.customerName || 'Anonymous'}</p>
                                        <p className="text-[10px] font-medium text-gray-400">{tx.customerPhone || 'Online User'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {getPaymentIcon(tx.paymentMethod)}
                                            <span className="text-xs font-bold text-gray-600 truncate max-w-[120px]">{tx.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {tx.paymentStatus === 'verified' ? (
                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit border border-emerald-100">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit border border-orange-100">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-black text-[#0F3024] text-lg">₦{tx.total?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {tx.paymentStatus !== 'verified' && tx.paymentMethod === 'Bank Transfer' ? (
                                            <button 
                                                onClick={() => handleVerify(tx.id)}
                                                className="bg-[#0F3024] hover:bg-[#0a2018] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                                            >
                                                {verifyingId === tx.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                                            </button>
                                        ) : (
                                            <div className="text-gray-300">
                                                <X className="w-4 h-4 mx-auto" />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-gray-50/50 flex justify-center">
                    <button className="text-xs font-black text-[#0F3024] uppercase tracking-widest hover:text-[#E85D04] transition-colors">
                        Load Full Ledger history
                    </button>
                </div>
            </div>

            {/* Bottom Insight Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-[#0F3024] mb-6">Payment Method Distribution</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Pay with Card', share: '65%', color: 'bg-blue-500' },
                            { name: 'Bank Transfer', share: '20%', color: 'bg-emerald-500' },
                            { name: 'Pay on Pickup / Walk-in', share: '15%', color: 'bg-orange-500' },
                        ].map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-400">{item.name}</span>
                                    <span className="text-[#0F3024]">{item.share}</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#E85D04] p-10 rounded-[40px] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Billing Support</h3>
                        <p className="text-orange-100/60 font-medium leading-relaxed">Financial data is synced every 24 hours with Paystack settlements. Direct bank transfers must be manually verified in the Orders tab.</p>
                    </div>
                    <button onClick={() => setFilter('Unverified')} className="w-full bg-white text-[#E85D04] font-black py-4 rounded-2xl transition-all shadow-xl shadow-orange-900/40 mt-8 relative z-10 uppercase tracking-widest text-xs">
                        Start Reconciliation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;
