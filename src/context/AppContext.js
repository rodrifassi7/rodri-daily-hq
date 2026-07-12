import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadData, saveData, INITIAL_DATA } from '../utils/storage';
const AppContext = createContext(undefined);
// --- Helper Functions ---
export const getTodayKey = () => new Date().toISOString().split('T')[0];
export const ensureHabitLog = (habitId, date, existing) => ({
    habitId,
    date,
    completed: existing?.completed ?? false,
    ...(existing?.value !== undefined ? { value: existing.value } : {})
});
export const ensureTrainingLog = (date, existing) => ({
    date,
    type: existing?.type ?? 'Rest',
    ...(existing?.notes !== undefined ? { notes: existing.notes } : {})
});
export const ensureNutritionLog = (date, existing) => ({
    date,
    calories: existing?.calories ?? 0,
    protein: existing?.protein ?? 0,
    meals: existing?.meals ?? [],
    ...(existing?.rating !== undefined ? { rating: existing.rating } : {})
});
export const AppProvider = ({ children }) => {
    const [data, setData] = useState(() => loadData());
    useEffect(() => {
        saveData(data);
    }, [data]);
    const updateData = useCallback((newData) => {
        setData(prev => ({ ...prev, ...newData }));
    }, []);
    const toggleHabit = useCallback((habitId, date) => {
        setData(prev => {
            const existingIdx = prev.habitLogs.findIndex(l => l.habitId === habitId && l.date === date);
            const newLogs = [...prev.habitLogs];
            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, completed: !existing.completed };
                }
            }
            else {
                newLogs.push(ensureHabitLog(habitId, date, { habitId, date, completed: true }));
            }
            return { ...prev, habitLogs: newLogs };
        });
    }, []);
    const toggleTask = useCallback((taskId) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        }));
    }, []);
    const toggleTop3 = useCallback((id) => {
        setData(prev => {
            const task = prev.tasks.find(t => t.id === id);
            if (!task)
                return prev;
            const top3Count = prev.tasks.filter(t => t.isTop3).length;
            if (!task.isTop3 && top3Count >= 3)
                return prev; // Max 3
            return {
                ...prev,
                tasks: prev.tasks.map(t => t.id === id ? { ...t, isTop3: !t.isTop3 } : t)
            };
        });
    }, []);
    const updateTraining = useCallback((date, type) => {
        setData(prev => {
            const existingIdx = prev.trainingLogs.findIndex(l => l.date === date);
            const newLogs = [...prev.trainingLogs];
            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, type };
                }
            }
            else {
                newLogs.push(ensureTrainingLog(date, { date, type }));
            }
            return { ...prev, trainingLogs: newLogs };
        });
    }, []);
    const updateNutrition = useCallback((date, calories, protein) => {
        setData(prev => {
            const existingIdx = prev.nutritionLogs.findIndex(l => l.date === date);
            const newLogs = [...prev.nutritionLogs];
            if (existingIdx > -1) {
                const existing = newLogs[existingIdx];
                if (existing) {
                    newLogs[existingIdx] = { ...existing, calories, protein };
                }
            }
            else {
                newLogs.push(ensureNutritionLog(date, { date, calories, protein, meals: [] }));
            }
            return { ...prev, nutritionLogs: newLogs };
        });
    }, []);
    const saveGymSession = useCallback((session) => {
        setData(prev => {
            const existingIdx = prev.gymSessions.findIndex(s => s.id === session.id);
            const newSessions = [...prev.gymSessions];
            if (existingIdx > -1) {
                newSessions[existingIdx] = session;
            }
            else {
                newSessions.push(session);
            }
            return { ...prev, gymSessions: newSessions };
        });
    }, []);
    const saveRoutine = useCallback((routine) => {
        setData(prev => {
            const existingIdx = prev.routines.findIndex(r => r.id === routine.id);
            const newRoutines = [...prev.routines];
            if (existingIdx > -1) {
                newRoutines[existingIdx] = routine;
            }
            else {
                newRoutines.push(routine);
            }
            return { ...prev, routines: newRoutines };
        });
    }, []);
    const deleteRoutine = useCallback((routineId) => {
        setData(prev => ({
            ...prev,
            routines: prev.routines.filter(r => r.id !== routineId)
        }));
    }, []);
    const addTask = useCallback((task) => {
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
    const deleteTask = useCallback((id) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));
    }, []);
    const resetData = useCallback(() => {
        setData(INITIAL_DATA);
    }, []);
    return (_jsx(AppContext.Provider, { value: {
            data,
            updateData,
            toggleHabit,
            toggleTask,
            updateTraining,
            updateNutrition,
            saveGymSession,
            saveRoutine,
            deleteRoutine,
            addTask,
            deleteTask,
            toggleTop3,
            resetData
        }, children: children }));
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error('useApp must be used within AppProvider');
    return context;
};
//# sourceMappingURL=AppContext.js.map