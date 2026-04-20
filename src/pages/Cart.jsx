import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { usePaystackPayment } from 'react-paystack';
import { MapPin, Home, Info, Loader2 } from 'lucide-react';

const markerSvg = `<svg class="w-10 h-10 text-[#E85D04] drop-shadow-[0_4px_10px_rgba(232,93,4,0.5)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>`;
const customIcon = new L.divIcon({
    html: markerSvg,
    className: 'bg-transparent',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

function LocationMarker({ position, setPosition, setTempAddress }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setTempAddress(`Location near ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
}

export default function Cart() {
    const navigate = useNavigate();
    const location = useLocation();

    // ── Persistence State Initialization ──
    const [cartItems, setCartItems] = useState(() => {
        if (location.state?.cartItems && location.state.cartItems.length > 0) {
            return location.state.cartItems;
        }
        const saved = localStorage.getItem('antigravity_cartItems');
        if (saved) return JSON.parse(saved);
        return [];
    });

    // ── Date Generation Logic ──
    const generateQuickDates = () => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);

            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            const id = `${y}-${m}-${d}`;

            dates.push({
                raw: date,
                id: id,
                dayName: i === 0 ? 'Today' : i === 1 ? 'Tmw' : date.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' })
            });
        }
        return dates;
    };

    const quickDates = useMemo(() => generateQuickDates(), []);
    const timeSlots = ["Morning", "Afternoon", "Evening (< 8pm)"];

    // ── Forms & Scheduling State ──
    const defaultAddress = localStorage.getItem('antigravity_default_address') || '';
    const [address, setAddress] = useState(() => localStorage.getItem('antigravity_address') || defaultAddress);
    const [tempAddress, setTempAddress] = useState('');
    const [mapPosition, setMapPosition] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    const [pickupDate, setPickupDate] = useState(() => localStorage.getItem('antigravity_pickupDate') || '');
    const [pickupTime, setPickupTime] = useState(() => localStorage.getItem('antigravity_pickupTime') || '');
    const [deliveryDate, setDeliveryDate] = useState(() => localStorage.getItem('antigravity_deliveryDate') || '');
    const [deliveryTime, setDeliveryTime] = useState(() => localStorage.getItem('antigravity_deliveryTime') || '');

    const [paymentMethod, setPaymentMethod] = useState(() => localStorage.getItem('antigravity_paymentMethod') || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaystackModal, setShowPaystackModal] = useState(false);

    // ── NEW: Location & Details State ──
    const [savedAddress, setSavedAddress] = useState('');
    const [savedPhone, setSavedPhone] = useState('');
    const [addrDescription, setAddrDescription] = useState(() => localStorage.getItem('antigravity_addrDescription') || '');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [isProfileChecking, setIsProfileChecking] = useState(true);

    // ── Fetch Profile ──
    useEffect(() => {
        const fetchProfile = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setSavedAddress(data.address || '');
                        setSavedPhone(data.phone || '');
                        if (!address && data.address) setAddress(data.address);
                    }
                } catch (e) {
                    console.error("Could not fetch profile", e);
                } finally {
                    setIsProfileChecking(false);
                }
            } else {
                setIsProfileChecking(false);
            }
        };
        fetchProfile();
    }, [address]);

    // ── NEW: Geolocation Handler ──
    const handleFetchCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMapPosition({ lat: latitude, lng: longitude });

                try {
                    // Use Nominatim (OpenStreetMap) for free reverse geocoding
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    
                    if (data.display_name) {
                        setAddress(data.display_name);
                    } else {
                        setAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                } catch (err) {
                    console.error("Geocoding error:", err);
                    setAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setLocationError("Permission denied or location unavailable");
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    // ── Local Storage Observers ──
    useEffect(() => {
        localStorage.setItem('antigravity_cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('antigravity_address', address);
    }, [address]);

    useEffect(() => {
        localStorage.setItem('antigravity_pickupDate', pickupDate);
    }, [pickupDate]);

    useEffect(() => {
        localStorage.setItem('antigravity_pickupTime', pickupTime);
    }, [pickupTime]);

    useEffect(() => {
        localStorage.setItem('antigravity_deliveryDate', deliveryDate);
    }, [deliveryDate]);

    useEffect(() => {
        localStorage.setItem('antigravity_deliveryTime', deliveryTime);
    }, [deliveryTime]);

    useEffect(() => {
        localStorage.setItem('antigravity_paymentMethod', paymentMethod);
    }, [paymentMethod]);

    useEffect(() => {
        localStorage.setItem('antigravity_addrDescription', addrDescription);
    }, [addrDescription]);

    const [userModifiedDelivery, setUserModifiedDelivery] = useState(false);
    const deliveryFee = 1500;

    // ── Smart 4-7 Day Delivery Logic ──
    const deliveryRange = useMemo(() => {
        if (!pickupDate) return { min: '', max: '', quickDates: [] };
        
        const [y, m, d] = pickupDate.split('-').map(Number);
        const pDate = new Date(y, m - 1, d);
        
        const minD = new Date(pDate);
        minD.setDate(pDate.getDate() + 4); // CHANGED: Now 4 days minimum
        const maxD = new Date(pDate);
        maxD.setDate(pDate.getDate() + 8); // Adjusted max to keep window consistent

        const formatDate = (date) => {
            const yy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yy}-${mm}-${dd}`;
        };

        const minStr = formatDate(minD);
        const maxStr = formatDate(maxD);

        // Generate filtered quick dates for delivery
        const dQuickDates = [];
        for (let i = 4; i <= 6; i++) { // Show 4-6 days in quick scroll
            const date = new Date(pDate);
            date.setDate(pDate.getDate() + i);
            const id = formatDate(date);
            dQuickDates.push({
                raw: date,
                id: id,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' })
            });
        }

        return { min: minStr, max: maxStr, quickDates: dQuickDates };
    }, [pickupDate]);

    // Enforce range constraint
    useEffect(() => {
        if (pickupDate && deliveryDate) {
            if (deliveryDate < deliveryRange.min || deliveryDate > deliveryRange.max) {
                setDeliveryDate(deliveryRange.min);
            }
        } else if (pickupDate && !deliveryDate) {
            setDeliveryDate(deliveryRange.min);
        }
    }, [pickupDate, deliveryRange.min, deliveryRange.max, deliveryDate]);

    const handleDeliveryDateSelect = (id) => {
        if (id >= deliveryRange.min && id <= deliveryRange.max) {
            setDeliveryDate(id);
            setUserModifiedDelivery(true);
        }
    };

    // ── Handlers ──
    const updateQuantity = (itemId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeItem = (itemId) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    // Map Simulation Handler
    const handleConfirmMapLocation = () => {
        if (tempAddress) setAddress(tempAddress);
        setIsMapModalOpen(false);
    };

    const openMapModal = () => {
        setTempAddress(address);
        setIsMapModalOpen(true);
    };

    // ── Calculations & Smart Progress ──
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal + (cartItems.length > 0 ? deliveryFee : 0);

    // Progress Logic
    const isProfileComplete = !!savedPhone && !!address;
    const steps = [isProfileComplete, !!pickupDate, !!pickupTime, !!deliveryDate, !!deliveryTime, !!paymentMethod];
    const completedStepsCount = steps.filter(Boolean).length;
    const progressPercent = cartItems.length === 0 ? 0 : (completedStepsCount / 6) * 100;
    const isReadyToCheckout = completedStepsCount === 6 && cartItems.length > 0 && isProfileComplete;

    // Smart Button Text
    let buttonPrompt = "Enter Delivery Details";
    if (!savedPhone || !address) buttonPrompt = "Complete Profile in Account Settings";
    else if (!pickupDate) buttonPrompt = "Select Pickup Date";
    else if (!pickupTime) buttonPrompt = "Select Pickup Time";
    else if (!deliveryDate) buttonPrompt = "Confirm Delivery Date";
    else if (!deliveryTime) buttonPrompt = "Select Delivery Time";
    else if (!paymentMethod) buttonPrompt = "Select Payment Method";
    else if (isReadyToCheckout) buttonPrompt = "Confirm Order";

    // ── Official Paystack Integration ──
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: auth.currentUser?.email || "customer@lyceum.com",
        amount: total * 100, // Paystack uses Kobo/Cents
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const onSuccess = (reference) => {
        console.log("Paystack Success:", reference);
        handleFinalProcessing();
    };

    const onClosePaystack = () => {
        console.log("Payment closed");
        setIsProcessing(false);
    };

    const handleCheckoutPrompt = () => {
        if (!isProfileComplete) {
            navigate('/account');
            return;
        }
        if (paymentMethod === 'Pay with Card') {
            setIsProcessing(true);
            initializePayment(onSuccess, onClosePaystack);
        } else {
            handleFinalProcessing();
        }
    };

    const handleFinalProcessing = async () => {
        setIsProcessing(true);
        setShowPaystackModal(false);

        try {
            if (!auth.currentUser) throw new Error("Please log in to place an order.");
            
            const docRef = await addDoc(collection(db, "orders"), {
                userId: auth.currentUser.uid,
                items: cartItems,
                status: "Order Placed",
                address: address,
                description: addrDescription,
                pickup: { date: pickupDate, time: pickupTime },
                delivery: { date: deliveryDate, time: deliveryTime },
                paymentMethod,
                total: total,
                createdAt: serverTimestamp()
            });

            // Clean up strictly after successful network write
            setCartItems([]);
            localStorage.removeItem('antigravity_cartItems');
            localStorage.removeItem('antigravity_pricing_quantities');
            localStorage.removeItem('antigravity_pricing_services');
            localStorage.removeItem('antigravity_addrDescription');

            // Route to success utilizing document ID
            navigate('/order-success', { state: { orderId: docRef.id, total, cartItems, address, description: addrDescription, pickupDate, pickupTime, deliveryDate, deliveryTime, paymentMethod } });
        } catch (error) {
            console.error("Order failed:", error);
            alert("Order submission failed: " + error.message);
            setIsProcessing(false);
        }
    };

    // ── Custom Date Selector Component ──
    const DateSelector = ({ title, selected, onSelect, forceQuickDates, minDate, maxDate }) => {
        const activeQuickDates = forceQuickDates || quickDates;
        const isCustomSelected = selected && !activeQuickDates.find(d => d.id === selected);

        let customDisplay = null;
        if (isCustomSelected) {
            const [y, m, d] = selected.split('-').map(Number);
            const cDate = new Date(y, m - 1, d);
            customDisplay = {
                dayName: cDate.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: cDate.getDate(),
                month: cDate.toLocaleDateString('en-US', { month: 'short' })
            };
        }

        const todayStr = new Date().toISOString().split('T')[0];

        return (
            <div className="mb-6">
                <h3 className="font-bold text-white text-[14px] mb-3">{title}</h3>
                <div className="flex overflow-x-auto gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {activeQuickDates.map((item) => {
                        const isSelected = selected === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-2xl transition-all duration-300 shrink-0 border ${isSelected ? 'bg-[#E85D04] border-[#E85D04] shadow-[0_4px_15px_rgba(232,93,4,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-white/90' : 'text-white/40'}`}>{item.dayName}</span>
                                <span className={`text-2xl font-extrabold ${isSelected ? 'text-white' : 'text-white/90'}`}>{item.dateNum}</span>
                                <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-white/50'}`}>{item.month}</span>
                            </button>
                        );
                    })}

                    {/* Native Calendar Trigger */}
                    <div className="relative shrink-0 flex">
                        <input
                            type="date"
                            min={minDate || todayStr}
                            max={maxDate}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            onChange={(e) => {
                                if (e.target.value) onSelect(e.target.value);
                            }}
                        />
                        <div className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-2xl transition-all duration-300 shrink-0 border ${isCustomSelected ? 'bg-[#E85D04] border-[#E85D04] shadow-[0_4px_15px_rgba(232,93,4,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            {isCustomSelected ? (
                                <>
                                    <span className="text-[11px] font-bold uppercase tracking-wider mb-1 text-white/90">{customDisplay.dayName}</span>
                                    <span className="text-2xl font-extrabold text-white">{customDisplay.dateNum}</span>
                                    <span className="text-[10px] font-medium text-white/80">{customDisplay.month}</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-white/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Other</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TimeSelector = ({ title, selected, onSelect }) => (
        <div className="mb-6">
            <h3 className="font-bold text-white text-[14px] mb-3">{title}</h3>
            <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((item, idx) => {
                    const isSelected = selected === item;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelect(item)}
                            className={`py-3 px-1 rounded-xl text-[11px] font-bold transition-all duration-300 border text-center leading-tight ${isSelected ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-[0_4px_15px_rgba(232,93,4,0.4)]' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-44 font-sans relative">

            {/* ── Top Header ── */}
            <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#0F3024] hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-lg font-extrabold text-[#0F3024]">Your Cart</h1>
                <div className="w-10 h-10 flex items-center justify-center relative">
                    <svg className="w-6 h-6 text-[#0F3024]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {cartItems.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E85D04] rounded-full border-2 border-white"></span>}
                </div>
            </div>

            <div className="max-w-2xl mx-auto pt-6">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#0F3024] mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any laundry items yet.</p>
                        <Link to="/user-pricing" className="bg-[#0F3024] text-white px-8 py-4 rounded-xl font-bold shadow-lg">Start Adding Items</Link>
                    </div>
                ) : (
                    <>
                        {/* ── Cart Items List ── */}
                        <div className="px-4 space-y-3 mb-8">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#0F3024]/5 rounded-2xl flex items-center justify-center shrink-0 p-2 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#0F3024] text-[15px] truncate">{item.name}</h3>
                                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">{item.service}</p>
                                        <p className="text-[#E85D04] font-bold text-sm mt-1">₦{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <button onClick={() => removeItem(item.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-100">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#0F3024]">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                            </button>
                                            <span className="w-6 text-center text-[#0F3024] font-bold text-sm">{item.qty}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#0F3024]">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Link to="/user-pricing" className="block text-center text-sm font-bold text-[#E85D04] mt-4 hover:underline">
                                + Add more items
                            </Link>
                        </div>

                        {/* ── Logistics Block (Address & Scheduling) ── */}
                        <div className="bg-[#0F3024] rounded-[32px] p-6 shadow-xl mb-8 mx-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full border-4 border-white/5 opacity-50"></div>

                            {/* 📍 Address Section */}
                            <div className="relative z-10 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <h2 className="text-lg font-extrabold text-white tracking-wide">Location</h2>
                                </div>

                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                    <button 
                                        onClick={handleFetchCurrentLocation}
                                        disabled={isLoadingLocation}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${isLoadingLocation ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20 border border-[#E85D04]'}`}
                                    >
                                        {isLoadingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                                        {isLoadingLocation ? 'Locating...' : 'Current Location'}
                                    </button>
                                    
                                    {savedAddress && (
                                        <button 
                                            onClick={() => setAddress(savedAddress)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${address === savedAddress ? 'bg-white text-[#0F3024] border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <Home className="w-3.5 h-3.5" />
                                            Preferred Area
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 mb-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Enter your street address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-white/40 outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                                    <div className="text-white/60 font-bold text-sm shrink-0 select-none">
                                        Benin City
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-start gap-3">
                                    <Info className="w-4 h-4 text-[#E85D04] mt-0.5 shrink-0" />
                                    <textarea
                                        placeholder="Add description (e.g. Near blue gate, Apartment 4, Landmark...)"
                                        value={addrDescription}
                                        onChange={(e) => setAddrDescription(e.target.value)}
                                        rows={2}
                                        className="w-full bg-transparent text-white/80 placeholder-white/30 outline-none text-sm font-medium resize-none"
                                    ></textarea>
                                </div>

                                {locationError && (
                                    <p className="mt-2 text-red-400 text-[10px] font-bold px-1">{locationError}</p>
                                )}

                                {/* Map Trigger Button */}
                                <button
                                    onClick={openMapModal}
                                    className="mt-3 flex items-center gap-2 text-white/40 text-[11px] font-bold hover:text-white transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                    Refine on Map
                                </button>
                            </div>

                            <div className="h-px bg-white/10 w-full my-6 relative z-10"></div>

                            {/* 🕒 Pickup Section */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#E85D04]/20 text-[#E85D04] flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-lg font-extrabold text-white tracking-wide">Pickup Details</h2>
                                </div>
                                <DateSelector title="Day" selected={pickupDate} onSelect={setPickupDate} />
                                <TimeSelector title="Time Window" selected={pickupTime} onSelect={setPickupTime} />
                            </div>

                            <div className="h-px bg-white/10 w-full my-6 relative z-10"></div>

                            {/* 🚚 Delivery Section */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold text-white tracking-wide">Expected Delivery</h2>
                                        <p className="text-[11px] text-white/50 font-medium">Standard 3-day turnaround</p>
                                    </div>
                                </div>
                                <DateSelector 
                                    title="Day" 
                                    selected={deliveryDate} 
                                    onSelect={handleDeliveryDateSelect} 
                                    forceQuickDates={deliveryRange.quickDates} 
                                    minDate={deliveryRange.min} 
                                    maxDate={deliveryRange.max} 
                                />
                                <TimeSelector title="Time Window" selected={deliveryTime} onSelect={setDeliveryTime} />
                            </div>
                        </div>

                        {/* ── Order Summary ── */}
                        <div className="px-4 mb-8">
                            <h2 className="text-lg font-extrabold text-[#0F3024] mb-4">Order Summary</h2>
                            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-bold text-[#0F3024]">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Pickup & Delivery</span>
                                    <span className="font-bold text-[#0F3024]">₦{deliveryFee.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Billing & Payment UI ── */}
                        <div className="px-4 mb-8">
                            <h2 className="text-lg font-extrabold text-[#0F3024] mb-4">Payment Method</h2>
                            <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 space-y-2">
                                {['Pay with Card', 'Bank Transfer', 'Pay on Pickup'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === method ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <span className={`font-bold ${paymentMethod === method ? 'text-[#E85D04]' : 'text-gray-600'}`}>{method}</span>
                                        {paymentMethod === method && (
                                            <div className="w-5 h-5 rounded-full bg-[#E85D04] flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Paystack Trust Badge Placeholder */}
                            {paymentMethod === 'Pay with Card' && (
                                <div className="mt-4 flex items-center justify-center gap-2 bg-[#0BA4DB]/5 p-3 rounded-xl border border-[#0BA4DB]/20">
                                    <svg className="w-4 h-4 text-[#0BA4DB]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                                    <span className="text-xs font-bold text-[#0BA4DB]">Securely processed by Paystack</span>
                                </div>
                            )}

                            {/* Manual Bank Details */}
                            {paymentMethod === 'Bank Transfer' && (
                                <div className="mt-4 p-5 bg-[#0F3024] rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3 opacity-60">Payment Details</h3>
                                    <div className="space-y-3 relative z-10">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Bank Name</p>
                                            <p className="text-white font-bold text-sm">Zenith Bank PLC</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Account Number</p>
                                            <p className="text-[#E85D04] font-black text-lg tracking-widest">1234567890</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Account Name</p>
                                            <p className="text-white font-bold text-sm">Lyceum Laundry Services</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/40 font-medium italic">
                                        * Kindly use your Phone Number as the payment reference.
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── Smart Progress Checkout Button ── */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-[88px] left-4 right-4 z-40 lg:ml-64 pointer-events-none flex justify-center">
                    <button
                        disabled={!isReadyToCheckout || isProcessing}
                        onClick={handleCheckoutPrompt}
                        className={`pointer-events-auto relative w-full max-w-2xl rounded-2xl p-4 flex items-center justify-between shadow-2xl overflow-hidden transition-transform duration-300 ${isReadyToCheckout && !isProcessing ? 'scale-100 hover:scale-[1.02]' : 'scale-[0.98]'}`}
                    >
                        {/* Background Container (Dark Green) */}
                        <div className="absolute inset-0 bg-[#0F3024]"></div>

                        {/* Smart Filling Bar (Orange) */}
                        <div
                            className="absolute inset-y-0 left-0 bg-[#E85D04] transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        ></div>

                        {/* Button Content (Z-10 to stay above the filling bar) */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                            <span className={`font-bold text-lg transition-colors duration-300 ${isReadyToCheckout ? 'text-white' : 'text-white/80'} ${isProcessing ? 'animate-pulse' : ''}`}>
                                {isProcessing ? 'Processing Securely...' : buttonPrompt}
                            </span>

                            {isReadyToCheckout && (
                                <div className="flex items-center gap-3 animate-fade-in">
                                    <span className="text-white font-extrabold text-xl">₦{total.toLocaleString()}</span>
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            )}

            {/* ── MAP MODAL PLACEHOLDER ── */}
            {isMapModalOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-white">
                    {/* Header */}
                    <div className="px-4 py-4 flex items-center justify-between bg-white shadow-sm z-10">
                        <h2 className="text-lg font-extrabold text-[#0F3024]">Pin Location</h2>
                        <button onClick={() => setIsMapModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#0F3024]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Real Leaflet Map */}
                    <div className="flex-1 relative overflow-hidden bg-[#0F3024]">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-[#0F3024]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 text-center w-[250px] pointer-events-none">
                            Tap anywhere on the map to place your pin
                        </div>
                        <MapContainer
                            center={[6.3350, 5.6037]}
                            zoom={13}
                            style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker position={mapPosition} setPosition={setMapPosition} setTempAddress={setTempAddress} />
                        </MapContainer>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="p-6 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10 rounded-t-[32px] relative -mt-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-[#0F3024] truncate">{tempAddress || "Select a location"}</h3>
                                <p className="text-sm text-gray-500">Benin City, Edo State</p>
                            </div>
                        </div>
                        <button
                            disabled={!mapPosition}
                            onClick={handleConfirmMapLocation}
                            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-colors ${mapPosition ? 'bg-[#E85D04] text-white hover:bg-[#d15303]' : 'bg-gray-200 text-gray-400'}`}
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}