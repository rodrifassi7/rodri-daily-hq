import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, cn } from '../components/UI';
import { Dumbbell, Calendar, ListChecks, ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { format, startOfToday, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { RoutineTemplate, ExerciseProgress } from '../types';

const Training: React.FC = () => {
    const { data, updateTraining, updateExerciseProgress, updateData } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [activeRoutine, setActiveRoutine] = useState<RoutineTemplate | null>(null);

    const weekDays = useMemo(() => {
        const today = startOfToday();
        return eachDayOfInterval({
            start: subDays(today, 6),
            end: today
        });
    }, []);

    const logsForSelected = data.trainingLogs.find(l => l.date === selectedDate);

    // Weekly counters
    const startOfWeek = subDays(startOfToday(), 6); // Last 7 days including today
    const weeklyLogs = data.trainingLogs.filter(l => l.date >= format(startOfWeek, 'yyyy-MM-dd'));
    const gymCount = weeklyLogs.filter(l => l.type === 'Gym').length;
    const padelCount = weeklyLogs.filter(l => l.type === 'Padel').length;

    // Routine progress helper
    const getProgress = (routineId: string, exerciseId: string, week: number) => {
        return data.exerciseProgress.find(p => p.routineId === routineId && p.exerciseId === exerciseId && p.week === week) || { weightKg: 0, reps: 0, sets: 0 };
    };

    return (
        <div className="space-y-6 pb-20">
            <header className="flex justify-between items-center px-1">
                <h1 className="text-3xl font-black">Training</h1>
                <div className="flex gap-2">
                    <Badge color={data.showDay5 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted'} onClick={() => updateData({ showDay5: !data.showDay5 })}>
                        Day 5: {data.showDay5 ? 'ON' : 'OFF'}
                    </Badge>
                </div>
            </header>

            {/* Week overview */}
            <div className="flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {weekDays.map(day => {
                    const dStr = format(day, 'yyyy-MM-dd');
                    const isSelected = dStr === selectedDate;
                    const log = data.trainingLogs.find(l => l.date === dStr);
                    return (
                        <button
                            key={dStr}
                            onClick={() => setSelectedDate(dStr)}
                            className={cn(
                                "flex-shrink-0 w-12 flex flex-col items-center py-3 rounded-2xl transition-all",
                                isSelected ? "bg-primary text-white scale-105 z-10 shadow-lg shadow-primary/20" : "bg-card text-muted"
                            )}
                        >
                            <span className="text-[10px] font-bold uppercase mb-1">{format(day, 'EEE')}</span>
                            <span className="text-sm font-black">{format(day, 'd')}</span>
                            {log && log.type !== 'Rest' && (
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1", isSelected ? "bg-white" : "bg-primary")} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="text-center p-4">
                    <div className="text-[10px] font-black text-muted mb-1 uppercase tracking-widest">Gym This Week</div>
                    <div className="text-2xl font-black">{gymCount}/4</div>
                    <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (gymCount / 4) * 100)}%` }} />
                    </div>
                </Card>
                <Card className="text-center p-4">
                    <div className="text-[10px] font-black text-muted mb-1 uppercase tracking-widest">Padel This Week</div>
                    <div className="text-2xl font-black">{padelCount}/3</div>
                    <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (padelCount / 3) * 100)}%` }} />
                    </div>
                </Card>
            </div>

            {/* Log Status */}
            <section>
                <h2 className="text-xl font-bold mb-3 px-1">Daily Log</h2>
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-primary" />
                        <span className="text-primary font-bold">{selectedDate === todayStr ? "Today" : format(new Date(selectedDate + 'T00:00:00'), 'MMM d')}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {(['Gym', 'Padel', 'Rest'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => updateTraining(selectedDate, type)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98]",
                                    logsForSelected?.type === type
                                        ? "bg-primary/20 border-primary shadow-sm shadow-primary/10"
                                        : "bg-white/5 border-white/10 text-muted"
                                )}
                            >
                                <span className="font-bold">{type} session</span>
                                {logsForSelected?.type === type && <div className="bg-primary p-1 rounded-full"><CheckIcon /></div>}
                            </button>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Gym Routine Section */}
            <section>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-xl font-bold">Gym Routine</h2>
                    <Dumbbell size={20} className="text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {data.routines.map(routine => {
                        if (routine.isOptional && !data.showDay5) return null;
                        return (
                            <button
                                key={routine.id}
                                onClick={() => setActiveRoutine(routine)}
                                className="bg-card border border-border p-4 rounded-2xl text-left active:scale-95 transition-all flex flex-col justify-between min-h-[100px]"
                            >
                                <span className="text-xs font-black text-primary uppercase tracking-widest">{routine.title.split(' ')[0]}</span>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-lg">{routine.title}</span>
                                    <ChevronRight size={18} className="text-muted" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Routine Detail Modal */}
            <AnimatePresence>
                {activeRoutine && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center px-0 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-black border-t border-white/10 w-full max-w-md h-[90vh] rounded-t-3xl overflow-hidden flex flex-col"
                        >
                            <header className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black">{activeRoutine.title}</h2>
                                    <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Exercise Tracker (4 Weeks)</p>
                                </div>
                                <button onClick={() => setActiveRoutine(null)} className="p-2 bg-white/5 rounded-full text-muted">
                                    <X size={24} />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-12">
                                {activeRoutine.exercises.map(ex => (
                                    <div key={ex.id} className="space-y-3">
                                        <h3 className="font-bold text-primary pl-1">{ex.name}</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3, 4].map(week => {
                                                const prog = getProgress(activeRoutine.id, ex.id, week);
                                                return (
                                                    <div key={week} className="bg-card border border-border rounded-xl p-2 space-y-2">
                                                        <div className="text-[8px] font-black text-muted text-center uppercase tracking-tighter">Week {week}</div>
                                                        <div className="space-y-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] text-muted font-black uppercase">WT (KG)</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-transparent text-xs font-bold outline-none border-b border-white/5 focus:border-primary py-0.5"
                                                                    value={prog.weightKg || ''}
                                                                    placeholder="0"
                                                                    onChange={e => updateExerciseProgress(activeRoutine.id, ex.id, week, { weightKg: parseFloat(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] text-muted font-black uppercase">REPS</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-transparent text-xs font-bold outline-none border-b border-white/5 focus:border-primary py-0.5"
                                                                    value={prog.reps || ''}
                                                                    placeholder="0"
                                                                    onChange={e => updateExerciseProgress(activeRoutine.id, ex.id, week, { reps: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] text-muted font-black uppercase">SETS</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-transparent text-xs font-bold outline-none border-b border-white/5 focus:border-primary py-0.5"
                                                                    value={prog.sets || ''}
                                                                    placeholder="0"
                                                                    onChange={e => updateExerciseProgress(activeRoutine.id, ex.id, week, { sets: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default Training;
