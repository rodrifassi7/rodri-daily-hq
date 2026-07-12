import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './UI';
import { Plus, Archive, RotateCcw } from 'lucide-react';
import { format, isMonday, getDate } from 'date-fns';
import { es } from 'date-fns/locale';
const ParkingLot = () => {
    const { data, updateData } = useApp();
    const [text, setText] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const active = data.parkedIdeas.filter(i => !i.archived);
    const archived = data.parkedIdeas.filter(i => i.archived);
    // Reminder: first Monday of the month → review day
    const today = new Date();
    const isReviewDay = isMonday(today) && getDate(today) <= 7;
    const addIdea = () => {
        const t = text.trim();
        if (!t)
            return;
        const idea = {
            id: Math.random().toString(36).substring(2, 9),
            text: t,
            archived: false,
            createdAt: new Date().toISOString(),
        };
        updateData({ parkedIdeas: [...data.parkedIdeas, idea] });
        setText('');
    };
    const toggleArchive = (id) => {
        updateData({
            parkedIdeas: data.parkedIdeas.map(i => i.id === id ? { ...i, archived: !i.archived } : i)
        });
    };
    return (_jsxs("section", { children: [_jsx("h2", { className: "text-xl font-bold mb-3", children: "\uD83C\uDD7F\uFE0F Estacionamiento de ideas" }), isReviewDay && (_jsx("div", { className: "mb-3 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl p-3", children: "\uD83D\uDCC5 Primer lunes del mes: 15 minutos para revisar la lista. Casi todo vuelve a guardarse \u2014 y est\u00E1 bien." })), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("input", { className: "flex-1 bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary text-sm", placeholder: "Idea nueva \u2192 ac\u00E1, no a la agenda", value: text, onChange: (e) => setText(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addIdea() }), _jsx("button", { onClick: addIdea, className: "bg-primary text-black rounded-xl px-4 font-black active:scale-95 transition-all", children: _jsx(Plus, { size: 18 }) })] }), _jsxs("div", { className: "space-y-2", children: [active.map(idea => (_jsxs(Card, { className: "p-3 flex justify-between items-start gap-2", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-white/90", children: idea.text }), _jsxs("div", { className: "text-[10px] text-muted mt-1", children: [format(new Date(idea.createdAt), 'd MMM yyyy', { locale: es }), idea.reviewNote && _jsxs("span", { className: "text-primary font-bold", children: [" \u00B7 ", idea.reviewNote] })] })] }), _jsx("button", { onClick: () => toggleArchive(idea.id), className: "text-muted hover:text-white shrink-0 p-1", children: _jsx(Archive, { size: 15 }) })] }, idea.id))), active.length === 0 && (_jsx("div", { className: "text-xs text-muted text-center py-4", children: "Estacionamiento vac\u00EDo. Cuando llegue la pr\u00F3xima idea brillante\u2026 ya sab\u00E9s d\u00F3nde va." }))] }), archived.length > 0 && (_jsx("button", { onClick: () => setShowArchived(s => !s), className: "text-[10px] font-black text-muted uppercase tracking-widest mt-3", children: showArchived ? 'Ocultar' : `Archivadas (${archived.length})` })), showArchived && archived.map(idea => (_jsxs("div", { className: "flex justify-between items-center text-xs text-muted mt-2 px-1", children: [_jsx("span", { className: "line-through", children: idea.text }), _jsx("button", { onClick: () => toggleArchive(idea.id), className: "p-1", children: _jsx(RotateCcw, { size: 13 }) })] }, idea.id)))] }));
};
export default ParkingLot;
//# sourceMappingURL=ParkingLot.js.map