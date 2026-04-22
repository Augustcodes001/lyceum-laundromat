import React, { useState, useEffect } from 'react';

// UPGRADED DATA: Premium Copywriting, Brand Colors, and 5-Star Reviews
const testimonialsData = [
  {
    id: 1,
    text: "Lyceum has completely changed my weekends. The dry cleaning is flawless, and the fact that I can track the valet arriving on my phone like a premium ride app is incredible. Unmatched service.",
    author: "Adesuwa E.",
    location: "GRA Phase 2",
    rating: 5,
  },
  {
    id: 2,
    text: "As a corporate lawyer, my suits need to be impeccably pressed. Their professional ironing service leaves my garments looking retail-ready every single time. It's the only service I trust with my wardrobe.",
    author: "David O.",
    location: "Peter Odili Road",
    rating: 5,
  },
  {
    id: 3,
    text: "I sent in a massive pile of heavy duvets and winter coats that my home machine couldn't handle. They came back smelling incredible, perfectly folded, and wrapped like gifts. Highly recommend!",
    author: "Chika M.",
    location: "Ada George",
    rating: 5,
  },
  {
    id: 4,
    text: "The sheer convenience of the secure handoff is amazing. I leave my laundry bag with my estate concierge, and Lyceum handles the rest. My clothes have never looked better or lasted longer.",
    author: "Dr. Nnamdi K.",
    location: "Trans Amadi",
    rating: 5,
  }
];

// Helper component for the 5 stars
const StarRating = () => (
  <div className="flex gap-1 mb-6">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#E85D04]">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);

  // Handle responsive sizing for the slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3); // lg
      } else if (window.innerWidth >= 640) {
        setCardsToShow(2); // sm
      } else {
        setCardsToShow(1); // mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonialsData.length - cardsToShow);

  return (
    <section id="reviews" className="w-full bg-slate-50 py-24 relative overflow-hidden border-t border-gray-100">

      {/* 🌟 UPGRADED: Cinematic Blended Background Image */}
      {/* 🌟 UPGRADED: Cinematic Blended Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/lyceum-wardrobe-testimonials.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
          aria-hidden="true"
        />
        {/* Modern blur overlay: keeps the image visible but softens it so text is readable */}
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[3px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 flex flex-col items-center">
          <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#E85D04]"></span>
            The Lyceum Standard
            <span className="w-8 h-[2px] bg-[#E85D04]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-[#0F3024] tracking-tight uppercase leading-[1.1]">
            What Our Clients Say
          </h3>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 px-3 sm:px-4"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                {/* Premium Card UI */}
                <div className="bg-white rounded-[32px] p-8 sm:p-10 h-full flex flex-col relative border border-gray-100 shadow-xl shadow-[#0F3024]/5 group hover:-translate-y-1 transition-all duration-300 overflow-hidden">

                  {/* Giant decorative background quote mark */}
                  <div className="absolute top-4 right-6 text-[#0F3024]/5 group-hover:text-[#E85D04]/5 transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex-grow flex flex-col">
                    <StarRating />

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed flex-grow font-medium mb-8">
                      "{testimonial.text}"
                    </p>

                    <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                      {/* Avatar Placeholder */}
                      <div className="w-12 h-12 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-lg">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F3024] text-sm uppercase tracking-wide">{testimonial.author}</p>
                        <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-0.5">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clickable Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-3 mt-12 sm:mt-16">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full h-2.5 ${currentIndex === index
                  ? 'w-10 bg-[#E85D04]' // Active state: Long orange pill
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400' // Inactive state: Small gray circle
                  }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}