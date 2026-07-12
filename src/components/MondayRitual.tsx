import React, { useMemo, useState } from 'react';
import type { WeeklyReview } from '../types';
import { useApp } from '../context/AppContext';
import { Card, Button } from './UI';
import { ClipboardCheck, TrendingUp, TrendingDown, Minus, Pencil } from 'lucide-react';
import { format, startOfWeek, subDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

const num = (v: string) => (v === '' ? 0 : Number(v));

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; suffix?: string }> = ({ label, value, onChange, suffix }) => (
    <label className="block">
        <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2 mt-1">
            <input
                type="number"
                inputMode="decimal"
                className="w-full bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
            />
            {suffix && <span className="text-xs text-muted font-bold">{suffix}</span>}
        </div>
    </label>
);

const Delta: React.FC<{ curr: number; prev?: number | undefined; invert?: boolean; unit?: string }> = ({ curr, prev, invert, unit }) => {
    if (prev === undefined) return null;
    const diff = curr - prev;
    if (diff === 0) return <Minus size={12} className="text-muted inline" />;
    const good = invert ? diff < 0 : diff > 0;
    const Icon = diff > 0 ? TrendingUp : TrendingDown;
    return (
        <span className={good ? 'text-green-500' : 'text-red-500'}>
            <Icon size={12} className="inline mr-0.5" />
            {diff > 0 ? '+' : ''}{Math.round(diff * 10) / 10}{unit}
        </span>
    );
};

const MondayRitual: React.FC = () => {
    const { data, updateData } = useApp();
    const mondayKey = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const current = data.weeklyReviews.find(r => r.weekOf === mondayKey);
    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        viandasDia: current ? String(current.viandasDia) : '',
        clientesNuevos: current ? String(current.clientesNuevos) : '',
        enRiesgoContactados: current ? String(current.enRiesgoContactados) : '',
        cajaSemana: current ? String(current.cajaSemana) : '',
        horasNppro: current ? String(current.horasNppro) : '',
        peso: current ? String(current.peso) : '',
        medida: current ? String(current.medida) : '',
        focoSemana: current ? current.focoSemana : '',
    });

    // Auto-computed from existing app data (last 7 days)
    const auto = useMemo(() => {
        const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(startOfToday(), i), 'yyyy-MM-dd'));
        const entrenamientos = data.gymSessions.filter(s => last7.includes(s.date)).length;
        const estudio = data.habitLogs.filter(l => l.habitId === 'leer' && last7.includes(l.date) && l.completed).length;
        return { entrenamientos, estudio };
    }, [data.gymSessions, data.habitLogs]);

    const sorted = useMemo(
        () => [...data.weeklyReviews].sort((a, b) => b.weekOf.localeCompare(a.weekOf)),
        [data.weeklyReviews]
    );

    const save = () => {
        const review: WeeklyReview = {
            id: current?.id ?? Math.random().toString(36).substring(2, 9),
            weekOf: mondayKey,
            viandasDia: num(form.viandasDia),
            clientesNuevos: num(form.clientesNuevos),
            enRiesgoContactados: num(form.enRiesgoContactados),
            cajaSemana: num(form.cajaSemana),
            horasNppro: num(form.horasNppro),
            peso: num(form.peso),
            medida: num(form.medida),
            focoSemana: form.focoSemana,
            createdAt: current?.createdAt ?? new Date().toISOString(),
        };
        const others = data.weeklyReviews.filter(r => r.weekOf !== mondayKey);
        updateData({ weeklyReviews: [...others, review] });
        setEditing(false);
    };

    const prev = sorted.find(r => r.weekOf < mondayKey);
    const showForm = !current || editing;

    return (
        <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <ClipboardCheck size={20} className="text-primary" />
                Ritual de Lunes
            </h2>

            {/* Auto stats */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
                    <div className="text-xl font-black">{auto.entrenamientos}/4</div>
                    <div className="text-[9px] font-black text-muted uppercase tracking-widest">Entrenos (auto)</div>
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
                    <div className="text-xl font-black">{auto.estudio}/7</div>
                    <div className="text-[9px] font-black text-muted uppercase tracking-widest">Estudio (auto)</div>
                </div>
            </div>

            {showForm ? (
                <Card className="p-4 space-y-3">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">NPPRO</div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Viandas/día" value={form.viandasDia} onChange={v => setForm(f => ({ ...f, viandasDia: v }))} />
                        <Field label="Clientes nuevos" value={form.clientesNuevos} onChange={v => setForm(f => ({ ...f, clientesNuevos: v }))} />
                        <Field label="En riesgo contactados" value={form.enRiesgoContactados} onChange={v => setForm(f => ({ ...f, enRiesgoContactados: v }))} />
                        <Field label="Caja semana" value={form.cajaSemana} onChange={v => setForm(f => ({ ...f, cajaSemana: v }))} suffix="$" />
                    </div>
                    <Field label="Horas que me pidió NPPRO" value={form.horasNppro} onChange={v => setForm(f => ({ ...f, horasNppro: v }))} suffix="hs" />

                    <div className="text-[10px] font-black text-primary uppercase tracking-widest pt-2">Cuerpo</div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Peso" value={form.peso} onChange={v => setForm(f => ({ ...f, peso: v }))} suffix="kg" />
                        <Field label="Medida" value={form.medida} onChange={v => setForm(f => ({ ...f, medida: v }))} suffix="cm" />
                    </div>

                    <div className="text-[10px] font-black text-primary uppercase tracking-widest pt-2">La pregunta de la semana</div>
                    <textarea
                        className="w-full bg-card border border-border rounded-xl p-3 text-white outline-none focus:border-primary min-h-[70px] text-sm"
                        placeholder="¿Qué UNA cosa muevo esta semana que sume viandas/día o me acerque al club?"
                        value={form.focoSemana}
                        onChange={(e) => setForm(f => ({ ...f, focoSemana: e.target.value }))}
                    />
                    <Button className="w-full" onClick={save}>Guardar semana</Button>
                </Card>
            ) : (
                <Card className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="text-xs font-bold text-muted">
                            Semana del {format(new Date(mondayKey + 'T00:00:00'), "d 'de' MMMM", { locale: es })} ✅
                        </div>
                        <button onClick={() => setEditing(true)} className="text-muted hover:text-white">
                            <Pencil size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-2xl font-black">{current.viandasDia}</div>
                            <div className="text-[9px] font-black text-muted uppercase">Viandas/día <Delta curr={current.viandasDia} prev={prev?.viandasDia} /></div>
                        </div>
                        <div>
                            <div className="text-2xl font-black">{current.peso}<span className="text-sm">kg</span></div>
                            <div className="text-[9px] font-black text-muted uppercase">Peso <Delta curr={current.peso} prev={prev?.peso} unit="kg" /></div>
                        </div>
                        <div>
                            <div className="text-2xl font-black">{current.horasNppro}<span className="text-sm">hs</span></div>
                            <div className="text-[9px] font-black text-muted uppercase">Hs NPPRO <Delta curr={current.horasNppro} prev={prev?.horasNppro} invert unit="hs" /></div>
                        </div>
                    </div>
                    {current.focoSemana && (
                        <div className="mt-3 text-xs text-white/80 bg-primary/10 border border-primary/20 rounded-xl p-3">
                            🎯 {current.focoSemana}
                        </div>
                    )}
                </Card>
            )}

            {/* History */}
            {sorted.filter(r => r.weekOf !== mondayKey).length > 0 && (
                <div className="mt-3 space-y-2">
                    {sorted.filter(r => r.weekOf !== mondayKey).slice(0, 8).map((r) => (
                        <div key={r.id} className="flex justify-between items-center bg-card/50 border border-border rounded-xl px-3 py-2 text-xs">
                            <span className="text-muted font-bold">{format(new Date(r.weekOf + 'T00:00:00'), 'd MMM', { locale: es })}</span>
                            <span className="font-black">🍱 {r.viandasDia}/día</span>
                            <span className="font-black">⚖️ {r.peso}kg</span>
                            <span className="font-black">⏱ {r.horasNppro}hs</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MondayRitual;
