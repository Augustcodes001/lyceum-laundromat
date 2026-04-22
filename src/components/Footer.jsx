// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {

  // 🌟 UPGRADED: Perfectly synced with SocialFollowModal.jsx icons and links!
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/lyceumlaundromat1/',
      color: 'hover:bg-[#E85D04]', // Lyceum Orange on hover
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/07085004780',
      color: 'hover:bg-[#25D366]', // Classic WhatsApp Green on hover (you can change this to '#0F3024' or '#E85D04' if you prefer strict brand colors)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@lyceumlaundromat?_r=1&_t=ZS-95YHPVIlYCG',
      color: 'hover:bg-[#E85D04]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    },
    {
      name: 'Email Us',
      href: 'mailto:lyceumlaundromat@gmail.com',
      color: 'hover:bg-[#0F3024]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#0F3024] text-gray-300 pt-20 pb-8 relative overflow-hidden border-t border-white/10">

      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E85D04] to-transparent opacity-50"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col">
            <div className="flex-shrink-0 cursor-pointer mb-6">
              <img
                src="/Lyceum-official-logo-white-bg.png"
                alt="Lyceum Laundromat Logo"
                className="h-12 w-auto object-contain rounded-full border border-white/10 shadow-lg"
              />
            </div>
            <p className="text-sm leading-relaxed mb-8 font-medium text-gray-400 pr-4">
              Premium laundry and cleaning services designed to give you your valuable time back. Operating proudly in Edo State.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((network, i) => (
                <a
                  key={i}
                  href={network.href}
                  aria-label={network.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E85D04] hover:border-[#E85D04] transition-all duration-300 cursor-pointer text-white hover:-translate-y-1 shadow-sm"
                >
                  {network.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
              <span className="w-4 h-[2px] bg-[#E85D04]"></span>
              Quick Links
            </h4>
            <nav className="flex flex-col gap-4 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-[#E85D04] hover:translate-x-1 transition-all duration-300 w-fit">Home</Link>
              <a href="/#about" className="hover:text-[#E85D04] hover:translate-x-1 transition-all duration-300 w-fit">About Us</a>
              <a href="/#delivery" className="hover:text-[#E85D04] hover:translate-x-1 transition-all duration-300 w-fit">Delivery Updates</a>
              <Link to="/pricing" className="hover:text-[#E85D04] hover:translate-x-1 transition-all duration-300 w-fit">Services & Pricing</Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
              <span className="w-4 h-[2px] bg-[#E85D04]"></span>
              Contact Us
            </h4>
            <ul className="flex flex-col gap-5 text-sm font-medium text-gray-400">
              <li className="flex gap-4 items-start group">
                <svg className="w-5 h-5 text-[#E85D04] flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>No. 4 Edo lane, off Edo street, Ekosodin, Ugbowo, Edo state.</span>
              </li>
              <li className="flex gap-4 items-center group">
                <svg className="w-5 h-5 text-[#E85D04] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+234 708 500 4780</span>
              </li>
              <li className="flex gap-4 items-center group">
                <svg className="w-5 h-5 text-[#E85D04] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:hello@lyceumlaundromat.com" className="hover:text-white transition-colors">lyceumlaundromat@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
              <span className="w-4 h-[2px] bg-[#E85D04]"></span>
              Stay Updated
            </h4>
            <p className="text-sm font-medium text-gray-400 mb-6">
              Get the latest updates, promotions, and cleaning tips sent securely to your inbox.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#E85D04] focus:bg-white/10 transition-all duration-300 placeholder-gray-500"
              />
              <button className="w-full bg-[#E85D04] hover:bg-[#cc5203] text-white font-bold text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 active:scale-95">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-gray-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Lyceum Laundromat. All rights reserved.</p>
          <div className="flex gap-8 list-none">
            <li><Link to="/privacy" className="hover:text-[#E85D04] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#E85D04] transition-colors">Terms of Service</Link></li>
          </div>
        </div>

      </div>
    </footer>
  );
}