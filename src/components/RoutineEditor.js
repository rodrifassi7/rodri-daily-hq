import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Card, Button, cn } from './UI';
export const RoutineEditor = ({ routine, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(routine?.title || '');
    const [exercises, setExercises] = useState(routine?.exercises || []);
    const [editingExerciseIdx, setEditingExerciseIdx] = useState(null);
    // Temp state for editing an exercise
    const [tempExercise, setTempExercise] = useState(null);
    const handleSave = () => {
        if (!title.trim())
            return alert('El título es requerido');
        if (exercises.length === 0)
            return alert('Agrega al menos un ejercicio');
        const newRoutine = {
            id: routine?.id || Math.random().toString(36).substring(2, 9),
            title: title.trim(),
            exercises
        };
        onSave(newRoutine);
    };
    const handleDeleteRoutine = () => {
        if (routine && onDelete) {
            if (window.confirm('¿Seguro que quieres eliminar esta rutina?')) {
                onDelete(routine.id);
            }
        }
    };
    const moveExercise = (index, direction) => {
        if (direction === 'up' && index === 0)
            return;
        if (direction === 'down' && index === exercises.length - 1)
            return;
        const newExercises = [...exercises];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const current = newExercises[index];
        const swap = newExercises[swapIndex];
        if (current && swap) {
            newExercises[index] = swap;
            newExercises[swapIndex] = current;
        }
        setExercises(newExercises);
    };
    const removeExercise = (index) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };
    const startEditingExercise = (index) => {
        setEditingExerciseIdx(index);
        setTempExercise(exercises[index] || null);
    };
    const startAddingExercise = () => {
        setEditingExerciseIdx(exercises.length);
        setTempExercise({
            id: Math.random().toString(36).substring(2, 9),
            name: '',
            target: { sets: 3, minReps: 8, maxReps: 12, reps: '8-12', isPrimary: false }
        });
    };
    const saveExercise = () => {
        if (!tempExercise || !tempExercise.name.trim())
            return alert('El nombre es requerido');
        const newExercises = [...exercises];
        if (editingExerciseIdx !== null && editingExerciseIdx < exercises.length) {
            newExercises[editingExerciseIdx] = tempExercise;
        }
        else {
            newExercises.push(tempExercise);
        }
        setExercises(newExercises);
        setEditingExerciseIdx(null);
        setTempExercise(null);
    };
    const cancelExercise = () => {
        setEditingExerciseIdx(null);
        setTempExercise(null);
    };
    const handleTempExerciseChange = (field, value) => {
        if (!tempExercise)
            return;
        if (field === 'name') {
            setTempExercise({ ...tempExercise, name: value });
        }
        else {
            const newTarget = { ...tempExercise.target, [field]: value };
            if (field === 'minReps' || field === 'maxReps') {
                newTarget.reps = `${newTarget.minReps}-${newTarget.maxReps}`;
            }
            setTempExercise({ ...tempExercise, target: newTarget });
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [_jsxs("header", { className: "flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-10", children: [_jsx("button", { onClick: onClose, className: "p-2 bg-white/5 rounded-full text-muted", children: _jsx(X, { size: 20 }) }), _jsx("h2", { className: "font-black text-xl", children: routine ? 'Editar Rutina' : 'Nueva Rutina' }), _jsx("button", { onClick: handleSave, className: "p-2 bg-primary text-black rounded-full", children: _jsx(Save, { size: 20 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-6 pb-32", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Nombre de la Rutina" }), _jsx("input", { type: "text", value: title, onChange: e => setTitle(e.target.value), placeholder: "Ej. Upper Body A", className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Ejercicios" }), _jsxs(Button, { variant: "ghost", onClick: startAddingExercise, className: "text-primary p-2 text-sm", children: [_jsx(Plus, { size: 16, className: "inline mr-1" }), " Agregar"] })] }), exercises.length === 0 ? (_jsx("div", { className: "text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted text-sm", children: "No hay ejercicios. Agrega uno para empezar." })) : (_jsx("div", { className: "space-y-2", children: exercises.map((ex, idx) => (_jsxs(Card, { className: "p-3 mb-0 flex items-center gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("button", { onClick: () => moveExercise(idx, 'up'), disabled: idx === 0, className: "text-muted disabled:opacity-20 active:text-white", children: _jsx(ArrowUp, { size: 16 }) }), _jsx("button", { onClick: () => moveExercise(idx, 'down'), disabled: idx === exercises.length - 1, className: "text-muted disabled:opacity-20 active:text-white", children: _jsx(ArrowDown, { size: 16 }) })] }), _jsxs("div", { className: "flex-1 cursor-pointer", onClick: () => startEditingExercise(idx), children: [_jsxs("div", { className: "font-bold flex items-center gap-2", children: [ex.name, ex.target.isPrimary && _jsx("span", { className: "w-2 h-2 rounded-full bg-primary" })] }), _jsxs("div", { className: "text-xs text-muted", children: [ex.target.sets, " sets x ", ex.target.reps, " reps"] })] }), _jsx("button", { onClick: () => removeExercise(idx), className: "p-2 text-red-500/50 hover:text-red-500 rounded-full", children: _jsx(Trash2, { size: 18 }) })] }, ex.id))) }))] }), routine && onDelete && (_jsx("div", { className: "pt-8", children: _jsx(Button, { variant: "outline", onClick: handleDeleteRoutine, className: "w-full text-red-500 border-red-500/30 hover:bg-red-500/10", children: "Eliminar Rutina" }) }))] }), tempExercise && (_jsx("div", { className: "fixed inset-0 z-[60] flex items-end bg-black/80 backdrop-blur-sm", children: _jsxs(motion.div, { initial: { y: '100%' }, animate: { y: 0 }, className: "w-full bg-card border-t border-white/10 rounded-t-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto pb-10", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h3", { className: "font-black text-xl", children: editingExerciseIdx !== null && editingExerciseIdx < exercises.length ? 'Editar Ejercicio' : 'Nuevo Ejercicio' }), _jsx("button", { onClick: cancelExercise, className: "p-2 text-muted", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Nombre" }), _jsx("input", { type: "text", value: tempExercise.name, onChange: e => handleTempExerciseChange('name', e.target.value), className: "w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-white" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Sets" }), _jsx("input", { type: "number", min: "1", value: tempExercise.target.sets, onChange: e => handleTempExerciseChange('sets', parseInt(e.target.value) || 1), className: "w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Min Reps" }), _jsx("input", { type: "number", min: "1", value: tempExercise.target.minReps, onChange: e => handleTempExerciseChange('minReps', parseInt(e.target.value) || 1), className: "w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-muted uppercase", children: "Max Reps" }), _jsx("input", { type: "number", min: "1", value: tempExercise.target.maxReps, onChange: e => handleTempExerciseChange('maxReps', parseInt(e.target.value) || 1), className: "w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-bold text-muted uppercase flex justify-between", children: [_jsx("span", { children: "Texto de Reps" }), _jsx("span", { className: "text-[10px] text-primary normal-case", children: "Puedes personalizarlo" })] }), _jsx("input", { type: "text", value: tempExercise.target.reps, onChange: e => handleTempExerciseChange('reps', e.target.value), className: "w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-sm text-primary" })] }), _jsxs("label", { className: "flex items-center gap-3 p-3 bg-black border border-white/10 rounded-xl mt-2 cursor-pointer active:scale-[0.98]", children: [_jsx("input", { type: "checkbox", checked: tempExercise.target.isPrimary || false, onChange: e => handleTempExerciseChange('isPrimary', e.target.checked), className: "w-5 h-5 rounded border-white/20 text-primary focus:ring-primary focus:ring-offset-black bg-black" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-bold", children: "Ejercicio Principal" }), _jsx("span", { className: "text-xs text-muted", children: "Aparece destacado en la rutina" })] })] })] }), _jsx(Button, { className: "w-full mt-4", onClick: saveExercise, children: "Guardar Ejercicio" })] }) }))] }));
};
//# sourceMappingURL=RoutineEditor.js.map