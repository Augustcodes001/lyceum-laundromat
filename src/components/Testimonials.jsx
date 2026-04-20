import React, { useRef } from 'react';

const testimonialsData = [
    {
        id: 1,
        bgColor: 'bg-[#FDF4D9]',
        imgSrc: '/placeholder-laundry-1.png',
        text: "I've used Lyceum-app in every city I've lived in and I am OBSESSED.\n\nIt's so convenient, whatever detergent they use smells amazing and all of my delivery people have been so friendly.\n\nHighly recommend!",
        name: "Customer Review",
        location: "App Store",
    },
    {
        id: 2,
        bgColor: 'bg-[#CBE4F9]',
        imgSrc: '/placeholder-bubble.png',
        text: "Lyceum-app is the best luxury item I ever gave myself. No more up & down the elevator doing loads and loads of laundry.\n\nI simply fill my bag and they pick it up and bring it back the next day. The bag literally is about 3 loads of my laundry. Everything comes back clean, smelling fresh and folded nicely.",
        name: "Tanya B.",
        location: "San Francisco",
    },
    {
        id: 3,
        bgColor: 'bg-[#BCECE0]',
        imgSrc: '/placeholder-towels.png',
        text: "I nominate Lyceum for community service guarantees. They transform my dirty clothes and return them clean, folded and smelling great.\n\nKeep up the good work. Their professionalism and service deserves an applause and recognition.",
        name: "Ronnie Y.",
        location: "New York",
    },
    {
        id: 4,
        bgColor: 'bg-[#FADBB8]',
        imgSrc: '/placeholder-machines.png',
        text: "This service is amazing.\n\nI put my laundry in a bag on my front porch one night and it's back there cleaned and folded the next night.\n\nIt's magic and worth the cost!",
        name: "David D.",
        location: "San Francisco",
    }
];

const Star = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
    </svg>
);

export default function Testimonials() {
    const scrollRef = useRef(null);

    const slide = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.85 : 420;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 relative bg-[#FFFDF9] overflow-hidden group">
            {/* Background illustration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('/image-grid-illustration.jpg')", backgroundSize: 'contain', backgroundRepeat: 'repeat-x', backgroundPosition: 'top' }}></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header - Updated to Deep Brand Green */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#0F3024] mb-16 tracking-tight">
                    Hear from customers like you:
                </h2>

                {/* Carousel Wrapper */}
                <div className="relative">

                    {/* Left Arrow Button - Updated with Green text and Orange hover */}
                    <button
                        onClick={() => slide('left')}
                        className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur text-[#0F3024] hover:bg-[#E85D04] hover:text-white p-3 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:scale-110 transition-all duration-300 hidden sm:block"
                        aria-label="Previous testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 md:px-8"
                    >
                        {testimonialsData.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`flex-shrink-0 w-[85vw] sm:w-[400px] snap-center rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col items-center text-center border border-gray-100/50 ${testimonial.bgColor}`}
                            >
                                {/* Illustration Area */}
                                <div className="h-40 w-full mb-8 flex items-center justify-center bg-white/40 rounded-2xl overflow-hidden border border-white/50">
                                    <span className="text-gray-500 font-medium text-sm">Illustration Area</span>
                                </div>

                                {/* Review Text */}
                                <div className="flex-grow flex flex-col justify-start w-full">
                                    <p className="text-gray-800 font-medium text-[15px] md:text-[16px] mb-8 whitespace-pre-line leading-relaxed text-balance">
                                        {testimonial.text}
                                    </p>
                                </div>

                                {/* Customer Info & Stars */}
                                <div className="mt-auto pt-4 w-full">
                                    <p className="font-bold text-[#0F3024] text-lg">{testimonial.name}</p>
                                    <p className="text-sm text-gray-700 mb-4">{testimonial.location}</p>

                                    <div className="flex gap-1 justify-center">
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-3 font-medium">attributiongraphics</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow Button - Updated with Green text and Orange hover */}
                    <button
                        onClick={() => slide('right')}
                        className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur text-[#0F3024] hover:bg-[#E85D04] hover:text-white p-3 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:scale-110 transition-all duration-300 hidden sm:block"
                        aria-label="Next testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                </div>

                {/* Decorative Pagination Dots - Updated to Orange and Soft Green */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E85D04] shadow-sm transition-colors duration-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F3024]/20 hover:bg-[#0F3024]/40 transition-colors duration-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F3024]/20 hover:bg-[#0F3024]/40 transition-colors duration-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F3024]/20 hover:bg-[#0F3024]/40 transition-colors duration-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F3024]/20 hover:bg-[#0F3024]/40 transition-colors duration-300"></div>
                </div>

            </div>
        </section>
    );
}