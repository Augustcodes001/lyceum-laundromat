import { useState } from 'react';
import SocialFollowModal from './SocialFollowModal';

export default function About() {
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  // ... existing trustPoints ...

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

              <img src="/Lyceum-about-illustration.png" alt="Lyceum Laundromat" className="w-full h-full object-cover" />


              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Right Column: Trust Content */}
          <div className="flex flex-col justify-center">
            {/* Pre-Heading */}
            <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#E85D04]"></span>
              About Lyceum
            </h2>

            {/* Main Headline */}
            <h3 className="text-4xl md:text-5xl font-black text-[#0F3024] leading-[1.15] mb-6 tracking-tight">
              Premium Care for <br className="hidden lg:block" /> Your Everyday Chores.
            </h3>

            {/* Mission Paragraph */}
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              We understand that your time is your most valuable asset. Our mission is to give you that time back by handling your laundry and cleaning with uncompromising quality and absolute reliability.
            </p>

            {/* 🌟 UPGRADED: 2x2 Trust Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-12">
              {trustPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-[#0F3024]/10 flex items-center justify-center group-hover:bg-[#E85D04]/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#0F3024] group-hover:text-[#E85D04] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold text-base leading-tight mt-1">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* 🌟 UPGRADED: Button Group with Micro-interactions */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Primary CTA */}
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 bg-[#E85D04] hover:bg-[#cc5203] text-white font-bold text-sm tracking-widest uppercase py-4 px-8 rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Secondary Interactive Connect CTA */}
              <button
                onClick={() => setIsSocialModalOpen(true)}
                className="bg-transparent border-2 border-[#0F3024] text-[#0F3024] hover:bg-[#0F3024] hover:text-white font-bold text-sm tracking-widest uppercase py-3.5 px-8 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Connect With Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Social Media Pop-Up Modal */}
      <SocialFollowModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />
    </section>
  );
}
