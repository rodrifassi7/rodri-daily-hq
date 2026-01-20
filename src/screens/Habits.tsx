import React, { useState } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar } from '../components/UI';
import { Plus, Trash2, Edit2, ChevronRight, Check } from 'lucide-react';
import type { Habit } from '../types';
import { format, startOfToday } from 'date-fns';

const Habits: React.FC = () => {
    const { data, toggleHabit, updateData } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');

    const deleteHabit = (id: string) => {
        if (confirm('Are you sure?')) {
            updateData({
                habits: data.habits.filter(h => h.id !== id),
                habitLogs: data.habitLogs.filter(l => l.habitId !== id)
            });
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-black">Habits</h1>
                <Button
                    variant="primary"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => alert('Feature coming soon: Custom Habits')}
                >
                    <Plus size={24} />
                </Button>
            </header>

            <div className="space-y-3">
                {data.habits.map(habit => {
                    const isCompleted = data.habitLogs.some(l => l.habitId === habit.id && l.date === todayStr && l.completed);

                    // Calculate streak for this habit
                    let streak = 0;
                    let curr = startOfToday();
                    while (true) {
                        const dStr = format(curr, 'yyyy-MM-dd');
                        if (data.habitLogs.some(l => l.habitId === habit.id && l.date === dStr && l.completed)) {
                            streak++;
                            curr = new Date(curr.setDate(curr.getDate() - 1));
                        } else {
                            break;
                        }
                    }

                    return (
                        <Card
                            key={habit.id}
                            className={cn(
                                "flex items-center justify-between p-4",
                                isCompleted ? "border-primary/30 ring-1 ring-primary/20" : ""
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">{habit.emoji}</div>
                                <div>
                                    <h3 className="font-bold">{habit.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-black">
                                            STREAK: {streak}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleHabit(habit.id, todayStr)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90",
                                    isCompleted ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-muted"
                                )}
                            >
                                {isCompleted ? <Check size={28} strokeWidth={3} /> : <div className="w-6 h-6 rounded-full border-2 border-muted/30" />}
                            </button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

// Helper inside Habits for cleaner code

export default Habits;
