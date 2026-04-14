import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, cn } from '../components/UI';
import { Calendar, Dumbbell, ChevronRight } from 'lucide-react';
import { format, startOfToday, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { RoutineTemplate } from '../types';
import { GymSessionView } from '../components/GymSessionView';

const Training: React.FC = () => {
    const { data, updateTraining } = useApp();
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

    return (
        <div className="space-y-6 pb-20">
            <header className="flex justify-between items-center px-1">
                <h1 className="text-3xl font-black tracking-tight">Training</h1>
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
                                isSelected ? "bg-primary text-black scale-105 z-10 shadow-lg shadow-primary/20" : "bg-card text-muted"
                            )}
                        >
                            <span className="text-[10px] font-bold uppercase mb-1">{format(day, 'EEE')}</span>
                            <span className="text-sm font-black">{format(day, 'd')}</span>
                            {log && log.type !== 'Rest' && (
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1", isSelected ? "bg-black" : "bg-primary")} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Stats */}
            <Card className="text-center p-4">
                <div className="text-[10px] font-black text-muted mb-1 uppercase tracking-widest">Gym This Week</div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black">{gymCount}</span>
                    <span className="text-lg text-muted font-bold">/ 4</span>
                </div>
                <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (gymCount / 4) * 100)}%` }} />
                </div>
            </Card>

            {/* Log Status */}
            <section>
                <div className="flex flex-col gap-2">
                    {(['Gym', 'Rest'] as const).map(type => (
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
                            {logsForSelected?.type === type && <div className="bg-primary text-black p-1 rounded-full"><CheckIcon /></div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Gym Routine Section */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1 mt-6">
                    <h2 className="text-2xl font-black">Routines</h2>
                    <Dumbbell size={24} className="text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {data.routines.filter(r => !r.isOptional).map(routine => {
                        return (
                            <button
                                key={routine.id}
                                onClick={() => setActiveRoutine(routine)}
                                className="bg-card border border-border p-5 rounded-3xl text-left active:scale-[0.97] transition-all flex flex-col justify-between min-h-[120px] relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-white to-transparent w-full h-full pointer-events-none" />
                                
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{routine.title.split(' ')[0]}</span>
                                
                                <div className="flex items-center justify-between mt-2 z-10 w-full">
                                    <span className="font-black text-xl leading-none">{routine.title.split(' ')[1]}</span>
                                    <div className="bg-white/5 p-1.5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Routine Detail Modal */}
            <AnimatePresence>
                {activeRoutine && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 flex"
                    >
                        <GymSessionView 
                            routine={activeRoutine} 
                            date={selectedDate} 
                            onClose={() => setActiveRoutine(null)} 
                        />
                    </motion.div>
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
