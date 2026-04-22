import React from 'react';

// 🌟 UPGRADED DATA: Brand aligned colors and optimized copy
const updatesData = [
    {
        id: 1,
        title: 'Daily Service Window',
        description: 'Your Clothes will always arrive at your selected time between 8am and 8pm.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        ),
        bgColor: 'bg-[#E85D04]/10',
        iconColor: 'text-[#E85D04]' // Brand Orange
    },
    {
        id: 2,
        title: 'Real-Time ETA Alert',
        description: "We will email you upon service completion before we arrive.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
        ),
        bgColor: 'bg-white/10',
        iconColor: 'text-white' // Crisp White
    },
    {
        id: 3,
        title: 'Live GPS & Order Tracking',
        description: 'Know the current state of your order & Watch your order approach on our live map, just like a premium ride app.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        ),
        bgColor: 'bg-white/10',
        iconColor: 'text-white'
    },
    {
        id: 4,
        title: 'Seamless Handoff',
        description: 'Meet us at the door, or leave your bags with your building concierge.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
        ),
        bgColor: 'bg-[#E85D04]/10',
        iconColor: 'text-[#E85D04]'
    }
];

export default function DeliveryUpdates() {
    return (
        <section id="delivery-updates" className="w-full bg-[#0F3024] py-24 relative overflow-hidden">
            {/* Subtle background pattern/glow for depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#E85D04] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

                {/* 🌟 UPGRADED: Section Header (Matches About & Services but inverted for dark mode) */}
                <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 flex flex-col items-center">
                    <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                        Logistics & Tracking
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.1]">
                        Never Guess When <br /><span className="text-[#E85D04]">We Will Arrive</span>
                    </h3>
                </div>

                {/* Grid Layout Container */}
                <div className="relative">

                    {/* Decorative Center Lines (Hidden on Mobile) */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 pointer-events-none"></div>
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2 pointer-events-none"></div>

                    {/* 2x2 Grid setup */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        {updatesData.map((item) => (
                            // 🌟 UPGRADED: The magical flex-col sm:flex-row for perfect mobile stacking
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative p-6 sm:p-4 rounded-3xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent group transition-all duration-300 hover:bg-white/[0.03]"
                            >
                                {/* Icon Container */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${item.bgColor} ${item.iconColor}`}
                                    >
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Text Container */}
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide">{item.title}</h3>
                                    <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">
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