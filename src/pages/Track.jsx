import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Track() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [recentTracks, setRecentTracks] = useState(() => {
        const saved = localStorage.getItem('antigravity_recent_tracks');
        return saved ? JSON.parse(saved) : [];
    });

    const handleTrack = (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        const id = trackingId.trim().toUpperCase();
        
        // Save to recent
        if (!recentTracks.includes(id)) {
            const newRecent = [id, ...recentTracks].slice(0, 5); // Keep last 5
            setRecentTracks(newRecent);
            localStorage.setItem('antigravity_recent_tracks', JSON.stringify(newRecent));
        }

        navigate(`/orders?id=${id}`);
    };

    const handleClearRecent = () => {
        setRecentTracks([]);
        localStorage.removeItem('antigravity_recent_tracks');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-28 font-sans">
            <div className="bg-[#0F3024] pt-12 pb-16 px-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-white tracking-wide border-l border-white/20 pl-4 py-1">Track Order</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-8 relative z-40 space-y-6">
                
                {/* ── Tracking Input Card ── */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100/50">
                    <div className="w-16 h-16 bg-[#E85D04]/10 text-[#E85D04] rounded-full flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#0F3024] text-center mb-2">Locate your laundry</h2>
                    <p className="text-sm text-gray-500 text-center mb-8">Enter your AG-XXXX reference code to instantly track your pickup or delivery status.</p>
                    
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="relative">
                            <input 
                                value={trackingId} 
                                onChange={(e) => setTrackingId(e.target.value)} 
                                placeholder="AG-1234" 
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-center text-lg font-extrabold text-[#0F3024] tracking-widest uppercase focus:border-[#E85D04] focus:ring-4 focus:ring-[#E85D04]/10 outline-none transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#E85D04] text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(232,93,4,0.25)] hover:bg-[#d15303] transition-colors">
                            Track Now
                        </button>
                    </form>
                </div>

                {/* ── Recent Tracks ── */}
                {recentTracks.length > 0 && (
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#0F3024] flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Recent Searches
                            </h3>
                            <button onClick={handleClearRecent} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider">
                                Clear
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            {recentTracks.map(id => (
                                <div 
                                    key={id} 
                                    onClick={() => { setTrackingId(id); navigate(`/orders?id=${id}`); }}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors border border-transparent hover:border-emerald-100 group"
                                >
                                    <span className="font-bold text-gray-700 group-hover:text-emerald-700">{id}</span>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
