import { useState } from 'react';

export default function PickupPill() {
  const [address, setAddress] = useState('');
  return (
    <div className="inline-flex items-center bg-white rounded-full overflow-hidden shadow-[0_6px_32px_rgba(0,0,0,0.14)] border border-gray-100/80">
      <div className="flex flex-col px-5 py-3.5 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors select-none">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0F3024]">Pickup</span>
        <span className="text-[15px] text-gray-500 mt-0.5 font-medium">Tonight</span>
      </div>
      <label className="flex items-center px-5 py-3.5 min-w-[170px] sm:min-w-[210px] cursor-text hover:bg-gray-50 transition-colors">
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
      <button className="m-2 w-12 h-12 rounded-full bg-[#E85D04] hover:bg-orange-600 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}