import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const Card = ({ children, className, onClick }) => (_jsx("div", { onClick: onClick, className: cn("bg-card border border-border rounded-2xl p-4 mb-4", onClick && "active:scale-95 transition-transform", className), children: children }));
export const Button = ({ children, className, variant = 'primary', onClick, disabled, type = 'button' }) => {
    const variants = {
        primary: 'bg-primary text-white',
        secondary: 'bg-white text-black',
        outline: 'border border-border text-white',
        ghost: 'text-muted hover:text-white',
    };
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled, className: cn("px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100", variants[variant], className), children: children }));
};
export const ProgressBar = ({ progress, label, subLabel, color = 'bg-primary' }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    return (_jsxs("div", { className: "w-full", children: [(label || subLabel) && (_jsxs("div", { className: "flex justify-between items-end mb-2", children: [label && _jsx("span", { className: "font-semibold text-sm", children: label }), subLabel && _jsx("span", { className: "text-xs text-muted", children: subLabel })] })), _jsx("div", { className: "h-2 w-full bg-white/10 rounded-full overflow-hidden", children: _jsx("div", { className: cn("h-full transition-all duration-500 rounded-full", color), style: { width: `${clampedProgress}%` } }) })] }));
};
export const Badge = ({ children, color = 'bg-primary/20 text-primary', onClick }) => (_jsx("span", { onClick: onClick, className: cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", color, onClick && "cursor-pointer active:scale-95 transition-all"), children: children }));
//# sourceMappingURL=UI.js.map