import React, { useState } from 'react';

// DATA STRUCTURE (Mirroring the specific steps and colors from your reference image)
// DATA STRUCTURE (Updated with Light Orange themes)
const stepsData = [
    {
        id: 0,
        title: 'Sign Up For Delivery',
        shortDesc: 'Create an account and schedule your first pickup.',
        fullDesc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        themeColor: '#FFEDD5', // Updated to Light Orange
        illustration: '/illustration-dirty-clothes-pile-concept.png',
        chevron: 'right',
    },
    {
        id: 1,
        title: 'Leave Clothes For Pick Up',
        shortDesc: 'Bag your laundry and leave it at your door.',
        fullDesc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        themeColor: '#deffdeff', // Blue background
        illustration: '/illustration-dirty-laundry-basket-concept.png',
        chevron: 'right',
    },
    {
        id: 2,
        title: 'You Are In Control',
        shortDesc: 'Track your laundry and manage preferences easily.',
        fullDesc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
        themeColor: '#E6F4C4', // Green background
        illustration: '/illustration-laundry-stacks-dirty-concept.png',
        chevron: 'right',
    },
    {
        id: 3,
        title: 'Get Clean Clothes Back',
        shortDesc: 'Fresh, folded, and delivered right to your door.',
        fullDesc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        themeColor: '#FFEDD5', // Updated from Pink to Light Orange
        illustration: '/illustration-folded-laundry-stacks-clean-concept.png',
        chevron: 'up',
    }
];

export default function HowItWorks() {
    const [expandedCardId, setExpandedCardId] = useState(null);

    const toggleExpand = (id) => {
        // If clicking an already expanded card, collapse it
        setExpandedCardId(id === expandedCardId ? null : id);
    };

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#01411C] tracking-tight uppercase leading-[1.1]">
                        Your Time Back in <span className="text-[#E85D04]">4 Simple Steps</span>
                    </h2>
                    <p className="mt-6 text-base sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto px-4">
                        From tap to doorstep, we handle the heavy lifting so you can focus on what actually matters.
                    </p>
                </div>

                {/* The Interactive Flex Container */}
                <div className="flex flex-wrap md:flex-nowrap gap-4 transition-all duration-300 relative">
                    {stepsData.map((step) => {
                        const isExpanded = step.id === expandedCardId;
                        const isAnyExpanded = expandedCardId !== null;

                        return (
                            <div
                                key={step.id}
                                className={`flex-initial transition-all duration-500 rounded-[32px] p-6 sm:p-8 relative flex flex-col ease-in-out border border-gray-100 shadow-sm
                  ${isExpanded ? 'flex-[0_0_100%] order-[-1] min-w-full' : 'flex-[1_1_0%] min-w-[280px]'}
                  ${isAnyExpanded && !isExpanded ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}
                  md:${isExpanded ? 'flex-[0_0_100%]' : 'flex-[1_1_0%]'}
                `}
                                style={{ backgroundColor: step.themeColor }}
                            >
                                {/* Close 'X' button (Only visible when expanded) */}
                                {isExpanded && (
                                    <button
                                        onClick={() => setExpandedCardId(null)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-black bg-white/70 rounded-full h-11 w-11 flex items-center justify-center z-10 transition-all active:scale-90 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                )}

                                {/* Illustrations container */}
                                <div className={`mb-4 flex ${isExpanded ? 'justify-center items-center h-48' : 'justify-center h-32'}`}>
                                    {/* If you haven't downloaded the images yet, this placeholder circle will show up instead of broken links */}
                                    <div className={`bg-black/5 rounded-full flex items-center justify-center transition-all duration-500 ${isExpanded ? 'w-48 h-48' : 'w-24 h-24'}`}>
                                        <img
                                            src={step.illustration}
                                            alt={step.title}
                                            className="object-contain w-full h-full p-2 drop-shadow-md"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<span class="text-xs text-gray-500">Image</span>';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Typography Block */}
                                <div className={`${isExpanded ? 'md:flex md:gap-8 md:items-start mt-4' : 'block mt-auto'}`}>
                                    <div className={`${isExpanded ? 'md:w-1/3' : 'w-full'}`}>
                                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">{step.title}</h3>
                                        <p className={`text-gray-500 font-bold mb-6 transition-all duration-300 text-sm sm:text-base ${isExpanded ? 'leading-relaxed' : 'line-clamp-2'}`}>
                                            {step.shortDesc}
                                        </p>
                                    </div>

                                    {/* Expanded Full Description (Only visible when expanded) */}
                                    {isExpanded && (
                                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-900/5 pt-6 md:pt-0 md:pl-10">
                                            <p className="text-gray-600 font-medium leading-relaxed mb-8 text-sm sm:text-[1.05rem]">{step.fullDesc}</p>
                                            <button
                                                onClick={() => setExpandedCardId(null)}
                                                className="w-full md:w-auto bg-gray-900 text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95"
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
                                        className="absolute bottom-6 right-6 text-gray-900 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-all active:scale-90 border border-gray-100"
                                    >
                                        {step.chevron === 'right' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        )}
                                        {step.chevron === 'up' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
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