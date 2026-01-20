import React, { useMemo } from 'react';
import type { TrainingType } from '../types';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar, Badge } from '../components/UI';
import { PieChart, Download, Upload, Trash2, Github, ExternalLink, Star, Dumbbell, Apple, CheckSquare } from 'lucide-react';
import { exportData, importData } from '../utils/storage';
import { format, subDays, startOfToday } from 'date-fns';

const Review: React.FC = () => {
    const { data, updateData, resetData } = useApp();

    const stats = useMemo(() => {
        const today = startOfToday();
        const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd'));

        const habitCompletion = data.habitLogs.filter(l => last7Days.includes(l.date) && l.completed).length;
        const totalHabitPotential = data.habits.length * 7;
        const habitRate = totalHabitPotential > 0 ? (habitCompletion / totalHabitPotential) * 100 : 0;

        const totalTrainings = data.trainingLogs.filter(l => last7Days.includes(l.date) && l.type !== 'Rest').length;

        const nutritionLogs = data.nutritionLogs.filter(l => last7Days.includes(l.date));
        const avgProtein = nutritionLogs.length > 0 ? nutritionLogs.reduce((acc, l) => acc + l.protein, 0) / nutritionLogs.length : 0;

        const completedTasks = data.tasks.filter(t => t.completed).length;

        return {
            habitRate: Math.round(habitRate),
            totalTrainings,
            avgProtein: Math.round(avgProtein),
            completedTasks
        };
    }, [data]);

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await importData(file);
                window.location.reload();
            } catch (err) {
                alert('Failed to import data');
            }
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-black">Review</h1>
            </header>

            {/* Weekly Stats */}
            <section className="grid grid-cols-2 gap-3">
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <CheckSquare size={24} className="text-primary mb-2" />
                    <div className="text-3xl font-black">{stats.habitRate}%</div>
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Habit rate</div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <Dumbbell size={24} className="text-primary mb-2" />
                    <div className="text-3xl font-black">{stats.totalTrainings}</div>
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Trainings</div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <Apple size={24} className="text-primary mb-2" />
                    <div className="text-3xl font-black">{stats.avgProtein}g</div>
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Avg Protein</div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <Star size={24} className="text-primary mb-2" />
                    <div className="text-3xl font-black">{stats.completedTasks}</div>
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Total Tasks</div>
                </Card>
            </section>

            {/* Next Week Focus */}
            <section>
                <h2 className="text-xl font-bold mb-3">Next Week Focus</h2>
                <textarea
                    className="w-full bg-card border border-border rounded-2xl p-4 text-white outline-none focus:border-primary min-h-[120px] text-sm leading-relaxed"
                    placeholder="What is your main goal for next week?"
                    value={data.nextWeekFocus}
                    onChange={(e) => updateData({ nextWeekFocus: e.target.value })}
                />
            </section>

            {/* Data Management */}
            <section>
                <h2 className="text-xl font-bold mb-3">Settings & Data</h2>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2"
                            onClick={exportData}
                        >
                            <Download size={18} /> Export JSON
                        </Button>
                        <label className="flex-1">
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                            <div className="flex items-center justify-center gap-2 border border-border px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 text-white cursor-pointer bg-transparent">
                                <Upload size={18} /> Import JSON
                            </div>
                        </label>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 flex items-center justify-center gap-2"
                        onClick={() => {
                            if (confirm('DANGER: This will delete ALL your data forever. Continue?')) {
                                resetData();
                                window.location.reload();
                            }
                        }}
                    >
                        <Trash2 size={18} /> Wipe All Data
                    </Button>
                </div>
            </section>

            <footer className="text-center py-8">
                <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Rodri Daily HQ v1.0</div>
                <div className="mt-2 text-[10px] text-muted/50">Production Ready PWA</div>
            </footer>
        </div>
    );
};

export default Review;
