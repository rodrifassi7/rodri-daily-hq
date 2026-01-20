import React, { useState, useMemo } from 'react';
import { cn } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/UI';
import { Plus, Trash2, Check, Star, Filter } from 'lucide-react';
import type { Category, Priority, Task } from '../types';
import { format, startOfToday } from 'date-fns';

const ToDo: React.FC = () => {
    const { data, toggleTask, addTask, deleteTask, toggleTop3 } = useApp();
    const [filter, setFilter] = useState<'All' | 'Today' | 'Backlog'>('All');
    const [showAdd, setShowAdd] = useState(false);

    // New task form state
    const [newTitle, setNewTitle] = useState('');
    const [newCat, setNewCat] = useState<Category>('Personal');
    const [newPri, setNewPri] = useState<Priority>('Medium');

    const filteredTasks = useMemo(() => {
        if (filter === 'Today') return data.tasks.filter(t => t.isTop3 || !t.completed);
        if (filter === 'Backlog') return data.tasks.filter(t => !t.dueDate);
        return data.tasks;
    }, [data.tasks, filter]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle) return;
        addTask({
            title: newTitle,
            category: newCat,
            priority: newPri,
        });
        setNewTitle('');
        setShowAdd(false);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-black">To-Do</h1>
                <Button
                    variant="primary"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => setShowAdd(!showAdd)}
                >
                    <Plus size={24} className={showAdd ? "rotate-45 transition-transform" : "transition-transform"} />
                </Button>
            </header>

            {showAdd && (
                <Card className="animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleAddTask} className="space-y-4">
                        <input
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary text-white"
                            placeholder="Task title..."
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white"
                                value={newCat}
                                onChange={e => setNewCat(e.target.value as Category)}
                            >
                                <option value="Personal">Personal</option>
                                <option value="Gym">Gym</option>
                                <option value="NP PRO">NP PRO</option>
                            </select>
                            <select
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white"
                                value={newPri}
                                onChange={e => setNewPri(e.target.value as Priority)}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">Add Task</Button>
                    </form>
                </Card>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {(['All', 'Today', 'Backlog'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                            filter === f ? "bg-white text-black" : "bg-card border border-border text-muted"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {filteredTasks.length === 0 ? (
                    <div className="py-12 text-center text-muted">No tasks found.</div>
                ) : (
                    filteredTasks.sort((a, b) => Number(b.isTop3) - Number(a.isTop3)).map(task => (
                        <Card key={task.id} className="p-3 mb-2 flex items-center justify-between gap-3 group">
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center border transition-all",
                                        task.completed ? "bg-primary border-primary text-white" : "border-white/20 text-transparent"
                                    )}
                                >
                                    <Check size={14} strokeWidth={4} />
                                </button>
                                <div className="flex flex-col overflow-hidden">
                                    <span className={cn("font-medium truncate", task.completed && "line-through text-muted")}>
                                        {task.title}
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[8px] font-black uppercase text-muted tracking-wide">{task.category}</span>
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-wide",
                                            task.priority === 'High' ? "text-red-500" : task.priority === 'Medium' ? "text-orange-500" : "text-blue-500"
                                        )}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleTop3(task.id)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        task.isTop3 ? "text-yellow-500 bg-yellow-500/10" : "text-muted hover:text-white"
                                    )}
                                >
                                    <Star size={18} fill={task.isTop3 ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};


export default ToDo;
