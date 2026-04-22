// src/components/Hero.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function PickupPill({ address, setAddress }) {
  return (
    <div className="inline-flex items-center bg-white rounded-full overflow-hidden shadow-[0_6px_32px_rgba(0,0,0,0.14)] border border-gray-100/80">
      <div className="flex flex-col px-5 py-3.5 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors select-none text-left">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0F3024]">Pickup</span>
        <span className="text-[15px] text-gray-500 mt-0.5 font-medium">Tonight</span>
      </div>
      <label className="flex items-center px-5 py-3.5 min-w-[170px] sm:min-w-[210px] cursor-text hover:bg-gray-50 transition-colors text-left">
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0F3024]">Where</span>
          <input
            type="text"
            placeholder="Add address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-[15px] text-gray-600 bg-transparent outline-none placeholder-gray-400 w-full mt-0.5 font-medium"
          />
        </div>
      </label>
      <Link
        to="/pricing"
        className="m-2 w-12 h-12 rounded-full bg-[#E85D04] hover:bg-orange-600 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-400/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

function SocialProof() {
  return (
    <div className="flex items-center flex-wrap gap-3 mt-7 mb-10 justify-center lg:justify-start">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className="w-[18px] h-[18px] text-[#E85D04] fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold text-[#0F3024]">4.9</span>
      <span className="text-sm text-gray-300">|</span>
      <span className="text-sm text-gray-500">500+ happy customers</span>
    </div>
  );
}

export default function Hero() {
  const [address, setAddress] = useState('');

  return (
    <section className="relative w-full overflow-hidden bg-white pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto">

        {/* Changed layout classes to stack cleanly on mobile/tablet, and split at lg */}
        <div className="relative flex flex-col lg:flex-row items-center px-6 lg:px-12 pt-8 pb-10 lg:pt-0  lg:pb-0 lg:min-h-[calc(100vh-76px)] gap-10 lg:gap-16">

          {/* IMAGE CONTAINER: Set strict heights on mobile so it never shrinks */}
          <div className="order-1 lg:order-none w-full flex items-center justify-center lg:flex-[1.3] h-[320px] sm:h-[450px] lg:h-auto ">
            <img src="/hero-on-brand.png" alt="Lyceum Laundromat" className="w-full h-full object-contain" />
          </div>

          {/* TEXT CONTAINER: Centered on mobile, left-aligned on desktop */}
          <div className="relative z-10 flex-shrink-0 w-full max-w-xl order-2 lg:order-none flex flex-col items-center text-center lg:items-start lg:text-left lg:ml-auto">

            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 bg-[#0F3024]/[0.07] text-[#0F3024] text-xs font-bold uppercase tracking-[0.1em]">
              <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse" />
              Now Delivering · Edo State
            </div>

            <h1 className="font-extrabold leading-[0.95] tracking-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.2rem)' }}>
              <span className="block text-[#0F3024]">WE'LL TAKE</span>
              <span className="block text-[#0F3024]">THE LAUNDRY.</span>
              <span className="block text-[#E85D04] mt-2 sm:mt-1">YOU KEEP</span>
              <span className="block text-[#E85D04]">THE TIME.</span>
            </h1>

            <p className="text-[1.1rem] md:text-[1.2rem] text-gray-600 leading-relaxed mb-8 max-w-[26rem]">
              Lyceum picks up, cleans, and delivers your laundry and dry cleaning — right to your door, <strong className="text-[#0F3024] font-semibold">after 72 hours.</strong>
            </p>

            <PickupPill address={address} setAddress={setAddress} />
            <SocialProof />
          </div>

        </div>
      </div>
    </section>
  );
}