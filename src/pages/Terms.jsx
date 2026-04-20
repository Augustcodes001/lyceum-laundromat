// import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Terms() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            {/* <Header /> */}

            {/* Dark Green Hero Section */}
            <div className="bg-[#0F3024] pt-28 pb-32 px-6 lg:px-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Terms of Service</h1>
                    <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[#E85D04]"></span>
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Floating Content Card */}
            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-24 relative z-20 flex-grow">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-14">

                    <div className="space-y-12 text-gray-600 leading-relaxed">

                        {/* Introduction */}
                        <div>
                            <p className="text-lg">
                                By accessing or using the <strong className="text-[#0F3024]">Lyceum Laundromat</strong> service, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access our services.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    1
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">Service Description</h2>
                            </div>
                            <p>
                                Lyceum Laundromat provides premium pickup, cleaning, and delivery services for garments and household items. We reserve the right to refuse service for items that we deem hazardous, overly soiled, infested, or unfit for our standard cleaning processes without risking damage to our equipment or other orders.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    2
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">Scheduling & Missed Pickups</h2>
                            </div>
                            <p>
                                Customers must ensure their garments are ready for collection during their selected time window. If our valet arrives and you are unavailable or the items are not left in the designated secure location, a missed pickup fee may apply to cover the logistical costs.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    3
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">Damaged or Lost Items</h2>
                            </div>
                            <p>
                                While we handle every garment with the utmost meticulous care, we recognize that accidents rarely happen. In the event of damage or loss caused by Lyceum, our liability is strictly limited to the industry standard, which is up to 10 times the cleaning cost of the specific item, subject to management review. We are not liable for pre-existing damage, normal wear and tear, or items left in pockets (e.g., pens, lipsticks).
                            </p>
                        </section>

                        {/* Contact Box */}
                        <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F3024] mb-1">Need clarification?</h3>
                                <p className="text-sm">Review our full policies or contact us directly.</p>
                            </div>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('openSupport'))}
                                className="inline-block bg-[#E85D04] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md"
                            >
                                Contact Support
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}