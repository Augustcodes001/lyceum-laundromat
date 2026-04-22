import React, { useState, useEffect, useRef } from 'react';

// 🌟 UPGRADED DATA: 8 Distinct Brand Images
const row1Source = [
    '/grid-1-towels.jpg',
    '/grid-2-van.jpg',
    '/grid-3-water.jpg',
    '/grid-4-iron.jpg'
];

const row2Source = [
    '/grid-5-valet.jpg',
    '/grid-6-app.jpg',
    '/grid-7-fabric.jpg',
    '/grid-8-fresh.jpg'
];

// Duplicate the arrays so the marquee never runs out of track
const row1Images = [...row1Source, ...row1Source, ...row1Source];
const row2Images = [...row2Source, ...row2Source, ...row2Source];

export default function ImageGrid() {
    const [scrollOffset, setScrollOffset] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (sectionRef.current) {
                        // Calculate how far the section is from the top of the viewport
                        const rect = sectionRef.current.getBoundingClientRect();
                        // Adjust the multiplier to make it feel buttery smooth, not frantic
                        setScrollOffset(rect.top * 0.3);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Trigger once on mount

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            // 🌟 UPGRADED: Cinematic bridge from White (previous section) to Dark Emerald (next section)
            className="py-32 overflow-hidden flex flex-col gap-6 sm:gap-8 bg-gradient-to-b from-white via-[#0F3024]/10 to-[#0F3024]"
        >
            {/* Row 1: Moves Right to Left */}
            <div
                className="flex gap-6 sm:gap-8 w-max will-change-transform ease-out duration-300"
                style={{
                    transform: `translateX(calc(-20vw + ${scrollOffset}px))`
                }}
            >
                {row1Images.map((src, index) => (
                    <div
                        key={`row1-${index}`}
                        className="w-[75vw] sm:w-[45vw] lg:w-[30vw] h-[260px] sm:h-[340px] lg:h-[400px] flex-shrink-0 rounded-[2rem] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-[#0F3024]/10 bg-gray-100 relative group"
                    >
                        {/* Fallback Text */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#0F3024] font-bold text-xs tracking-[0.2em] uppercase opacity-30">
                            Grid Image {index % 4 + 1}
                        </div>

                        <img
                            src={src}
                            alt="Lyceum feature"
                            className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => {
                                e.target.style.opacity = '0';
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Row 2: Moves Left to Right */}
            <div
                className="flex gap-6 sm:gap-8 w-max will-change-transform ease-out duration-300"
                style={{
                    transform: `translateX(calc(-60vw - ${scrollOffset}px))`
                }}
            >
                {row2Images.map((src, index) => (
                    <div
                        key={`row2-${index}`}
                        className="w-[75vw] sm:w-[45vw] lg:w-[30vw] h-[260px] sm:h-[340px] lg:h-[400px] flex-shrink-0 rounded-[2rem] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-[#0F3024]/10 bg-gray-100 relative group"
                    >
                        {/* Fallback Text */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#0F3024] font-bold text-xs tracking-[0.2em] uppercase opacity-30">
                            Grid Image {index % 4 + 5}
                        </div>

                        <img
                            src={src}
                            alt="Lyceum feature"
                            className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => {
                                e.target.style.opacity = '0';
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}