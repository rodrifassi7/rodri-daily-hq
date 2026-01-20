import React from 'react';
import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
export declare const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}>;
export declare const Button: React.FC<{
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
}>;
export declare const ProgressBar: React.FC<{
    progress: number;
    label?: string;
    subLabel?: string;
    color?: string;
}>;
export declare const Badge: React.FC<{
    children: React.ReactNode;
    color?: string;
    onClick?: () => void;
}>;
//# sourceMappingURL=UI.d.ts.map