import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const handleOpenSupport = () => setIsOpen(true);
    window.addEventListener('openSupport', handleOpenSupport);

    return () => window.removeEventListener('openSupport', handleOpenSupport);
  }, []);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      // 1. Save to support_tickets
      await addDoc(collection(db, 'support_tickets'), {
        email,
        message,
        status: 'open',
        createdAt: serverTimestamp()
      });

      // 2. Send email via Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
          subject: "New Support Ticket from Lyceum App",
          from_name: "Lyceum Support Widget",
          email: email,
          message: message,
        }),
      });

      if (!response.ok) {
        console.error("Web3Forms delivery failed");
      }

      setStatusMessage('success');
      setEmail('');
      setMessage('');
      
      // Auto-close after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage('');
      }, 4000);

    } catch (error) {
      console.error("Error submitting support request: ", error);
      setStatusMessage('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-[140px] right-4 lg:bottom-8 lg:right-8 z-[200] flex flex-col items-end transition-all duration-300">
 
       {/* ── THE POPOVER MENU ── */}
       {isOpen && (
         <div className="w-[88vw] max-w-[340px] bg-white shadow-2xl rounded-2xl mb-4 overflow-hidden border border-gray-100 animate-slide-up origin-bottom-right">

          {/* Header */}
          <div className="bg-[#0F3024] text-white p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg leading-tight">We're here to help!</h3>
              <p className="text-gray-300 text-sm mt-1">Usually replies in minutes.</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/234XXXXXXXXXX" // <-- Replace with your actual Lyceum WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20b858] text-white py-3.5 rounded-xl font-bold shadow-md shadow-green-500/20 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.031 21.002a9.96 9.96 0 01-5.064-1.378l-.36-.214-3.744.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.485 4.461-9.948 9.942-9.948 2.658 0 5.158 1.035 7.037 2.915a9.92 9.92 0 012.914 7.031c-.004 5.488-4.466 9.948-9.953 9.948h-.025zm0-18.257c-4.582 0-8.312 3.73-8.316 8.314-.002 1.464.382 2.894 1.114 4.152l.243.42-1.2 4.39 4.495-1.18.411.244a8.28 8.28 0 004.254 1.168h.02c4.584 0 8.318-3.733 8.322-8.318.003-2.223-.86-4.312-2.43-5.882a8.27 8.27 0 00-5.892-2.43h-.021zm4.184 10.428c-.23-.115-1.357-.67-1.567-.746-.21-.077-.363-.116-.516.115-.152.23-.591.745-.724.898-.133.153-.267.172-.497.057-.23-.115-.968-.357-1.844-1.14-.682-.61-1.142-1.363-1.275-1.593-.133-.23-.014-.355.101-.47.103-.103.23-.269.345-.403.115-.134.153-.23.23-.384.077-.153.039-.287-.019-.403-.057-.115-.516-1.245-.707-1.704-.186-.447-.375-.387-.516-.394-.133-.006-.286-.008-.44-.008a.84.84 0 00-.612.287c-.21.23-.803.785-.803 1.916 0 1.131.823 2.226.938 2.379.115.153 1.623 2.477 3.931 3.473.55.237 1.054.408 1.488.528.552.176 1.054.15 1.45.092.443-.066 1.357-.555 1.548-1.092.191-.536.191-.994.133-1.091-.057-.097-.21-.154-.44-.269z" />
              </svg>
              Chat on WhatsApp
            </a>

            {/* Custom Divider */}
            <div className="flex items-center gap-3 text-gray-400 text-xs font-semibold tracking-wider">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span>OR SEND AN EMAIL</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Email Form */}
            <form className="flex flex-col gap-3" onSubmit={handleSupportSubmit}>
              {statusMessage === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm text-center">
                  Message sent successfully! We'll be in touch.
                </div>
              )}
              {statusMessage === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm text-center">
                  Failed to send message. Please try again.
                </div>
              )}
              
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3024] focus:border-transparent transition-all disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
              <textarea
                placeholder="How can we help you?"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3024] focus:border-transparent resize-none transition-all disabled:opacity-50"
                required
                disabled={isSubmitting}
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E85D04] hover:bg-[#d45203] text-white py-3 rounded-lg font-bold text-sm transition-colors mt-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ── THE FLOATING ACTION BUTTON (FAB) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-[#E85D04]' : 'bg-[#0F3024]'}`}
      >
        {isOpen ? (
          /* Close Icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Support Bubble Icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

    </div>
  );
}