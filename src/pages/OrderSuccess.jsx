import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;
    const [orderId, setOrderId] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (!orderData) {
            navigate('/cart');
            return;
        }

        const existingOrders = JSON.parse(localStorage.getItem('antigravity_orders') || '[]');
        
        // Find if we already just processed this to prevent double-submit in React StrictMode
        const recentIdMatch = existingOrders.find(o => JSON.stringify(o.cartItems) === JSON.stringify(orderData.cartItems) && o.placedAt.startsWith(new Date().toISOString().slice(0, 10)));
        
        let newId = '';
        if (recentIdMatch) {
            newId = recentIdMatch.id;
        } else {
            newId = `AG-${Math.floor(1000 + Math.random() * 9000)}`;
            const newOrder = {
                id: newId,
                placedAt: new Date().toISOString(),
                status: 'Order Placed',
                ...orderData
            };
            localStorage.setItem('antigravity_orders', JSON.stringify([newOrder, ...existingOrders]));
            
            // Purge Cart Context
            localStorage.removeItem('antigravity_cartItems');
            localStorage.removeItem('antigravity_address');
            localStorage.removeItem('antigravity_pickupDate');
            localStorage.removeItem('antigravity_pickupTime');
            localStorage.removeItem('antigravity_deliveryDate');
            localStorage.removeItem('antigravity_deliveryTime');
        }

        setOrderId(newId);
    }, [orderData, navigate]);

    if (!orderData || !orderId) return null;

    const shareLink = `${window.location.origin}/orders?id=${orderId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const userName = "SAGE";

    return (
        <div className="min-h-screen bg-[#0F3024] pb-44 font-sans flex flex-col items-center justify-center p-6 text-center">
            
            <div className="w-24 h-24 rounded-full bg-[#E85D04]/10 border-2 border-[#E85D04] flex items-center justify-center mb-8 animate-bounce shadow-[0_0_40px_rgba(232,93,4,0.3)]">
                <svg className="w-12 h-12 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Order Received!</h1>
            <p className="text-emerald-100/70 text-lg mb-10">Thank You, {userName}!</p>

            {/* Premium Deep Link Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-6 w-full max-w-sm mb-6 text-left shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-[#E85D04]/10 rounded-full blur-xl"></div>
                <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Order Reference</h3>
                
                <div className="flex items-center gap-3 bg-black/20 rounded-xl p-3 border border-white/5 mb-3">
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <p className="text-sm font-medium text-white/80 truncate w-full">{shareLink}</p>
                </div>
                
                <button onClick={handleCopy} className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 ${linkCopied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {linkCopied ? (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Copied!
                        </>
                    ) : 'Copy Tracking Link'}
                </button>
            </div>

            <p className="text-emerald-100/60 max-w-xs mb-12 text-sm">A rider will contact you soon for pickup and delivery.</p>

            <div className="fixed bottom-[88px] left-4 right-4 z-40 lg:w-full lg:max-w-sm lg:relative lg:inset-auto lg:p-0">
                <button
                    onClick={() => navigate('/orders')}
                    className="w-full bg-[#E85D04] text-white py-4 rounded-[20px] font-bold shadow-[0_8px_25px_rgba(232,93,4,0.3)] hover:bg-[#d15303] transition-colors"
                >
                    View Tracking Hub
                </button>
            </div>
        </div>
    );
}
