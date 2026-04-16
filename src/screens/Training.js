import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, cn } from '../components/UI';
import { Calendar, Dumbbell, ChevronRight } from 'lucide-react';
import { format, startOfToday, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { GymSessionView } from '../components/GymSessionView';
const Training = () => {
    const { data, updateTraining } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [activeRoutine, setActiveRoutine] = useState(null);
    const weekDays = useMemo(() => {
        const today = startOfToday();
        return eachDayOfInterval({
            start: subDays(today, 6),
            end: today
        });
    }, []);
    const logsForSelected = data.trainingLogs.find(l => l.date === selectedDate);
    // Weekly counters
    const startOfWeek = subDays(startOfToday(), 6); // Last 7 days including today
    const weeklyLogs = data.trainingLogs.filter(l => l.date >= format(startOfWeek, 'yyyy-MM-dd'));
    const gymCount = weeklyLogs.filter(l => l.type === 'Gym').length;
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsx("header", { className: "flex justify-between items-center px-1", children: _jsx("h1", { className: "text-3xl font-black tracking-tight", children: "Training" }) }), _jsx("div", { className: "flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide", children: weekDays.map(day => {
                    const dStr = format(day, 'yyyy-MM-dd');
                    const isSelected = dStr === selectedDate;
                    const log = data.trainingLogs.find(l => l.date === dStr);
                    return (_jsxs("button", { onClick: () => setSelectedDate(dStr), className: cn("flex-shrink-0 w-12 flex flex-col items-center py-3 rounded-2xl transition-all", isSelected ? "bg-primary text-black scale-105 z-10 shadow-lg shadow-primary/20" : "bg-card text-muted"), children: [_jsx("span", { className: "text-[10px] font-bold uppercase mb-1", children: format(day, 'EEE') }), _jsx("span", { className: "text-sm font-black", children: format(day, 'd') }), log && log.type !== 'Rest' && (_jsx("div", { className: cn("w-1.5 h-1.5 rounded-full mt-1", isSelected ? "bg-black" : "bg-primary") }))] }, dStr));
                }) }), _jsxs(Card, { className: "text-center p-4", children: [_jsx("div", { className: "text-[10px] font-black text-muted mb-1 uppercase tracking-widest", children: "Gym This Week" }), _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: "text-3xl font-black", children: gymCount }), _jsx("span", { className: "text-lg text-muted font-bold", children: "/ 4" })] }), _jsx("div", { className: "mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary transition-all duration-500", style: { width: `${Math.min(100, (gymCount / 4) * 100)}%` } }) })] }), _jsx("section", { children: _jsx("div", { className: "flex flex-col gap-2", children: ['Gym', 'Rest'].map(type => (_jsxs("button", { onClick: () => updateTraining(selectedDate, type), className: cn("w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98]", logsForSelected?.type === type
                            ? "bg-primary/20 border-primary shadow-sm shadow-primary/10"
                            : "bg-white/5 border-white/10 text-muted"), children: [_jsxs("span", { className: "font-bold", children: [type, " session"] }), logsForSelected?.type === type && _jsx("div", { className: "bg-primary text-black p-1 rounded-full", children: _jsx(CheckIcon, {}) })] }, type))) }) }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4 px-1 mt-6", children: [_jsx("h2", { className: "text-2xl font-black", children: "Routines" }), _jsx(Dumbbell, { size: 24, className: "text-primary" })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: data.routines.filter(r => !r.isOptional).map(routine => {
                            return (_jsxs("button", { onClick: () => setActiveRoutine(routine), className: "bg-card border border-border p-5 rounded-3xl text-left active:scale-[0.97] transition-all flex flex-col justify-between min-h-[120px] relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-white to-transparent w-full h-full pointer-events-none" }), _jsx("span", { className: "text-[10px] font-black text-primary uppercase tracking-widest", children: routine.title.split(' ')[0] }), _jsxs("div", { className: "flex items-center justify-between mt-2 z-10 w-full", children: [_jsx("span", { className: "font-black text-xl leading-none", children: routine.title.split(' ')[1] }), _jsx("div", { className: "bg-white/5 p-1.5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors", children: _jsx(ChevronRight, { size: 16 }) })] })] }, routine.id));
                        }) })] }), _jsx(AnimatePresence, { children: activeRoutine && (_jsx(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: "fixed inset-0 z-50 flex", children: _jsx(GymSessionView, { routine: activeRoutine, date: selectedDate, onClose: () => setActiveRoutine(null) }) })) })] }));
};
function CheckIcon() {
    return (_jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
}
export default Training;
//# sourceMappingURL=Training.js.map