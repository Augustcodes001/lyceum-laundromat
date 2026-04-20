import React, { useState, useEffect, useRef } from 'react';

const img1 = '/image-grid-illustration.jpg';
const img2 = '/image-grid-illustration-2.jpg';

// 8 images per row so it never runs out of track on wide screens
const row1Images = [img1, img2, img1, img2, img1, img2, img1, img2];
const row2Images = [img2, img1, img2, img1, img2, img1, img2, img1];

export default function ImageGrid() {
    const [scrollOffset, setScrollOffset] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                setScrollOffset(rect.top);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            // UPDATED: A crisper, more deliberate brand gradient
            className="py-24 overflow-hidden flex flex-col gap-8 bg-gradient-to-br from-[#E8F1EC] via-white to-[#FCECDA]"
        >

            {/* Row 1: Moves Left as you scroll down */}
            <div
                className="flex gap-6 w-max will-change-transform"
                style={{
                    transform: `translateX(${scrollOffset * 0.4}px)`
                }}
            >
                {row1Images.map((src, index) => (
                    <div
                        key={`row1-${index}`}
                        className="w-[75vw] md:w-[45vw] lg:w-[35vw] h-[280px] md:h-[380px] flex-shrink-0 rounded-[2rem] overflow-hidden shadow-md bg-white border border-gray-100/50"
                    >
                        <img
                            src={src}
                            alt="Lyceum feature"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Row 2: Moves Right as you scroll down */}
            <div
                className="flex gap-6 w-max will-change-transform"
                style={{
                    transform: `translateX(calc(-50vw - ${scrollOffset * 0.4}px))`
                }}
            >
                {row2Images.map((src, index) => (
                    <div
                        key={`row2-${index}`}
                        className="w-[75vw] md:w-[45vw] lg:w-[35vw] h-[280px] md:h-[380px] flex-shrink-0 rounded-[2rem] overflow-hidden shadow-md bg-white border border-gray-100/50"
                    >
                        <img
                            src={src}
                            alt="Lyceum feature"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

        </section>
    );
}