// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-lyceum-green text-gray-300 pt-20 pb-8 border-t-[8px] border-lyceum-orange">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col">
            <div className="flex-shrink-0 cursor-pointer mb-3 ">
              <img
                src="/Lyceum-official-logo-white-bg.png"
                alt="Lyceum Laundromat Logo"
                className="h-12 md:h-16 w-auto object-contain rounded-full "
              />
            </div>
            <p className="text-sm leading-relaxed mb-6 font-medium text-gray-400">
              Premium laundry and cleaning services designed to give you your valuable time back. Operating proudly in Edo State.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram'].map((network, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-lyceum-orange transition-colors cursor-pointer text-white">
                  <span className="text-xs font-bold">{network[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (UPDATED WITH REAL LINKS) */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link to="/" className="hover:text-lyceum-orange transition-colors w-fit">Home</Link>
              <a href="/#about" className="hover:text-lyceum-orange transition-colors w-fit">About Us</a>
              <a href="/#delivery" className="hover:text-lyceum-orange transition-colors w-fit">Delivery Updates</a>
              <Link to="/pricing" className="hover:text-lyceum-orange transition-colors w-fit">Services & Pricing</Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-lyceum-orange flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Edo State, Nigeria</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-lyceum-orange flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-lyceum-orange flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@lyceumlaundromat.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Stay Updated</h4>
            <p className="text-sm font-medium text-gray-400 mb-4">
              Get the latest updates, promotions, and cleaning tips sent securely to your inbox.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lyceum-orange transition-colors"
              />
              <button className="w-full bg-lyceum-orange hover:bg-orange-500 text-white font-bold text-sm tracking-widest uppercase py-3 rounded-lg shadow-md transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-white-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Lyceum Laundromat. All rights reserved.</p>
          <div className="flex gap-6 list-none">
            <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-[#E85D04]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-sm text-gray-500 hover:text-[#E85D04]">Terms of Service</Link></li>
          </div>
        </div>

      </div>
    </footer>
  );
}