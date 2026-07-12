import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar } from '../components/UI';
import { Plus, Trash2, Edit2, ChevronRight, Check, GraduationCap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { HabitEditor } from '../components/HabitEditor';
import { format, startOfToday } from 'date-fns';
const Habits = () => {
    const { data, toggleHabit, deleteHabit, saveHabit, setStudyHabitId } = useApp();
    const [editingHabit, setEditingHabit] = useState(null);
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const handleDeleteHabit = (id) => {
        if (confirm('¿Seguro que quieres eliminar este hábito?')) {
            deleteHabit(id);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-black", children: "Habits" }), _jsx(Button, { variant: "primary", className: "p-2 rounded-full w-10 h-10 flex items-center justify-center", onClick: () => setEditingHabit('new'), children: _jsx(Plus, { size: 24 }) })] }), _jsx("div", { className: "space-y-3", children: data.habits.map(habit => {
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
                    return (_jsxs(Card, { className: cn("flex items-center justify-between p-4", isCompleted ? "border-primary/30 ring-1 ring-primary/20" : ""), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-3xl", children: habit.emoji }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold", children: habit.name }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("span", { className: "text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-black", children: ["STREAK: ", streak] }), data.studyHabitId === habit.id && (_jsx("span", { className: "text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded uppercase font-black", children: "ESTUDIO" }))] }), _jsxs("div", { className: "flex items-center gap-3 mt-2", children: [_jsx("button", { onClick: (e) => { e.stopPropagation(); setEditingHabit(habit); }, className: "text-muted hover:text-white transition-colors", children: _jsx(Edit2, { size: 14 }) }), _jsx("button", { onClick: (e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }, className: "text-red-500/50 hover:text-red-500 transition-colors", children: _jsx(Trash2, { size: 14 }) }), _jsx("button", { onClick: (e) => { e.stopPropagation(); setStudyHabitId(habit.id); }, className: cn("transition-colors", data.studyHabitId === habit.id ? "text-blue-500" : "text-muted hover:text-white"), children: _jsx(GraduationCap, { size: 16 }) })] })] })] }), _jsx("button", { onClick: () => toggleHabit(habit.id, todayStr), className: cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90", isCompleted ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-muted"), children: isCompleted ? _jsx(Check, { size: 28, strokeWidth: 3 }) : _jsx("div", { className: "w-6 h-6 rounded-full border-2 border-muted/30" }) })] }, habit.id));
                }) }), _jsx(AnimatePresence, { children: editingHabit !== null && (_jsx(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: "fixed inset-0 z-[100] flex", children: _jsx(HabitEditor, { habit: editingHabit === 'new' ? null : editingHabit, onClose: () => setEditingHabit(null), onSave: (habit) => {
                            saveHabit(habit);
                            setEditingHabit(null);
                        } }) })) })] }));
};
// Helper inside Habits for cleaner code
export default Habits;
//# sourceMappingURL=Habits.js.map