import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Home, CheckSquare, Dumbbell, Apple, PieChart, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cn } from './UI';
const Layout = ({ children, currentScreen, onScreenChange }) => {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'habits', label: 'Habits', icon: CheckSquare },
        { id: 'todo', label: 'To-Do', icon: ListTodo },
        { id: 'training', label: 'Training', icon: Dumbbell },
        { id: 'nutrition', label: 'Nutrition', icon: Apple },
        { id: 'review', label: 'Review', icon: PieChart },
    ];
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-md mx-auto bg-black text-white relative", children: [_jsx("main", { className: "flex-1 overflow-y-auto px-4 pt-4 pb-24 safe-area-top", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: children }, currentScreen) }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/80 backdrop-blur-lg border-t border-white/10 safe-area-bottom z-50", children: _jsx("div", { className: "flex justify-around items-center h-16 px-2", children: tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentScreen === tab.id;
                        return (_jsxs("button", { onClick: () => onScreenChange(tab.id), className: cn("flex flex-col items-center justify-center w-full h-full transition-all relative", isActive ? "text-primary" : "text-muted"), children: [_jsx(motion.div, { whileTap: { scale: 0.9 }, className: "p-1", children: _jsx(Icon, { size: 24, strokeWidth: isActive ? 2.5 : 2 }) }), _jsx("span", { className: "text-[10px] font-medium mt-0.5", children: tab.label }), isActive && (_jsx(motion.div, { layoutId: "activeTab", className: "absolute top-0 w-8 h-1 bg-primary rounded-b-full", transition: { type: "spring", stiffness: 500, damping: 30 } }))] }, tab.id));
                    }) }) })] }));
};
export default Layout;
//# sourceMappingURL=Layout.js.map