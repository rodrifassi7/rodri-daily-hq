import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar, Badge } from '../components/UI';
import { PieChart, Download, Upload, Trash2, Github, ExternalLink, Star, Dumbbell, Apple, CheckSquare } from 'lucide-react';
import { exportData, importData } from '../utils/storage';
import { format, subDays, startOfToday } from 'date-fns';
const Review = () => {
    const { data, updateData, resetData } = useApp();
    const stats = useMemo(() => {
        const today = startOfToday();
        const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd'));
        const habitCompletion = data.habitLogs.filter(l => last7Days.includes(l.date) && l.completed).length;
        const totalHabitPotential = data.habits.length * 7;
        const habitRate = totalHabitPotential > 0 ? (habitCompletion / totalHabitPotential) * 100 : 0;
        const totalTrainings = data.trainingLogs.filter(l => last7Days.includes(l.date) && l.type !== 'Rest').length;
        const nutritionLogs = data.nutritionLogs.filter(l => last7Days.includes(l.date));
        const avgProtein = nutritionLogs.length > 0 ? nutritionLogs.reduce((acc, l) => acc + l.protein, 0) / nutritionLogs.length : 0;
        const completedTasks = data.tasks.filter(t => t.completed).length;
        return {
            habitRate: Math.round(habitRate),
            totalTrainings,
            avgProtein: Math.round(avgProtein),
            completedTasks
        };
    }, [data]);
    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await importData(file);
                window.location.reload();
            }
            catch (err) {
                alert('Failed to import data');
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-8", children: [_jsx("header", { className: "flex justify-between items-center", children: _jsx("h1", { className: "text-3xl font-black", children: "Review" }) }), _jsxs("section", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Card, { className: "flex flex-col items-center justify-center p-6 text-center", children: [_jsx(CheckSquare, { size: 24, className: "text-primary mb-2" }), _jsxs("div", { className: "text-3xl font-black", children: [stats.habitRate, "%"] }), _jsx("div", { className: "text-[10px] font-black text-muted uppercase tracking-widest mt-1", children: "Habit rate" })] }), _jsxs(Card, { className: "flex flex-col items-center justify-center p-6 text-center", children: [_jsx(Dumbbell, { size: 24, className: "text-primary mb-2" }), _jsx("div", { className: "text-3xl font-black", children: stats.totalTrainings }), _jsx("div", { className: "text-[10px] font-black text-muted uppercase tracking-widest mt-1", children: "Trainings" })] }), _jsxs(Card, { className: "flex flex-col items-center justify-center p-6 text-center", children: [_jsx(Apple, { size: 24, className: "text-primary mb-2" }), _jsxs("div", { className: "text-3xl font-black", children: [stats.avgProtein, "g"] }), _jsx("div", { className: "text-[10px] font-black text-muted uppercase tracking-widest mt-1", children: "Avg Protein" })] }), _jsxs(Card, { className: "flex flex-col items-center justify-center p-6 text-center", children: [_jsx(Star, { size: 24, className: "text-primary mb-2" }), _jsx("div", { className: "text-3xl font-black", children: stats.completedTasks }), _jsx("div", { className: "text-[10px] font-black text-muted uppercase tracking-widest mt-1", children: "Total Tasks" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-xl font-bold mb-3", children: "Next Week Focus" }), _jsx("textarea", { className: "w-full bg-card border border-border rounded-2xl p-4 text-white outline-none focus:border-primary min-h-[120px] text-sm leading-relaxed", placeholder: "What is your main goal for next week?", value: data.nextWeekFocus, onChange: (e) => updateData({ nextWeekFocus: e.target.value }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-xl font-bold mb-3", children: "Settings & Data" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", className: "flex-1 flex items-center justify-center gap-2", onClick: exportData, children: [_jsx(Download, { size: 18 }), " Export JSON"] }), _jsxs("label", { className: "flex-1", children: [_jsx("input", { type: "file", accept: ".json", onChange: handleImport, className: "hidden" }), _jsxs("div", { className: "flex items-center justify-center gap-2 border border-border px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 text-white cursor-pointer bg-transparent", children: [_jsx(Upload, { size: 18 }), " Import JSON"] })] })] }), _jsxs(Button, { variant: "outline", className: "w-full text-red-500 border-red-500/20 hover:bg-red-500/10 flex items-center justify-center gap-2", onClick: () => {
                                    if (confirm('DANGER: This will delete ALL your data forever. Continue?')) {
                                        resetData();
                                        window.location.reload();
                                    }
                                }, children: [_jsx(Trash2, { size: 18 }), " Wipe All Data"] })] })] }), _jsxs("footer", { className: "text-center py-8", children: [_jsx("div", { className: "text-[10px] font-black text-muted uppercase tracking-[0.2em]", children: "Rodri Daily HQ v1.0" }), _jsx("div", { className: "mt-2 text-[10px] text-muted/50", children: "Production Ready PWA" })] })] }));
};
export default Review;
//# sourceMappingURL=Review.js.map