import React from 'react';
import type { RoutineTemplate } from '../types';
interface RoutineEditorProps {
    routine: RoutineTemplate | null;
    onClose: () => void;
    onSave: (routine: RoutineTemplate) => void;
    onDelete?: (routineId: string) => void;
}
export declare const RoutineEditor: React.FC<RoutineEditorProps>;
export {};
//# sourceMappingURL=RoutineEditor.d.ts.map