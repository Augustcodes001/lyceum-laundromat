import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
    Star, 
    MessageSquare, 
    Calendar,
    User,
    Loader2,
    Search,
    Filter,
    ChevronRight
} from 'lucide-react';

const AdminReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Fallback for missing dates
                date: doc.data().createdAt?.toDate() || new Date()
            }));
            setReviews(reviewsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredReviews = reviews.filter(r => 
        r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#0F3024] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Feedback...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F3024] tracking-tight">User Feedback</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time testimonials and satisfaction levels.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-96">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full text-[#0F3024]"
                    />
                </div>
            </div>

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl font-black text-[#0F3024]">{reviews.length}</p>
                </div>
                <div className="bg-[#0F3024] p-6 rounded-[32px] shadow-xl text-white">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Avg Rating</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-black">
                            {(reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (reviews.length || 1)).toFixed(1)}
                        </p>
                        <Star className="w-5 h-5 fill-[#E85D04] text-[#E85D04]" />
                    </div>
                </div>
            </div>

            {/* ── Reviews Grid (Masonry-style) ── */}
            {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching reviews found</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredReviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="break-inside-avoid bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-[#0F3024] font-black text-xs">
                                        {review.userName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#0F3024] text-sm leading-none">{review.userName || 'Anonymous'}</h4>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <Calendar className="w-3 h-3" />
                                            {review.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star} 
                                            className={`w-3 h-3 ${star <= (review.rating || 0) ? 'fill-[#E85D04] text-[#E85D04]' : 'text-gray-100'}`} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-[#0F3024]/80 text-sm font-medium leading-relaxed italic mb-4">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Order: {review.orderId?.slice(-6).toUpperCase() || 'N/A'}</span>
                                <button 
                                    onClick={() => review.orderId && navigate(`/admin/orders?search=${review.orderId.slice(-6)}`)}
                                    className="text-[10px] font-black text-[#E85D04] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
                                >
                                    View Order <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
