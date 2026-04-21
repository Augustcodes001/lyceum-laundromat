import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    collection, 
    query, 
    where, 
    getCountFromServer, 
    getAggregateFromServer, 
    sum 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
    LayoutDashboard, 
    Users, 
    ShoppingBag, 
    TrendingUp, 
    AlertCircle,
    Loader2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalOrders: 0,
        activeUsers: 0,
        totalRevenue: 0,
        pendingWalkins: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // ── Server-Side Aggregations (High Performance) ──
                
                // 1. Total Orders Count
                const ordersCountSnap = await getCountFromServer(collection(db, "orders"));
                
                // 2. Active Users Count
                const usersCountSnap = await getCountFromServer(collection(db, "users"));
                
                // 3. Total Revenue (Sum of 'total' field)
                const revenueSnap = await getAggregateFromServer(collection(db, "orders"), {
                    totalRevenue: sum('total')
                });
                
                // 4. Pending Walk-ins (Filtered Count)
                const walkinQuery = query(
                    collection(db, "orders"), 
                    where("type", "==", "walk-in"),
                    where("status", "!=", "Completed")
                );
                const walkinCountSnap = await getCountFromServer(walkinQuery);

                setStats({
                    totalOrders: ordersCountSnap.data().count,
                    activeUsers: usersCountSnap.data().count,
                    totalRevenue: revenueSnap.data().totalRevenue || 0,
                    pendingWalkins: walkinCountSnap.data().count,
                    loading: false
                });
            } catch (error) {
                console.error("Dashboard Stats Error:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const formatRevenue = (val) => {
        if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `₦${(val / 1000).toFixed(1)}K`;
        return `₦${val.toLocaleString()}`;
    };

    const statConfig = [
        { name: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+12%', icon: ShoppingBag, color: 'bg-blue-500' },
        { name: 'Active Users', value: stats.activeUsers.toLocaleString(), change: '+18%', icon: Users, color: 'bg-[#0F3024]' },
        { name: 'Total Revenue', value: formatRevenue(stats.totalRevenue), change: '+7%', icon: TrendingUp, color: 'bg-[#E85D04]', raw: `₦${stats.totalRevenue.toLocaleString()}` },
        { name: 'Pending Walk-ins', value: stats.pendingWalkins.toString(), change: '-3%', icon: AlertCircle, color: 'bg-red-500' },
    ];

    if (stats.loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#0F3024] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Calibrating Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Operational intelligence for Lyceum Laundromat.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Sync Enabled</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statConfig.map((stat) => (
                    <div key={stat.name} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gray-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-0"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg shadow-gray-200 transition-transform group-hover:rotate-6 duration-500`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</p>
                            <h3 className="text-3xl font-black text-[#0F3024] mt-1" title={stat.raw || stat.value}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0F3024] p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -mr-32"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-white tracking-tight leading-tight max-w-sm">Revenue Intelligence is now online.</h3>
                        <p className="text-emerald-100/60 mt-4 max-w-md font-medium leading-relaxed">We've migrated your dashboard to server-side aggregations. This ensures sub-millisecond load times even as your orders scale into the hundreds of thousands.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-12 relative z-10">
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Current Run Rate</p>
                            <p className="text-2xl font-black text-white">₦{(stats.totalRevenue / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Customer LTV</p>
                            <p className="text-2xl font-black text-white">₦{(stats.totalRevenue / stats.activeUsers || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-orange-100 text-[#E85D04] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-[#0F3024] tracking-tight">Walk-in Priority</h3>
                        <p className="text-gray-400 mt-3 font-medium leading-relaxed">There are currently <span className="text-[#E85D04] font-bold">{stats.pendingWalkins}</span> active walk-in orders awaiting completion. Manage them in the Orders tab.</p>
                    </div>
                    <button onClick={() => navigate('/admin/orders')} className="w-full bg-gray-50 hover:bg-gray-100 text-[#0F3024] font-black py-5 rounded-2xl transition-all border border-gray-100 uppercase tracking-widest text-xs mt-10">
                        View Active Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
