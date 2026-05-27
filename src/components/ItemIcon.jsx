// src/components/ItemIcon.jsx
import React from 'react';

const ItemIcon = ({ name, className = "" }) => {
    const itemName = (name || '').toLowerCase();
    const strokeProps = { stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", className };

    if (itemName.includes('polo') || itemName.includes('shirt') || itemName.includes('hoodie') || itemName.includes('cardigan') || itemName.includes('top')) {
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>;
    }
    if (itemName.includes('jean') || itemName.includes('trouser') || itemName.includes('short') || itemName.includes('jogger')) {
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
    if (itemName.includes('suit') || itemName.includes('agbada') || itemName.includes('gown') || itemName.includes('jumpsuit') || itemName.includes('safari') || itemName.includes('native')) {
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
    // Default fallback icon
    return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
};

export default ItemIcon;
