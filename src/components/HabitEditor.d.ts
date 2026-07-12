import React from 'react';
import type { Habit } from '../types';
interface HabitEditorProps {
    habit: Habit | null;
    onClose: () => void;
    onSave: (habit: Habit) => void;
}
export declare const HabitEditor: React.FC<HabitEditorProps>;
export {};
//# sourceMappingURL=HabitEditor.d.ts.map