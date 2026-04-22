import React, { useEffect, useRef, useState } from 'react';

const Star = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-[#E85D04] fill-current" viewBox="0 0 24 24">
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
    </svg>
);

export default function GuaranteeBackground() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            { threshold: 0.3 }
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
            // 🌟 UPGRADED: No top padding needed since the Gradient Bridge flows right into this!
            className="relative flex items-center min-h-[80vh] py-24 sm:py-32 px-6 md:px-16 lg:px-24 overflow-hidden bg-[#0F3024]"
        >
            {/* 🌟 UPGRADED: Cinematic Background Image Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{ backgroundImage: "url('/lyceum-background.png')" }}
                ></div>
                {/* Gradient mask to ensure text is always readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F3024] via-[#0F3024]/80 to-[#0F3024]"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">

                {/* Group A - Headline */}
                <div
                    className={`w-full lg:w-1/2 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {/* Signature Sub-header */}
                    <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                        Our Promise
                    </h2>

                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[1.05] tracking-tight">
                        The Lyceum <br />
                        <span className="text-[#E85D04]">Guarantee.</span>
                    </h3>

                    {/* Mobile CTA */}
                    <div className={`mt-10 lg:hidden transition-all duration-1000 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {/* <button className="bg-[#E85D04] hover:bg-[#cc5203] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-3 group w-full justify-center sm:w-auto">
                            Get $15 off
                            <svg className="transform group-hover:translate-x-1 transition-transform duration-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button> */}
                    </div>
                </div>

                {/* Group B - Content & Desktop CTA */}
                <div
                    className={`w-full lg:w-1/2 flex flex-col items-start transition-all duration-1000 delay-200 ease-out`}
                >
                    {/* 🌟 UPGRADED: Staggered Star Pop-In Animation */}
                    <div className="flex gap-2 sm:gap-3 mb-8">
                        {[0, 100, 200, 300, 400].map((delay, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                    }`}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                <Star />
                            </div>
                        ))}
                    </div>

                    {/* Paragraph Text */}
                    <p className={`text-lg md:text-xl lg:text-2xl text-gray-300 font-medium mb-12 leading-relaxed text-balance transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'
                        }`}>
                        Every order is backed by our industry-leading guarantee. If you are not completely satisfied with the finishing of your garments, we will re-clean them—<span className="text-white font-bold">free of charge.</span>
                    </p>

                    {/* Desktop CTA Button */}
                    <div className={`hidden lg:block transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'
                        }`}>
                        {/* <button className="bg-[#E85D04] hover:bg-[#cc5203] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 active:scale-95 flex items-center gap-3 group">
                            <span className="text-lg tracking-wide">Get $15 off</span>
                            <svg className="transform group-hover:translate-x-1 transition-transform duration-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button> */}
                    </div>
                </div>

            </div>
        </section>
    );
}