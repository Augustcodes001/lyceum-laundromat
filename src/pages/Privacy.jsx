// import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Privacy() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            {/* <Header /> */}

            {/* Dark Green Hero Section */}
            <div className="bg-[#0F3024] pt-28 pb-32 px-6 lg:px-12 text-center relative overflow-hidden">
                {/* Subtle background pattern/gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Privacy Policy</h1>
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
                                At <strong className="text-[#0F3024]">Lyceum Laundromat</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website and mobile applications.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    1
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">Information We Collect</h2>
                            </div>
                            <p className="mb-4">We collect information that helps us deliver your laundry securely and effectively. This includes:</p>
                            <ul className="list-none space-y-3 pl-12 relative before:absolute before:left-[1.9rem] before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                                <li className="relative before:absolute before:-left-[1.35rem] before:top-2.5 before:w-2 before:h-2 before:bg-[#E85D04] before:rounded-full">
                                    <strong className="text-[#0F3024]">Personal Details:</strong> Your name, delivery address, and phone number when scheduling a pickup.
                                </li>
                                <li className="relative before:absolute before:-left-[1.35rem] before:top-2.5 before:w-2 before:h-2 before:bg-[#E85D04] before:rounded-full">
                                    <strong className="text-[#0F3024]">Payment Information:</strong> Processed securely via our third-party payment gateways.
                                </li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    2
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">How We Use Your Information</h2>
                            </div>
                            <p>
                                We use your information exclusively to provide, maintain, and improve our services. Your address is used to route our valets efficiently, and your phone number is utilized to send real-time ETA alerts and order updates. We will never sell your personal data to third parties.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0F3024]/10 flex items-center justify-center text-[#0F3024] font-bold text-sm">
                                    3
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F3024]">Data Security</h2>
                            </div>
                            <p>
                                We implement strict industry-standard security measures to protect your personal information from unauthorized access. While no method of transmission over the internet is 100% secure, we continuously update our protocols to ensure the highest level of safety for your data.
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