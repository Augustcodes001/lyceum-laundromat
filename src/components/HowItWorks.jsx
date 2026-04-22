import React, { useState } from 'react';

// 🌟 UPGRADED DATA: Alternating Light & Dark themes for perfect visual balance
const stepsData = [
    {
        id: 0,
        title: 'Schedule Service',
        shortDesc: 'Select Washing, Ironing, or Dry Cleaning & pick a time.',
        fullDesc: 'Your time is valuable. Choose from our core services—Washing, professional Ironing, or comprehensive Dry Cleaning—and select a pickup time that fits your lifestyle. Our seamless platform puts premium garment care at your fingertips in seconds.',
        themeColor: '#ffffff', // Light: Crisp White
        textColor: '#0F3024',
        buttonBg: '#f8fafc',
        circleBg: 'bg-black/5', // Subtle dark circle
        illustration: '/how-it-works-phase-one-illustration.png',
        chevron: 'right',
    },
    {
        id: 1,
        title: 'Secure Handoff',
        shortDesc: 'Bag your items and we will collect them from your door.',
        fullDesc: 'Simply place your garments, duvets, or shoes in a bag. A professional Lyceum concierge will arrive promptly at your doorstep to collect them. No heavy lifting, no traffic, just a seamless and secure handoff.',
        themeColor: '#0F3024', // Dark: Brand Emerald
        textColor: '#ffffff',
        buttonBg: '#1a4f3d',
        circleBg: 'bg-white/10', // Subtle light circle
        illustration: '/how-it-works-phase-two-illustration.png',
        chevron: 'right',
    },
    {
        id: 2,
        title: 'Meticulous Care',
        shortDesc: 'Expert stain removal, washing, and crisp pressing.',
        fullDesc: 'This is where the magic happens. Your items undergo our rigorous care protocols in our advanced facility. From heavy-duty washing and delicate dry cleaning to retail-ready ironing, our experts handle every fabric with uncompromising quality.',
        themeColor: '#FFF4ED', // Light: Soft Orange
        textColor: '#0F3024',
        buttonBg: '#ffffff',
        circleBg: 'bg-[#E85D04]/10', // Subtle orange tinted circle
        illustration: '/how-it-works-phase-three-illustration.png',
        chevron: 'right',
    },
    {
        id: 3,
        title: 'Reclaim Your Time',
        shortDesc: 'Fresh, perfectly folded clothes delivered back to you.',
        fullDesc: 'Open your wardrobe to freshly cleaned, neatly packaged, and perfectly pressed clothes. We deliver your garments back to you in ready-to-wear condition. We handled the chores; you keep the time.',
        themeColor: '#0F3024', // Dark: Brand Emerald
        textColor: '#ffffff',
        buttonBg: '#1a4f3d',
        circleBg: 'bg-white/10', // Subtle light circle
        illustration: '/how-it-works-phase-four-illustration.png',
        chevron: 'up',
    }
];

export default function HowItWorks() {
    const [expandedCardId, setExpandedCardId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedCardId(id === expandedCardId ? null : id);
    };

    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 flex flex-col items-center">
                    <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                        The Process
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#0F3024] tracking-tight uppercase leading-[1.1]">
                        Your Time Back in <br /><span className="text-[#E85D04]">4 Simple Steps</span>
                    </h3>
                    <p className="mt-6 text-base sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto px-4">
                        From tap to doorstep, we handle the heavy lifting so you can focus on what actually matters.
                    </p>
                </div>

                {/* The Interactive Flex Container */}
                <div className="flex flex-wrap md:flex-nowrap gap-6 transition-all duration-300 relative">
                    {stepsData.map((step) => {
                        const isExpanded = step.id === expandedCardId;
                        const isAnyExpanded = expandedCardId !== null;

                        return (
                            <div
                                key={step.id}
                                className={`group flex-initial transition-all duration-500 rounded-[32px] p-6 sm:p-8 relative flex flex-col ease-in-out border border-gray-100 shadow-sm hover:shadow-xl
                                  ${isExpanded ? 'flex-[0_0_100%] order-[-1] min-w-full' : 'flex-[1_1_0%] min-w-[280px] hover:-translate-y-1'}
                                  ${isAnyExpanded && !isExpanded ? 'scale-95 opacity-40 blur-[2px]' : 'scale-100 opacity-100'}
                                  md:${isExpanded ? 'flex-[0_0_100%]' : 'flex-[1_1_0%]'}
                                `}
                                style={{ backgroundColor: step.themeColor, color: step.textColor }}
                            >
                                {/* Close 'X' button */}
                                {isExpanded && (
                                    <button
                                        onClick={() => setExpandedCardId(null)}
                                        className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-white/90 backdrop-blur-sm rounded-full h-11 w-11 flex items-center justify-center z-10 transition-all active:scale-90 shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                )}

                                {/* 🌟 UPGRADED: Much larger image containers & reduced padding */}
                                <div className={`mb-6 flex ${isExpanded ? 'justify-center items-center h-64' : 'justify-center h-40 sm:h-48'}`}>
                                    <div className={`rounded-full flex items-center justify-center transition-all duration-500 ${step.circleBg} ${isExpanded ? 'w-64 h-64' : 'w-32 h-32 sm:w-40 sm:h-40 group-hover:scale-105'}`}>
                                        <img
                                            src={step.illustration}
                                            alt={step.title}
                                            /* Changed p-4 to p-2 so the image fills more of the circle */
                                            className="object-contain w-full h-full p-2 drop-shadow-xl"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<span class="text-xs opacity-50 uppercase tracking-widest font-bold" style="color:${step.textColor}">Image ${step.id + 1}</span>`;
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Typography Block */}
                                <div className={`${isExpanded ? 'md:flex md:gap-10 md:items-start mt-4' : 'block mt-auto'}`}>
                                    <div className={`${isExpanded ? 'md:w-1/3' : 'w-full'}`}>
                                        <div className="text-xs font-black tracking-[0.2em] opacity-50 mb-2 uppercase">Step 0{step.id + 1}</div>
                                        <h3 className="text-2xl sm:text-3xl font-black mb-3 uppercase tracking-tight leading-none" style={{ color: step.textColor }}>
                                            {step.title}
                                        </h3>
                                        <p className={`font-semibold transition-all duration-300 text-sm sm:text-base opacity-80 ${isExpanded ? 'leading-relaxed' : 'line-clamp-2'}`}>
                                            {step.shortDesc}
                                        </p>
                                    </div>

                                    {/* Expanded Full Description */}
                                    {isExpanded && (
                                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-current/10 pt-6 mt-6 md:mt-0 md:pt-0 md:pl-10">
                                            <p className="font-medium leading-relaxed mb-8 text-base sm:text-lg opacity-90">
                                                {step.fullDesc}
                                            </p>
                                            <button
                                                onClick={() => setExpandedCardId(null)}
                                                className="w-full md:w-auto font-black uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95"
                                                style={{ backgroundColor: step.textColor, color: step.themeColor }}
                                            >
                                                Close Details
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Chevron/Arrow Button */}
                                {!isExpanded && (
                                    <button
                                        onClick={() => toggleExpand(step.id)}
                                        className="absolute bottom-6 right-6 shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform active:scale-90"
                                        style={{ backgroundColor: step.buttonBg, color: step.textColor }}
                                    >
                                        {step.chevron === 'right' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        )}
                                        {step.chevron === 'up' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}