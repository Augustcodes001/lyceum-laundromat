// src/pages/ServicesPricing.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ── CUSTOM PRICING SVG ICONS ──
const ItemIcon = ({ name }) => {
    const itemName = name.toLowerCase();

    // Default brand colors
    const strokeProps = { stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

    if (itemName.includes('polo') || itemName.includes('shirt') || itemName.includes('hoodie') || itemName.includes('cardigan')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>;
    }
    if (itemName.includes('jean') || itemName.includes('trouser') || itemName.includes('short')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M6 4h12l-1 18h-3l-2-8-2 8H8L7 4z" /></svg>;
    }
    if (itemName.includes('shoe')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M4 14l3-3h4l4 2 4 1a2 2 0 011 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" /></svg>;
    }
    if (itemName.includes('bed') || itemName.includes('duvet')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M3 14h18M3 10h18M5 6h14v4H5V6zM3 18h18" /></svg>;
    }
    if (itemName.includes('rug') || itemName.includes('towel') || itemName.includes('curtain')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M4 8h16M4 16h16" /></svg>;
    }
    if (itemName.includes('suit') || itemName.includes('agbada') || itemName.includes('gown') || itemName.includes('jumpsuit') || itemName.includes('safari')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M8 3h8l4 6-2 12H6L4 9l4-6z" /><path d="M12 3v18M8 9h8" /></svg>;
    }
    if (itemName.includes('iron')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M4 15h16v-2a6 6 0 00-6-6H8a4 4 0 00-4 4v4z" /><path d="M14 15v4h4v-4" /></svg>;
    }
    if (itemName.includes('starch')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M10 5h4v4h-4zM12 9v10M8 19h8M14 5l2-2h3M16 3v3" /></svg>;
    }
    if (itemName.includes('bag')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" /></svg>;
    }
    // Default Tag/Accessory Icon (Caps, socks, ties, boxers)
    return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
};

// ── PickupPill Component (Perfectly Aligned) ──
const PickupPill = () => {
    const [address, setAddress] = useState('');
    return (
        <div className="inline-flex items-center bg-white rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-200 h-16">
            <div className="flex flex-col px-6 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors select-none h-full justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F3024] leading-none mb-1">Pickup</span>
                <span className="text-[14px] text-gray-500 font-medium leading-none">Tonight</span>
            </div>
            <label className="flex items-center px-6 min-w-[200px] cursor-text hover:bg-gray-50 transition-colors h-full">
                <div className="flex flex-col w-full h-full justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F3024] leading-none mb-1.5">Where</span>
                    <input
                        type="text"
                        placeholder="Add address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="text-[14px] text-gray-800 bg-transparent outline-none placeholder-gray-400 w-full font-medium leading-none p-0 border-0 focus:ring-0"
                    />
                </div>
            </label>
            <button className="mr-2 w-12 h-12 rounded-full bg-[#E85D04] hover:bg-[#d65503] flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    );
};

// ── SERVICES DATA ──
const services = [
    {
        id: 'washing',
        name: 'Wash Only',
        icon: '🎒',
        tagline: 'Built for people who don\'t waste time on chores.',
        description: 'We pick up your everyday clothes, heavy duvets, intricate center rugs, pillows, and even your favorite shoes. Everything is washed with meticulous care using dedicated machines.\n\nLet us take laundry off your to-do list – permanently.',
        imageUrl: '/washing-illustration.png',
        howItWorks: [
            {
                title: 'We collect your everyday wear and bulky items',
                desc: 'From clothes and shoes to heavy items like duvets and center rugs, we pick it all up right from your doorstep.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            },
            {
                title: 'We sort and inspect everything',
                desc: 'We do thorough pocket inspections and separate your lights, darks, and delicate items to ensure safe washes.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            },
            {
                title: 'We wash according to your preferences',
                desc: 'Your items are cleaned with the utmost care. Need specific detergents or cold water? We tailor the wash to your exact choices.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            },
            {
                title: 'We return it fresh and clean',
                desc: 'Your laundry is returned fresh, securely packaged, and ready to be put away or worn.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            },
        ],
        pricing: {
            items: [
                { name: 'Regular Clothes (Wash Only)', price: '₦350' },
                { name: 'Pair of Shoe', price: '₦1,000' },
                { name: 'Duvet', price: '₦2,000' },
                { name: 'White duvet', price: '₦2,500' },
                { name: 'Center rug', price: '₦7,000' }
            ]
        }
    },
    {
        id: 'dry-cleaning',
        name: 'Wash, Starch & Iron',
        icon: '👔',
        tagline: 'Impeccable complete care for your entire wardrobe.',
        description: 'Our most comprehensive service. We expertly wash, perfectly starch, and professionally iron your garments so they are returned to you in pristine, retail-ready condition.\n\nFrom high-end couture to your everyday jeans and polos, our experts ensure your garments look spectacular.',
        imageUrl: '/drycleaning-illustration.png',
        howItWorks: [
            {
                title: 'We inspect and tag every garment',
                desc: 'Each piece is carefully examined for existing damage, loose buttons, and stubborn stains.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            },
            {
                title: 'We clean and protect fabrics',
                desc: 'Your clothes are expertly washed using premium detergents that remove dirt while protecting the fabric.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            },
            {
                title: 'We apply professional starch',
                desc: 'Based on the fabric and your preference, we apply the perfect level of starch for that crisp, sharp edge.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            },
            {
                title: 'We press, package, and deliver',
                desc: 'After a final quality check, your garments are professionally ironed, wrapped securely, and delivered to your home.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            }
        ],
        pricing: {
            items: [
                { name: 'For polo', price: '₦500' },
                { name: 'Short', price: '₦500' },
                { name: 'Jean trouser', price: '₦500' },
                { name: 'Jean top', price: '₦500' },
                { name: 'Joggers', price: '₦500' },
                { name: 'Complete Jean', price: '₦1,000' },
                { name: 'Hoodie', price: '₦500' },
                { name: 'Gown', price: '₦800' },
                { name: 'Skirt', price: '₦500' },
                { name: 'Jumpsuits', price: '₦800' },
                { name: 'Cardigan', price: '₦500' },
                { name: 'T-Shirt', price: '₦500' },
                { name: 'Trouser', price: '₦500' },
                { name: 'Native up and down', price: '₦1,000' },
                { name: 'Complete Agbada', price: '₦1,800' },
                { name: 'Bedspread', price: '₦500' },
                { name: 'White bedspread', price: '₦700' },
                { name: 'Big towel', price: '₦700' },
                { name: 'White big towel', price: '₦800' },
                { name: 'Small towel', price: '₦400' },
                { name: 'White small towel', price: '₦500' },
                { name: 'Jalavia(safari)', price: '₦800' },
                { name: 'Complete suit', price: '₦1,800' },
                { name: 'Cap', price: '₦400' },
                { name: 'Boxer', price: '₦300' },
                { name: 'Singlet', price: '₦300' },
                { name: 'Socks', price: '₦200' },
                { name: 'Scarf', price: '₦200' },
                { name: 'School bag', price: '₦1,500' },
                { name: 'Travelling bags', price: '₦3,000' },
                { name: 'Curtains', price: '₦1,200' }
            ]
        }
    },
    {
        id: 'ironing',
        name: 'Ironing & Starch',
        icon: '✨',
        tagline: 'Step into garments that feel flawlessly brand new.',
        description: 'Your clothes deserve a retail-ready finish. We handle the meticulous pressing and precise starching so your wardrobe is always returned in pristine, closet-ready condition.\n\nNo more struggling with stubborn wrinkles or spending your mornings hunched over an ironing board. We deliver crisp, sharp perfection every single time.',
        imageUrl: '/ironing-illustration.png',
        howItWorks: [
            {
                title: 'We collect your clean, wrinkled garments',
                desc: 'Schedule a pickup and we will grab your clean clothes that just need that perfect, professional press and starch.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            },
            {
                title: 'We sort by fabric type',
                desc: 'Delicate silks, heavy cottons, and native wears are separated to ensure they receive the exact temperature and steam levels they need.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            },
            {
                title: 'We apply professional steam and starch',
                desc: 'Using industrial-grade irons, we eliminate every crease. You can specify your preferred level of starch for that crisp, sharp edge.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            },
            {
                title: 'We hang, fold, and deliver to your door',
                desc: 'Your garments are hung beautifully or folded crisply, then delivered right back to you, ready for the boardroom or your next event.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            }
        ],
        pricing: {
            items: [
                { name: 'Just ironing', price: '₦300' },
                { name: 'Just Starch', price: '₦300' }
            ]
        }
    }
];

export default function ServicesPricing() {
    const [activeTabId, setActiveTabId] = useState('washing');
    const [showAllPricing, setShowAllPricing] = useState(false);
    const activeService = services.find(s => s.id === activeTabId);

    useEffect(() => {
        window.scrollTo(0, 0);
        setShowAllPricing(false);
    }, [activeTabId]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-[#0F3024] selection:bg-[#E85D04] selection:text-white flex flex-col m-0 p-0 w-full overflow-x-hidden">
            <Header />

            {/* 🌟 MARGIN FIX: Absolute block to cover any accidental parent padding */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-[#0F3024] z-[-1]"></div>

            {/* ── HERO SECTION ── */}
            <header className="relative pt-[120px] md:pt-[150px] pb-24 lg:pb-36 bg-transparent w-full m-0 border-none">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F3024] to-[#164332]"></div>

                {/* Deep Ambient Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-[#1a4f3d] rounded-full blur-[120px] opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-[#E85D04] rounded-full blur-[140px] opacity-30 pointer-events-none"></div>

                {/* Abstract Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-[#E85D04] text-white font-bold text-xs tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(232,93,4,0.3)]">
                        Premium Garment Care
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-[1.1] uppercase drop-shadow-lg">
                        Services & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D04] to-[#ff8c42]">Pricing</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-300 max-w-2xl font-medium text-balance mb-10 leading-relaxed">
                        Transparent pricing for meticulous care. Choose the service you need, and we'll handle the rest.
                    </p>
                    <PickupPill />
                </div>

                {/* Slanted Bottom Edge Transition */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] md:h-[80px]" style={{ transform: 'rotate(180deg)' }}>
                        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-slate-50"></path>
                    </svg>
                </div>
            </header>

            <main className="flex-grow z-10 relative bg-slate-50 pb-24 w-full">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">

                    {/* ── TAB NAVIGATION ── */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-20 p-2 bg-white rounded-2xl md:rounded-full shadow-[0_15px_40px_-10px_rgba(15,48,36,0.15)] border border-gray-100 max-w-3xl mx-auto relative -mt-16 z-20">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setActiveTabId(service.id)}
                                className={`flex items-center gap-2 px-6 py-4 rounded-xl md:rounded-full font-black text-sm md:text-base tracking-wide uppercase transition-all duration-300 flex-1 md:flex-none justify-center ${activeTabId === service.id
                                    ? 'bg-[#0F3024] text-white shadow-xl shadow-[#0F3024]/30 scale-105'
                                    : 'bg-transparent text-gray-500 hover:text-[#0F3024] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-xl">{service.icon}</span>
                                {service.name}
                            </button>
                        ))}
                    </div>

                    {/* ── ACTIVE TAB CONTENT ── */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-[#0F3024] uppercase">{activeService.tagline}</h2>
                            <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line font-medium">
                                {activeService.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                            {/* Left: How it Works */}
                            <div className="lg:col-span-5 space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E85D04]/5 to-transparent rounded-full blur-3xl"></div>
                                <h3 className="text-2xl font-black uppercase tracking-wide border-b-2 border-gray-100 pb-4 flex items-center gap-3 relative z-10 text-[#0F3024]">
                                    <span className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center text-sm shadow-md shadow-orange-500/20">✦</span>
                                    How it works
                                </h3>
                                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gray-100 z-10">
                                    {activeService.howItWorks.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-6 group/step">
                                            <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0F3024] flex items-center justify-center flex-shrink-0 z-10 text-[#0F3024] group-hover/step:bg-[#0F3024] group-hover/step:text-white transition-all duration-300 shadow-sm group-hover/step:scale-110">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{step.icon}</svg>
                                            </div>
                                            <div className="pt-1.5">
                                                <h4 className="text-lg font-black mb-2 text-[#0F3024] uppercase tracking-wide">{step.title}</h4>
                                                <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Image + Pricing */}
                            <div className="lg:col-span-7 space-y-10">
                                <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 group bg-gray-100 border border-gray-200 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#0F3024]/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>

                                    {/* Will display your generated image path */}
                                    <img src={activeService.imageUrl} alt={activeService.name} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />

                                    {/* Fallback if image isn't generated yet */}
                                    <span style={{ display: 'none' }} className="absolute text-gray-400 font-bold tracking-widest uppercase text-center px-4">
                                        [ Render {activeService.imageUrl} ]
                                    </span>

                                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 z-20 shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <h4 className="font-black text-[#0F3024] text-lg uppercase tracking-wider">{activeService.name}</h4>
                                        <p className="text-xs font-bold text-[#E85D04] uppercase tracking-widest">Premium Care Standards</p>
                                    </div>
                                </div>

                                {/* Pricing Card */}
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 transition-shadow duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0F3024] via-[#164332] to-[#E85D04]"></div>
                                    <h3 className="text-2xl font-black uppercase tracking-wide mb-6 flex items-center gap-3 text-[#0F3024]">
                                        <span className="w-8 h-8 rounded-full bg-[#0F3024]/10 text-[#0F3024] flex items-center justify-center text-sm font-black">₦</span>
                                        Itemized Pricing
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                                        {(showAllPricing ? activeService.pricing.items : activeService.pricing.items.slice(0, 8)).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-[#0F3024]/[0.03] px-3 rounded-xl transition-colors group/item cursor-default">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover/item:scale-110 transition-transform duration-300 border border-gray-100 shadow-sm text-[#0F3024]">
                                                        {/* 🌟 Custom Inline SVG applied dynamically based on item name */}
                                                        <ItemIcon name={item.name} />
                                                    </div>
                                                    <span className="font-semibold text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="font-black text-[#E85D04] tracking-tight">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {activeService.pricing.items.length > 8 && (
                                        <div className="mt-8 flex justify-center">
                                            <button
                                                onClick={() => setShowAllPricing(!showAllPricing)}
                                                className="px-8 py-3 rounded-xl font-bold text-[#E85D04] border-2 border-[#E85D04] hover:bg-[#E85D04] hover:text-white transition-all text-sm uppercase tracking-wider active:scale-95 shadow-sm"
                                            >
                                                {showAllPricing ? 'Hide full pricing' : 'See full pricing'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-8 p-5 bg-[#0F3024]/5 border border-[#0F3024]/10 rounded-2xl flex items-start gap-4">
                                        <svg className="w-6 h-6 text-[#E85D04] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-sm text-[#0F3024]/80 font-semibold leading-relaxed">
                                            Prices may vary slightly based on size, material, or condition upon physical inspection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── DELIVERY UPDATES ── */}
                    <div className="mt-32 relative pb-10">
                        <section className="w-full bg-[#0F3024] py-24 rounded-[3rem] relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#E85D04] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
                            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                                <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 flex flex-col items-center">
                                    <h2 className="text-sm font-bold tracking-widest text-[#E85D04] uppercase mb-4 flex items-center gap-3">
                                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                                        Logistics & Tracking
                                        <span className="w-8 h-[2px] bg-[#E85D04]"></span>
                                    </h2>
                                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.1]">
                                        Never Guess When <br /><span className="text-[#E85D04]">We Will Arrive</span>
                                    </h3>
                                </div>
                                <div className="relative">
                                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 pointer-events-none"></div>
                                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2 pointer-events-none"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative p-6 sm:p-4 rounded-3xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent group transition-all duration-300 hover:bg-white/[0.03]">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide">Daily Service Window</h3>
                                                <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">Your clothes will always arrive between 8am and 8pm.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative p-6 sm:p-4 rounded-3xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent group transition-all duration-300 hover:bg-white/[0.03]">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide">Real-Time ETA Alert</h3>
                                                <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">We'll email you when service is complete and before arrival.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative p-6 sm:p-4 rounded-3xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent group transition-all duration-300 hover:bg-white/[0.03]">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide">Live GPS & Order Tracking</h3>
                                                <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">Track your order in real time on our live map.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative p-6 sm:p-4 rounded-3xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent group transition-all duration-300 hover:bg-white/[0.03]">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide">Seamless Handoff</h3>
                                                <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">Meet us at the door, or leave bags with concierge.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}