import { useState } from 'react';

export default function Services({ onOpenAuth }) {
  const [activeService, setActiveService] = useState(null);

  const servicesData = [
    {
      id: "washing",
      title: "WASHING",
      shortDesc: "Clothes, duvets, rugs, pillows, and shoes cleaned with care.",
      longDesc: "Our dedicated 'Washing' service handles your heavy-duty laundry with ease. We specialize in cleaning bulky items that are too large or delicate for a standard home machine. From fluffy duvets and cozy center rugs to bed pillows and everyday shoes, we ensure every fiber is deeply cleaned and refreshed. Your items are returned fresh, clean, and ready to be put away.",
      image: "/washing-illustration.png", // 🌟 Drop your new image here
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0F3024] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: "ironing",
      title: "PROFESSIONAL IRONING",
      shortDesc: "Crisp, professional pressing for your ready-to-wear garments.",
      longDesc: "Experience the crisp perfection of our professional 'Ironing' service. We focus exclusively on pressing your garments to a pristine, retail-ready finish. Whether it’s a delicate silk blouse or a structured cotton dress shirt, our team uses industry-grade equipment to eliminate every crease and wrinkle. This service is ideal for clothes you have already washed at home but need that flawless, sharp look for the workweek or a special occasion.",
      image: "/ironing-illustration.png", // 🌟 Drop your new image here
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0F3024] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: "dry-cleaning",
      title: "DRY CLEANING",
      shortDesc: "Washing, expert stain removal, ironing, and neat packaging.",
      longDesc: "Choose our all-inclusive 'Dry Cleaning' experience for the ultimate fabric care package. This comprehensive solution combines three steps: professional washing to lift dirt, targeted stain removal for difficult spots, and expert ironing for a smooth finish. The experience is completed with our signature neat packaging—each garment is folded or hung with care, wrapped to prevent wrinkles, and delivered in a condition that means you can wear it straight away.",
      image: "/dry-cleaning-illustration.png", // 🌟 Drop your new image here
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0F3024] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A4 4 0 002 9.259V18a2 2 0 002 2h16a2 2 0 002-2v-8.741a4 4 0 00-5.248-3.091z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="w-full bg-[#0F3024]/[0.02] py-24 border-t border-[#0F3024]/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* 🌟 UPGRADED: Section Header to match About.jsx */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 flex flex-col items-center">
          <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#E85D04]"></span>
            What We Do
            <span className="w-8 h-[2px] bg-[#E85D04]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-[#0F3024] tracking-tight uppercase leading-[1.1]">
            Our Core Services
          </h3>
        </div>

        {/* 🌟 UPGRADED: 3-Column Grid with Hover Micro-Interactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:shadow-[#0F3024]/10 transition-all duration-500 border border-gray-100 hover:-translate-y-2"
            >
              {/* Animated Icon Circle */}
              <div className="w-20 h-20 rounded-full bg-[#0F3024]/5 group-hover:bg-[#0F3024] flex items-center justify-center mb-6 transition-colors duration-500">
                {service.icon}
              </div>

              <h3 className="text-2xl font-black text-[#0F3024] mb-4 uppercase tracking-wide">
                {service.title}
              </h3>

              <p className="text-gray-500 mb-10 text-sm leading-relaxed px-2">
                {service.shortDesc}
              </p>

              {/* Animated Read More Button */}
              <button
                onClick={() => setActiveService(service)}
                className="mt-auto flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#cc5203] text-white font-bold text-xs tracking-[0.2em] uppercase py-4 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all w-full active:scale-95 group/btn"
              >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 UPGRADED: Interactive Modal / Bottom Sheet */}
      {activeService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">

          {/* Dark Semi-transparent Overlay */}
          <div
            className="absolute inset-0 bg-[#0F3024]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveService(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative z-[101] bg-white w-full max-w-lg mx-auto h-[90vh] sm:h-auto sm:max-h-[90vh] mt-auto sm:mt-0 sm:rounded-[32px] rounded-t-[32px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 overflow-hidden">

            {/* Close Button (Floating over image) */}
            <button
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md text-[#0F3024] hover:bg-white hover:text-red-500 rounded-full p-2 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* High-End Edge-to-Edge Image Header */}
            <div className="w-full h-56 sm:h-64 bg-gray-200 relative">
              {/* Note: Until you add the real images, this acts as a gorgeous dark green placeholder 
                  Just make sure to replace the src={activeService.image} when ready!
               */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0F3024] to-[#1a4f3d]"></div>
              <img
                src={activeService.image}
                alt={activeService.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                onError={(e) => e.target.style.display = 'none'} // Hides broken image icon if no image exists yet
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8 pt-2 flex flex-col flex-1 overflow-y-auto">
              <h3 className="text-3xl font-black text-[#0F3024] mb-4 uppercase tracking-tight">
                {activeService.title}
              </h3>

              <div className="prose prose-sm text-gray-600 mb-8">
                <p className="leading-relaxed text-base">
                  {activeService.longDesc}
                </p>
              </div>

              {/* 🌟 UPGRADED: Action CTA triggers Auth Modal */}
              <button
                onClick={() => {
                  setActiveService(null);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="mt-auto flex items-center justify-center gap-2 w-full bg-[#0F3024] hover:bg-[#1a4f3d] text-white font-bold text-xs tracking-[0.2em] uppercase py-5 rounded-2xl shadow-xl shadow-[#0F3024]/30 transition-all active:scale-95 group/btn"
              >
                Schedule This Service
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}