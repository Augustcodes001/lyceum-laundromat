// src/components/Hero.jsx
import PickupPill from './PickupPill'; // 🌟 Import shared PickupPill

function SocialProof() {
  return (
    <div className="flex items-center flex-wrap gap-3 mt-0 mb-10 justify-center lg:justify-start">
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

export default function Hero({ onOpenAuth }) {   // 🌟 Accept onOpenAuth prop
  return (
    <section className="relative w-full overflow-hidden bg-white pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto">

        {/* Changed layout classes to stack cleanly on mobile/tablet, and split at lg */}
        <div className="relative flex flex-col lg:flex-row items-center px-6 lg:px-12 pt-8 pb-10 lg:pt-0 lg:pb-0 lg:min-h-[calc(100vh-76px)] gap-10 lg:gap-16">

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

            {/* 🌟 Use shared PickupPill with onOpenAuth prop */}
            {/* <PickupPill onOpenAuth={onOpenAuth} /> */}
            <SocialProof />
          </div>

        </div>
      </div>
    </section>
  );
}