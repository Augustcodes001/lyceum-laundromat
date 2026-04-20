import React from 'react';

const updatesData = [
    {
        id: 1,
        title: 'Daily Service Window',
        description: 'Your Valet will always arrive between 7pm and 10pm.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        ),
        bgColor: '#DEF2FF'
    },
    {
        id: 2,
        title: 'Real-Time ETA Alert',
        description: "At 5:30pm, we'll text you a 30-minute ETA window.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
        ),
        bgColor: '#FFE7D9'
    },
    {
        id: 3,
        title: 'Order & Valet Tracking',
        description: "We'll also send a link to track your Valet, and your order once it's picked up.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        ),
        bgColor: '#E6F4C4'
    },
    {
        id: 4,
        title: 'Personalized Lyceum Bags',
        description: 'Your Valet will bring your free, personalized Lyceum bags. Just have your clothes ready for pickup.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
        ),
        bgColor: '#FFD9DC'
    }
];

export default function DeliveryUpdates() {
    return (
        <section
            id="delivery"
            className="relative py-24 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/delivery-pickup-update-illustration.png')" }}
        >
            {/* Reduced overlay opacity to let the background illustration's colors shine */}
            <div className="absolute inset-0 bg-[#01411C]/20"></div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

                {/* THE VIBRANT GLASS PANEL:
                   1. Lowered opacity from /90 to /40 for true transparency
                   2. Increased blur to backdrop-blur-xl for a premium feel
                   3. Added backdrop-saturate-150 to make the colors "pop" through the glass
                */}
                <div className="bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-[3rem] shadow-2xl p-8 md:p-12 lg:p-16 border border-white/40 relative overflow-hidden">

                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#01411C] tracking-tight">
                            Delivery & Pickup <span className="text-[#F6921E]">Updates</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-900 max-w-2xl mx-auto font-semibold">
                            Stay in the loop at every step. Here is exactly what happens when you schedule a Lyceum pickup.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 relative z-10">

                        {/* Updated dividers to be even more subtle */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2"></div>
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/20 -translate-x-1/2"></div>

                        {updatesData.map((item) => (
                            <div key={item.id} className="flex gap-6 relative bg-transparent p-2 group transition-all duration-300">

                                <div className="flex-shrink-0">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#F6921E] shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3"
                                        style={{ backgroundColor: item.bgColor }}
                                    >
                                        {item.icon}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#01411C] mb-2">{item.title}</h3>
                                    <p className="text-gray-800 leading-relaxed text-[1.05rem] font-medium">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}