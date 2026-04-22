import React, { useEffect } from 'react';

export default function SocialFollowModal({ isOpen, onClose }) {
    // Prevent scrolling on the body when the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

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
            href: 'https://wa.me/2347085004780',
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">

            {/* Modal Container */}
            <div className="bg-white rounded-[24px] p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center transform transition-transform animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-[#0F3024] hover:text-red-500 transition-colors p-1"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" x2="6" y1="6" y2="18" />
                        <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                </button>

                {/* Content */}
                <div className="mt-4 mb-8 w-full">
                    <h3 className="text-xl font-black tracking-widest text-[#0F3024] uppercase mb-3">
                        Follow Lyceum
                    </h3>
                    <p className="text-sm text-gray-500 font-medium px-4">
                        Get <strong>10% off</strong> your next order when you join the Lyceum community online.
                    </p>
                </div>

                {/* Social Icons Grid */}
                <div className="flex items-center justify-center gap-x-6 w-full mb-4">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Follow us on ${social.name}`}
                            className={`w-14 h-14 bg-neutral-50 rounded-full flex items-center justify-center text-[#0F3024] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color} hover:text-white`}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

            </div>
        </div>
    );
}