import type { AppData, Habit, RoutineTemplate, Exercise } from '../types';
import { format } from 'date-fns';

const STORAGE_KEY = 'rodri_daily_hq_data';

const DEFAULT_HABITS: Habit[] = [
    { id: '1', name: 'Training Done', emoji: '🏋️', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '2', name: 'Proteína 150g+', emoji: '🍗', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '3', name: '2.5L water', emoji: '💧', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '4', name: '8k steps', emoji: '🚶', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '5', name: 'Focus block 25min', emoji: '📵', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '6', name: '10min improvement', emoji: '🧠', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '7', name: 'Sleep 7h+', emoji: '😴', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: 'no-lol', name: 'No jugar al LoL', emoji: '🚫', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: 'creatina', name: 'Tomar creatina', emoji: '🧪', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: 'pastilla', name: 'Tomar pastilla', emoji: '💊', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: 'leer', name: 'Leer 2 páginas', emoji: '📖', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
];

const DEFAULT_ROUTINES: RoutineTemplate[] = [
    {
        id: 'upper-a',
        title: 'Upper A',
        exercises: [
            { id: 'ua-1', name: 'Press banca', target: { sets: 4, reps: '6-8', minReps: 6, maxReps: 8, isPrimary: true } },
            { id: 'ua-2', name: 'Remo Pendlay', target: { sets: 4, reps: '6-8', minReps: 6, maxReps: 8, isPrimary: true } },
            { id: 'ua-3', name: 'Press inclinado mancuernas', target: { sets: 3, reps: '8-10', minReps: 8, maxReps: 10 } },
            { id: 'ua-4', name: 'Jalón al pecho', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ua-5', name: 'Elevaciones laterales', target: { sets: 4, reps: '12-15', minReps: 12, maxReps: 15 } },
            { id: 'ua-6', name: 'Curl barra', target: { sets: 3, reps: '8-10', minReps: 8, maxReps: 10 } },
            { id: 'ua-7', name: 'Tríceps polea', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ua-8', name: 'Facepull', target: { sets: 3, reps: '15-20', minReps: 15, maxReps: 20 } },
        ]
    },
    {
        id: 'lower-a',
        title: 'Lower A',
        exercises: [
            { id: 'la-1', name: 'Sentadilla', target: { sets: 4, reps: '6-8', minReps: 6, maxReps: 8, isPrimary: true } },
            { id: 'la-2', name: 'Prensa (pies bajos)', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'la-3', name: 'Extensiones', target: { sets: 3, reps: '12-15 + myo', minReps: 12, maxReps: 15 } },
            { id: 'la-4', name: 'Peso muerto rumano', target: { sets: 3, reps: '8-10', minReps: 8, maxReps: 10, isPrimary: true } },
            { id: 'la-5', name: 'Gemelos prensa', target: { sets: 4, reps: '12-15', minReps: 12, maxReps: 15 } },
            { id: 'la-core', name: 'Elevaciones de piernas colgado', target: { sets: 3, reps: '10-15', minReps: 10, maxReps: 15 } },
        ]
    },
    {
        id: 'upper-b',
        title: 'Upper B',
        exercises: [
            { id: 'ub-1', name: 'Press militar', target: { sets: 4, reps: '6-8', minReps: 6, maxReps: 8, isPrimary: true } },
            { id: 'ub-2', name: 'Dominadas lastradas', target: { sets: 4, reps: '6-10', minReps: 6, maxReps: 10, isPrimary: true } },
            { id: 'ub-3', name: 'Press inclinado máquina', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ub-4', name: 'Remo polea', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ub-5', name: 'Elevaciones laterales', target: { sets: 4, reps: '15-20', minReps: 15, maxReps: 20 } },
            { id: 'ub-6', name: 'Curl inclinado', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ub-7', name: 'Tríceps francés', target: { sets: 3, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'ub-8', name: 'Martillo', target: { sets: 2, reps: '12-15', minReps: 12, maxReps: 15 } },
        ]
    },
    {
        id: 'lower-b',
        title: 'Lower B',
        exercises: [
            { id: 'lb-1', name: 'Hip thrust', target: { sets: 4, reps: '8-10', minReps: 8, maxReps: 10, isPrimary: true } },
            { id: 'lb-2', name: 'Curl femoral', target: { sets: 4, reps: '10-12', minReps: 10, maxReps: 12 } },
            { id: 'lb-3', name: 'Zancadas', target: { sets: 3, reps: '10 por pierna', minReps: 10, maxReps: 10 } },
            { id: 'lb-4', name: 'Prensa (pies altos)', target: { sets: 2, reps: '12-15', minReps: 12, maxReps: 15 } },
            { id: 'lb-5', name: 'Gemelos sentado', target: { sets: 4, reps: '15-20', minReps: 15, maxReps: 20 } },
            { id: 'lb-core', name: 'Rueda abdominal', target: { sets: 3, reps: '8-12', minReps: 8, maxReps: 12 } },
        ]
    }
];

export const INITIAL_DATA: AppData = {
    habits: DEFAULT_HABITS,
    habitLogs: [],
    tasks: [],
    trainingLogs: [],
    nutritionLogs: [],
    routines: DEFAULT_ROUTINES,
    gymSessions: [],
    legacyRoutines: {},
    nextWeekFocus: '',
    showDay5: false,
    weeklyReviews: [],
    parkedIdeas: [
        {
            id: 'padelito',
            text: 'Padelito — retomar cuando esté operando el club (canal de distribución: profes del club)',
            reviewNote: 'Revisar enero 2027',
            archived: false,
            createdAt: new Date().toISOString()
        }
    ],
    studyHabitId: 'leer',
    goals: { calories: 2811, protein: 155 },
    profile: { name: 'Rodri', business: true },
    appliedMigrations: [],
};

// --- Migraciones sobre datos ya guardados en el teléfono ---
// Cada migración corre una sola vez y solo toca lo que el usuario no cambió a mano.
const CORE_LOWER_A: Exercise = { id: 'la-core', name: 'Elevaciones de piernas colgado', target: { sets: 3, reps: '10-15', minReps: 10, maxReps: 15 } };
const CORE_LOWER_B: Exercise = { id: 'lb-core', name: 'Rueda abdominal', target: { sets: 3, reps: '8-12', minReps: 8, maxReps: 12 } };

const addExerciseIfMissing = (routines: RoutineTemplate[], routineId: string, exercise: Exercise): RoutineTemplate[] =>
    routines.map(r => {
        if (r.id !== routineId) return r;
        const exists = r.exercises.some(e => e.id === exercise.id || e.name.toLowerCase() === exercise.name.toLowerCase());
        return exists ? r : { ...r, exercises: [...r.exercises, exercise] };
    });

const MIGRATIONS: { id: string; run: (data: AppData) => AppData }[] = [
    {
        id: '2026-10-troya',
        run: (data) => {
            let routines = addExerciseIfMissing(data.routines, 'lower-a', CORE_LOWER_A);
            routines = addExerciseIfMissing(routines, 'lower-b', CORE_LOWER_B);
            routines = routines.map(r => r.id !== 'upper-b' ? r : {
                ...r,
                exercises: r.exercises.map(e => e.id === 'ub-2' && e.name === 'Dominadas' ? { ...e, name: 'Dominadas lastradas' } : e)
            });
            const habits = data.habits.map(h => h.id === '2' && h.name === 'Hit 140g protein' ? { ...h, name: 'Proteína 150g+' } : h);
            const goals = { ...data.goals, protein: Math.max(data.goals.protein, 155) };
            return { ...data, routines, habits, goals };
        }
    }
];

const runMigrations = (data: AppData): AppData => {
    let result = data;
    for (const m of MIGRATIONS) {
        if (result.appliedMigrations.includes(m.id)) continue;
        result = m.run(result);
        result = { ...result, appliedMigrations: [...result.appliedMigrations, m.id] };
    }
    return result;
};

// --- Datos guardados localmente ---
// LEGACY_KEY: donde la app guardaba todo antes de tener usuarios (solo en el teléfono de Rodri).
export const LEGACY_KEY = STORAGE_KEY;
const LEGACY_CLAIMED_KEY = 'rodri_daily_hq_legacy_claimed';
const cacheKey = (userId: string) => `daily_hq_cache_${userId}`;

// Datos de arranque para un usuario nuevo: hábitos genéricos, sin cosas de NPPRO
const GENERIC_HABITS: Habit[] = [
    { id: '1', name: 'Entrené', emoji: '🏋️', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '2', name: 'Llegué a la proteína', emoji: '🍗', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '3', name: '2L de agua', emoji: '💧', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '4', name: '8k pasos', emoji: '🚶', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '7', name: 'Dormir 7h+', emoji: '😴', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: 'leer', name: 'Leer 2 páginas', emoji: '📖', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
];

export const createNewUserData = (name: string, withBaseRoutine: boolean): AppData => ({
    ...INITIAL_DATA,
    habits: GENERIC_HABITS,
    routines: withBaseRoutine ? DEFAULT_ROUTINES : [],
    parkedIdeas: [],
    goals: { calories: 2000, protein: 110 },
    profile: { name: name.trim() || 'Vos', business: false },
    appliedMigrations: MIGRATIONS.map(m => m.id),
});

// Completa campos que falten (datos viejos o importados) y corre las migraciones pendientes
export const normalizeData = (raw: any): AppData => {
    const data = raw && typeof raw === 'object' ? raw : {};
    return runMigrations({
        ...INITIAL_DATA,
        ...data,
        habits: Array.isArray(data.habits) ? data.habits : DEFAULT_HABITS,
        habitLogs: Array.isArray(data.habitLogs) ? data.habitLogs : [],
        tasks: Array.isArray(data.tasks) ? data.tasks : [],
        trainingLogs: Array.isArray(data.trainingLogs) ? data.trainingLogs : [],
        nutritionLogs: Array.isArray(data.nutritionLogs) ? data.nutritionLogs : [],
        routines: Array.isArray(data.routines) ? data.routines : DEFAULT_ROUTINES,
        gymSessions: Array.isArray(data.gymSessions) ? data.gymSessions : [],
        weeklyReviews: Array.isArray(data.weeklyReviews) ? data.weeklyReviews : [],
        parkedIdeas: Array.isArray(data.parkedIdeas) ? data.parkedIdeas : INITIAL_DATA.parkedIdeas,
        studyHabitId: data.studyHabitId || 'leer',
        // Antes las metas estaban fijas en el código (2811 kcal / 140g)
        goals: data.goals ?? { calories: 2811, protein: 140 },
        // Los datos de antes de los usuarios son de Rodri
        profile: data.profile ?? { name: 'Rodri', business: true },
        appliedMigrations: Array.isArray(data.appliedMigrations) ? data.appliedMigrations : [],
    });
};

const readJson = (key: string): any | null => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// Datos viejos de este teléfono que todavía no se subieron a ninguna cuenta
export const getUnclaimedLegacyData = (): AppData | null => {
    if (localStorage.getItem(LEGACY_CLAIMED_KEY)) return null;
    const raw = readJson(LEGACY_KEY);
    return raw ? normalizeData(raw) : null;
};
export const markLegacyClaimed = () => localStorage.setItem(LEGACY_CLAIMED_KEY, new Date().toISOString());

// Copia local por usuario (para abrir rápido y funcionar sin señal)
export const readCache = (userId: string): AppData | null => {
    const raw = readJson(cacheKey(userId));
    return raw ? normalizeData(raw) : null;
};
export const writeCache = (userId: string, data: AppData) => {
    try {
        localStorage.setItem(cacheKey(userId), JSON.stringify(data));
    } catch (e) {
        console.error('No se pudo guardar la copia local', e);
    }
};

export const exportData = (data: AppData) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-hq-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const readImportFile = (file: File): Promise<AppData> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                resolve(normalizeData(JSON.parse(e.target?.result as string)));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
