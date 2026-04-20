import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const navigate = useNavigate();
    const [name, setName] = useState('John Doe'); // Mock user
    const [email, setEmail] = useState(() => localStorage.getItem('antigravity_email') || '');
    const [phone, setPhone] = useState(() => localStorage.getItem('antigravity_phone') || '');
    const [address, setAddress] = useState(() => localStorage.getItem('antigravity_default_address') || '');
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const handleUpdateDetails = () => {
        localStorage.setItem('antigravity_email', email);
        localStorage.setItem('antigravity_phone', phone);
        localStorage.setItem('antigravity_default_address', address);
        alert('Account details updated successfully.');
    };

    const handleUpdatePassword = () => {
        if (!currentPass || !newPass) return;
        alert('Password updated securely.');
        setCurrentPass('');
        setNewPass('');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-28 font-sans">
            {/* Header Area */}
            <div className="bg-[#0F3024] pt-12 pb-16 px-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-white tracking-wide border-l border-white/20 pl-4 py-1">Profile</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8 relative z-40 space-y-6">
                
                {/* ── Profile Details Section ── */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-extrabold text-[#0F3024] mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Personal details
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number <span className="text-gray-400 font-normal lowercase">(For logistics)</span></label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="080..." type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Permanent Delivery Address</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} autoComplete="street-address" type="text" placeholder="House Number & Street" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State</label>
                            <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 flex items-center justify-between cursor-not-allowed">
                                Benin City, Edo State
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                        </div>
                        
                        <button onClick={handleUpdateDetails} className="w-full mt-2 bg-[#0F3024] text-white py-3.5 rounded-[16px] font-bold shadow-[0_4px_15px_rgba(15,48,36,0.3)] hover:bg-[#0a2018] transition-colors">
                            Update Account Details
                        </button>
                    </div>
                </div>

                {/* ── Security Section ── */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-extrabold text-[#0F3024] mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Security
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
                            <input value={currentPass} onChange={e => setCurrentPass(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                            <input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] outline-none transition-colors" />
                        </div>
                        
                        <button onClick={handleUpdatePassword} className="w-full mt-2 bg-gray-100 text-[#0F3024] py-3.5 rounded-[16px] font-bold hover:bg-gray-200 transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}