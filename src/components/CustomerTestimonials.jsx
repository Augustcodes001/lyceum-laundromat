import React, { useState, useEffect } from 'react';

const testimonialsData = [
  {
    id: 1,
    bgColor: '#FEF0E6',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#F6921E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 16h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
    ),
    text: (
      <>
        I've used Lyceum in every city I've lived in and I am OBSESSED.
        <br /><br />
        It's so convenient, whatever detergent they use smell amazing, and <span className="font-bold">all of my delivery people have been so friendly.</span>
        <br /><br />
        Highly recommend!
      </>
    ),
    author: null,
    location: null
  },
  {
    id: 2,
    bgColor: '#DEF2FF',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v20"/><path d="M14 8h.01"/><path d="M10 8h.01"/><path d="M14 12h.01"/><path d="M10 12h.01"/><path d="M14 16h.01"/><path d="M10 16h.01"/><path d="M10 22v-4h4v4"/></svg>
    ),
    text: (
      <>
        <span className="font-bold">Lyceum is the best luxury item I ever gave myself.</span> No more up & down the elevator doing loads and loads of laundry.
        <br /><br />
        I simply fill my bag and they pick it up and bring it back the next day. The bag literally is about 3 loads of my laundry. <span className="font-bold">Everything comes back clean, smelling fresh and folded nicely.</span>
      </>
    ),
    author: 'Tanya B.',
    location: 'San Francisco'
  },
  {
    id: 3,
    bgColor: '#E6F4C4',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#52796F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="2" ry="2"/><path d="M3 8h18"/><circle cx="12" cy="15" r="4"/><path d="M16 5h.01"/><path d="M18 5h.01"/></svg>
    ),
    text: (
      <>
        <span className="font-bold">I nominate Lyceum for community service greatness.</span> They transform my dirty clothes and return them clean, folded and smelling great.
        <br /><br />
        Keep up the good work. Their professionalism and service deserves an applause and recognition.
      </>
    ),
    author: 'Ronnie Y.',
    location: 'New York'
  },
  {
    id: 4,
    bgColor: '#FFD9DC',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D77A84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    text: (
      <>
        This service is amazing.
        <br /><br />
        <span className="font-bold">I put my laundry in a bag on my front porch one night and it's back there cleaned and folded the next night.</span>
        <br /><br />
        It's magic and worth the cost!
      </>
    ),
    author: 'David D.',
    location: 'San Francisco'
  }
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Determine how many cards to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Tablet: 2 cards
      } else {
        setItemsPerView(3); // Desktop: 3 cards (so the 4th one can slide in!)
      }
    };

    handleResize(); // Set initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the maximum index we can slide to
  const maxIndex = Math.max(0, testimonialsData.length - itemsPerView);

  // Auto-slide effect
  useEffect(() => {
    if (isHovered || maxIndex === 0) return; // Pause on hover or if no overflow

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 4000); // Slides every 4 seconds

    return () => clearInterval(interval);
  }, [maxIndex, isHovered]);

  return (
    <section className="py-24 relative bg-[#FAF9F6] overflow-hidden">
      {/* Background illustration — same technique as Testimonials */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          backgroundImage: "url('/image-grid-illustration.jpg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top',
          opacity: 0.18,
        }}
      />
      {/* Mobile-specific background: full cover so it still adds texture on small screens */}
      <div
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          backgroundImage: "url('/image-grid-illustration.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          opacity: 0.10,
        }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#01411C] tracking-tight">
            Hear from customers like you:
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Moving Track */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` 
            }}
          >
            {testimonialsData.map((testimonial) => (
              // Each Card Wrapper
              <div 
                key={testimonial.id} 
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div 
                  className="rounded-3xl p-8 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: testimonial.bgColor }}
                >
                  <div className="h-32 flex items-center justify-center mb-6 bg-white/40 rounded-2xl">
                    {testimonial.icon}
                  </div>

                  <div className="mb-4">
                    <svg className="w-10 h-10 text-black/10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <p className="text-gray-800 text-[1.05rem] leading-relaxed flex-grow">
                    {testimonial.text}
                  </p>

                  {testimonial.author && (
                    <div className="mt-8 pt-6 border-t border-black/10">
                      <p className="font-bold text-[#01411C]">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clickable Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index 
                    ? 'w-8 h-3 bg-[#01411C]' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}