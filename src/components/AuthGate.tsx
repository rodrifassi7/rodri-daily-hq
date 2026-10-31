import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AppProvider } from '../context/AppContext';
import type { AppData } from '../types';
import {
    readCache, normalizeData, createNewUserData,
    getUnclaimedLegacyData, markLegacyClaimed,
} from '../utils/storage';
import { Button } from './UI';

type Ready = { data: AppData; needsUpload: boolean };

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">{children}</div>
    </div>
);

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white outline-none focus:border-primary';

// ---------- Login / registro ----------
const LoginScreen: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (error) {
                setMessage({
                    type: 'error',
                    text: error.message.includes('Email not confirmed')
                        ? 'Todavía no confirmaste el mail. Revisá tu casilla (y spam).'
                        : error.message.includes('Invalid login')
                            ? 'Mail o contraseña incorrectos.'
                            : `No se pudo entrar: ${error.message}`,
                });
            }
        } else {
            if (password.length < 6) {
                setLoading(false);
                return setMessage({ type: 'error', text: 'La contraseña tiene que tener al menos 6 caracteres.' });
            }
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: { data: { name: name.trim() }, emailRedirectTo: window.location.origin },
            });
            if (error) {
                setMessage({ type: 'error', text: error.message.includes('already registered') ? 'Ese mail ya tiene cuenta. Entrá con tu contraseña.' : `No se pudo crear la cuenta: ${error.message}` });
            } else if (!data.session) {
                setMessage({ type: 'info', text: 'Listo. Te mandamos un mail para confirmar la cuenta: tocá el link y después entrá acá.' });
                setMode('login');
            }
        }
        setLoading(false);
    };

    return (
        <Shell>
            <div>
                <h1 className="text-4xl font-black">Daily HQ</h1>
                <p className="text-muted font-medium mt-1">Hábitos, gym y comidas.</p>
            </div>

            <div className="flex bg-white/5 rounded-xl p-1">
                {(['login', 'signup'] as const).map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => { setMode(m); setMessage(null); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${mode === m ? 'bg-primary text-black' : 'text-muted'}`}
                    >
                        {m === 'login' ? 'Entrar' : 'Crear cuenta'}
                    </button>
                ))}
            </div>

            <form onSubmit={submit} className="space-y-3">
                {mode === 'signup' && (
                    <input className={inputCls} placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required autoComplete="given-name" />
                )}
                <input className={inputCls} type="email" placeholder="Mail" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" inputMode="email" />
                <input className={inputCls} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                {message && (
                    <p className={`text-sm font-semibold ${message.type === 'error' ? 'text-red-400' : 'text-primary'}`}>{message.text}</p>
                )}
                <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-black">
                    {loading ? 'Un segundo…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
                </Button>
            </form>
        </Shell>
    );
};

// ---------- Primera vez en una cuenta ----------
const SetupScreen: React.FC<{ defaultName: string; legacy: AppData | null; onDone: (data: AppData) => void }> = ({ defaultName, legacy, onDone }) => {
    const [name, setName] = useState(defaultName);

    if (legacy) {
        const sessions = legacy.gymSessions.length;
        return (
            <Shell>
                <div>
                    <h1 className="text-3xl font-black">Encontramos datos en este teléfono</h1>
                    <p className="text-muted mt-2 text-sm">
                        Son los datos que la app tenía guardados antes de las cuentas ({legacy.habits.length} hábitos, {legacy.routines.length} rutinas, {sessions} sesiones de gym).
                        ¿Los pasamos a esta cuenta?
                    </p>
                </div>
                <Button className="w-full bg-primary text-black font-black" onClick={() => { markLegacyClaimed(); onDone(legacy); }}>
                    Sí, son míos: pasarlos a mi cuenta
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onDone(createNewUserData(name, true))}>
                    No, empezar de cero
                </Button>
            </Shell>
        );
    }

    return (
        <Shell>
            <div>
                <h1 className="text-3xl font-black">¡Bienvenida/o!</h1>
                <p className="text-muted mt-2 text-sm">Dos cosas y arrancás. Todo se puede cambiar después.</p>
            </div>
            <input className={inputCls} placeholder="¿Cómo te llamás?" value={name} onChange={e => setName(e.target.value)} />
            <div className="space-y-3">
                <Button className="w-full bg-primary text-black font-black" onClick={() => onDone(createNewUserData(name, true))}>
                    Empezar con la rutina base (4 días)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onDone(createNewUserData(name, false))}>
                    Empezar sin rutina y armo la mía
                </Button>
            </div>
        </Shell>
    );
};

// ---------- Puerta de entrada ----------
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [ready, setReady] = useState<Ready | null>(null);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
        return () => sub.subscription.unsubscribe();
    }, []);

    const userId = session?.user.id;

    useEffect(() => {
        setReady(null);
        setNeedsSetup(false);
        setLoadError(null);
        if (!userId) return;
        let cancelled = false;

        (async () => {
            const { data: row, error } = await supabase.from('app_data').select('data').eq('user_id', userId).maybeSingle();
            if (cancelled) return;
            if (error) {
                // Sin señal: abrimos con la copia local si existe
                const cached = readCache(userId);
                if (cached) return setReady({ data: cached, needsUpload: false });
                return setLoadError('No hay conexión y este teléfono no tiene una copia de tus datos todavía.');
            }
            if (row?.data) return setReady({ data: normalizeData(row.data), needsUpload: false });
            setNeedsSetup(true);
        })();

        return () => { cancelled = true; };
    }, [userId]);

    if (session === undefined) return <Shell><p className="text-muted text-center">Cargando…</p></Shell>;
    if (!session) return <LoginScreen />;

    if (loadError) {
        return (
            <Shell>
                <p className="text-sm text-red-400 font-semibold">{loadError}</p>
                <Button className="w-full bg-primary text-black font-black" onClick={() => window.location.reload()}>Reintentar</Button>
                <Button variant="ghost" className="w-full" onClick={() => supabase.auth.signOut()}>Salir</Button>
            </Shell>
        );
    }

    if (needsSetup) {
        const meta = session.user.user_metadata as { name?: string } | undefined;
        return (
            <SetupScreen
                defaultName={meta?.name ?? ''}
                legacy={getUnclaimedLegacyData()}
                onDone={(data) => { setNeedsSetup(false); setReady({ data, needsUpload: true }); }}
            />
        );
    }

    if (!ready) return <Shell><p className="text-muted text-center">Cargando tus datos…</p></Shell>;

    return (
        <AppProvider
            key={session.user.id}
            userId={session.user.id}
            userEmail={session.user.email ?? ''}
            initialData={ready.data}
            needsUpload={ready.needsUpload}
        >
            {children}
        </AppProvider>
    );
};
