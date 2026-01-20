import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar } from '../components/UI';
import { Plus, Trash2, Edit2, ChevronRight, Check } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
const Habits = () => {
    const { data, toggleHabit, updateData } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const deleteHabit = (id) => {
        if (confirm('Are you sure?')) {
            updateData({
                habits: data.habits.filter(h => h.id !== id),
                habitLogs: data.habitLogs.filter(l => l.habitId !== id)
            });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-black", children: "Habits" }), _jsx(Button, { variant: "primary", className: "p-2 rounded-full w-10 h-10 flex items-center justify-center", onClick: () => alert('Feature coming soon: Custom Habits'), children: _jsx(Plus, { size: 24 }) })] }), _jsx("div", { className: "space-y-3", children: data.habits.map(habit => {
                    const isCompleted = data.habitLogs.some(l => l.habitId === habit.id && l.date === todayStr && l.completed);
                    // Calculate streak for this habit
                    let streak = 0;
                    let curr = startOfToday();
                    while (true) {
                        const dStr = format(curr, 'yyyy-MM-dd');
                        if (data.habitLogs.some(l => l.habitId === habit.id && l.date === dStr && l.completed)) {
                            streak++;
                            curr = new Date(curr.setDate(curr.getDate() - 1));
                        }
                        else {
                            break;
                        }
                    }
                    return (_jsxs(Card, { className: cn("flex items-center justify-between p-4", isCompleted ? "border-primary/30 ring-1 ring-primary/20" : ""), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-3xl", children: habit.emoji }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold", children: habit.name }), _jsx("div", { className: "flex items-center gap-2 mt-1", children: _jsxs("span", { className: "text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-black", children: ["STREAK: ", streak] }) })] })] }), _jsx("button", { onClick: () => toggleHabit(habit.id, todayStr), className: cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90", isCompleted ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-muted"), children: isCompleted ? _jsx(Check, { size: 28, strokeWidth: 3 }) : _jsx("div", { className: "w-6 h-6 rounded-full border-2 border-muted/30" }) })] }, habit.id));
                }) })] }));
};
// Helper inside Habits for cleaner code
export default Habits;
//# sourceMappingURL=Habits.js.map