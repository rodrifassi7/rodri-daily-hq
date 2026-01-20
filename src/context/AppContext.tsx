import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppData, Habit, HabitLog, Task, TrainingLog, NutritionLog, TrainingType, ExerciseProgress } from '../types';
import { loadData, saveData, INITIAL_DATA } from '../utils/storage';

interface AppContextType {
    data: AppData;
    updateData: (newData: Partial<AppData>) => void;
    toggleHabit: (habitId: string, date: string) => void;
    toggleTask: (taskId: string) => void;
    updateTraining: (date: string, type: TrainingType) => void;
    updateNutrition: (date: string, calories: number, protein: number) => void;
    updateExerciseProgress: (routineId: string, exerciseId: string, week: number, progress: Partial<Omit<ExerciseProgress, 'routineId' | 'exerciseId' | 'week'>>) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'isTop3'>) => void;
    deleteTask: (id: string) => void;
    toggleTop3: (id: string) => void;
    resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
            let newLogs = [...prev.habitLogs];
            if (existingIdx > -1) {
                newLogs[existingIdx] = { ...newLogs[existingIdx], completed: !newLogs[existingIdx].completed };
            } else {
                newLogs.push({ habitId, date, completed: true } as HabitLog);
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
            let newLogs = [...prev.trainingLogs];
            if (existingIdx > -1) {
                newLogs[existingIdx] = { ...newLogs[existingIdx], type };
            } else {
                newLogs.push({ date, type } as TrainingLog);
            }
            return { ...prev, trainingLogs: newLogs };
        });
    }, []);

    const updateNutrition = useCallback((date: string, calories: number, protein: number) => {
        setData(prev => {
            const existingIdx = prev.nutritionLogs.findIndex(l => l.date === date);
            let newLogs = [...prev.nutritionLogs];
            if (existingIdx > -1) {
                newLogs[existingIdx] = { ...newLogs[existingIdx], calories, protein };
            } else {
                newLogs.push({ date, calories, protein, meals: [] } as NutritionLog);
            }
            return { ...prev, nutritionLogs: newLogs };
        });
    }, []);

    const updateExerciseProgress = useCallback((routineId: string, exerciseId: string, week: number, progress: Partial<ExerciseProgress>) => {
        setData(prev => {
            const existingIdx = prev.exerciseProgress.findIndex(
                p => p.routineId === routineId && p.exerciseId === exerciseId && p.week === week
            );

            let newProgress = [...prev.exerciseProgress];
            if (existingIdx > -1) {
                newProgress[existingIdx] = { ...newProgress[existingIdx], ...progress };
            } else {
                newProgress.push({
                    routineId,
                    exerciseId,
                    week,
                    weightKg: progress.weightKg || 0,
                    reps: progress.reps || 0,
                    sets: progress.sets || 0
                } as ExerciseProgress);
            }
            return { ...prev, exerciseProgress: newProgress };
        });
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
            updateExerciseProgress,
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
