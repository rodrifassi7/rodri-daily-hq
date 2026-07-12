import React from 'react';
import type { AppData, Habit, HabitLog, Task, TrainingLog, NutritionLog, TrainingType, GymSession, RoutineTemplate } from '../types';
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
export declare const getTodayKey: () => string | undefined;
export declare const ensureHabitLog: (habitId: string, date: string, existing?: HabitLog) => HabitLog;
export declare const ensureTrainingLog: (date: string, existing?: TrainingLog) => TrainingLog;
export declare const ensureNutritionLog: (date: string, existing?: NutritionLog) => NutritionLog;
export declare const AppProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useApp: () => AppContextType;
export {};
//# sourceMappingURL=AppContext.d.ts.map