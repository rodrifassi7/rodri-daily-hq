import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { format, startOfToday, isSameDay } from 'date-fns';
import { Card, ProgressBar, Button, Badge } from '../components/UI';
import { CheckCircle2, Circle, Trophy, Flame, Dumbbell, Apple, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
const Home = () => {
    const { data, toggleHabit, updateTraining, updateNutrition } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const todayHabits = useMemo(() => {
        return data.habits.map(h => ({
            ...h,
            completed: data.habitLogs.some(l => l.habitId === h.id && l.date === todayStr && l.completed)
        }));
    }, [data.habits, data.habitLogs, todayStr]);
    const todayTasks = useMemo(() => {
        return data.tasks.filter(t => t.isTop3);
    }, [data.tasks]);
    const todayTraining = useMemo(() => {
        return data.trainingLogs.find(l => l.date === todayStr);
    }, [data.trainingLogs, todayStr]);
    const todayNutrition = useMemo(() => {
        return data.nutritionLogs.find(l => l.date === todayStr) || { calories: 0, protein: 0 };
    }, [data.nutritionLogs, todayStr]);
    const dayScore = useMemo(() => {
        const habitScore = todayHabits.length > 0 ? (todayHabits.filter(h => h.completed).length / todayHabits.length) * 40 : 0;
        const trainingScore = todayTraining ? 20 : 0;
        const nutritionScore = (Math.min(1, todayNutrition.calories / 2811) * 10 + Math.min(1, todayNutrition.protein / 140) * 20);
        const taskScore = todayTasks.length > 0 ? (todayTasks.filter(t => t.completed).length / todayTasks.length) * 10 : 0;
        return Math.round(habitScore + trainingScore + nutritionScore + taskScore);
    }, [todayHabits, todayTraining, todayNutrition, todayTasks]);
    const streak = useMemo(() => {
        // Simple streak calculation: count consecutive days with at least one habit done
        let count = 0;
        let curr = startOfToday();
        while (true) {
            const dStr = format(curr, 'yyyy-MM-dd');
            const hasHabit = data.habitLogs.some(l => l.date === dStr && l.completed);
            if (hasHabit) {
                count++;
                curr = new Date(curr.setDate(curr.getDate() - 1));
            }
            else {
                break;
            }
        }
        return count;
    }, [data.habitLogs]);
    return (_jsxs("div", { className: "space-y-6 pb-8", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-black", children: format(new Date(), 'EEEE') }), _jsx("p", { className: "text-muted font-medium", children: format(new Date(), 'MMMM d, yyyy') })] }), _jsxs("div", { className: "flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20", children: [_jsx(Flame, { size: 18, className: "text-primary fill-primary" }), _jsx("span", { className: "font-bold text-primary", children: streak })] })] }), _jsxs(Card, { className: "bg-gradient-to-br from-card to-black relative overflow-hidden ring-1 ring-white/10", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: "Day Score" }), _jsx("p", { className: "text-xs text-muted", children: "Keep pushing, Rodri!" })] }), _jsxs("div", { className: "text-3xl font-black text-primary", children: [dayScore, "%"] })] }), _jsx(ProgressBar, { progress: dayScore })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(ListTodo, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold", children: "Top 3 Today" })] }), _jsx("div", { className: "space-y-2", children: todayTasks.length === 0 ? (_jsx(Card, { className: "py-8 text-center border-dashed", children: _jsx("p", { className: "text-muted text-sm", children: "No top tasks selected." }) })) : (todayTasks.map(task => (_jsxs(Card, { className: "p-3 mb-2 flex items-center gap-3 active:scale-[0.98]", children: [_jsx("div", { className: task.completed ? "text-primary" : "text-muted", children: task.completed ? _jsx(CheckCircle2, { size: 24 }) : _jsx(Circle, { size: 24 }) }), _jsx("span", { className: task.completed ? "line-through text-muted" : "font-medium", children: task.title })] }, task.id)))) })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold", children: "Habits" })] }), _jsxs("span", { className: "text-xs text-muted", children: [todayHabits.filter(h => h.completed).length, "/", todayHabits.length] })] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: todayHabits.slice(0, 6).map(habit => (_jsxs("button", { onClick: () => toggleHabit(habit.id, todayStr), className: cn("p-3 rounded-xl border flex items-center gap-2 transition-all active:scale-95", habit.completed
                                ? "bg-primary/20 border-primary/50 text-white"
                                : "bg-card border-border text-muted"), children: [_jsx("span", { className: "text-xl", children: habit.emoji }), _jsx("span", { className: "text-xs font-bold truncate", children: habit.name })] }, habit.id))) })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Dumbbell, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold", children: "Training" })] }), _jsxs(Card, { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm font-medium", children: ["Status: ", todayTraining?.type || 'Not logged'] }), _jsx(Badge, { color: todayTraining?.type ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted', children: todayTraining ? 'DONE ✅' : 'PENDING' })] }), _jsx("div", { className: "flex gap-2", children: ['Gym', 'Padel', 'Rest'].map(type => (_jsx(Button, { variant: todayTraining?.type === type ? 'primary' : 'outline', className: "flex-1 py-2 text-xs", onClick: () => updateTraining(todayStr, type), children: type }, type))) })] })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Apple, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold", children: "Nutrition" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Card, { className: "mb-0 flex flex-col gap-2", children: [_jsxs("div", { className: "flex justify-between items-end", children: [_jsx("span", { className: "text-xs font-bold text-muted", children: "CALORIES" }), _jsxs("span", { className: "text-sm font-black", children: [todayNutrition.calories, "/2811"] })] }), _jsx(ProgressBar, { progress: (todayNutrition.calories / 2811) * 100 }), _jsx("div", { className: "flex gap-1 mt-1", children: _jsx("button", { onClick: () => updateNutrition(todayStr, todayNutrition.calories + 300, todayNutrition.protein), className: "flex-1 text-[10px] font-bold bg-white/5 py-1 rounded-md active:bg-white/10", children: "+300" }) })] }), _jsxs(Card, { className: "mb-0 flex flex-col gap-2", children: [_jsxs("div", { className: "flex justify-between items-end", children: [_jsx("span", { className: "text-xs font-bold text-muted", children: "PROTEIN" }), _jsxs("span", { className: "text-sm font-black", children: [todayNutrition.protein, "g/140g"] })] }), _jsx(ProgressBar, { progress: (todayNutrition.protein / 140) * 100 }), _jsx("div", { className: "flex gap-1 mt-1", children: _jsx("button", { onClick: () => updateNutrition(todayStr, todayNutrition.calories, todayNutrition.protein + 20), className: "flex-1 text-[10px] font-bold bg-white/5 py-1 rounded-md active:bg-white/10", children: "+20g" }) })] })] })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Trophy, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold", children: "Weekly Summary" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [_jsx("div", { className: "text-xs text-muted mb-1", children: "STREAK" }), _jsx("div", { className: "text-lg font-black", children: streak })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [_jsx("div", { className: "text-xs text-muted mb-1", children: "GYM" }), _jsxs("div", { className: "text-lg font-black", children: [data.trainingLogs.filter(l => l.type === 'Gym').length, "/4"] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [_jsx("div", { className: "text-xs text-muted mb-1", children: "PADEL" }), _jsxs("div", { className: "text-lg font-black", children: [data.trainingLogs.filter(l => l.type === 'Padel').length, "/3"] })] })] })] })] }));
};
export default Home;
//# sourceMappingURL=Home.js.map