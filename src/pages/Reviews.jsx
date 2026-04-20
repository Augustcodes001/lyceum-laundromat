import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Star, MessageSquare, Quote, Heart } from 'lucide-react';

export default function Reviews() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "reviews"),
            where("rating", ">=", 3),
            orderBy("rating", "desc"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = [];
            snapshot.forEach(doc => {
                fetched.push({ id: doc.id, ...doc.data() });
            });
            setReviews(fetched);
            setLoading(false);
        }, (err) => {
            console.error("Firestore error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "4.9";

    return (
        <div className="min-h-screen bg-gray-50 pb-28 font-sans">
            {/* Header Area */}
            <div className="bg-[#0F3024] pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E85D04]/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                
                <div className="max-w-2xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-2xl font-black text-white tracking-tight">Community Feedback</h1>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] shadow-2xl">
                        <div className="text-center border-r border-white/10 pr-6">
                            <p className="text-4xl font-black text-white">{averageRating}</p>
                            <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 fill-[#E85D04] text-[#E85D04]`} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">Excellence Guaranteed</p>
                            <p className="text-white/60 text-sm">Join {reviews.length}+ happy customers who trust Lyceum for their garment care.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Feed */}
            <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
                {loading ? (
                    <div className="flex justify-center pt-20">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E85D04] rounded-full animate-spin"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="font-bold text-[#0F3024] text-lg">No Community Feedback Yet</h3>
                        <p className="text-gray-400 text-sm mt-1">Be the first to share your experience after your next delivery!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#0F3024] text-white flex items-center justify-center font-black text-lg shadow-inner uppercase">
                                            {review.userName?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F3024]">{review.userName || "Valued Customer"}</h4>
                                            <p className="text-xs text-gray-400 font-medium">Verified Order</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#E85D04] text-[#E85D04]' : 'text-gray-200'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#0F3024]/5" />
                                    <p className="text-[#0F3024]/80 text-[15px] leading-relaxed font-medium pl-2 italic">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                                    <div className="flex items-center gap-1.5 text-[#E85D04]/60 group-hover:text-[#E85D04] transition-colors cursor-pointer">
                                        <Heart className="w-3 h-3 fill-current" />
                                        <span>Helpful</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
