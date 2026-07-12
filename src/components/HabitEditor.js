import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Type, Hash, Calendar, CalendarDays } from 'lucide-react';
import { Button, cn } from './UI';
const COMMON_EMOJIS = [
    '🏋️', '🏃', '🧘', '🏊', '🚴', '💪', '🍎', '🥗', '🍗', '🍳', '🥑', '🥦',
    '💧', '☕', '🍵', '🧃', '🥤', '📚', '📖', '📝', '🧠', '💻',
    '📱', '📵', '🎮', '🚫', '🚬', '💊', '🧪', '😴', '🛌', '🌅', '🚶', '🚗',
    '💰', '📈', '🗑️', '🧹', '🧺', '🌱', '☀️', '☔'
];
export const HabitEditor = ({ habit, onClose, onSave }) => {
    const [name, setName] = useState(habit?.name || '');
    const [emoji, setEmoji] = useState(habit?.emoji || '✨');
    const [type, setType] = useState(habit?.type || 'checkbox');
    const [frequency, setFrequency] = useState(habit?.frequency || 'daily');
    const [target, setTarget] = useState(habit?.target?.toString() || '');
    const [unit, setUnit] = useState(habit?.unit || '');
    const [customEmoji, setCustomEmoji] = useState('');
    const handleSave = () => {
        if (!name.trim())
            return alert('El nombre es requerido');
        if (type === 'numeric' && (!target || isNaN(Number(target))))
            return alert('El objetivo numérico es requerido y debe ser un número');
        const newHabit = {
            id: habit?.id || Math.random().toString(36).substring(2, 9),
            name: name.trim(),
            emoji: emoji,
            type,
            frequency,
            createdAt: habit?.createdAt || new Date().toISOString(),
        };
        if (type === 'numeric') {
            newHabit.target = Number(target);
            if (unit.trim())
                newHabit.unit = unit.trim();
        }
        onSave(newHabit);
    };
    const handleCustomEmoji = (val) => {
        setCustomEmoji(val);
        if (val.trim())
            setEmoji(val.trim());
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [_jsxs("header", { className: "flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-10", children: [_jsx("button", { onClick: onClose, className: "p-2 bg-white/5 rounded-full text-muted", children: _jsx(X, { size: 20 }) }), _jsx("h2", { className: "font-black text-xl", children: habit ? 'Editar Hábito' : 'Nuevo Hábito' }), _jsx("button", { onClick: handleSave, className: "p-2 bg-primary text-black rounded-full", children: _jsx(Save, { size: 20 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-8 pb-32", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase tracking-widest", children: "Nombre del H\u00E1bito" }), _jsx("input", { type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Ej. Leer 2 p\u00E1ginas", className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary text-white" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "text-xs font-bold text-muted uppercase tracking-widest flex justify-between", children: [_jsx("span", { children: "Icono (Emoji)" }), _jsx("span", { className: "text-primary text-lg leading-none", children: emoji })] }), _jsx("div", { className: "grid grid-cols-7 gap-2", children: COMMON_EMOJIS.map(e => (_jsx("button", { onClick: () => { setEmoji(e); setCustomEmoji(''); }, className: cn("text-2xl p-2 rounded-xl transition-all active:scale-90", emoji === e ? "bg-primary/20 ring-1 ring-primary" : "bg-white/5 hover:bg-white/10"), children: e }, e))) }), _jsxs("div", { className: "pt-2", children: [_jsx("label", { className: "text-[10px] font-bold text-muted uppercase mb-1 block", children: "O escribe uno propio:" }), _jsx("input", { type: "text", maxLength: 4, value: customEmoji, onChange: e => handleCustomEmoji(e.target.value), placeholder: "Pegar emoji...", className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold text-center focus:outline-none focus:border-primary text-white" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase tracking-widest", children: "Tipo de registro" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => setType('checkbox'), className: cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all", type === 'checkbox' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"), children: [_jsx(Type, { size: 24 }), _jsx("span", { className: "font-bold text-sm", children: "S\u00ED / No" })] }), _jsxs("button", { onClick: () => setType('numeric'), className: cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all", type === 'numeric' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"), children: [_jsx(Hash, { size: 24 }), _jsx("span", { className: "font-bold text-sm", children: "Num\u00E9rico" })] })] })] }), type === 'numeric' && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "space-y-3", children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-muted uppercase", children: "Objetivo (Cant)" }), _jsx("input", { type: "number", value: target, onChange: e => setTarget(e.target.value), placeholder: "Ej. 140", className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-primary text-white" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-muted uppercase", children: "Unidad (Opcional)" }), _jsx("input", { type: "text", value: unit, onChange: e => setUnit(e.target.value), placeholder: "Ej. g, ml, km", className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-primary text-white" })] })] }) })), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase tracking-widest", children: "Frecuencia" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => setFrequency('daily'), className: cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all", frequency === 'daily' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"), children: [_jsx(CalendarDays, { size: 24 }), _jsx("span", { className: "font-bold text-sm", children: "Diario" })] }), _jsxs("button", { onClick: () => setFrequency('weekly'), className: cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all", frequency === 'weekly' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"), children: [_jsx(Calendar, { size: 24 }), _jsx("span", { className: "font-bold text-sm", children: "Semanal" })] })] })] })] })] }));
};
//# sourceMappingURL=HabitEditor.js.map