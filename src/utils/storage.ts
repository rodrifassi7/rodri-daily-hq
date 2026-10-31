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

export const loadData = (): AppData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...INITIAL_DATA, appliedMigrations: MIGRATIONS.map(m => m.id) };
    try {
        const data = JSON.parse(stored);

        // Drop `exerciseProgress` if it exists in old storage and map it to `gymSessions`. Actually just load `gymSessions`.
        if (!data.gymSessions) {
            data.gymSessions = [];
        }

        // Migration: Ritual de Lunes + Estacionamiento
        if (!Array.isArray(data.weeklyReviews)) {
            data.weeklyReviews = [];
        }
        if (!Array.isArray(data.parkedIdeas)) {
            data.parkedIdeas = INITIAL_DATA.parkedIdeas;
        }

        // Ensure specific habits exist (Migration for existing users)
        const loadedHabits = Array.isArray(data.habits) ? data.habits : DEFAULT_HABITS;
        
        if (!data.studyHabitId) {
            data.studyHabitId = 'leer';
        }

        return runMigrations({
            ...INITIAL_DATA,
            ...data,
            habits: loadedHabits,
            // Ensure routines stay structured even if someone messes with the JSON
            routines: Array.isArray(data.routines) ? data.routines : DEFAULT_ROUTINES,
            // Antes las metas estaban fijas en el código (2811 kcal / 140g)
            goals: data.goals ?? { calories: 2811, protein: 140 },
            appliedMigrations: Array.isArray(data.appliedMigrations) ? data.appliedMigrations : [],
        });
    } catch (e) {
        console.error('Failed to parse storage data', e);
        return INITIAL_DATA;
    }
};

export const saveData = (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = () => {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rodri-daily-hq-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                saveData(data);
                resolve();
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
