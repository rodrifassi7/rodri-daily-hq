import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
    <div
        onClick={onClick}
        className={cn("bg-card border border-border rounded-2xl p-4 mb-4", onClick && "active:scale-95 transition-transform", className)}
    >
        {children}
    </div>
);

export const Button: React.FC<{ children: React.ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit' }> = ({ children, className, variant = 'primary', onClick, disabled, type = 'button' }) => {
    const variants = {
        primary: 'bg-primary text-white',
        secondary: 'bg-white text-black',
        outline: 'border border-border text-white',
        ghost: 'text-muted hover:text-white',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100",
                variants[variant],
                className
            )}
        >
            {children}
        </button>
    );
};

export const ProgressBar: React.FC<{ progress: number; label?: string; subLabel?: string; color?: string }> = ({ progress, label, subLabel, color = 'bg-primary' }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    return (
        <div className="w-full">
            {(label || subLabel) && (
                <div className="flex justify-between items-end mb-2">
                    {label && <span className="font-semibold text-sm">{label}</span>}
                    {subLabel && <span className="text-xs text-muted">{subLabel}</span>}
                </div>
            )}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-500 rounded-full", color)}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string; onClick?: () => void }> = ({ children, color = 'bg-primary/20 text-primary', onClick }) => (
    <span
        onClick={onClick}
        className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", color, onClick && "cursor-pointer active:scale-95 transition-all")}
    >
        {children}
    </span>
);
