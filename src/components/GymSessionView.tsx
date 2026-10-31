import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge, cn } from './UI';
import { X, Check, Timer as TimerIcon, Info, Minus, Plus } from 'lucide-react';
import type { RoutineTemplate, GymSession, ExerciseSetRecord, Exercise } from '../types';

interface Props {
    routine: RoutineTemplate;
    date: string;
    onClose: () => void;
}

type ExerciseLog = GymSession['exercises'][number];

const emptySet = (): ExerciseSetRecord => ({ weightKg: 0, reps: 0, completed: false });

// --- Timer de descanso ---
// Usa una hora de fin (no un contador) para que no se atrase si se bloquea la pantalla.
const useRestTimer = () => {
    const [endAt, setEndAt] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (endAt === null) return;
        const id = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(id);
    }, [endAt]);

    const timeLeft = endAt === null ? null : Math.max(0, Math.ceil((endAt - now) / 1000));

    useEffect(() => {
        if (timeLeft === 0) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            setEndAt(null);
        }
    }, [timeLeft]);

    const start = useCallback((seconds: number) => {
        setNow(Date.now());
        setEndAt(Date.now() + seconds * 1000);
    }, []);
    const stop = useCallback(() => setEndAt(null), []);

    return { timeLeft, start, stop };
};

const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// Incremento de peso según el ejercicio: barra/primario 2.5kg, accesorios 1kg
const weightStep = (ex: Exercise) => (ex.target?.isPrimary ? 2.5 : 1);

export const GymSessionView: React.FC<Props> = ({ routine, date, onClose }) => {
    const { data: { gymSessions, trainingLogs }, saveGymSession, updateTraining } = useApp();
    const sessionId = `${date}_${routine.id}`;

    const [session, setSession] = useState<GymSession>(() =>
        gymSessions.find(s => s.id === sessionId) || { id: sessionId, date, routineId: routine.id, exercises: [] }
    );
    const timer = useRestTimer();

    // Auto-guardado (no guarda sesiones vacías solo por abrir la rutina)
    useEffect(() => {
        if (session.exercises.length === 0) return;
        saveGymSession(session);
    }, [session, saveGymSession]);

    // Historial del ejercicio en sesiones anteriores de esta rutina
    const getHistory = (exerciseId: string): ExerciseLog[] =>
        gymSessions
            .filter(s => s.routineId === routine.id && s.date < date)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(s => s.exercises.find(e => e.exerciseId === exerciseId))
            .filter((e): e is ExerciseLog => e !== undefined && e.sets.some(s => s.completed || s.weightKg > 0 || s.reps > 0));

    // Series que se muestran: lo anotado hoy, o lo de la última vez como punto de partida
    const plannedSets = (ex: Exercise): ExerciseSetRecord[] => {
        const setsCount = ex.target?.sets || 3;
        const today = session.exercises.find(e => e.exerciseId === ex.id);
        const base = today?.sets ?? getHistory(ex.id)[0]?.sets.map(s => ({ ...s, completed: false })) ?? [];
        return Array.from({ length: setsCount }, (_, i) => base[i] ?? { ...(base[base.length - 1] ?? emptySet()), completed: false });
    };

    const updateExercise = (ex: Exercise, transform: (sets: ExerciseSetRecord[]) => ExerciseSetRecord[]) => {
        setSession(prev => {
            const current = prev.exercises.find(e => e.exerciseId === ex.id);
            const sets = transform(current ? [...current.sets] : plannedSets(ex));
            const others = prev.exercises.filter(e => e.exerciseId !== ex.id);
            const updated: ExerciseLog = { exerciseId: ex.id, sets, isCompleted: sets.every(s => s.completed) };
            // Mantener el orden de la rutina
            const exercises = [...others, updated].sort((a, b) =>
                routine.exercises.findIndex(r => r.id === a.exerciseId) - routine.exercises.findIndex(r => r.id === b.exerciseId)
            );
            return { ...prev, exercises };
        });
    };

    // Cambiar el peso de una serie lo copia a las series siguientes que todavía no hiciste
    const setWeight = (ex: Exercise, index: number, weightKg: number) => {
        updateExercise(ex, sets => sets.map((s, i) =>
            i === index || (i > index && !s.completed) ? { ...s, weightKg: Math.max(0, weightKg) } : s
        ));
    };

    const setReps = (ex: Exercise, index: number, reps: number) => {
        updateExercise(ex, sets => sets.map((s, i) => (i === index ? { ...s, reps: Math.max(0, reps) } : s)));
    };

    const toggleDone = (ex: Exercise, index: number) => {
        const willBeDone = !plannedSets(ex)[index]?.completed;
        updateExercise(ex, sets => sets.map((s, i) => {
            if (i !== index) return s;
            // Si no anotaste reps, toma el objetivo mínimo del rango
            const reps = s.reps > 0 ? s.reps : (ex.target?.minReps ?? 0);
            return { ...s, reps, completed: !s.completed };
        }));
        if (willBeDone) {
            timer.start(ex.target?.isPrimary ? 120 : 90);
            const todayLog = trainingLogs.find(l => l.date === date);
            if (todayLog?.type !== 'Gym') updateTraining(date, 'Gym');
        }
    };

    const totalSets = routine.exercises.reduce((acc, ex) => acc + (ex.target?.sets || 3), 0);
    const doneSets = session.exercises.reduce((acc, e) => acc + e.sets.filter(s => s.completed).length, 0);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
            <header className="p-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black">{routine.title}</h2>
                        <p className="text-xs text-muted font-bold tracking-widest uppercase mt-0.5">{date} · {doneSets}/{totalSets} series</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-muted" aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>
                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` }} />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-36">
                <p className="text-xs text-muted px-1">
                    Arranca con los pesos de la última vez. Cambiá el peso en una serie y se copia a las siguientes. Tocá ✓ al terminar cada serie y arranca el descanso solo.
                </p>
                {routine.exercises.map((ex, index) => {
                    const exData = session.exercises.find(e => e.exerciseId === ex.id);
                    const history = getHistory(ex.id);
                    const lastSession = history[0];
                    const sets = plannedSets(ex);
                    const step = weightStep(ex);

                    // Lógica de progresión
                    let status: 'none' | 'green' | 'yellow' | 'red' = 'none';
                    let suggestion: string;

                    if (lastSession) {
                        const lastTotalReps = lastSession.sets.reduce((acc, s) => acc + s.reps, 0);
                        const lastMaxWeight = Math.max(...lastSession.sets.map(s => s.weightKg));
                        const lastHitTop = lastSession.sets.length > 0 && lastSession.sets.every(s => s.reps >= (ex.target?.maxReps ?? Infinity));

                        if (exData && exData.sets.length > 0 && exData.sets.every(s => s.completed)) {
                            const currTotalReps = exData.sets.reduce((acc, s) => acc + s.reps, 0);
                            const currMaxWeight = Math.max(...exData.sets.map(s => s.weightKg));
                            if (currMaxWeight > lastMaxWeight || currTotalReps > lastTotalReps) {
                                status = 'green';
                                const hitTop = exData.sets.every(s => s.reps >= (ex.target?.maxReps ?? Infinity));
                                suggestion = hitTop
                                    ? `¡Progreso! Llegaste al tope del rango: subí a ${currMaxWeight + step}kg la próxima.`
                                    : `¡Progreso! La próxima, sumá reps con ${currMaxWeight}kg.`;
                            } else {
                                const identicalSessions = history.slice(0, 2).filter(h => {
                                    const hTotalReps = h.sets.reduce((acc, s) => acc + s.reps, 0);
                                    const hMaxWeight = Math.max(...h.sets.map(s => s.weightKg));
                                    return Math.abs(hTotalReps - currTotalReps) <= 1 && hMaxWeight === currMaxWeight;
                                });
                                if (identicalSessions.length >= 2) {
                                    status = 'red';
                                    suggestion = 'Estancado 3 sesiones → bajá 5% y volvé a subir.';
                                } else {
                                    status = 'yellow';
                                    suggestion = 'Igual que la última. La próxima intentá sumar una rep.';
                                }
                            }
                        } else if (lastHitTop) {
                            status = 'green';
                            suggestion = `La última hiciste el tope del rango con ${lastMaxWeight}kg → hoy probá ${lastMaxWeight + step}kg.`;
                        } else {
                            status = 'yellow';
                            suggestion = `Última vez: ${lastSession.sets.map(s => `${s.weightKg}×${s.reps}`).join(' · ')}`;
                        }
                    } else {
                        suggestion = `Primer registro: buscá un peso con el que llegues a ${ex.target?.reps || 'X'} reps.`;
                    }

                    return (
                        <Card key={ex.id} className="p-4 border-l-4" style={{
                            borderLeftColor: status === 'green' ? '#10b981' : status === 'red' ? '#ef4444' : status === 'yellow' ? '#f59e0b' : '#333'
                        }}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight flex items-center gap-2 flex-wrap">
                                        {index + 1}. {ex.name}
                                        {ex.target?.isPrimary && <Badge className="text-[9px] px-1.5 py-0">PRINCIPAL</Badge>}
                                    </h3>
                                    <p className="text-xs font-bold text-muted">{ex.target?.sets || 3} series • {ex.target?.reps || 'X'} reps</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-2 mb-3 mt-1 flex items-start gap-2">
                                <Info size={14} className="text-muted mt-0.5 flex-shrink-0" />
                                <span className="text-xs font-semibold text-white/80">{suggestion}</span>
                            </div>

                            <div className="space-y-2">
                                {sets.map((s, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center gap-1.5 p-1.5 rounded-xl border transition-all",
                                        s.completed ? "bg-primary/10 border-primary/30" : "bg-black/20 border-white/5",
                                        !exData && !s.completed && "opacity-70"
                                    )}>
                                        <span className="w-4 text-center text-xs font-black text-muted">{i + 1}</span>

                                        {/* Peso con botones − / + */}
                                        <div className="flex items-center bg-white/5 rounded-lg flex-[1.4] min-w-0">
                                            <button
                                                onClick={() => setWeight(ex, i, s.weightKg - step)}
                                                className="w-8 h-10 flex items-center justify-center text-muted active:text-white flex-shrink-0"
                                                aria-label="Bajar peso"
                                            ><Minus size={14} /></button>
                                            <input
                                                type="number" inputMode="decimal" step="any"
                                                value={s.weightKg || ''}
                                                onChange={e => setWeight(ex, i, parseFloat(e.target.value) || 0)}
                                                onFocus={e => e.target.select()}
                                                className="w-full min-w-0 bg-transparent text-center text-sm font-black outline-none"
                                                placeholder="kg"
                                            />
                                            <button
                                                onClick={() => setWeight(ex, i, s.weightKg + step)}
                                                className="w-8 h-10 flex items-center justify-center text-muted active:text-white flex-shrink-0"
                                                aria-label="Subir peso"
                                            ><Plus size={14} /></button>
                                        </div>

                                        {/* Reps con botones − / + */}
                                        <div className="flex items-center bg-white/5 rounded-lg flex-1 min-w-0">
                                            <button
                                                onClick={() => setReps(ex, i, s.reps - 1)}
                                                className="w-7 h-10 flex items-center justify-center text-muted active:text-white flex-shrink-0"
                                                aria-label="Menos reps"
                                            ><Minus size={14} /></button>
                                            <input
                                                type="number" inputMode="numeric"
                                                value={s.reps || ''}
                                                onChange={e => setReps(ex, i, parseInt(e.target.value) || 0)}
                                                onFocus={e => e.target.select()}
                                                className="w-full min-w-0 bg-transparent text-center text-sm font-black outline-none"
                                                placeholder={String(ex.target?.minReps ?? 'reps')}
                                            />
                                            <button
                                                onClick={() => setReps(ex, i, s.reps + 1)}
                                                className="w-7 h-10 flex items-center justify-center text-muted active:text-white flex-shrink-0"
                                                aria-label="Más reps"
                                            ><Plus size={14} /></button>
                                        </div>

                                        <button
                                            onClick={() => toggleDone(ex, i)}
                                            className={cn(
                                                "w-10 h-10 flex items-center justify-center rounded-lg transition-all flex-shrink-0",
                                                s.completed ? "bg-primary text-black" : "bg-white/5 text-muted"
                                            )}
                                            aria-label="Serie hecha"
                                        >
                                            <Check strokeWidth={4} size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Descanso */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
                <div className="pointer-events-auto bg-card border border-border p-3 rounded-2xl shadow-xl flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <span className="text-xs font-bold text-muted uppercase flex items-center gap-1 flex-shrink-0"><TimerIcon size={14} /> Descanso</span>
                    {timer.timeLeft !== null ? (
                        <>
                            <div className="px-3 py-1.5 rounded-lg bg-black text-white text-sm font-black border border-primary tabular-nums">
                                {formatTime(timer.timeLeft)}
                            </div>
                            <button onClick={timer.stop} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-muted border border-white/10">Saltar</button>
                        </>
                    ) : (
                        [60, 90, 120, 180].map(s => (
                            <button
                                key={s}
                                onClick={() => timer.start(s)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-muted border border-white/10 whitespace-nowrap"
                            >
                                {s < 120 ? `${s}s` : `${s / 60}min`}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
