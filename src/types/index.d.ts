export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Gym' | 'NP PRO' | 'Personal';
export type Frequency = 'daily' | 'weekly';
export type HabitType = 'checkbox' | 'numeric';
export type TrainingType = 'Gym' | 'Rest';
export type NutritionRating = 'Good' | 'OK' | 'Bad';
export interface Habit {
    id: string;
    name: string;
    emoji: string;
    type: HabitType;
    frequency: Frequency;
    target?: number;
    unit?: string;
    createdAt: string;
}
export interface HabitLog {
    date: string;
    habitId: string;
    completed: boolean;
    value?: number;
}
export interface Task {
    id: string;
    title: string;
    category: Category;
    priority: Priority;
    dueDate?: string;
    completed: boolean;
    isTop3: boolean;
    recurring?: boolean;
    createdAt: string;
}
export interface TrainingLog {
    date: string;
    type: TrainingType;
    notes?: string;
}
export interface NutritionLog {
    date: string;
    calories: number;
    protein: number;
    rating?: NutritionRating;
    meals?: Meal[];
}
export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    time: string;
}
export interface ExerciseTarget {
    sets: number;
    reps: string;
    minReps: number;
    maxReps: number;
    isPrimary?: boolean;
}
export interface Exercise {
    id: string;
    name: string;
    target: ExerciseTarget;
}
export interface RoutineTemplate {
    id: string;
    title: string;
    exercises: Exercise[];
    isOptional?: boolean;
}
export interface ExerciseSetRecord {
    weightKg: number;
    reps: number;
    completed: boolean;
}
export interface GymSession {
    id: string;
    date: string;
    routineId: string;
    exercises: {
        exerciseId: string;
        sets: ExerciseSetRecord[];
        isCompleted?: boolean;
    }[];
}
export interface AppData {
    habits: Habit[];
    habitLogs: HabitLog[];
    tasks: Task[];
    trainingLogs: TrainingLog[];
    nutritionLogs: NutritionLog[];
    routines: RoutineTemplate[];
    gymSessions: GymSession[];
    legacyRoutines: {
        [key: string]: string;
    };
    nextWeekFocus: string;
    showDay5: boolean;
}
//# sourceMappingURL=index.d.ts.map