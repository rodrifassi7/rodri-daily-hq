import React from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { Onboarding } from './Onboarding';

// Rehacer "Conozcámonos" sobre una cuenta que ya tiene datos (no borra nada)
export const GoalsEditor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { data, updateData } = useApp();

    return createPortal(
        <Onboarding
            mode="edit"
            initialProfile={data.profile}
            initialGoals={data.goals}
            hasRoutines={data.routines.length > 0}
            onCancel={onClose}
            onDone={({ profile, goals, routines }) => {
                const habits = data.habits.map(h =>
                    h.id === '2' && /^(Proteína|Hit \d+g protein)/i.test(h.name) ? { ...h, name: `Proteína ${goals.protein}g` } : h
                );
                updateData({ profile, goals, habits, ...(routines ? { routines } : {}) });
                onClose();
            }}
        />,
        document.body
    );
};
