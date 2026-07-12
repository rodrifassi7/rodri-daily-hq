import React, { useState } from 'react';
import type { ParkedIdea } from '../types';
import { useApp } from '../context/AppContext';
import { Card } from './UI';
import { Plus, Archive, RotateCcw } from 'lucide-react';
import { format, isMonday, getDate } from 'date-fns';
import { es } from 'date-fns/locale';

const ParkingLot: React.FC = () => {
    const { data, updateData } = useApp();
    const [text, setText] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    const active = data.parkedIdeas.filter(i => !i.archived);
    const archived = data.parkedIdeas.filter(i => i.archived);

    // Reminder: first Monday of the month → review day
    const today = new Date();
    const isReviewDay = isMonday(today) && getDate(today) <= 7;

    const addIdea = () => {
        const t = text.trim();
        if (!t) return;
        const idea: ParkedIdea = {
            id: Math.random().toString(36).substring(2, 9),
            text: t,
            archived: false,
            createdAt: new Date().toISOString(),
        };
        updateData({ parkedIdeas: [...data.parkedIdeas, idea] });
        setText('');
    };

    const toggleArchive = (id: string) => {
        updateData({
            parkedIdeas: data.parkedIdeas.map(i => i.id === id ? { ...i, archived: !i.archived } : i)
        });
    };

    return (
        <section>
            <h2 className="text-xl font-bold mb-3">🅿️ Estacionamiento de ideas</h2>

            {isReviewDay && (
                <div className="mb-3 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl p-3">
                    📅 Primer lunes del mes: 15 minutos para revisar la lista. Casi todo vuelve a guardarse — y está bien.
                </div>
            )}

            <div className="flex gap-2 mb-3">
                <input
                    className="flex-1 bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary text-sm"
                    placeholder="Idea nueva → acá, no a la agenda"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIdea()}
                />
                <button
                    onClick={addIdea}
                    className="bg-primary text-black rounded-xl px-4 font-black active:scale-95 transition-all"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="space-y-2">
                {active.map(idea => (
                    <Card key={idea.id} className="p-3 flex justify-between items-start gap-2">
                        <div>
                            <div className="text-sm text-white/90">{idea.text}</div>
                            <div className="text-[10px] text-muted mt-1">
                                {format(new Date(idea.createdAt), 'd MMM yyyy', { locale: es })}
                                {idea.reviewNote && <span className="text-primary font-bold"> · {idea.reviewNote}</span>}
                            </div>
                        </div>
                        <button onClick={() => toggleArchive(idea.id)} className="text-muted hover:text-white shrink-0 p-1">
                            <Archive size={15} />
                        </button>
                    </Card>
                ))}
                {active.length === 0 && (
                    <div className="text-xs text-muted text-center py-4">Estacionamiento vacío. Cuando llegue la próxima idea brillante… ya sabés dónde va.</div>
                )}
            </div>

            {archived.length > 0 && (
                <button
                    onClick={() => setShowArchived(s => !s)}
                    className="text-[10px] font-black text-muted uppercase tracking-widest mt-3"
                >
                    {showArchived ? 'Ocultar' : `Archivadas (${archived.length})`}
                </button>
            )}
            {showArchived && archived.map(idea => (
                <div key={idea.id} className="flex justify-between items-center text-xs text-muted mt-2 px-1">
                    <span className="line-through">{idea.text}</span>
                    <button onClick={() => toggleArchive(idea.id)} className="p-1"><RotateCcw size={13} /></button>
                </div>
            ))}
        </section>
    );
};

export default ParkingLot;
