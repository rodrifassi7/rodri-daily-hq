import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppData, Habit, HabitLog, Task, TrainingLog, NutritionLog, TrainingType, GymSession, RoutineTemplate } from '../types';
import { loadData, saveData, INITIAL_DATA } from '../utils/storage';

interface AppContextType {
    data: AppData;
    updateData: (newData: Partial<AppData>) => void;
    toggleHabit: (habitId: string, date: string) => void;
    toggleTask: (taskId: string) => void;
    updateTraining: (date: string, type: TrainingType) => void;
    updateNutrition: (date: string, calories: number, protein: number) => void;
    saveGymSession: (session: GymSession) => void;
    saveRoutine: (routine: RoutineTemplate) => void;
    deleteRoutine: (routineId: string) => void;
    saveHabit: (habit: Habit) => void;
    deleteHabit: (habitId: string) => void;
    setStudyHabitId: (habitId: string) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'isTop3'>) => void;
    deleteTask: (id: string) => void;
    toggleTop3: (id: string) => void;
    resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Helper Functions ---
export const getTodayKey = () => new Date().toISOString().split('T')[0];

export const ensureHabitLog = (habitId: string, date: string, existing?: HabitLog): HabitLog => ({
    habitId,
    date,
    completed: existing?.completed ?? false,
    ...(existing?.value !== undefined ? { value: existing.value } : {})
});

export const ensureTrainingLog = (date: string, existing?: TrainingLog): TrainingLog => ({
    date,
    type: existing?.type ?? 'Rest',
    ...(existing?.notes !== undefined ? { notes: existing.notes } : {})
});

export const ensureNutritionLog = (date: string, existing?: NutritionLog): NutritionLog => ({
    date,
    calories: existing?.calories ?? 0,
    protein: existing?.protein ?? 0,
    meals: existing?.meals ?? [],
    ...(existing?.rating !== undefined ? { rating: existing.rating } : {})
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(() => loadData());

    useEffect(() => {
        saveData(data);
    }, [data]);

    const updateData = useCallback((newData: Partial<AppData>) => {
        setData(prev => ({ ...prev, ...newData }));
    }, []);

    const toggleHabit = useCallback((habitId: string, date: string) => {
        setData(prev => {
            const existingIdx = prev.habitLogs.findIndex(l => l.habitId === habitId && l.date === date);
            const newLogs = [...prev.habitLogs];

            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, completed: !existing.completed };
                }
            } else {
                newLogs.push(ensureHabitLog(habitId, date, { habitId, date, completed: true }));
            }
            return { ...prev, habitLogs: newLogs };
        });
    }, []);

    const toggleTask = useCallback((taskId: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        }));
    }, []);

    const toggleTop3 = useCallback((id: string) => {
        setData(prev => {
            const task = prev.tasks.find(t => t.id === id);
            if (!task) return prev;

            const top3Count = prev.tasks.filter(t => t.isTop3).length;
            if (!task.isTop3 && top3Count >= 3) return prev; // Max 3

            return {
                ...prev,
                tasks: prev.tasks.map(t => t.id === id ? { ...t, isTop3: !t.isTop3 } : t)
            };
        });
    }, []);

    const updateTraining = useCallback((date: string, type: TrainingType) => {
        setData(prev => {
            const existingIdx = prev.trainingLogs.findIndex(l => l.date === date);
            const newLogs = [...prev.trainingLogs];

            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, type };
                }
            } else {
                newLogs.push(ensureTrainingLog(date, { date, type }));
            }
            return { ...prev, trainingLogs: newLogs };
        });
    }, []);

    const updateNutrition = useCallback((date: string, calories: number, protein: number) => {
        setData(prev => {
            const existingIdx = prev.nutritionLogs.findIndex(l => l.date === date);
            const newLogs = [...prev.nutritionLogs];

            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, calories, protein };
                }
            } else {
                newLogs.push(ensureNutritionLog(date, { date, calories, protein, meals: [] }));
            }
            return { ...prev, nutritionLogs: newLogs };
        });
    }, []);

    const saveGymSession = useCallback((session: GymSession) => {
        setData(prev => {
            const existingIdx = prev.gymSessions.findIndex(s => s.id === session.id);
            const newSessions = [...prev.gymSessions];
            if (existingIdx > -1) {
                newSessions[existingIdx] = session;
            } else {
                newSessions.push(session);
            }
            return { ...prev, gymSessions: newSessions };
        });
    }, []);

    const saveRoutine = useCallback((routine: RoutineTemplate) => {
        setData(prev => {
            const existingIdx = prev.routines.findIndex(r => r.id === routine.id);
            const newRoutines = [...prev.routines];
            if (existingIdx > -1) {
                newRoutines[existingIdx] = routine;
            } else {
                newRoutines.push(routine);
            }
            return { ...prev, routines: newRoutines };
        });
    }, []);

    const deleteRoutine = useCallback((routineId: string) => {
        setData(prev => ({
            ...prev,
            routines: prev.routines.filter(r => r.id !== routineId)
        }));
    }, []);

    const saveHabit = useCallback((habit: Habit) => {
        setData(prev => {
            const existingIdx = prev.habits.findIndex(h => h.id === habit.id);
            const newHabits = [...prev.habits];
            if (existingIdx > -1) {
                newHabits[existingIdx] = habit;
            } else {
                newHabits.push(habit);
            }
            return { ...prev, habits: newHabits };
        });
    }, []);

    const deleteHabit = useCallback((habitId: string) => {
        setData(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== habitId)
        }));
    }, []);

    const setStudyHabitId = useCallback((habitId: string) => {
        setData(prev => ({ ...prev, studyHabitId: habitId }));
    }, []);

    const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'isTop3'>) => {
        setData(prev => ({
            ...prev,
            tasks: [...prev.tasks, {
                ...task,
                id: Math.random().toString(36).substring(2, 9),
                createdAt: new Date().toISOString(),
                completed: false,
                isTop3: false
            }]
        }));
    }, []);

    const deleteTask = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));
    }, []);

    const resetData = useCallback(() => {
        setData(INITIAL_DATA);
    }, []);

    return (
        <AppContext.Provider value={{
            data,
            updateData,
            toggleHabit,
            toggleTask,
            updateTraining,
            updateNutrition,
            saveGymSession,
            saveRoutine,
            deleteRoutine,
            saveHabit,
            deleteHabit,
            setStudyHabitId,
            addTask,
            deleteTask,
            toggleTop3,
            resetData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};

