import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, cn } from './UI';
import { X, Check, Timer as TimerIcon, Plus, Minus, Info } from 'lucide-react';
const Timer = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        if (timeLeft === null)
            return;
        if (timeLeft === 0) {
            onComplete();
            if (navigator.vibrate)
                navigator.vibrate([200, 100, 200]);
            setTimeLeft(null);
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, onComplete]);
    return (_jsxs("div", { className: "flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide", children: [_jsxs("span", { className: "text-xs font-bold text-muted uppercase flex items-center gap-1", children: [_jsx(TimerIcon, { size: 14 }), " REST"] }), [60, 90, 120].map(s => (_jsxs("button", { onClick: () => setTimeLeft(s), className: cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap", timeLeft === s ? "bg-primary text-black" : "bg-white/5 text-muted border border-white/10"), children: [s, "s"] }, s))), timeLeft !== null && (_jsxs("div", { className: "px-3 py-1.5 rounded-lg bg-black text-white text-xs font-black border border-primary animate-pulse", children: [Math.floor(timeLeft / 60), ":", (timeLeft % 60).toString().padStart(2, '0')] }))] }));
};
export const GymSessionView = ({ routine, date, onClose }) => {
    const { data: { gymSessions }, saveGymSession } = useApp();
    const sessionId = `${date}_${routine.id}`;
    // Find current or initialize new
    const initialSession = gymSessions.find(s => s.id === sessionId) || {
        id: sessionId,
        date,
        routineId: routine.id,
        exercises: []
    };
    const [session, setSession] = useState(initialSession);
    // Auto-save logic
    useEffect(() => {
        saveGymSession(session);
    }, [session, saveGymSession]);
    // History helper
    const getHistory = (exerciseId) => {
        return gymSessions
            .filter(s => s.routineId === routine.id && s.date < date)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(s => s.exercises.find(e => e.exerciseId === exerciseId))
            .filter(e => e !== undefined);
    };
    const handleSetUpdate = (exerciseId, setIndex, field, value) => {
        setSession(prev => {
            const newExercises = [...prev.exercises];
            let exIdx = newExercises.findIndex(e => e.exerciseId === exerciseId);
            if (exIdx === -1) {
                // Preload from last session or init empty
                const history = getHistory(exerciseId);
                let newSets = [];
                const target = routine.exercises.find(e => e.id === exerciseId)?.target;
                const setsCount = target?.sets || 3;
                const lastHistorySession = history.length > 0 ? history[0] : undefined;
                if (lastHistorySession && lastHistorySession.sets.length > 0) {
                    newSets = lastHistorySession.sets.map(s => ({ weightKg: s.weightKg, reps: s.reps, completed: false }));
                }
                else {
                    newSets = Array(setsCount).fill({ weightKg: 0, reps: 0, completed: false });
                }
                newExercises.push({ exerciseId, sets: newSets });
                exIdx = newExercises.length - 1;
            }
            let targetExData = newExercises[exIdx];
            if (!targetExData)
                return prev; // Safety
            const newSets = [...targetExData.sets];
            const currentSet = newSets[setIndex] || { weightKg: 0, reps: 0, completed: false };
            newSets[setIndex] = { ...currentSet, [field]: value };
            newExercises[exIdx] = { ...targetExData, sets: newSets };
            return { ...prev, exercises: newExercises };
        });
    };
    return (_jsxs("div", { className: "fixed inset-0 z-[100] flex flex-col bg-background", children: [_jsxs("header", { className: "p-4 border-b border-white/10 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-black", children: routine.title }), _jsx("p", { className: "text-xs text-muted font-bold tracking-widest uppercase mt-0.5", children: date })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white/5 rounded-full text-muted", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-4 pb-32", children: routine.exercises.map((ex, index) => {
                    const exData = session.exercises.find(e => e.exerciseId === ex.id);
                    const history = getHistory(ex.id);
                    const lastSession = history[0];
                    // Progression Logic
                    let status = 'none';
                    let suggestion = 'Cargando...';
                    if (history.length > 0 && lastSession) {
                        const lastTotalReps = lastSession.sets.reduce((acc, s) => acc + s.reps, 0);
                        const lastMaxWeight = Math.max(...lastSession.sets.map(s => s.weightKg));
                        const currTotalReps = exData ? exData.sets.reduce((acc, s) => acc + s.reps, 0) : 0;
                        const currMaxWeight = exData ? Math.max(...exData.sets.map(s => s.weightKg)) : 0;
                        if (exData && exData.sets.every(s => s.completed)) {
                            if (currMaxWeight > lastMaxWeight || currTotalReps > lastTotalReps) {
                                status = 'green';
                                const inc = ex.target?.isPrimary ? 2.5 : 1;
                                suggestion = `¡Progreso! Subí a ${currMaxWeight + inc}kg próxima sesión.`;
                            }
                            else {
                                // Check Stagnation over 3 sessions
                                const identicalSessions = history.slice(0, 3).filter(h => {
                                    const hTotalReps = h.sets.reduce((acc, s) => acc + s.reps, 0);
                                    const hMaxWeight = Math.max(...h.sets.map(s => s.weightKg));
                                    return Math.abs(hTotalReps - currTotalReps) <= 1 && hMaxWeight === currMaxWeight;
                                });
                                if (identicalSessions.length >= 2) { // 2 history + current = 3
                                    status = 'red';
                                    suggestion = `Estancado → mantener peso o bajar carga 5%`;
                                }
                                else {
                                    status = 'yellow';
                                    suggestion = `Manteniendo. Intentá sumar reps.`;
                                }
                            }
                        }
                        else {
                            status = 'yellow';
                            suggestion = `Última vez: ${lastMaxWeight}kg (${lastTotalReps} reps totales)`;
                        }
                    }
                    else {
                        suggestion = `Primer registro - busquemos un peso para ${ex.target?.reps || 'X'} reps`;
                    }
                    // Initialization logic for UI render
                    const setsCount = ex.target?.sets || 3;
                    const renderSets = exData?.sets || (lastSession ? lastSession.sets.map(s => ({ ...s, completed: false })) : Array(setsCount).fill({ weightKg: 0, reps: 0, completed: false }));
                    return (_jsxs(Card, { className: "p-4 border-l-4", style: {
                            borderLeftColor: status === 'green' ? '#10b981' : status === 'red' ? '#ef4444' : status === 'yellow' ? '#f59e0b' : '#333'
                        }, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-lg leading-tight flex items-center gap-2", children: [index + 1, ". ", ex.name, ex.target?.isPrimary && _jsx(Badge, { className: "text-[9px] px-1.5 py-0", children: "PRIMARY" })] }), _jsxs("p", { className: "text-xs font-bold text-muted", children: [setsCount, " sets \u2022 ", ex.target?.reps || 'X', " reps"] })] }), _jsx("div", { className: "flex items-center gap-1", children: _jsx("div", { className: cn("w-2.5 h-2.5 rounded-full", status === 'green' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                                status === 'red' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                    status === 'yellow' ? "bg-amber-500" : "bg-white/10") }) })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-2 mb-3 mt-1 flex items-start gap-2", children: [_jsx(Info, { size: 14, className: "text-muted mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-xs font-semibold text-white/80", children: suggestion })] }), _jsx("div", { className: "space-y-2", children: renderSets.map((s, i) => {
                                    // Limit array mapping up to setsCount just in case previous session had more
                                    if (i >= setsCount)
                                        return null;
                                    return (_jsxs("div", { className: cn("flex items-center gap-2 p-2 rounded-xl border transition-all", s.completed ? "bg-primary/10 border-primary/30" : "bg-black/20 border-white/5"), children: [_jsx("span", { className: "w-6 text-center text-xs font-black text-muted", children: i + 1 }), _jsxs("div", { className: "flex-1 flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("span", { className: "absolute left-2 text-[10px] text-muted top-1/2 -translate-y-1/2 font-bold pointer-events-none", children: "KG" }), _jsx("input", { type: "number", value: s.weightKg || '', onChange: e => handleSetUpdate(ex.id, i, 'weightKg', parseFloat(e.target.value) || 0), className: "w-full bg-white/5 rounded-lg py-2 pl-7 pr-2 text-sm font-black outline-none focus:bg-white/10 text-right appearance-none", placeholder: "0" })] }), _jsxs("div", { className: "relative flex-1", children: [_jsx("span", { className: "absolute left-2 text-[10px] text-muted top-1/2 -translate-y-1/2 font-bold pointer-events-none", children: "REPS" }), _jsx("input", { type: "number", value: s.reps || '', onChange: e => handleSetUpdate(ex.id, i, 'reps', parseInt(e.target.value) || 0), className: "w-full bg-white/5 rounded-lg py-2 pl-10 pr-2 text-sm font-black outline-none focus:bg-white/10 text-right appearance-none", placeholder: "0" })] })] }), _jsx("button", { onClick: () => handleSetUpdate(ex.id, i, 'completed', !s.completed), className: cn("w-10 h-10 flex items-center justify-center rounded-lg transition-all flex-shrink-0", s.completed ? "bg-primary text-black" : "bg-white/5 text-muted hover:bg-white/10"), children: _jsx(Check, { strokeWidth: 4, size: 18 }) })] }, i));
                                }) })] }, ex.id));
                }) }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none", children: _jsx("div", { className: "pointer-events-auto bg-card border border-border p-3 rounded-2xl shadow-xl", children: _jsx(Timer, { onComplete: () => console.log('Timer done') }) }) })] }));
};
//# sourceMappingURL=GymSessionView.js.map