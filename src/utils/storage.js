import { format } from 'date-fns';
const STORAGE_KEY = 'rodri_daily_hq_data';
const DEFAULT_HABITS = [
    { id: '1', name: 'Training Done', emoji: '🏋️', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '2', name: 'Hit 140g protein', emoji: '🍗', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '3', name: '2.5L water', emoji: '💧', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '4', name: '8k steps', emoji: '🚶', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '5', name: 'Focus block 25min', emoji: '📵', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '6', name: '10min improvement', emoji: '🧠', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
    { id: '7', name: 'Sleep 7h+', emoji: '😴', type: 'checkbox', frequency: 'daily', createdAt: new Date().toISOString() },
];
const DEFAULT_ROUTINES = [
    {
        id: 'upper-a',
        title: 'Upper A',
        exercises: [
            { id: 'ua-1', name: 'Bench Press / Chest Press Machine' },
            { id: 'ua-2', name: 'Incline Dumbbell Press' },
            { id: 'ua-3', name: 'Lat Pulldown' },
            { id: 'ua-4', name: 'Seated Row' },
            { id: 'ua-5', name: 'Shoulder Press' },
            { id: 'ua-6', name: 'Lateral Raises' },
            { id: 'ua-7', name: 'Triceps Pushdown' },
            { id: 'ua-8', name: 'Biceps Curl' },
        ]
    },
    {
        id: 'lower-a',
        title: 'Lower A',
        exercises: [
            { id: 'la-1', name: 'Squat / Hack Squat' },
            { id: 'la-2', name: 'Romanian Deadlift' },
            { id: 'la-3', name: 'Leg Press' },
            { id: 'la-4', name: 'Leg Curl' },
            { id: 'la-5', name: 'Leg Extension' },
            { id: 'la-6', name: 'Calf Raises' },
            { id: 'la-7', name: 'Abs (Cable Crunch)' },
        ]
    },
    {
        id: 'upper-b',
        title: 'Upper B',
        exercises: [
            { id: 'ub-1', name: 'Incline Chest Press' },
            { id: 'ub-2', name: 'Dumbbell Fly / Pec Deck' },
            { id: 'ub-3', name: 'Pull Ups / Assisted Pull Up' },
            { id: 'ub-4', name: 'Row Machine' },
            { id: 'ub-5', name: 'Arnold Press' },
            { id: 'ub-6', name: 'Rear Delt Fly' },
            { id: 'ub-7', name: 'Triceps Overhead Extension' },
            { id: 'ub-8', name: 'Hammer Curl' },
        ]
    },
    {
        id: 'lower-b',
        title: 'Lower B',
        exercises: [
            { id: 'lb-1', name: 'Deadlift Variation / Trap Bar' },
            { id: 'lb-2', name: 'Bulgarian Split Squat' },
            { id: 'lb-3', name: 'Hip Thrust' },
            { id: 'lb-4', name: 'Leg Curl' },
            { id: 'lb-5', name: 'Leg Extension' },
            { id: 'lb-6', name: 'Calf Raises' },
            { id: 'lb-7', name: 'Abs (Plank / Machine)' },
        ]
    },
    {
        id: 'day-5',
        title: 'Day 5 (Optional)',
        isOptional: true,
        exercises: [
            { id: 'd5-1', name: 'Full Body / Weak Points' },
        ]
    }
];
export const INITIAL_DATA = {
    habits: DEFAULT_HABITS,
    habitLogs: [],
    tasks: [],
    trainingLogs: [],
    nutritionLogs: [],
    routines: DEFAULT_ROUTINES,
    exerciseProgress: [],
    legacyRoutines: {},
    nextWeekFocus: '',
    showDay5: false,
};
export const loadData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored)
        return INITIAL_DATA;
    try {
        const data = JSON.parse(stored);
        // Migration: convert legacy routines if they exist
        if (data.routines && !Array.isArray(data.routines)) {
            data.legacyRoutines = data.routines;
            data.routines = DEFAULT_ROUTINES;
            data.exerciseProgress = data.exerciseProgress || [];
            data.showDay5 = data.showDay5 ?? false;
        }
        return {
            ...INITIAL_DATA,
            ...data,
            // Ensure routines stay structured even if someone messes with the JSON
            routines: Array.isArray(data.routines) ? data.routines : DEFAULT_ROUTINES
        };
    }
    catch (e) {
        console.error('Failed to parse storage data', e);
        return INITIAL_DATA;
    }
};
export const saveData = (data) => {
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
export const importData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result);
                saveData(data);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
//# sourceMappingURL=storage.js.map