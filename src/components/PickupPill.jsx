// src/components/PickupPill.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // 🌟 Import your Firebase auth!

export default function PickupPill({ onOpenAuth }) {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  // Remember previously typed address
  useEffect(() => {
    const savedAddress = localStorage.getItem('lyceum_pickup_address');
    if (savedAddress) setAddress(savedAddress);
  }, []);

  const handleStartBooking = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter a pickup address first.");
      return;
    }

    // 1. Save the address temporarily
    localStorage.setItem('lyceum_pickup_address', address);

    // 2. The Smart Routing Logic
    if (auth.currentUser) {
      // User is already logged in? Send them straight to booking!
      navigate('/orders'); // Change to '/cart' depending on your app
    } else {
      // Not logged in? Open the central Auth Modal and tell it where to go after!
      if (onOpenAuth) {
        onOpenAuth('/orders'); // Change to '/cart' depending on your app
      }
    }
  };

  return (
    <form onSubmit={handleStartBooking} className="inline-flex items-center bg-white rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-200 h-10 md:h-16 w-auto max-w-xl">
      {/* ... Your exact inputs and button UI from before ... */}
      <div className="flex flex-col px-4 md:px-6 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors select-none h-auto justify-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#0F3024] leading-none mb-1">Pickup</span>
        <span className="text-[13px] md:text-[14px] text-gray-500 font-medium leading-none whitespace-nowrap">Tonight</span>
      </div>
      <label className="flex items-center px-4 md:px-6 min-w-[150px] md:min-w-[200px] cursor-text hover:bg-gray-50 transition-colors h-full flex-grow">
        <div className="flex flex-col w-auto h-auto justify-center">
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#0F3024] leading-none mb-1.5">Where</span>
          <input
            type="text"
            placeholder="Add address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-[13px] md:text-[14px] text-gray-800 bg-transparent outline-none placeholder-gray-400 w-full font-medium leading-none p-0 border-0 focus:ring-0"
          />
        </div>
      </label>
      <button type="submit" className="mr-1.5 md:mr-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E85D04] hover:bg-[#d65503] flex items-center justify-center flex-shrink-0 transition-colors shadow-md active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </form>
  );
}