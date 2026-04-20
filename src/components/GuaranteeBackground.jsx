import React, { useEffect, useRef, useState } from 'react';

const Star = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#E85D04] fill-current" viewBox="0 0 24 24">
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
    </svg>
);

export default function GuaranteeBackground() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        // Set up the Intersection Observer for the scroll reveal
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Stop observing once it has been revealed
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            { threshold: 0.3 } // Triggers when 30% of the section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex items-center min-h-[80vh] py-24 px-6 md:px-16 lg:px-24 overflow-hidden bg-[#0F3024]"
        >
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/lyceum-background.png')" }}
            ></div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center justify-between">

                {/* Group A - Headline (Fades in first) */}
                <div
                    className={`w-full md:w-1/2 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight whitespace-pre-line tracking-tight">
                        The Lyceum{"\n"}Guarantee.
                    </h2>

                    {/* Mobile CTA (Shows only on small screens for better UX) */}
                    <div className={`mt-8 md:hidden transition-all duration-1000 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        <button className="bg-[#E85D04] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg">
                            Get $15 off
                        </button>
                    </div>
                </div>

                {/* Group B - Content & Desktop CTA (Fades in with 200ms delay) */}
                <div
                    className={`w-full md:w-1/2 flex flex-col items-start transition-all duration-1000 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {/* Stars */}
                    <div className="flex gap-2 mb-6">
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                    </div>

                    {/* Paragraph Text */}
                    <p className="text-lg md:text-xl text-white font-medium mb-10 leading-relaxed text-balance">
                        Every order is backed by our industry-leading guarantee. If you're not satisfied with the cleaning of your clothes, we will re-clean them — free of charge.
                    </p>

                    {/* Desktop CTA Button */}
                    {/* <button className="hidden md:block bg-[#E85D04] hover:bg-[#c24e03] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-1">
                        Get $15 off
                    </button> */}
                </div>

            </div>
        </section>
    );
}