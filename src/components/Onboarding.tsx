import React, { useMemo, useState } from 'react';
import { ChevronLeft, Minus, Plus, X } from 'lucide-react';
import type { GoalId, GymFocus, NutritionGoals, Profile, RoutineTemplate, Sex, WeeklyActivity } from '../types';
import {
    GOAL_OPTIONS, ACTIVITY_OPTIONS, FOCUS_OPTIONS, calculateGoals, goalExplanation,
    buildRoutines, describeRoutinePlan, gymDays, totalSessions,
} from '../utils/plan';
import { Button, cn } from './UI';

export interface OnboardingResult {
    profile: Profile;
    goals: NutritionGoals;
    routines: RoutineTemplate[] | null; // null = no tocar las rutinas actuales
}

interface Props {
    mode: 'new' | 'edit';
    initialProfile: Profile;
    initialGoals?: NutritionGoals;
    hasRoutines: boolean;
    onDone: (result: OnboardingResult) => void;
    onCancel?: () => void;
}

type Step = 'nombre' | 'objetivo' | 'datos' | 'semana' | 'rutina' | 'resumen';

const NumberStepper: React.FC<{ label: string; value: number; onChange: (v: number) => void; step?: number; min: number; max: number; suffix?: string }> =
    ({ label, value, onChange, step = 1, min, max, suffix }) => {
        const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 10) / 10));
        return (
            <div>
                <div className="text-xs font-bold text-muted uppercase mb-1">{label}</div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl">
                    <button type="button" onClick={() => onChange(clamp(value - step))} className="w-11 h-12 flex items-center justify-center text-muted active:text-white" aria-label={`Bajar ${label}`}><Minus size={16} /></button>
                    <input
                        type="number" inputMode="decimal" value={value || ''}
                        onChange={e => onChange(parseFloat(e.target.value) || 0)}
                        onBlur={() => onChange(clamp(value))}
                        onFocus={e => e.target.select()}
                        className="w-full min-w-0 bg-transparent text-center font-black text-lg outline-none"
                    />
                    {suffix && <span className="text-xs text-muted font-bold pr-1">{suffix}</span>}
                    <button type="button" onClick={() => onChange(clamp(value + step))} className="w-11 h-12 flex items-center justify-center text-muted active:text-white" aria-label={`Subir ${label}`}><Plus size={16} /></button>
                </div>
            </div>
        );
    };

const OptionCard: React.FC<{ selected: boolean; onClick: () => void; emoji?: string; title: string; desc?: string }> = ({ selected, onClick, emoji, title, desc }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            'w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center gap-3',
            selected ? 'bg-primary/15 border-primary' : 'bg-white/5 border-white/10'
        )}
    >
        {emoji && <span className="text-2xl">{emoji}</span>}
        <span className="flex-1">
            <span className="block font-black">{title}</span>
            {desc && <span className="block text-xs text-muted mt-0.5">{desc}</span>}
        </span>
    </button>
);

export const Onboarding: React.FC<Props> = ({ mode, initialProfile, initialGoals, hasRoutines, onDone, onCancel }) => {
    const [name, setName] = useState(initialProfile.name === 'Vos' ? '' : initialProfile.name);
    const [goal, setGoal] = useState<GoalId | null>(initialProfile.goal ?? null);
    const [sex, setSex] = useState<Sex | null>(initialProfile.sex ?? null);
    const [age, setAge] = useState(initialProfile.age ?? 30);
    const [heightCm, setHeightCm] = useState(initialProfile.heightCm ?? (initialProfile.sex === 'f' ? 163 : 175));
    const [weightKg, setWeightKg] = useState(initialProfile.weightKg ?? (initialProfile.sex === 'f' ? 60 : 75));
    const [activities, setActivities] = useState<WeeklyActivity[]>(initialProfile.activities ?? []);
    const [customActivity, setCustomActivity] = useState('');
    const [routineChoice, setRoutineChoice] = useState<'armar' | 'propia' | 'mantener'>(mode === 'edit' && hasRoutines ? 'mantener' : 'armar');
    const [focus, setFocus] = useState<GymFocus>(initialProfile.gymFocus ?? 'equilibrado');
    const [goalsOverride, setGoalsOverride] = useState<NutritionGoals | null>(null);

    const gym = gymDays(activities);
    const steps: Step[] = ['nombre', 'objetivo', 'datos', 'semana', ...(gym > 0 ? ['rutina' as Step] : []), 'resumen'];
    const [stepIdx, setStepIdx] = useState(0);
    const step = steps[Math.min(stepIdx, steps.length - 1)] as Step;

    const calculated = useMemo(
        () => (goal && sex ? calculateGoals({ sex, age, heightCm, weightKg }, activities, goal) : null),
        [goal, sex, age, heightCm, weightKg, activities]
    );
    const goals = goalsOverride ?? calculated ?? initialGoals ?? { calories: 2000, protein: 120 };

    const setDays = (type: string, days: number) => {
        setGoalsOverride(null);
        setActivities(prev => {
            const others = prev.filter(a => a.type !== type);
            const next = days > 0 ? [...others, { type, days: Math.min(7, days) }] : others;
            const order = (t: string) => { const i = ACTIVITY_OPTIONS.findIndex(o => o.type === t); return i === -1 ? 99 : i; };
            return next.sort((a, b) => order(a.type) - order(b.type));
        });
    };
    const daysOf = (type: string) => activities.find(a => a.type === type)?.days ?? 0;
    const customTypes = activities.filter(a => !ACTIVITY_OPTIONS.some(o => o.type === a.type)).map(a => a.type);

    const canNext = {
        nombre: name.trim().length > 0,
        objetivo: goal !== null,
        datos: sex !== null && age >= 12 && heightCm >= 120 && weightKg >= 30,
        semana: true,
        rutina: true,
        resumen: true,
    }[step];

    const next = () => {
        if (step === 'resumen') return finish();
        setStepIdx(i => Math.min(i + 1, steps.length - 1));
    };
    const back = () => (stepIdx === 0 ? onCancel?.() : setStepIdx(i => i - 1));

    const finish = () => {
        const profile: Profile = {
            ...initialProfile,
            name: name.trim(),
            ...(goal ? { goal } : {}),
            ...(sex ? { sex } : {}),
            age, heightCm, weightKg,
            activities,
            gymFocus: focus,
        };
        let routines: RoutineTemplate[] | null = null;
        if (gym > 0 && routineChoice === 'armar') routines = buildRoutines(gym, focus);
        else if (gym > 0 && routineChoice === 'propia' && mode === 'new') routines = [];
        else if (gym === 0 && mode === 'new') routines = [];
        onDone({ profile, goals, routines });
    };

    const goalInfo = GOAL_OPTIONS.find(g => g.id === goal);

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col">
            <header className="p-4 flex items-center gap-3">
                {(stepIdx > 0 || onCancel) ? (
                    <button onClick={back} className="p-2 bg-white/5 rounded-full text-muted" aria-label="Atrás">
                        {stepIdx === 0 ? <X size={20} /> : <ChevronLeft size={20} />}
                    </button>
                ) : <div className="w-9" />}
                <div className="flex-1 flex gap-1.5">
                    {steps.map((s, i) => (
                        <div key={s} className={cn('h-1 flex-1 rounded-full', i <= stepIdx ? 'bg-primary' : 'bg-white/10')} />
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-6 max-w-md w-full mx-auto">
                {step === 'nombre' && (
                    <div className="space-y-6 pt-6">
                        <div>
                            <h1 className="text-3xl font-black leading-tight">{mode === 'new' ? 'Vamos a conocernos un poco 👋' : 'Actualicemos tus objetivos'}</h1>
                            <p className="text-muted mt-2">Con 4 preguntas te armamos calorías, proteína y rutina a tu medida. Todo se puede cambiar después.</p>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-muted uppercase mb-1">¿Cómo te llamás?</div>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-lg outline-none focus:border-primary"
                                value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" autoComplete="given-name"
                            />
                        </div>
                    </div>
                )}

                {step === 'objetivo' && (
                    <div className="space-y-4 pt-6">
                        <h1 className="text-3xl font-black leading-tight">¿Cuál es tu objetivo, {name.trim()}?</h1>
                        <div className="space-y-2">
                            {GOAL_OPTIONS.map(g => (
                                <OptionCard key={g.id} selected={goal === g.id} onClick={() => { setGoal(g.id); setGoalsOverride(null); }} emoji={g.emoji} title={g.title} desc={g.desc} />
                            ))}
                        </div>
                    </div>
                )}

                {step === 'datos' && (
                    <div className="space-y-5 pt-6">
                        <div>
                            <h1 className="text-3xl font-black leading-tight">Unos datos para el cálculo</h1>
                            <p className="text-muted mt-2 text-sm">Se usan solo para estimar tus calorías.</p>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-muted uppercase mb-1">Sexo (para la fórmula)</div>
                            <div className="grid grid-cols-2 gap-2">
                                {([['m', 'Hombre'], ['f', 'Mujer']] as const).map(([id, label]) => (
                                    <button key={id} type="button" onClick={() => { setSex(id); setGoalsOverride(null); }}
                                        className={cn('py-3 rounded-xl font-black border', sex === id ? 'bg-primary/15 border-primary' : 'bg-white/5 border-white/10 text-muted')}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <NumberStepper label="Edad" value={age} onChange={v => { setAge(v); setGoalsOverride(null); }} min={12} max={99} suffix="años" />
                        <NumberStepper label="Altura" value={heightCm} onChange={v => { setHeightCm(v); setGoalsOverride(null); }} min={120} max={230} suffix="cm" />
                        <NumberStepper label="Peso" value={weightKg} onChange={v => { setWeightKg(v); setGoalsOverride(null); }} step={0.5} min={30} max={250} suffix="kg" />
                    </div>
                )}

                {step === 'semana' && (
                    <div className="space-y-4 pt-6">
                        <div>
                            <h1 className="text-3xl font-black leading-tight">¿Cómo es tu semana?</h1>
                            <p className="text-muted mt-2 text-sm">¿Qué hacés y cuántos días? Por ejemplo: 4 de gym y 2 de pádel, o 2 de yoga y 2 de funcional.</p>
                        </div>
                        <div className="space-y-2">
                            {[...ACTIVITY_OPTIONS, ...customTypes.map(t => ({ type: t, emoji: '✨' }))].map(a => {
                                const d = daysOf(a.type);
                                return (
                                    <div key={a.type} className={cn('flex items-center gap-3 p-3 rounded-2xl border', d > 0 ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/10')}>
                                        <span className="text-xl">{a.emoji}</span>
                                        <span className="flex-1 font-black">{a.type}</span>
                                        <button type="button" onClick={() => setDays(a.type, d - 1)} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted" aria-label={`Menos días de ${a.type}`}><Minus size={14} /></button>
                                        <span className="w-14 text-center font-black text-sm">{d > 0 ? `${d} ${d === 1 ? 'día' : 'días'}` : '—'}</span>
                                        <button type="button" onClick={() => setDays(a.type, d + 1)} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted" aria-label={`Más días de ${a.type}`}><Plus size={14} /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-primary"
                                placeholder="Otra actividad…" value={customActivity} onChange={e => setCustomActivity(e.target.value)}
                            />
                            <Button variant="outline" className="py-2" onClick={() => {
                                const t = customActivity.trim();
                                if (t && !activities.some(a => a.type.toLowerCase() === t.toLowerCase())) setDays(t, 1);
                                setCustomActivity('');
                            }}>Agregar</Button>
                        </div>
                        <p className="text-xs text-muted text-center">
                            {totalSessions(activities) === 0 ? 'Si por ahora no entrenás, está perfecto: seguí sin cargar nada.' : `Total: ${totalSessions(activities)} entrenamientos por semana`}
                        </p>
                    </div>
                )}

                {step === 'rutina' && (
                    <div className="space-y-4 pt-6">
                        <div>
                            <h1 className="text-3xl font-black leading-tight">Tu rutina de gym</h1>
                            <p className="text-muted mt-2 text-sm">Vas {gym} {gym === 1 ? 'día' : 'días'} por semana. ¿Te la armamos?</p>
                        </div>
                        <div className="space-y-2">
                            {mode === 'edit' && hasRoutines && (
                                <OptionCard selected={routineChoice === 'mantener'} onClick={() => setRoutineChoice('mantener')} emoji="📌" title="Dejar mis rutinas como están" />
                            )}
                            <OptionCard selected={routineChoice === 'armar'} onClick={() => setRoutineChoice('armar')} emoji="🪄" title={mode === 'edit' && hasRoutines ? 'Armarme una nueva' : 'Sí, armámela'} desc={describeRoutinePlan(gym, focus)} />
                            {mode === 'new' && (
                                <OptionCard selected={routineChoice === 'propia'} onClick={() => setRoutineChoice('propia')} emoji="✍️" title="Prefiero cargar la mía" desc="Arrancás vacío y la armás en Training." />
                            )}
                        </div>
                        {routineChoice === 'armar' && (
                            <div className="space-y-2 pt-2">
                                <div className="text-xs font-bold text-muted uppercase">Enfoque</div>
                                {FOCUS_OPTIONS.map(f => (
                                    <OptionCard key={f.id} selected={focus === f.id} onClick={() => setFocus(f.id)} title={f.title} desc={f.desc} />
                                ))}
                                {mode === 'edit' && hasRoutines && (
                                    <p className="text-xs text-amber-400 font-semibold">Reemplaza tus rutinas actuales. Las sesiones que ya anotaste quedan guardadas.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 'resumen' && (
                    <div className="space-y-5 pt-6">
                        <div>
                            <h1 className="text-3xl font-black leading-tight">Tu plan, {name.trim()} {goalInfo?.emoji}</h1>
                            <p className="text-muted mt-2 text-sm">{goal ? goalExplanation(goal) : ''}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <NumberStepper label="Calorías / día" value={goals.calories} step={50} min={1000} max={6000} onChange={v => setGoalsOverride({ ...goals, calories: v })} />
                            <NumberStepper label="Proteína / día" value={goals.protein} step={5} min={30} max={400} suffix="g" onChange={v => setGoalsOverride({ ...goals, protein: v })} />
                        </div>
                        <p className="text-[11px] text-muted -mt-2">Es una estimación para arrancar: si en 2–3 semanas el peso no va para donde querés, ajustá ±150 kcal.</p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                            <div className="text-xs font-bold text-muted uppercase">Tu semana</div>
                            {activities.length === 0
                                ? <div className="text-sm font-bold">Sin entrenamientos cargados por ahora</div>
                                : activities.map(a => <div key={a.type} className="text-sm font-bold">{ACTIVITY_OPTIONS.find(o => o.type === a.type)?.emoji ?? '✨'} {a.type}: {a.days} {a.days === 1 ? 'día' : 'días'}</div>)}
                            {gym > 0 && (
                                <div className="text-xs text-muted pt-1">
                                    Gym: {routineChoice === 'armar' ? describeRoutinePlan(gym, focus) : routineChoice === 'mantener' ? 'tus rutinas de siempre' : 'la cargás vos en Training'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 max-w-md w-full mx-auto">
                <Button className="w-full bg-primary text-black font-black py-4" disabled={!canNext} onClick={next}>
                    {step === 'resumen' ? (mode === 'new' ? '¡Empezar!' : 'Guardar') : step === 'semana' && activities.length === 0 ? 'Seguir sin cargar' : 'Siguiente'}
                </Button>
            </div>
        </div>
    );
};
