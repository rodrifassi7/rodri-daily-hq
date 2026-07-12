import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from './UI';
import { ClipboardCheck, TrendingUp, TrendingDown, Minus, Pencil } from 'lucide-react';
import { format, startOfWeek, subDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
const num = (v) => (v === '' ? 0 : Number(v));
const Field = ({ label, value, onChange, suffix }) => (_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-[10px] font-black text-muted uppercase tracking-widest", children: label }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("input", { type: "number", inputMode: "decimal", className: "w-full bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary text-sm", value: value, onChange: (e) => onChange(e.target.value), placeholder: "0" }), suffix && _jsx("span", { className: "text-xs text-muted font-bold", children: suffix })] })] }));
const Delta = ({ curr, prev, invert, unit }) => {
    if (prev === undefined)
        return null;
    const diff = curr - prev;
    if (diff === 0)
        return _jsx(Minus, { size: 12, className: "text-muted inline" });
    const good = invert ? diff < 0 : diff > 0;
    const Icon = diff > 0 ? TrendingUp : TrendingDown;
    return (_jsxs("span", { className: good ? 'text-green-500' : 'text-red-500', children: [_jsx(Icon, { size: 12, className: "inline mr-0.5" }), diff > 0 ? '+' : '', Math.round(diff * 10) / 10, unit] }));
};
const MondayRitual = () => {
    const { data, updateData } = useApp();
    const mondayKey = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const current = data.weeklyReviews.find(r => r.weekOf === mondayKey);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        viandasDia: current ? String(current.viandasDia) : '',
        clientesNuevos: current ? String(current.clientesNuevos) : '',
        enRiesgoContactados: current ? String(current.enRiesgoContactados) : '',
        cajaSemana: current ? String(current.cajaSemana) : '',
        horasNppro: current ? String(current.horasNppro) : '',
        peso: current ? String(current.peso) : '',
        medida: current ? String(current.medida) : '',
        focoSemana: current ? current.focoSemana : '',
    });
    // Auto-computed from existing app data (last 7 days)
    const auto = useMemo(() => {
        const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(startOfToday(), i), 'yyyy-MM-dd'));
        const entrenamientos = data.gymSessions.filter(s => last7.includes(s.date)).length;
        const estudio = data.studyHabitId ? data.habitLogs.filter(l => l.habitId === data.studyHabitId && last7.includes(l.date) && l.completed).length : 0;
        return { entrenamientos, estudio };
    }, [data.gymSessions, data.habitLogs, data.studyHabitId]);
    const sorted = useMemo(() => [...data.weeklyReviews].sort((a, b) => b.weekOf.localeCompare(a.weekOf)), [data.weeklyReviews]);
    const save = () => {
        const review = {
            id: current?.id ?? Math.random().toString(36).substring(2, 9),
            weekOf: mondayKey,
            viandasDia: num(form.viandasDia),
            clientesNuevos: num(form.clientesNuevos),
            enRiesgoContactados: num(form.enRiesgoContactados),
            cajaSemana: num(form.cajaSemana),
            horasNppro: num(form.horasNppro),
            peso: num(form.peso),
            medida: num(form.medida),
            focoSemana: form.focoSemana,
            createdAt: current?.createdAt ?? new Date().toISOString(),
        };
        const others = data.weeklyReviews.filter(r => r.weekOf !== mondayKey);
        updateData({ weeklyReviews: [...others, review] });
        setEditing(false);
    };
    const prev = sorted.find(r => r.weekOf < mondayKey);
    const showForm = !current || editing;
    return (_jsxs("section", { children: [_jsxs("h2", { className: "text-xl font-bold mb-3 flex items-center gap-2", children: [_jsx(ClipboardCheck, { size: 20, className: "text-primary" }), "Ritual de Lunes"] }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsxs("div", { className: "flex-1 bg-card border border-border rounded-xl p-3 text-center", children: [_jsxs("div", { className: "text-xl font-black", children: [auto.entrenamientos, "/4"] }), _jsx("div", { className: "text-[9px] font-black text-muted uppercase tracking-widest", children: "Entrenos (auto)" })] }), _jsxs("div", { className: "flex-1 bg-card border border-border rounded-xl p-3 text-center", children: [_jsxs("div", { className: "text-xl font-black", children: [auto.estudio, "/7"] }), _jsx("div", { className: "text-[9px] font-black text-muted uppercase tracking-widest", children: "Estudio (auto)" })] })] }), showForm ? (_jsxs(Card, { className: "p-4 space-y-3", children: [_jsx("div", { className: "text-[10px] font-black text-primary uppercase tracking-widest", children: "NPPRO" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Viandas/d\u00EDa", value: form.viandasDia, onChange: v => setForm(f => ({ ...f, viandasDia: v })) }), _jsx(Field, { label: "Clientes nuevos", value: form.clientesNuevos, onChange: v => setForm(f => ({ ...f, clientesNuevos: v })) }), _jsx(Field, { label: "En riesgo contactados", value: form.enRiesgoContactados, onChange: v => setForm(f => ({ ...f, enRiesgoContactados: v })) }), _jsx(Field, { label: "Caja semana", value: form.cajaSemana, onChange: v => setForm(f => ({ ...f, cajaSemana: v })), suffix: "$" })] }), _jsx(Field, { label: "Horas que me pidi\u00F3 NPPRO", value: form.horasNppro, onChange: v => setForm(f => ({ ...f, horasNppro: v })), suffix: "hs" }), _jsx("div", { className: "text-[10px] font-black text-primary uppercase tracking-widest pt-2", children: "Cuerpo" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Peso", value: form.peso, onChange: v => setForm(f => ({ ...f, peso: v })), suffix: "kg" }), _jsx(Field, { label: "Medida", value: form.medida, onChange: v => setForm(f => ({ ...f, medida: v })), suffix: "cm" })] }), _jsx("div", { className: "text-[10px] font-black text-primary uppercase tracking-widest pt-2", children: "La pregunta de la semana" }), _jsx("textarea", { className: "w-full bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary min-h-[70px] text-sm", placeholder: "\u00BFQu\u00E9 UNA cosa muevo esta semana que sume viandas/d\u00EDa o me acerque al club?", value: form.focoSemana, onChange: (e) => setForm(f => ({ ...f, focoSemana: e.target.value })) }), _jsx(Button, { className: "w-full", onClick: save, children: "Guardar semana" })] })) : (_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "text-xs font-bold text-muted", children: ["Semana del ", format(new Date(mondayKey + 'T00:00:00'), "d 'de' MMMM", { locale: es }), " \u2705"] }), _jsx("button", { onClick: () => setEditing(true), className: "text-muted hover:text-white", children: _jsx(Pencil, { size: 14 }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-black", children: current.viandasDia }), _jsxs("div", { className: "text-[9px] font-black text-muted uppercase", children: ["Viandas/d\u00EDa ", _jsx(Delta, { curr: current.viandasDia, prev: prev?.viandasDia })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-black", children: [current.peso, _jsx("span", { className: "text-sm", children: "kg" })] }), _jsxs("div", { className: "text-[9px] font-black text-muted uppercase", children: ["Peso ", _jsx(Delta, { curr: current.peso, prev: prev?.peso, unit: "kg" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-black", children: [current.horasNppro, _jsx("span", { className: "text-sm", children: "hs" })] }), _jsxs("div", { className: "text-[9px] font-black text-muted uppercase", children: ["Hs NPPRO ", _jsx(Delta, { curr: current.horasNppro, prev: prev?.horasNppro, invert: true, unit: "hs" })] })] })] }), current.focoSemana && (_jsxs("div", { className: "mt-3 text-xs text-white/80 bg-primary/10 border border-primary/20 rounded-xl p-3", children: ["\uD83C\uDFAF ", current.focoSemana] }))] })), sorted.filter(r => r.weekOf !== mondayKey).length > 0 && (_jsx("div", { className: "mt-3 space-y-2", children: sorted.filter(r => r.weekOf !== mondayKey).slice(0, 8).map((r) => (_jsxs("div", { className: "flex justify-between items-center bg-card/50 border border-border rounded-xl px-3 py-2 text-xs", children: [_jsx("span", { className: "text-muted font-bold", children: format(new Date(r.weekOf + 'T00:00:00'), 'd MMM', { locale: es }) }), _jsxs("span", { className: "font-black", children: ["\uD83C\uDF71 ", r.viandasDia, "/d\u00EDa"] }), _jsxs("span", { className: "font-black", children: ["\u2696\uFE0F ", r.peso, "kg"] }), _jsxs("span", { className: "font-black", children: ["\u23F1 ", r.horasNppro, "hs"] })] }, r.id))) }))] }));
};
export default MondayRitual;
//# sourceMappingURL=MondayRitual.js.map