import React, { useState, useEffect } from 'react';

const features = [
    {
        id: 1,
        title: "World-class customer service",
        description: "We're obsessed with delivering unmatched customer service. Our dedicated team is always here and strives to ensure your Lyceum experience is both convenient and delightful every time. Email us anytime at care@lyceum.com or text our dedicated line, and a Lyceum Care team member will be there to assist you!",
        image: "/why-choose-us-illustration.jpg"
    },
    {
        id: 2,
        title: "Make Mom proud",
        description: "Look sharp without the effort. We handle the meticulous sorting, washing, and folding so your clothes are always returned in pristine, closet-ready condition.",
        image: "/delivery-pickup-update-illustration.jpg"
    },
    {
        id: 3,
        title: "Clean clothes at your fingertips",
        description: "Schedule pickups, track your Valet in real-time, and update your cleaning preferences seamlessly right from your smartphone.",
        image: "/testimonial-illustration.jpg"
    }
];

// Duplicate the array 3 times to create a seamless infinite loop track
const displayFeatures = [...features, ...features, ...features];

export default function WhyLoveLyceum() {
    // Start in the middle of our duplicated array (index 3 is the first 'real' slide)
    const [activeIndex, setActiveIndex] = useState(features.length);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);

    // Adjusted Dimensions for better balance
    const [dimensions, setDimensions] = useState({ active: 580, inactive: 380, gap: 24 });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: Active is 80% of screen, Inactive is 75%. Allows next card to "peek"
                setDimensions({ active: width * 0.8, inactive: width * 0.75, gap: 16 });
            } else if (width < 1024) {
                // Tablet: Mid-sized balance
                setDimensions({ active: 450, inactive: 320, gap: 20 });
            } else {
                // Desktop: Narrower active, much wider/taller inactive (3 fit perfectly in 1400px container)
                setDimensions({ active: 580, inactive: 380, gap: 24 });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- SEAMLESS INFINITE LOOP LOGIC ---
    const handleNext = () => {
        if (isNavigating) return; // Prevent rapid clicking from breaking animation
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
        // If we slide past the middle duplicate set, silently jump back to the center
        if (activeIndex === features.length * 2) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false); // Turn off animation
                setActiveIndex(features.length); // Jump
            }, 700); // Wait for CSS transition to finish
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
        // Turn transition back on after a silent jump
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    // The Magic Math offset
    const offset = -(activeIndex * (dimensions.inactive + dimensions.gap));

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#01411C] tracking-tight">
                        Why you'll love <span className="text-[#F6921E]">Lyceum</span>
                    </h2>
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
                                    {/* Image Container - Taller Inactive State */}
                                    <div
                                        className={`w-full overflow-hidden rounded-[2rem] shadow-sm ${isActive
                                            ? 'h-[380px] md:h-[480px] bg-[#FAF9F6] border border-gray-100'
                                            : 'h-[320px] md:h-[400px] bg-gray-100 opacity-80 group-hover:opacity-100'
                                            }`}
                                        style={{
                                            transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                        }}
                                    >
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-100' : 'scale-105 group-hover:scale-100'}`}
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="mt-6 flex flex-col">
                                        <h3
                                            className={`font-extrabold text-[#01411C] ${isActive ? 'text-3xl md:text-4xl mb-4' : 'text-xl md:text-2xl mt-2'
                                                }`}
                                            style={{ transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none' }}
                                        >
                                            {feature.title}
                                        </h3>

                                        {/* Expanding Description */}
                                        <div
                                            className="overflow-hidden"
                                            style={{
                                                maxHeight: isActive ? '300px' : '0px',
                                                opacity: isActive ? 1 : 0,
                                                transition: isTransitioning ? 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                            }}
                                        >
                                            <p className="text-gray-700 text-lg leading-relaxed pr-8">
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
                <div className="flex gap-4 mt-12">
                    <button
                        onClick={handlePrev}
                        aria-label="Previous feature"
                        className="w-14 h-14 rounded-full border-2 border-[#01411C] text-[#01411C] hover:bg-[#01411C] hover:text-white flex items-center justify-center transition-colors duration-300"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    <button
                        onClick={handleNext}
                        aria-label="Next feature"
                        className="w-14 h-14 rounded-full border-2 border-[#01411C] text-[#01411C] hover:bg-[#01411C] hover:text-white flex items-center justify-center transition-colors duration-300"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>

            </div>
        </section>
    );
}