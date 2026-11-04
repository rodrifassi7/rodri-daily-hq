import type { Exercise, GoalId, GymFocus, NutritionGoals, Profile, RoutineTemplate, Sex, WeeklyActivity } from '../types';

// ---------- Opciones que se muestran en "Conozcámonos" ----------
export const GOAL_OPTIONS: { id: GoalId; emoji: string; title: string; desc: string }[] = [
    { id: 'recomp', emoji: '💪', title: 'Más músculo y marcado', desc: 'Físico atlético: ganar músculo bajando la grasa de a poco.' },
    { id: 'perder', emoji: '🔥', title: 'Bajar grasa', desc: 'Perder grasa cuidando el músculo.' },
    { id: 'ganar', emoji: '🏋️', title: 'Ganar masa', desc: 'Subir de peso y fuerza, con un superávit chico.' },
    { id: 'mantener', emoji: '🧘', title: 'Mantenerme y sentirme bien', desc: 'Sostener hábitos, energía y salud.' },
    { id: 'rendimiento', emoji: '🎾', title: 'Rendir en mi deporte', desc: 'Energía para entrenar y competir.' },
];

export const ACTIVITY_OPTIONS: { type: string; emoji: string }[] = [
    { type: 'Gym', emoji: '🏋️' },
    { type: 'Pádel', emoji: '🎾' },
    { type: 'Funcional', emoji: '⚡' },
    { type: 'Yoga', emoji: '🧘' },
    { type: 'Pilates', emoji: '🤸' },
    { type: 'Running', emoji: '🏃' },
    { type: 'Natación', emoji: '🏊' },
    { type: 'Fútbol', emoji: '⚽' },
];

export const activityEmoji = (type: string) =>
    type === 'Rest' ? '😴' : ACTIVITY_OPTIONS.find(a => a.type === type)?.emoji ?? '✨';

export const FOCUS_OPTIONS: { id: GymFocus; title: string; desc: string }[] = [
    { id: 'equilibrado', title: 'Equilibrado', desc: 'Todo el cuerpo por igual.' },
    { id: 'superior', title: 'Más tren superior', desc: 'Hombros, espalda, pecho y brazos.' },
    { id: 'gluteos', title: 'Más piernas y glúteos', desc: 'Prioridad a glúteos y piernas.' },
];

// ---------- Semana ----------
export const totalSessions = (activities: WeeklyActivity[] = []) => activities.reduce((acc, a) => acc + a.days, 0);
export const gymDays = (activities: WeeklyActivity[] = []) => activities.find(a => a.type === 'Gym')?.days ?? 0;

// Meta semanal para los contadores (si no completó el perfil, 4 como antes)
export const weeklyTarget = (profile: Profile) => {
    const total = totalSessions(profile.activities);
    return total > 0 ? total : 4;
};

// Actividades para los botones de Training/Home: las del perfil (Gym primero) + Descanso
export const trainingOptions = (profile: Profile): string[] => {
    const fromProfile = (profile.activities ?? []).filter(a => a.days > 0).map(a => a.type);
    const list = fromProfile.length > 0 ? fromProfile : ['Gym'];
    const ordered = [...list].sort((a, b) => (a === 'Gym' ? -1 : b === 'Gym' ? 1 : 0));
    return [...ordered, 'Rest'];
};

export const activityLabel = (type: string) => (type === 'Rest' ? 'Descanso' : type);

// ---------- Calorías y proteína ----------
// Factores conservadores (las tablas clásicas suelen sobreestimar)
const activityFactor = (sessions: number) =>
    sessions === 0 ? 1.2 : sessions <= 2 ? 1.35 : sessions <= 4 ? 1.45 : sessions <= 6 ? 1.55 : 1.65;

const GOAL_ADJUST: Record<GoalId, number> = { recomp: -300, perder: -500, ganar: 250, mantener: 0, rendimiento: 0 };
const PROTEIN_PER_KG: Record<GoalId, number> = { recomp: 2.0, perder: 2.0, ganar: 1.8, mantener: 1.6, rendimiento: 1.8 };

export interface BodyData { sex: Sex; age: number; heightCm: number; weightKg: number }

export const maintenanceCalories = (body: BodyData, activities: WeeklyActivity[]) => {
    // Mifflin-St Jeor
    const bmr = 10 * body.weightKg + 6.25 * body.heightCm - 5 * body.age + (body.sex === 'm' ? 5 : -161);
    return bmr * activityFactor(totalSessions(activities));
};

const round = (n: number, step: number) => Math.round(n / step) * step;

export const calculateGoals = (body: BodyData, activities: WeeklyActivity[], goal: GoalId): NutritionGoals => {
    const floor = body.sex === 'm' ? 1600 : 1300;
    const calories = Math.max(floor, round(maintenanceCalories(body, activities) + GOAL_ADJUST[goal], 50));
    const protein = round(body.weightKg * PROTEIN_PER_KG[goal], 5);
    return { calories, protein };
};

export const goalExplanation = (goal: GoalId) => ({
    recomp: 'Un poco por debajo de tu mantenimiento: bajás grasa despacio mientras ganás músculo.',
    perder: 'Déficit moderado para bajar unos 0,5 kg por semana sin perder músculo.',
    ganar: 'Superávit chico para ganar masa sin sumar mucha grasa.',
    mantener: 'Tu mantenimiento: ni subir ni bajar.',
    rendimiento: 'Tu mantenimiento, para tener energía en cada entrenamiento.',
}[goal]);

// ---------- Rutinas ----------
let seq = 0;
const ex = (name: string, sets: number, minReps: number, maxReps: number, isPrimary = false, reps?: string): Exercise => ({
    id: `ex-${Date.now().toString(36)}-${(seq++).toString(36)}`,
    name,
    target: { sets, minReps, maxReps, reps: reps ?? `${minReps}-${maxReps}`, ...(isPrimary ? { isPrimary: true } : {}) },
});
const routine = (id: string, title: string, exercises: Exercise[]): RoutineTemplate => ({ id, title, exercises });

const fullBodyA = () => routine('full-a', 'Full Body A', [
    ex('Sentadilla', 3, 6, 8, true), ex('Press banca', 3, 6, 8, true), ex('Remo con barra', 3, 8, 10),
    ex('Press militar', 3, 8, 10), ex('Curl femoral', 3, 10, 12), ex('Plancha', 3, 30, 45, false, '30-45 seg'),
]);
const fullBodyB = () => routine('full-b', 'Full Body B', [
    ex('Peso muerto rumano', 3, 8, 10, true), ex('Jalón al pecho', 3, 8, 10, true), ex('Press inclinado mancuernas', 3, 8, 10),
    ex('Zancadas', 3, 10, 10, false, '10 por pierna'), ex('Elevaciones laterales', 3, 12, 15), ex('Rueda abdominal', 3, 8, 12),
]);
const fullBodyC = () => routine('full-c', 'Full Body C', [
    ex('Hip thrust', 3, 8, 10, true), ex('Press militar', 3, 6, 8, true), ex('Remo polea', 3, 10, 12),
    ex('Prensa', 3, 10, 12), ex('Facepull', 3, 15, 20), ex('Curl barra', 2, 10, 12), ex('Tríceps polea', 2, 10, 12),
]);
const glutesA = () => routine('gluteos-a', 'Glúteos A', [
    ex('Hip thrust', 4, 8, 10, true), ex('Sentadilla búlgara', 3, 8, 10, false, '8-10 por pierna'), ex('Peso muerto rumano', 3, 8, 10, true),
    ex('Abductores', 3, 15, 20), ex('Patada de glúteo en polea', 3, 12, 15), ex('Elevaciones de piernas colgado', 3, 10, 15),
]);
const glutesB = () => routine('gluteos-b', 'Glúteos B', [
    ex('Sentadilla', 4, 6, 8, true), ex('Hip thrust', 3, 10, 12), ex('Curl femoral', 3, 10, 12),
    ex('Zancadas', 3, 10, 10, false, '10 por pierna'), ex('Abductores', 3, 15, 20), ex('Plancha', 3, 30, 45, false, '30-45 seg'),
]);
const upperA = () => routine('upper-a', 'Upper A', [
    ex('Press banca', 4, 6, 8, true), ex('Remo con barra', 4, 6, 8, true), ex('Press inclinado mancuernas', 3, 8, 10),
    ex('Jalón al pecho', 3, 10, 12), ex('Elevaciones laterales', 4, 12, 15), ex('Curl barra', 3, 8, 10), ex('Tríceps polea', 3, 10, 12),
]);
const upperB = () => routine('upper-b', 'Upper B', [
    ex('Press militar', 4, 6, 8, true), ex('Dominadas', 4, 6, 10, true), ex('Press inclinado máquina', 3, 10, 12),
    ex('Remo polea', 3, 10, 12), ex('Elevaciones laterales', 4, 15, 20), ex('Facepull', 3, 15, 20), ex('Curl inclinado', 3, 10, 12),
]);
const lowerA = () => routine('lower-a', 'Lower A', [
    ex('Sentadilla', 4, 6, 8, true), ex('Prensa', 3, 10, 12), ex('Peso muerto rumano', 3, 8, 10, true),
    ex('Gemelos', 4, 12, 15), ex('Elevaciones de piernas colgado', 3, 10, 15),
]);
const lowerB = () => routine('lower-b', 'Lower B', [
    ex('Hip thrust', 4, 8, 10, true), ex('Curl femoral', 4, 10, 12), ex('Zancadas', 3, 10, 10, false, '10 por pierna'),
    ex('Gemelos sentado', 4, 15, 20), ex('Rueda abdominal', 3, 8, 12),
]);
const armsShoulders = () => routine('hombros-brazos', 'Hombros y brazos', [
    ex('Press Arnold', 3, 8, 10, true), ex('Elevaciones laterales', 4, 12, 15), ex('Pájaros', 3, 12, 15),
    ex('Curl barra', 3, 8, 10), ex('Tríceps francés', 3, 10, 12), ex('Martillo', 2, 12, 15),
]);

const addIfMissing = (r: RoutineTemplate, extra: Exercise[]): RoutineTemplate => ({
    ...r,
    exercises: [...r.exercises, ...extra.filter(e => !r.exercises.some(x => x.name === e.name))],
});

export const buildRoutines = (days: number, focus: GymFocus): RoutineTemplate[] => {
    if (days <= 0) return [];
    if (days <= 3) {
        let base = days <= 2 ? [fullBodyA(), fullBodyB()] : [fullBodyA(), fullBodyB(), fullBodyC()];
        if (focus === 'gluteos') base = base.map(r => addIfMissing(r, [ex('Hip thrust', 3, 8, 12), ex('Abductores', 2, 15, 20)]));
        if (focus === 'superior') base = base.map(r => addIfMissing(r, [ex('Elevaciones laterales', 3, 12, 15), ex('Curl barra', 2, 10, 12)]));
        return base;
    }
    const four = focus === 'gluteos'
        ? [glutesA(), upperA(), glutesB(), upperB()]
        : [upperA(), lowerA(), upperB(), lowerB()];
    if (days === 4) return four;
    const fifth = focus === 'gluteos' ? routine('gluteos-c', 'Glúteos C', glutesA().exercises.map(e => ({ ...e, id: e.id + 'c' }))) : armsShoulders();
    return [...four, fifth];
};

export const describeRoutinePlan = (days: number, focus: GymFocus) => {
    if (days <= 0) return '';
    if (days <= 3) return `${days === 1 ? 'Full body' : `Full body ${days <= 2 ? 'A/B' : 'A/B/C'}`}: todo el cuerpo en cada sesión`;
    const split = focus === 'gluteos' ? 'Glúteos / Upper' : 'Upper / Lower';
    return days === 4 ? `${split} (4 días)` : `${split} + ${focus === 'gluteos' ? 'un día extra de glúteos' : 'un día de hombros y brazos'}`;
};
