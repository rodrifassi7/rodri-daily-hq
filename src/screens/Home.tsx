import React, { useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { format, startOfToday, isSameDay } from 'date-fns';
import { Card, ProgressBar, Button, Badge } from '../components/UI';
import { CheckCircle2, Circle, Trophy, Flame, Dumbbell, Apple, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const { data, toggleHabit, updateTraining, updateNutrition } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');

    const todayHabits = useMemo(() => {
        return data.habits.map(h => ({
            ...h,
            completed: data.habitLogs.some(l => l.habitId === h.id && l.date === todayStr && l.completed)
        }));
    }, [data.habits, data.habitLogs, todayStr]);

    const todayTasks = useMemo(() => {
        return data.tasks.filter(t => t.isTop3);
    }, [data.tasks]);

    const todayTraining = useMemo(() => {
        return data.trainingLogs.find(l => l.date === todayStr);
    }, [data.trainingLogs, todayStr]);

    const todayNutrition = useMemo(() => {
        return data.nutritionLogs.find(l => l.date === todayStr) || { calories: 0, protein: 0 };
    }, [data.nutritionLogs, todayStr]);

    const dayScore = useMemo(() => {
        const habitScore = todayHabits.length > 0 ? (todayHabits.filter(h => h.completed).length / todayHabits.length) * 40 : 0;
        const trainingScore = todayTraining ? 20 : 0;
        const nutritionScore = (Math.min(1, todayNutrition.calories / 2811) * 10 + Math.min(1, todayNutrition.protein / 140) * 20);
        const taskScore = todayTasks.length > 0 ? (todayTasks.filter(t => t.completed).length / todayTasks.length) * 10 : 0;

        return Math.round(habitScore + trainingScore + nutritionScore + taskScore);
    }, [todayHabits, todayTraining, todayNutrition, todayTasks]);

    const streak = useMemo(() => {
        // Simple streak calculation: count consecutive days with at least one habit done
        let count = 0;
        let curr = startOfToday();
        while (true) {
            const dStr = format(curr, 'yyyy-MM-dd');
            const hasHabit = data.habitLogs.some(l => l.date === dStr && l.completed);
            if (hasHabit) {
                count++;
                curr = new Date(curr.setDate(curr.getDate() - 1));
            } else {
                break;
            }
        }
        return count;
    }, [data.habitLogs]);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black">{format(new Date(), 'EEEE')}</h1>
                    <p className="text-muted font-medium">{format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <Flame size={18} className="text-primary fill-primary" />
                    <span className="font-bold text-primary">{streak}</span>
                </div>
            </header>

            {/* Day Score */}
            <Card className="bg-gradient-to-br from-card to-black relative overflow-hidden ring-1 ring-white/10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold">Day Score</h3>
                        <p className="text-xs text-muted">Keep pushing, Rodri!</p>
                    </div>
                    <div className="text-3xl font-black text-primary">{dayScore}%</div>
                </div>
                <ProgressBar progress={dayScore} />
            </Card>

            {/* Top 3 Tasks */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <ListTodo size={20} className="text-primary" />
                    <h2 className="text-xl font-bold">Top 3 Today</h2>
                </div>
                <div className="space-y-2">
                    {todayTasks.length === 0 ? (
                        <Card className="py-8 text-center border-dashed">
                            <p className="text-muted text-sm">No top tasks selected.</p>
                        </Card>
                    ) : (
                        todayTasks.map(task => (
                            <Card key={task.id} className="p-3 mb-2 flex items-center gap-3 active:scale-[0.98]">
                                <div className={task.completed ? "text-primary" : "text-muted"}>
                                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <span className={task.completed ? "line-through text-muted" : "font-medium"}>{task.title}</span>
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* Habit Quick Checklist */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-primary" />
                        <h2 className="text-xl font-bold">Habits</h2>
                    </div>
                    <span className="text-xs text-muted">{todayHabits.filter(h => h.completed).length}/{todayHabits.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {todayHabits.slice(0, 6).map(habit => (
                        <button
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id, todayStr)}
                            className={cn(
                                "p-3 rounded-xl border flex items-center gap-2 transition-all active:scale-95",
                                habit.completed
                                    ? "bg-primary/20 border-primary/50 text-white"
                                    : "bg-card border-border text-muted"
                            )}
                        >
                            <span className="text-xl">{habit.emoji}</span>
                            <span className="text-xs font-bold truncate">{habit.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Training Check-in */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Dumbbell size={20} className="text-primary" />
                    <h2 className="text-xl font-bold">Training</h2>
                </div>
                <Card className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status: {todayTraining?.type || 'Not logged'}</span>
                        <Badge color={todayTraining?.type ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted'}>
                            {todayTraining ? 'DONE ✅' : 'PENDING'}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        {(['Gym', 'Padel', 'Rest'] as const).map(type => (
                            <Button
                                key={type}
                                variant={todayTraining?.type === type ? 'primary' : 'outline'}
                                className="flex-1 py-2 text-xs"
                                onClick={() => updateTraining(todayStr, type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Nutrition Counters */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Apple size={20} className="text-primary" />
                    <h2 className="text-xl font-bold">Nutrition</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Card className="mb-0 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-muted">CALORIES</span>
                            <span className="text-sm font-black">{todayNutrition.calories}/2811</span>
                        </div>
                        <ProgressBar progress={(todayNutrition.calories / 2811) * 100} />
                        <div className="flex gap-1 mt-1">
                            <button
                                onClick={() => updateNutrition(todayStr, todayNutrition.calories + 300, todayNutrition.protein)}
                                className="flex-1 text-[10px] font-bold bg-white/5 py-1 rounded-md active:bg-white/10"
                            >
                                +300
                            </button>
                        </div>
                    </Card>
                    <Card className="mb-0 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-muted">PROTEIN</span>
                            <span className="text-sm font-black">{todayNutrition.protein}g/140g</span>
                        </div>
                        <ProgressBar progress={(todayNutrition.protein / 140) * 100} />
                        <div className="flex gap-1 mt-1">
                            <button
                                onClick={() => updateNutrition(todayStr, todayNutrition.calories, todayNutrition.protein + 20)}
                                className="flex-1 text-[10px] font-bold bg-white/5 py-1 rounded-md active:bg-white/10"
                            >
                                +20g
                            </button>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Weekly Summary */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Trophy size={20} className="text-primary" />
                    <h2 className="text-xl font-bold">Weekly Summary</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-card border border-border rounded-xl p-3 text-center">
                        <div className="text-xs text-muted mb-1">STREAK</div>
                        <div className="text-lg font-black">{streak}</div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-3 text-center">
                        <div className="text-xs text-muted mb-1">GYM</div>
                        <div className="text-lg font-black">
                            {data.trainingLogs.filter(l => l.type === 'Gym').length}/4
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-3 text-center">
                        <div className="text-xs text-muted mb-1">PADEL</div>
                        <div className="text-lg font-black">
                            {data.trainingLogs.filter(l => l.type === 'Padel').length}/3
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
