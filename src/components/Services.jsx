import { useState } from 'react';

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const servicesData = [
    {
      id: "wash-up",
      title: "WASH UP",
      shortDesc: "Kitchen cleaning, dishes, and large pots.",
      longDesc: "Our comprehensive 'Wash Up' service tackles the heart of your home. We handle all kitchen cleaning needs, from soaking encrusted pots to scrubbing dishes so spotless they shine. Experience a flawlessly clean kitchen without lifting a finger.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-lyceum-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: "washing",
      title: "WASHING",
      shortDesc: "Laundry, ironing, and fabric care.",
      longDesc: "From delicate fabrics to heavy winter coats, our 'Washing' tier provides standard-setting laundry service. We utilize eco-friendly detergents in high-end front-loading washers, finishing every garment with a crisp iron for a sharp, flawless look.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-lyceum-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: "cleaning",
      title: "CLEANING",
      shortDesc: "Floors, vacuums, and general room chores.",
      longDesc: "Reclaim your weekend with our general 'Cleaning' service. We vacuum deep carpets, mop hard floors thoroughly, and cover standard household chores so you get to return to a completely refreshed, inviting environment every day.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-lyceum-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A4 4 0 002 9.259V18a2 2 0 002 2h16a2 2 0 002-2v-8.741a4 4 0 00-5.248-3.091z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="w-full bg-lyceum-light py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-lyceum-green tracking-tight">
            Our Core Services
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              {service.icon}
              <h3 className="text-2xl font-bold text-lyceum-green mb-3 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                {service.shortDesc}
              </p>

              <button
                onClick={() => setActiveService(service)}
                className="mt-auto bg-lyceum-orange hover:bg-orange-500 text-white font-bold text-sm tracking-widest uppercase py-3 px-6 rounded shadow transition-colors w-full"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal / Bottom Sheet */}
      {activeService && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in">
          {/* Dark Semi-transparent Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveService(null)}
          ></div>

          {/* Modal Container: Slide-up on Mobile, Centered on Desktop */}
          <div className="relative z-[101] bg-white w-full max-w-lg mx-auto sm:h-fit mt-auto md:mt-auto md:my-auto md:rounded-2xl rounded-t-3xl p-6 sm:p-8 flex flex-col shadow-2xl animate-slide-up md:animate-zoom-in">

            {/* Close Button */}
            <button
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-lyceum-green bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Body */}
            <h3 className="text-3xl font-bold text-lyceum-green mb-4 pr-10 uppercase tracking-tight">
              {activeService.title}
            </h3>

            {/* Illustration Placeholder */}
            <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl mb-6 flex items-center justify-center text-gray-400">
              <span className="text-sm font-medium">Illustration Placeholder</span>
            </div>

            {/* Detailed Description */}
            <div className="prose prose-sm text-gray-600 mb-8">
              <p className="leading-relaxed">
                {activeService.longDesc}
              </p>
            </div>

            {/* Action CTA */}
            <button className="w-full bg-lyceum-orange hover:bg-orange-500 text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl shadow-md transition-colors mt-auto">
              Schedule This Service
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
