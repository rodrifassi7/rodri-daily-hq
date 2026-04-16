import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/UI';
import { Plus, Trash2, Check, Star, Filter } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
const ToDo = () => {
    const { data, toggleTask, addTask, deleteTask, toggleTop3 } = useApp();
    const [filter, setFilter] = useState('All');
    const [showAdd, setShowAdd] = useState(false);
    // New task form state
    const [newTitle, setNewTitle] = useState('');
    const [newCat, setNewCat] = useState('Personal');
    const [newPri, setNewPri] = useState('Medium');
    const filteredTasks = useMemo(() => {
        if (filter === 'Today')
            return data.tasks.filter(t => t.isTop3 || !t.completed);
        if (filter === 'Backlog')
            return data.tasks.filter(t => !t.dueDate);
        return data.tasks;
    }, [data.tasks, filter]);
    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTitle)
            return;
        addTask({
            title: newTitle,
            category: newCat,
            priority: newPri,
        });
        setNewTitle('');
        setShowAdd(false);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-black", children: "To-Do" }), _jsx(Button, { variant: "primary", className: "p-2 rounded-full w-10 h-10 flex items-center justify-center", onClick: () => setShowAdd(!showAdd), children: _jsx(Plus, { size: 24, className: showAdd ? "rotate-45 transition-transform" : "transition-transform" }) })] }), showAdd && (_jsx(Card, { className: "animate-in slide-in-from-top duration-300", children: _jsxs("form", { onSubmit: handleAddTask, className: "space-y-4", children: [_jsx("input", { autoFocus: true, className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary text-white", placeholder: "Task title...", value: newTitle, onChange: e => setNewTitle(e.target.value) }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { className: "flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white", value: newCat, onChange: e => setNewCat(e.target.value), children: [_jsx("option", { value: "Personal", children: "Personal" }), _jsx("option", { value: "Gym", children: "Gym" }), _jsx("option", { value: "NP PRO", children: "NP PRO" })] }), _jsxs("select", { className: "flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white", value: newPri, onChange: e => setNewPri(e.target.value), children: [_jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Low", children: "Low" })] })] }), _jsx(Button, { type: "submit", className: "w-full", children: "Add Task" })] }) })), _jsx("div", { className: "flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide", children: ['All', 'Today', 'Backlog'].map(f => (_jsx("button", { onClick: () => setFilter(f), className: cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", filter === f ? "bg-white text-black" : "bg-card border border-border text-muted"), children: f }, f))) }), _jsx("div", { className: "space-y-2", children: filteredTasks.length === 0 ? (_jsx("div", { className: "py-12 text-center text-muted", children: "No tasks found." })) : (filteredTasks.sort((a, b) => Number(b.isTop3) - Number(a.isTop3)).map(task => (_jsxs(Card, { className: "p-3 mb-2 flex items-center justify-between gap-3 group", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 overflow-hidden", children: [_jsx("button", { onClick: () => toggleTask(task.id), className: cn("w-6 h-6 rounded-md flex items-center justify-center border transition-all", task.completed ? "bg-primary border-primary text-white" : "border-white/20 text-transparent"), children: _jsx(Check, { size: 14, strokeWidth: 4 }) }), _jsxs("div", { className: "flex flex-col overflow-hidden", children: [_jsx("span", { className: cn("font-medium truncate", task.completed && "line-through text-muted"), children: task.title }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsx("span", { className: "text-[8px] font-black uppercase text-muted tracking-wide", children: task.category }), _jsx("span", { className: cn("text-[8px] font-black uppercase tracking-wide", task.priority === 'High' ? "text-red-500" : task.priority === 'Medium' ? "text-orange-500" : "text-blue-500"), children: task.priority })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => toggleTop3(task.id), className: cn("p-2 rounded-lg transition-all", task.isTop3 ? "text-yellow-500 bg-yellow-500/10" : "text-muted hover:text-white"), children: _jsx(Star, { size: 18, fill: task.isTop3 ? "currentColor" : "none" }) }), _jsx("button", { onClick: () => deleteTask(task.id), className: "p-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(Trash2, { size: 18 }) })] })] }, task.id)))) })] }));
};
export default ToDo;
//# sourceMappingURL=ToDo.js.map