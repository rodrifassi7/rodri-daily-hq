import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Type, Hash, Calendar, CalendarDays } from 'lucide-react';
import { Button, cn } from './UI';
import type { Habit } from '../types';

interface HabitEditorProps {
    habit: Habit | null; // null means new
    onClose: () => void;
    onSave: (habit: Habit) => void;
}

const COMMON_EMOJIS = [
    '🏋️', '🏃', '🧘', '🏊', '🚴', '💪', '🍎', '🥗', '🍗', '🍳', '🥑', '🥦',
    '💧', '☕', '🍵', '🧃', '🥤', '📚', '📖', '📝', '🧠', '💻',
    '📱', '📵', '🎮', '🚫', '🚬', '💊', '🧪', '😴', '🛌', '🌅', '🚶', '🚗',
    '💰', '📈', '🗑️', '🧹', '🧺', '🌱', '☀️', '☔'
];

export const HabitEditor: React.FC<HabitEditorProps> = ({ habit, onClose, onSave }) => {
    const [name, setName] = useState(habit?.name || '');
    const [emoji, setEmoji] = useState(habit?.emoji || '✨');
    const [type, setType] = useState<Habit['type']>(habit?.type || 'checkbox');
    const [frequency, setFrequency] = useState<Habit['frequency']>(habit?.frequency || 'daily');
    const [target, setTarget] = useState<string>(habit?.target?.toString() || '');
    const [unit, setUnit] = useState(habit?.unit || '');
    const [customEmoji, setCustomEmoji] = useState('');

    const handleSave = () => {
        if (!name.trim()) return alert('El nombre es requerido');
        if (type === 'numeric' && (!target || isNaN(Number(target)))) return alert('El objetivo numérico es requerido y debe ser un número');

        const newHabit: Habit = {
            id: habit?.id || Math.random().toString(36).substring(2, 9),
            name: name.trim(),
            emoji: emoji,
            type,
            frequency,
            createdAt: habit?.createdAt || new Date().toISOString(),
        };

        if (type === 'numeric') {
            newHabit.target = Number(target);
            if (unit.trim()) newHabit.unit = unit.trim();
        }

        onSave(newHabit);
    };

    const handleCustomEmoji = (val: string) => {
        setCustomEmoji(val);
        if (val.trim()) setEmoji(val.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
            <header className="flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-10">
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-muted">
                    <X size={20} />
                </button>
                <h2 className="font-black text-xl">{habit ? 'Editar Hábito' : 'Nuevo Hábito'}</h2>
                <button onClick={handleSave} className="p-2 bg-primary text-black rounded-full">
                    <Save size={20} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32">
                {/* Nombre */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Nombre del Hábito</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej. Leer 2 páginas"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary text-white"
                    />
                </div>

                {/* Emoji Picker */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest flex justify-between">
                        <span>Icono (Emoji)</span>
                        <span className="text-primary text-lg leading-none">{emoji}</span>
                    </label>
                    
                    <div className="grid grid-cols-7 gap-2">
                        {COMMON_EMOJIS.map(e => (
                            <button
                                key={e}
                                onClick={() => { setEmoji(e); setCustomEmoji(''); }}
                                className={cn(
                                    "text-2xl p-2 rounded-xl transition-all active:scale-90",
                                    emoji === e ? "bg-primary/20 ring-1 ring-primary" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                    
                    <div className="pt-2">
                        <label className="text-[10px] font-bold text-muted uppercase mb-1 block">O escribe uno propio:</label>
                        <input
                            type="text"
                            maxLength={4}
                            value={customEmoji}
                            onChange={e => handleCustomEmoji(e.target.value)}
                            placeholder="Pegar emoji..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold text-center focus:outline-none focus:border-primary text-white"
                        />
                    </div>
                </div>

                {/* Tipo de Hábito */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Tipo de registro</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setType('checkbox')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                type === 'checkbox' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"
                            )}
                        >
                            <Type size={24} />
                            <span className="font-bold text-sm">Sí / No</span>
                        </button>
                        <button
                            onClick={() => setType('numeric')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                type === 'numeric' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"
                            )}
                        >
                            <Hash size={24} />
                            <span className="font-bold text-sm">Numérico</span>
                        </button>
                    </div>
                </div>

                {/* Meta Numérica (si aplica) */}
                {type === 'numeric' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase">Objetivo (Cant)</label>
                                <input
                                    type="number"
                                    value={target}
                                    onChange={e => setTarget(e.target.value)}
                                    placeholder="Ej. 140"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-primary text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase">Unidad (Opcional)</label>
                                <input
                                    type="text"
                                    value={unit}
                                    onChange={e => setUnit(e.target.value)}
                                    placeholder="Ej. g, ml, km"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-primary text-white"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Frecuencia */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Frecuencia</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFrequency('daily')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                frequency === 'daily' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"
                            )}
                        >
                            <CalendarDays size={24} />
                            <span className="font-bold text-sm">Diario</span>
                        </button>
                        <button
                            onClick={() => setFrequency('weekly')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                frequency === 'weekly' ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted"
                            )}
                        >
                            <Calendar size={24} />
                            <span className="font-bold text-sm">Semanal</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
