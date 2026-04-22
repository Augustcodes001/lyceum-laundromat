import React, { useState, useEffect } from 'react';

// 🌟 UPGRADED DATA: Perfectly balanced text lengths (30-31 words each) to prevent layout shifting
const features = [
    {
        id: 1,
        title: "Uncompromising Concierge Support",
        description: "Experience uncompromising care with our dedicated client concierge team. From special fabric requests to prompt scheduling adjustments, we ensure every interaction is seamless, discreet, and flawlessly tailored to your lifestyle.",
        image: "/whylove-illustration-one.jpg"
    },
    {
        id: 2,
        title: "The Retail-Ready Finish",
        description: "Step into garments that consistently feel flawlessly brand new. We handle the meticulous sorting, advanced stain removal, and crisp pressing so your wardrobe is always returned in pristine, closet-ready condition.",
        image: "/whylove-illustration-two.jpg"
    },
    {
        id: 3,
        title: "Seamless Smart Technology",
        description: "Discover where premium garment care seamlessly meets modern convenience. Instantly schedule pickups, track your order via live GPS, and update specialized cleaning preferences right from your smartphone with absolute ease.",
        image: "/whylove-illustration-three.jpg"
    }
];

// Duplicate the array 3 times to create a seamless infinite loop track
const displayFeatures = [...features, ...features, ...features];

export default function WhyLoveLyceum() {
    const [activeIndex, setActiveIndex] = useState(features.length);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);

    // Refined Dimensions for Perfect Mobile & Desktop Balance
    const [dimensions, setDimensions] = useState({ active: 600, inactive: 400, gap: 32 });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setDimensions({ active: width * 0.85, inactive: width * 0.75, gap: 16 });
            } else if (width < 1024) {
                setDimensions({ active: 450, inactive: 320, gap: 24 });
            } else {
                setDimensions({ active: 600, inactive: 400, gap: 32 });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- SEAMLESS INFINITE LOOP LOGIC ---
    const handleNext = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        setIsTransitioning(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsNavigating(false), 700);
    };

    const handlePrev = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        setIsTransitioning(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsNavigating(false), 700);
    };

    const handleCardClick = (index) => {
        if (isNavigating || index === activeIndex) return;
        setIsNavigating(true);
        setIsTransitioning(true);
        setActiveIndex(index);
        setTimeout(() => setIsNavigating(false), 700);
    };

    useEffect(() => {
        if (activeIndex === features.length * 2) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setActiveIndex(features.length);
            }, 700);
            return () => clearTimeout(timeout);
        } else if (activeIndex === features.length - 1) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setActiveIndex(features.length * 2 - 1);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [activeIndex]);

    useEffect(() => {
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    const offset = -(activeIndex * (dimensions.inactive + dimensions.gap));

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                {/* Section Header */}
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                        The Lyceum Difference
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#0F3024] tracking-tight uppercase leading-[1.1]">
                        Why You Will <span className="text-[#E85D04]">Love Lyceum</span>
                    </h3>
                </div>

                {/* Dynamic Slider Container */}
                <div className="relative">
                    <div
                        className="flex"
                        style={{
                            gap: `${dimensions.gap}px`,
                            transform: `translateX(${offset}px)`,
                            transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                        }}
                    >
                        {displayFeatures.map((feature, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <div
                                    key={`${feature.id}-${index}`}
                                    onClick={() => handleCardClick(index)}
                                    className="flex-shrink-0 flex flex-col cursor-pointer group"
                                    style={{
                                        width: `${isActive ? dimensions.active : dimensions.inactive}px`,
                                        transition: isTransitioning ? 'width 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                    }}
                                >
                                    {/* Image Container */}
                                    <div
                                        className={`w-full overflow-hidden rounded-[32px] relative shadow-lg ${isActive
                                            ? 'h-[400px] md:h-[500px] bg-[#0F3024]/5 border-none shadow-[#0F3024]/10'
                                            : 'h-[320px] md:h-[400px] bg-gray-100 opacity-60 group-hover:opacity-100'
                                            }`}
                                        style={{
                                            transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center text-[#0F3024] font-bold text-sm tracking-widest uppercase opacity-50">
                                            Image {feature.id}
                                        </div>

                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F3024]/20 to-transparent z-10 pointer-events-none mix-blend-overlay"></div>
                                        )}

                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className={`relative z-10 w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-100' : 'scale-105 group-hover:scale-100'}`}
                                            onError={(e) => {
                                                e.target.style.opacity = '0';
                                            }}
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="mt-6 flex flex-col">
                                        <h3
                                            className={`font-black text-[#0F3024] uppercase tracking-wide ${isActive ? 'text-2xl md:text-3xl mb-4' : 'text-lg md:text-xl mt-2'
                                                }`}
                                            style={{ transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none' }}
                                        >
                                            {feature.title}
                                        </h3>

                                        {/* 🌟 UPGRADED: Structural lock added here (min-h-[100px]) */}
                                        <div
                                            className="overflow-hidden"
                                            style={{
                                                maxHeight: isActive ? '300px' : '0px',
                                                opacity: isActive ? 1 : 0,
                                                transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                            }}
                                        >
                                            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium pr-4 sm:pr-8 min-h-[110px] xl:min-h-[88px]">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex gap-4 mt-8 md:mt-12">
                    <button
                        onClick={handlePrev}
                        aria-label="Previous feature"
                        className="w-14 h-14 rounded-full bg-[#0F3024]/5 text-[#0F3024] hover:bg-[#0F3024] hover:text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    <button
                        onClick={handleNext}
                        aria-label="Next feature"
                        className="w-14 h-14 rounded-full bg-[#E85D04] text-white hover:bg-[#cc5203] flex items-center justify-center transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 group"
                    >
                        <svg className="transform group-hover:translate-x-1 transition-transform duration-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>

            </div>
        </section>
    );
}