import React, { useState, useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar, Badge } from '../components/UI';
import { Apple, Plus, Flame, Zap, Check, X, Minus } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import type { NutritionRating, Meal } from '../types';

const Nutrition: React.FC = () => {
    const { data, updateNutrition, updateData } = useApp();
    const todayStr = format(startOfToday(), 'yyyy-MM-dd');

    const todayLog = useMemo(() => {
        return data.nutritionLogs.find(l => l.date === todayStr) || { calories: 0, protein: 0, rating: 'OK' as NutritionRating };
    }, [data.nutritionLogs, todayStr]);

    const caloriesGoal = 2811;
    const proteinGoal = 140;

    const setRating = (rating: NutritionRating) => {
        const existingIdx = data.nutritionLogs.findIndex(l => l.date === todayStr);
        const newLogs = [...data.nutritionLogs];

        if (existingIdx > -1) {
            const existing = newLogs[existingIdx];
            if (existing) {
                newLogs[existingIdx] = { ...existing, rating };
            }
        } else {
            newLogs.push({ date: todayStr, calories: 0, protein: 0, rating, meals: [] });
        }
        updateData({ nutritionLogs: newLogs });
    };

    const quickAdds = [
        { label: 'Meal 1', cal: 600, pro: 35 },
        { label: 'Meal 2', cal: 800, pro: 45 },
        { label: 'Meal 3', cal: 700, pro: 40 },
        { label: 'Snack', cal: 300, pro: 20 },
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-black">Nutrition</h1>
            </header>

            {/* Main Stats */}
            <div className="grid grid-cols-1 gap-4">
                <Card className="bg-gradient-to-br from-card to-black p-6 ring-1 ring-white/10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Flame size={20} className="text-orange-500" />
                                <span className="text-xs font-black text-muted uppercase tracking-wider">Calories</span>
                            </div>
                            <div className="text-4xl font-black">{todayLog.calories} <span className="text-lg text-muted font-medium">/ {caloriesGoal}</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-muted uppercase tracking-wider mb-1">Remaining</div>
                            <div className="text-xl font-bold text-primary">{Math.max(0, caloriesGoal - todayLog.calories)}</div>
                        </div>
                    </div>
                    <ProgressBar progress={(todayLog.calories / caloriesGoal) * 100} color="bg-orange-500" />
                </Card>

                <Card className="bg-gradient-to-br from-card to-black p-6 ring-1 ring-white/10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Zap size={20} className="text-primary" />
                                <span className="text-xs font-black text-muted uppercase tracking-wider">Protein</span>
                            </div>
                            <div className="text-4xl font-black">{todayLog.protein}g <span className="text-lg text-muted font-medium">/ {proteinGoal}g</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-muted uppercase tracking-wider mb-1">Remaining</div>
                            <div className="text-xl font-bold text-primary">{Math.max(0, proteinGoal - todayLog.protein)}g</div>
                        </div>
                    </div>
                    <ProgressBar progress={(todayLog.protein / proteinGoal) * 100} color="bg-primary" />
                </Card>
            </div>

            {/* Quick Add Section */}
            <section>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Plus size={20} className="text-primary" />
                    Quick Add Templates
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {quickAdds.map(template => (
                        <button
                            key={template.label}
                            onClick={() => updateNutrition(todayStr, todayLog.calories + template.cal, todayLog.protein + template.pro)}
                            className="bg-card border border-border p-4 rounded-2xl text-left active:scale-[0.98] transition-all"
                        >
                            <div className="font-bold mb-1">{template.label}</div>
                            <div className="text-[10px] text-muted font-black uppercase">
                                {template.cal} kcal • {template.pro}g prot
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Manual Entry */}
            <section className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => updateNutrition(todayStr, todayLog.calories + 100, todayLog.protein)}
                >
                    <Plus size={16} /> 100 kcal
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => updateNutrition(todayStr, todayLog.calories, todayLog.protein + 10)}
                >
                    <Plus size={16} /> 10g Prot
                </Button>
            </section>

            {/* RESET Button */}
            <button
                onClick={() => updateNutrition(todayStr, 0, 0)}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted/30 hover:text-red-500/50 transition-colors"
            >
                Reset Daily Counters
            </button>

            {/* Daily Rating */}
            <section>
                <h2 className="text-xl font-bold mb-3">Rate your day</h2>
                <div className="flex gap-2">
                    {(['Good', 'OK', 'Bad'] as const).map(r => (
                        <button
                            key={r}
                            onClick={() => setRating(r)}
                            className={cn(
                                "flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center gap-1",
                                todayLog.rating === r
                                    ? r === 'Good' ? "bg-primary/20 border-primary text-primary"
                                        : r === 'Bad' ? "bg-red-500/20 border-red-500 text-red-500"
                                            : "bg-white/20 border-white text-white"
                                    : "bg-white/5 border-white/10 text-muted"
                            )}
                        >
                            <span className="text-lg">{r === 'Good' ? '✅' : r === 'Bad' ? '❌' : '😐'}</span>
                            <span className="text-xs font-bold uppercase">{r}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};


export default Nutrition;
