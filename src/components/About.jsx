import { useState } from 'react';

export default function About() {
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const trustPoints = [
    "Meticulous attention to detail",
    "Eco-friendly cleaning supplies",
    "Swift & secure delivery",
    "Customer satisfaction guarantee"
  ];

  return (
    <section id="about" className="w-full bg-slate-50 py-24 border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visual Placeholder */}
          <div className="w-full">
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl shadow-md flex items-center justify-center relative overflow-hidden group">
              <span className="text-gray-400 font-medium tracking-wide">
                Lifestyle Image Placeholder
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Right Column: Trust Content */}
          <div className="flex flex-col justify-center">
            {/* Pre-Heading */}
            <h2 className="text-sm font-bold tracking-widest text-lyceum-orange uppercase mb-4">
              About Lyceum
            </h2>
            
            {/* Main Headline */}
            <h3 className="text-4xl md:text-5xl font-extrabold text-lyceum-green leading-[1.15] mb-6 tracking-tight">
              Premium Care for Your Everyday Chores.
            </h3>
            
            {/* Mission Paragraph */}
            <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
              We understand that your time is your most valuable asset. Our mission is to give you that time back by handling your laundry and cleaning with uncompromising quality and absolute reliability.
            </p>
            
            {/* Trust Indicators */}
            <ul className="space-y-4 mb-12">
              {trustPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-lyceum-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-bold text-lg">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* Button Group */}
            <div className="flex flex-wrap gap-4">
               {/* Primary CTA */}
               <button 
                 onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                 className="bg-lyceum-orange hover:bg-orange-500 text-white font-bold text-sm tracking-widest uppercase py-3.5 px-8 rounded shadow-sm hover:shadow-md transition-all duration-300"
               >
                 Learn More
               </button>
               {/* Secondary Interactive Connect CTA */}
               <button 
                 onClick={() => setIsSocialModalOpen(true)}
                 className="bg-transparent border-2 border-lyceum-green text-lyceum-green hover:bg-lyceum-green hover:text-white font-bold text-sm tracking-widest uppercase py-3.5 px-8 rounded transition-all duration-300"
               >
                 Connect With Us
               </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Social Media Pop-Up Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center p-6">
          {/* Subtle Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSocialModalOpen(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative z-10 bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl animate-zoom-in text-center">
            
            {/* Top-Right Close Button */}
            <button 
              onClick={() => setIsSocialModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-extrabold text-lyceum-green mb-8 mt-2 uppercase tracking-tight">
              Follow Lyceum
            </h3>

            {/* Interactive Social Icon Row */}
            <div className="flex justify-center items-center gap-6 mb-2">
              
              {/* Instagram Placeholder SVG */}
              <a href="#" className="text-lyceum-green hover:text-lyceum-orange hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Twitter/X Placeholder SVG */}
              <a href="#" className="text-lyceum-green hover:text-lyceum-orange hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </a>

              {/* Facebook Placeholder SVG */}
              <a href="#" className="text-lyceum-green hover:text-lyceum-orange hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* LinkedIn Placeholder SVG */}
              <a href="#" className="text-lyceum-green hover:text-lyceum-orange hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
