// src/pages/ServicesPricing.jsx
import { useState, useEffect } from 'react';
// import Header from '../components/Header';
import Footer from '../components/Footer';

// Inline PickupPill
const PickupPill = () => {
    const [address, setAddress] = useState('');
    return (
        <div className="inline-flex items-center bg-white rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-200">
            <div className="flex flex-col px-6 py-3 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F3024]">Pickup</span>
                <span className="text-[14px] text-gray-500 font-medium">Tonight</span>
            </div>
            <label className="flex items-center px-6 py-3 min-w-[200px] cursor-text hover:bg-gray-50 transition-colors">
                <div className="flex flex-col w-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F3024]">Where</span>
                    <input
                        type="text"
                        placeholder="Add address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="text-[14px] text-gray-800 bg-transparent outline-none placeholder-gray-400 w-full font-medium"
                    />
                </div>
            </label>
            <button className="m-1.5 w-11 h-11 rounded-full bg-[#E85D04] hover:bg-[#d65503] flex items-center justify-center flex-shrink-0 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    );
};

const services = [
    {
        id: 'wash-fold',
        name: 'Wash & Fold',
        icon: '🎒',
        tagline: 'Built for people who don\'t waste time on chores that don\'t move them forward.',
        description: 'We pick up your laundry, clean it with care using a dedicated machine, and return everything neatly folded – right down to pairing your socks.\n\nClothes are washed to your preferences and delivered on your schedule, so you can focus on what matters most.\n\nLet us take laundry off your to-do list – permanently.',
        howItWorks: [
            {
                title: 'We inspect your clothes and check your pockets',
                desc: 'We do "pocket inspections" for you so nothing ends up in the wash that shouldn\'t. All pockets and clothes are inspected before being washed.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            },
            {
                title: 'We clean your items with extra care',
                desc: 'Your lights and darks are separated and all your clothes are washed using cold water to preserve color (and save energy).',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            },
            {
                title: 'We wash your loads according to your choices',
                desc: 'Need hypoallergenic detergent? Want fabric softener? Just select the laundry preferences that are right for you.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            },
            {
                title: 'We fold everything so that you don\'t have to',
                desc: 'Your clothes are crisply folded, and your socks are paired, ready to be worn or put away when we deliver your clothes to your door!',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            },
        ],
        pricing: {
            payAsYouGo: {
                subtitle: 'Occasional, priced per pound.',
                price: '$3.49 / lb',
                prefix: 'Always',
                features: [
                    '$9.95 Pickup & Delivery Fee',
                    '3-4 Day Turnaround or $9.95 Next-Day Rush',
                    '$5 Service Fee',
                    'Household items priced separately',
                ],
            },
            subscription: {
                subtitle: 'All-inclusive subscription, priced per bag.',
                price: '$1.64 / lb',
                prefix: 'As low as*',
                features: [
                    'Free Pickup & Delivery',
                    'Free Next-Day Rush Service',
                    'Waived Service Fee',
                    'If it fits the bag, we\'ll clean it',
                    'Unlimited rollover of bags and pounds',
                    '$10 in monthly credit for other services',
                ],
            },
        },
        fees: [
            { title: 'Service Fee', price: '$5', desc: 'It helps cover our operational costs and ensure we can provide the best experience possible.' },
            { title: 'Pickup & Delivery', price: '$9.95', desc: 'This covers the cost of both picking up and delivering your orders. All Valets are trained W-2 employees.', freeSub: true },
            { title: 'Next-Day Rush Service', price: '$9.95', desc: 'Get your Wash & Fold and Hang Dry orders back in 24 hours.', freeSub: true },
            { title: 'Minimum order', price: '', desc: 'All orders have a $30 order minimum.', freeSub: true },
        ],
        pickupDetails: {
            text: 'All pickups and deliveries are between 7pm and 10pm. At 5:30pm, we’ll text you a 30‑minute arrival window of your Valet.',
            subtext: 'After creating your account, activate Lyceum Drop for contact-free pickup and delivery. Our Valet will pick up and deliver your order to your doorstep, building reception, or another place of your choosing.',
        }
    },
    {
        id: 'dry-cleaning',
        name: 'Dry Cleaning',
        icon: '👔',
        tagline: 'Expert care for your everyday and special garments.',
        description: 'We use a customized cleaning process designed to protect and extend the life of your garments. From inspecting garments for stains to choosing the optimal cleaning solvent to hand finishing, your items will be expertly cleaned and ready to wear.',
        howItWorks: [
            {
                title: 'We inspect your clothes',
                desc: 'Your clothes are inspected for stains and necessary repairs.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z m7.5 0c-.918-3.1-3.627-5.5-7.5-5.5S8.418 8.9 7.5 12c.918 3.1 3.627 5.5 7.5 5.5s6.582-2.4 7.5-5.5z" />
            },
            {
                title: 'We pre-treat your stains',
                desc: 'Spots and stains are pre-treated.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            },
            {
                title: 'We wash your clothes with care',
                desc: 'Your garments are cleaned using the optimal solvent and drying method.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            },
            {
                title: 'We hand press your clothes',
                desc: 'Your garments are pressed by hand and returned on a hanger.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            }
        ],
        pricing: {
            items: [
                { name: 'Laundered & Pressed Shirt', price: '$3.95', img: 'https://img.icons8.com/color/96/shirt.png' },
                { name: 'Dress Shirt (Dry Cleaned)', price: '$8.45', img: 'https://img.icons8.com/color/96/clothes.png' },
                { name: 'Polo/Knit Shirt', price: '$7.45', img: 'https://img.icons8.com/color/96/t-shirt.png' },
                { name: 'T-shirt', price: '$6.45', img: 'https://img.icons8.com/color/96/t-shirt--v1.png' },
                { name: 'Blouse', price: '$8.45', img: 'https://img.icons8.com/color/96/womens-shirt.png' },
                { name: 'Pants', price: '$8.95', img: 'https://img.icons8.com/color/96/trousers.png' },
                { name: 'Shorts', price: '$8.45', img: 'https://img.icons8.com/color/96/shorts.png' },
                { name: 'Sweater', price: '$9.45', img: 'https://img.icons8.com/color/96/sweater.png' },
                { name: 'Dress', price: '$16.95', img: 'https://img.icons8.com/color/96/dress-front-view.png' },
                { name: 'Skirt', price: '$8.95', img: 'https://img.icons8.com/color/96/skirt.png' },
                { name: 'Blazer/Sport Coat', price: '$10.95', img: 'https://img.icons8.com/color/96/jacket.png' },
                { name: 'Suit', price: '$18.95', img: 'https://img.icons8.com/color/96/business-suit.png' },
                { name: 'Tie', price: '$6.95', img: 'https://img.icons8.com/color/96/tie.png' },
            ]
        },
        fees: [
            { title: 'Service Fee', price: '$5', desc: 'It helps cover our operational costs and ensure we can provide the best experience possible.' },
            { title: 'Pickup & Delivery', price: '$9.95', desc: 'This covers the cost of both picking up and delivering your orders. All Valets are W-2 employees.', freeSub: true },
            { title: 'Minimum order', price: '', desc: 'All orders have a $30 order minimum.', freeSub: true }
        ],
        pickupDetails: {
            text: 'All pickups and deliveries are between 8pm and 10pm. At 7:30pm, we’ll text you a 30‑minute arrival window of your Valet.',
            subtext: 'After creating your account, activate Lyceum Drop for contact-free pickup and delivery. Our Valet will pick up and deliver your order to your doorstep, building reception, or another place of your choosing.'
        }
    },
    {
        id: 'hang-dry',
        name: 'Hang Dry',
        icon: '👗',
        tagline: 'Air-dried freshness for your delicates.',
        description: 'We pick up your delicates, clean them with care using cold water, and hang them to dry in a climate-controlled environment to protect their shape and fit.\n\nClothes are washed to your preferences and delivered on your schedule, so you can focus on what matters most.\n\nLet us take laundry off your to-do list - permanently.',
        howItWorks: [
            {
                title: 'We inspect your clothes and check your pockets',
                desc: 'We do "pocket inspections" for you so nothing ends up in the wash that shouldn\'t. All pockets and clothes are inspected before being washed.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            },
            {
                title: 'We clean your items with extra care',
                desc: 'Your lights and darks are separated and all your clothes are washed using cold water to preserve color (and save energy).',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            },
            {
                title: 'We wash your loads according to your choices',
                desc: 'Need hypoallergenic detergent? Want fabric softener? Just select the laundry preferences that are right for you.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            },
            {
                title: 'We hang everything so that you don\'t have to',
                desc: 'Your clothes are carefully hung to dry in a climate-controlled environment, then returned to you on hangers so they\'re ready to be put away.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            }
        ],
        pricing: {
            items: [
                { name: 'Hang Dry Shirt', price: '$3.95', img: 'https://img.icons8.com/color/96/shirt.png' },
                { name: 'Hang Dry Blouse', price: '$8.45', img: 'https://img.icons8.com/color/96/womens-shirt.png' },
                { name: 'Hang Dry Pants', price: '$8.95', img: 'https://img.icons8.com/color/96/trousers.png' },
                { name: 'Hang Dry T-shirt', price: '$6.45', img: 'https://img.icons8.com/color/96/t-shirt--v1.png' },
                { name: 'Hang Dry Dress', price: '$16.95', img: 'https://img.icons8.com/color/96/dress-front-view.png' },
                { name: 'Hang Dry Skirt', price: '$8.95', img: 'https://img.icons8.com/color/96/skirt.png' },
                { name: 'Hang Dry Sweater', price: '$9.45', img: 'https://img.icons8.com/color/96/sweater.png' },
                { name: 'Hang Dry Shorts', price: '$8.45', img: 'https://img.icons8.com/color/96/shorts.png' },
            ]
        },
        fees: [
            { title: 'Service Fee', price: '$5', desc: 'It helps cover our operational costs and ensure we can provide the best experience possible.' },
            { title: 'Pickup & Delivery', price: '$9.95', desc: 'This covers the cost of both picking up and delivering your orders. All Valets are W-2 employees.', freeSub: true },
            { title: 'Next-Day Rush Service', price: '$9.95', desc: 'Get your Wash & Fold and Hang Dry orders back in 24 hours.', freeSub: true },
            { title: 'Minimum order', price: '', desc: 'All orders have a $30 order minimum.', freeSub: true }
        ],
        pickupDetails: {
            text: 'All pickups and deliveries are between 8pm and 10pm. At 7:30pm, we’ll text you a 30‑minute arrival window of your Valet.',
            subtext: 'After creating your account, activate Lyceum Drop for contact-free pickup and delivery. Our Valet will pick up and deliver your order to your doorstep, building reception, or another place of your choosing.'
        }
    },
];

const ServiceToggle = ({ activeService, setActiveService }) => (
    <div className="sticky top-[72px] z-30 bg-[#F6F8F7]/95 backdrop-blur-md py-4 border-b border-gray-200/50 flex justify-center">
        <div className="inline-flex bg-white p-1 rounded-full shadow-sm border border-gray-200">
            {services.map((service) => (
                <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeService === service.id
                            ? 'bg-[#fef3c7] text-[#0F3024] shadow-sm border border-yellow-600/20'
                            : 'text-gray-500 hover:text-[#0F3024] hover:bg-gray-50'
                        }`}
                >
                    <span className="uppercase">{service.name}</span>
                    <span className="text-lg">{service.icon}</span>
                </button>
            ))}
        </div>
    </div>
);

export default function ServicesPricing() {
    const [activeServiceId, setActiveServiceId] = useState('wash-fold');
    const [showAllPricing, setShowAllPricing] = useState(false);
    const activeService = services.find((s) => s.id === activeServiceId);

    // Reset the "Show All" toggle whenever a new category is selected
    useEffect(() => {
        setShowAllPricing(false);
    }, [activeServiceId]);

    return (
        <div className="bg-[#F6F8F7] min-h-screen">
            {/* <Header /> */}

            {/* HERO SECTION */}
            <div id = "services" className="relative w-full h-[500px] md:h-[600px] bg-[#0F3024] overflow-hidden">
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-2xl uppercase">
                                We'll take the laundry.<br />
                                <span className="text-[#E85D04]">You take the time.</span>
                            </h1>
                            <div className="mt-12">
                                <PickupPill />
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center h-full">
                            <div className="w-3/4 h-3/4 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center bg-white/5">
                                <span className="text-white/50 font-bold tracking-widest uppercase">[ Hero Illustration Here ]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY TOGGLE */}
            <ServiceToggle activeService={activeServiceId} setActiveService={setActiveServiceId} />

            <main className="pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">

                    {/* INTRO SPLIT SECTION */}
                    {activeService.description && (
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F3024] mb-8">{activeService.name}</h2>
                                <div className="space-y-6 text-lg text-gray-700 font-medium whitespace-pre-line">
                                    <p className="font-semibold text-gray-900">{activeService.tagline}</p>
                                    <p>{activeService.description}</p>
                                </div>
                                <div className="mt-10">
                                    <PickupPill />
                                </div>
                            </div>

                            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-[#e2e8f0]/50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <span className="text-gray-400 font-bold tracking-widest uppercase text-center px-4">
                                    [ Insert "{activeService.name}" Illustration Here ]
                                </span>
                            </div>
                        </div>
                    )}

                    {/* HOW IT WORKS */}
                    {activeService.howItWorks && activeService.howItWorks.length > 0 && (
                        <div className="py-16 border-t border-gray-200">
                            <h2 className="text-4xl font-extrabold text-[#0F3024] mb-4">How it works</h2>
                            <p className="text-lg text-gray-600 mb-12 max-w-4xl">
                                Lyceum will pick up your laundry, clean it according to best practices and your preferences, and deliver it back neatly folded—right to your door.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                {activeService.howItWorks.map((step, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <div className="flex items-center mb-6">
                                            <div className="w-14 h-14 rounded-2xl border-2 border-[#0F3024] flex items-center justify-center flex-shrink-0 bg-white">
                                                <svg className="w-6 h-6 text-[#0F3024]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    {step.icon}
                                                </svg>
                                            </div>
                                            {idx < activeService.howItWorks.length - 1 && (
                                                <div className="hidden lg:block h-[2px] bg-gray-200 flex-1 ml-4 mr-[-20px] relative">
                                                    <div className="absolute right-0 top-[-3px] w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0F3024] mb-3 pr-4">{step.title}</h3>
                                        <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PRICING DYNAMIC RENDER */}
                    {activeService.pricing && (
                        <div className="py-16 border-t border-gray-200">

                            {/* IF SERVICE HAS TIERED SUBSCRIPTION (Wash & Fold) */}
                            {activeService.pricing.payAsYouGo && (
                                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                                    <div className="lg:col-span-4 flex flex-col justify-center">
                                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F3024] leading-tight mb-6">
                                            Pricing That Fits Your Needs
                                        </h2>
                                        <p className="text-lg text-gray-600 mb-8">
                                            Two options, one goal: your convenience. Forget about laundry and <span className="text-[#0F3024] font-bold cursor-pointer underline decoration-2 underline-offset-4">save up to 60% with Rinse Repeat</span>, or try Lyceum with Pay-As-You-Go.
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                                ))}
                                            </div>
                                            <div>
                                                <div className="flex text-[#0F3024] text-lg">★★★★<span className="text-gray-300">★</span></div>
                                                <div className="text-sm text-gray-500">from 6,000+ reviews</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-200 flex flex-col">
                                        <h3 className="text-3xl font-extrabold text-[#0F3024] mb-2">Pay-As-You-Go</h3>
                                        <p className="text-gray-600 font-medium mb-8 pb-8 border-b border-gray-100">{activeService.pricing.payAsYouGo.subtitle}</p>
                                        <div className="mb-8">
                                            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider block mb-1">{activeService.pricing.payAsYouGo.prefix}</span>
                                            <span className="text-5xl font-bold text-[#0F3024]">{activeService.pricing.payAsYouGo.price}</span>
                                        </div>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {activeService.pricing.payAsYouGo.features.map((feature, i) => (
                                                <li key={i} className="text-gray-600 font-medium flex items-start gap-2">{feature}</li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-4 rounded-xl font-bold text-[#E85D04] border-2 border-[#E85D04] hover:bg-[#E85D04] hover:text-white transition-colors">
                                            Schedule a pickup
                                        </button>
                                    </div>

                                    <div className="lg:col-span-4 bg-[#0F3024] rounded-[32px] p-8 md:p-10 shadow-xl flex flex-col relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-3xl font-extrabold text-white">Rinse Repeat</h3>
                                            <span className="bg-[#fef3c7] text-[#0F3024] text-xs font-bold px-3 py-1 rounded-full">Most popular</span>
                                        </div>
                                        <p className="text-gray-300 font-medium mb-8 pb-8 border-b border-white/10">{activeService.pricing.subscription.subtitle}</p>
                                        <div className="mb-8">
                                            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider block mb-1">{activeService.pricing.subscription.prefix}</span>
                                            <span className="text-5xl font-bold text-white">{activeService.pricing.subscription.price}</span>
                                        </div>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {activeService.pricing.subscription.features.map((feature, i) => (
                                                <li key={i} className="text-white font-medium flex items-start gap-2">{feature}</li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-4 rounded-xl font-bold text-white bg-[#E85D04] hover:bg-[#d65503] transition-colors">
                                            Explore Rinse Repeat plans
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* IF SERVICE HAS ITEMIZED PRICING (Dry Cleaning & Hang Dry) */}
                            {activeService.pricing.items && (
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F3024] leading-tight mb-4 text-center">
                                        Pricing That Fits Your Needs
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                                        {activeService.name} items are priced individually. Here are a few common items.
                                    </p>

                                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-200 max-w-5xl mx-auto">
                                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
                                            {/* Slices the array based on showAllPricing boolean */}
                                            {(showAllPricing ? activeService.pricing.items : activeService.pricing.items.slice(0, 6)).map((item, i) => (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4 hover:bg-gray-50/50 transition-colors rounded-2xl px-3 py-2">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-24 h-24 rounded-3xl bg-[#0F3024]/5 flex items-center justify-center p-4">
                                                            <img src={item.img} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />
                                                        </div>
                                                        <span className="text-gray-700 font-bold text-xl">{item.name}</span>
                                                    </div>
                                                    <span className="text-[#0F3024] font-extrabold text-2xl">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Toggle button to show/hide remaining items if there are more than 6 */}
                                        {activeService.pricing.items.length > 6 && (
                                            <div className="mt-12 flex justify-center">
                                                <button
                                                    onClick={() => setShowAllPricing(!showAllPricing)}
                                                    className="px-10 py-4 rounded-xl font-bold text-[#E85D04] border-2 border-[#E85D04] hover:bg-[#E85D04] hover:text-white transition-all text-lg"
                                                >
                                                    {showAllPricing ? 'Hide full pricing' : 'See full pricing'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FEES */}
                    {activeService.fees && activeService.fees.length > 0 && (
                        <div className="py-16 border-t border-gray-200">
                            <h2 className="text-4xl font-extrabold text-[#0F3024] mb-8">About our fees</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {activeService.fees.map((fee, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-xl font-bold text-[#0F3024] pr-2">{fee.title}</h3>
                                            <span className="text-gray-400 font-bold">{fee.price}</span>
                                        </div>
                                        <p className="text-gray-500 mb-6 flex-1">{fee.desc}</p>

                                        {fee.freeSub && (
                                            <div className="bg-[#0F3024]/10 text-[#0F3024] p-4 rounded-xl text-sm font-bold">
                                                Free for Rinse Repeat subscribers.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PICKUP DETAILS */}
                    {activeService.pickupDetails && activeService.pickupDetails.text && (
                        <div className="py-16 border-t border-gray-200">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F3024] mb-8">Pickup & Delivery details</h2>

                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <p className="text-xl text-gray-800 font-medium mb-12">
                                        {activeService.pickupDetails.text}
                                    </p>

                                    <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm">
                                        <h3 className="text-2xl font-bold text-[#0F3024] mb-4">Not available in the evening? No problem!</h3>
                                        <p className="text-gray-600 mb-8 leading-relaxed">
                                            {activeService.pickupDetails.subtext}
                                        </p>

                                        <div className="flex flex-wrap gap-6">
                                            {[
                                                { label: 'Front Door', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 001 1m-6 0h6" /> },
                                                { label: 'Building Reception', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
                                                { label: 'Other place', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> }
                                            ].map((btn, i) => (
                                                <div key={i} className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 rounded-full border-2 border-[#0F3024]/20 flex items-center justify-center text-[#0F3024] bg-[#0F3024]/5">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{btn.icon}</svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-[#0F3024]">{btn.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden bg-[#e2e8f0]/50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <span className="text-gray-400 font-bold tracking-widest uppercase text-center px-4">
                                        [ Insert Delivery Illustration Here ]
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}