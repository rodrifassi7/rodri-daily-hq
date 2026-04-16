import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar, Badge } from '../components/UI';
import { Apple, Plus, Flame, Zap, Check, X, Minus } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
const Nutrition = () => {
    const { data, updateNutrition, updateData } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const todayLog = useMemo(() => {
        return data.nutritionLogs.find(l => l.date === todayStr) || { calories: 0, protein: 0, rating: 'OK' };
    }, [data.nutritionLogs, todayStr]);
    const caloriesGoal = 2811;
    const proteinGoal = 140;
    const setRating = (rating) => {
        const existingIdx = data.nutritionLogs.findIndex(l => l.date === todayStr);
        const newLogs = [...data.nutritionLogs];
        if (existingIdx > -1) {
            const existing = newLogs[existingIdx];
            if (existing) {
                newLogs[existingIdx] = { ...existing, rating };
            }
        }
        else {
            newLogs.push({ date: todayStr, calories: 0, protein: 0, rating, meals: [] });
        }
        updateData({ nutritionLogs: newLogs });
    };
    const quickAdds = [
        { label: 'Meal 1', cal: 600, pro: 35 },
        { label: 'Meal 2', cal: 800, pro: 45 },
        { label: 'Meal 3', cal: 700, pro: 40 },
        { label: 'Snack', cal: 300, pro: 20 },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("header", { className: "flex justify-between items-center", children: _jsx("h1", { className: "text-3xl font-black", children: "Nutrition" }) }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs(Card, { className: "bg-gradient-to-br from-card to-black p-6 ring-1 ring-white/10", children: [_jsxs("div", { className: "flex justify-between items-end mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Flame, { size: 20, className: "text-orange-500" }), _jsx("span", { className: "text-xs font-black text-muted uppercase tracking-wider", children: "Calories" })] }), _jsxs("div", { className: "text-4xl font-black", children: [todayLog.calories, " ", _jsxs("span", { className: "text-lg text-muted font-medium", children: ["/ ", caloriesGoal] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs font-black text-muted uppercase tracking-wider mb-1", children: "Remaining" }), _jsx("div", { className: "text-xl font-bold text-primary", children: Math.max(0, caloriesGoal - todayLog.calories) })] })] }), _jsx(ProgressBar, { progress: (todayLog.calories / caloriesGoal) * 100, color: "bg-orange-500" })] }), _jsxs(Card, { className: "bg-gradient-to-br from-card to-black p-6 ring-1 ring-white/10", children: [_jsxs("div", { className: "flex justify-between items-end mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Zap, { size: 20, className: "text-primary" }), _jsx("span", { className: "text-xs font-black text-muted uppercase tracking-wider", children: "Protein" })] }), _jsxs("div", { className: "text-4xl font-black", children: [todayLog.protein, "g ", _jsxs("span", { className: "text-lg text-muted font-medium", children: ["/ ", proteinGoal, "g"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs font-black text-muted uppercase tracking-wider mb-1", children: "Remaining" }), _jsxs("div", { className: "text-xl font-bold text-primary", children: [Math.max(0, proteinGoal - todayLog.protein), "g"] })] })] }), _jsx(ProgressBar, { progress: (todayLog.protein / proteinGoal) * 100, color: "bg-primary" })] })] }), _jsxs("section", { children: [_jsxs("h2", { className: "text-xl font-bold mb-3 flex items-center gap-2", children: [_jsx(Plus, { size: 20, className: "text-primary" }), "Quick Add Templates"] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: quickAdds.map(template => (_jsxs("button", { onClick: () => updateNutrition(todayStr, todayLog.calories + template.cal, todayLog.protein + template.pro), className: "bg-card border border-border p-4 rounded-2xl text-left active:scale-[0.98] transition-all", children: [_jsx("div", { className: "font-bold mb-1", children: template.label }), _jsxs("div", { className: "text-[10px] text-muted font-black uppercase", children: [template.cal, " kcal \u2022 ", template.pro, "g prot"] })] }, template.label))) })] }), _jsxs("section", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", className: "flex-1 flex items-center justify-center gap-2", onClick: () => updateNutrition(todayStr, todayLog.calories + 100, todayLog.protein), children: [_jsx(Plus, { size: 16 }), " 100 kcal"] }), _jsxs(Button, { variant: "outline", className: "flex-1 flex items-center justify-center gap-2", onClick: () => updateNutrition(todayStr, todayLog.calories, todayLog.protein + 10), children: [_jsx(Plus, { size: 16 }), " 10g Prot"] })] }), _jsx("button", { onClick: () => updateNutrition(todayStr, 0, 0), className: "w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted/30 hover:text-red-500/50 transition-colors", children: "Reset Daily Counters" }), _jsxs("section", { children: [_jsx("h2", { className: "text-xl font-bold mb-3", children: "Rate your day" }), _jsx("div", { className: "flex gap-2", children: ['Good', 'OK', 'Bad'].map(r => (_jsxs("button", { onClick: () => setRating(r), className: cn("flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center gap-1", todayLog.rating === r
                                ? r === 'Good' ? "bg-primary/20 border-primary text-primary"
                                    : r === 'Bad' ? "bg-red-500/20 border-red-500 text-red-500"
                                        : "bg-white/20 border-white text-white"
                                : "bg-white/5 border-white/10 text-muted"), children: [_jsx("span", { className: "text-lg", children: r === 'Good' ? '✅' : r === 'Bad' ? '❌' : '😐' }), _jsx("span", { className: "text-xs font-bold uppercase", children: r })] }, r))) })] })] }));
};
export default Nutrition;
//# sourceMappingURL=Nutrition.js.map