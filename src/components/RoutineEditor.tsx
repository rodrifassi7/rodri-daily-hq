import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Card, Button, cn } from './UI';
import type { RoutineTemplate, Exercise } from '../types';

interface RoutineEditorProps {
    routine: RoutineTemplate | null; // null means new routine
    onClose: () => void;
    onSave: (routine: RoutineTemplate) => void;
    onDelete?: (routineId: string) => void;
}

export const RoutineEditor: React.FC<RoutineEditorProps> = ({ routine, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(routine?.title || '');
    const [exercises, setExercises] = useState<Exercise[]>(routine?.exercises || []);
    const [editingExerciseIdx, setEditingExerciseIdx] = useState<number | null>(null);

    // Temp state for editing an exercise
    const [tempExercise, setTempExercise] = useState<Exercise | null>(null);

    const handleSave = () => {
        if (!title.trim()) return alert('El título es requerido');
        if (exercises.length === 0) return alert('Agrega al menos un ejercicio');

        const newRoutine: RoutineTemplate = {
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

    const moveExercise = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === exercises.length - 1) return;

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

    const removeExercise = (index: number) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const startEditingExercise = (index: number) => {
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
        if (!tempExercise || !tempExercise.name.trim()) return alert('El nombre es requerido');
        
        const newExercises = [...exercises];
        if (editingExerciseIdx !== null && editingExerciseIdx < exercises.length) {
            newExercises[editingExerciseIdx] = tempExercise;
        } else {
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

    const handleTempExerciseChange = (field: keyof Exercise | keyof Exercise['target'], value: any) => {
        if (!tempExercise) return;
        if (field === 'name') {
            setTempExercise({ ...tempExercise, name: value });
        } else {
            const newTarget = { ...tempExercise.target, [field]: value };
            
            if (field === 'minReps' || field === 'maxReps') {
                newTarget.reps = `${newTarget.minReps}-${newTarget.maxReps}`;
            }

            setTempExercise({ ...tempExercise, target: newTarget as any });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
            <header className="flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-10">
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-muted">
                    <X size={20} />
                </button>
                <h2 className="font-black text-xl">{routine ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
                <button onClick={handleSave} className="p-2 bg-primary text-black rounded-full">
                    <Save size={20} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase">Nombre de la Rutina</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ej. Upper Body A"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted uppercase">Ejercicios</label>
                        <Button variant="ghost" onClick={startAddingExercise} className="text-primary p-2 text-sm">
                            <Plus size={16} className="inline mr-1" /> Agregar
                        </Button>
                    </div>

                    {exercises.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted text-sm">
                            No hay ejercicios. Agrega uno para empezar.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {exercises.map((ex, idx) => (
                                <Card key={ex.id} className="p-3 mb-0 flex items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="text-muted disabled:opacity-20 active:text-white">
                                            <ArrowUp size={16} />
                                        </button>
                                        <button onClick={() => moveExercise(idx, 'down')} disabled={idx === exercises.length - 1} className="text-muted disabled:opacity-20 active:text-white">
                                            <ArrowDown size={16} />
                                        </button>
                                    </div>
                                    <div className="flex-1 cursor-pointer" onClick={() => startEditingExercise(idx)}>
                                        <div className="font-bold flex items-center gap-2">
                                            {ex.name}
                                            {ex.target.isPrimary && <span className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <div className="text-xs text-muted">
                                            {ex.target.sets} sets x {ex.target.reps} reps
                                        </div>
                                    </div>
                                    <button onClick={() => removeExercise(idx)} className="p-2 text-red-500/50 hover:text-red-500 rounded-full">
                                        <Trash2 size={18} />
                                    </button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                
                {routine && onDelete && (
                    <div className="pt-8">
                        <Button variant="outline" onClick={handleDeleteRoutine} className="w-full text-red-500 border-red-500/30 hover:bg-red-500/10">
                            Eliminar Rutina
                        </Button>
                    </div>
                )}
            </div>

            {/* Exercise Edit Modal (Nested) */}
            {tempExercise && (
                <div className="fixed inset-0 z-[60] flex items-end bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        className="w-full bg-card border-t border-white/10 rounded-t-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto pb-10"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-black text-xl">
                                {editingExerciseIdx !== null && editingExerciseIdx < exercises.length ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                            </h3>
                            <button onClick={cancelExercise} className="p-2 text-muted">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted uppercase">Nombre</label>
                                <input
                                    type="text"
                                    value={tempExercise.name}
                                    onChange={e => handleTempExerciseChange('name', e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase">Sets</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={tempExercise.target.sets}
                                        onChange={e => handleTempExerciseChange('sets', parseInt(e.target.value) || 1)}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase">Min Reps</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={tempExercise.target.minReps}
                                        onChange={e => handleTempExerciseChange('minReps', parseInt(e.target.value) || 1)}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase">Max Reps</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={tempExercise.target.maxReps}
                                        onChange={e => handleTempExerciseChange('maxReps', parseInt(e.target.value) || 1)}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-center text-white"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-muted uppercase flex justify-between">
                                    <span>Texto de Reps</span>
                                    <span className="text-[10px] text-primary normal-case">Puedes personalizarlo</span>
                                </label>
                                <input
                                    type="text"
                                    value={tempExercise.target.reps}
                                    onChange={e => handleTempExerciseChange('reps', e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 font-bold mt-1 text-sm text-primary"
                                />
                            </div>

                            <label className="flex items-center gap-3 p-3 bg-black border border-white/10 rounded-xl mt-2 cursor-pointer active:scale-[0.98]">
                                <input
                                    type="checkbox"
                                    checked={tempExercise.target.isPrimary || false}
                                    onChange={e => handleTempExerciseChange('isPrimary', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 text-primary focus:ring-primary focus:ring-offset-black bg-black"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold">Ejercicio Principal</span>
                                    <span className="text-xs text-muted">Aparece destacado en la rutina</span>
                                </div>
                            </label>
                        </div>

                        <Button className="w-full mt-4" onClick={saveExercise}>
                            Guardar Ejercicio
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
