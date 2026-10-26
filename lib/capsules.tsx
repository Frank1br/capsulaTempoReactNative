import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Capsule = {
  id: string;
  title: string;
  message: string;
  photoUri: string;
  /** Index into MOODS, or null when no mood was picked. */
  mood: number | null;
  createdAt: string;
  /** Local midnight of the opening day, as an ISO string. */
  opensAt: string;
};

export const MOODS = [
  { emoji: '😄', name: 'Feliz' },
  { emoji: '😐', name: 'Neutro' },
  { emoji: '😢', name: 'Triste' },
  { emoji: '😍', name: 'Apaixonado' },
  { emoji: '😴', name: 'Cansado' },
];

const STORAGE_KEY = 'capsulas:v1';
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

type CapsulesContextValue = {
  capsules: Capsule[];
  loaded: boolean;
  addCapsule: (input: Omit<Capsule, 'id' | 'createdAt'>) => Promise<Capsule>;
};

const CapsulesContext = createContext<CapsulesContextValue | null>(null);

export function CapsulesProvider({ children }: { children: ReactNode }) {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const capsulesRef = useRef<Capsule[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        capsulesRef.current = JSON.parse(raw);
        setCapsules(capsulesRef.current);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const addCapsule = useCallback(async (input: Omit<Capsule, 'id' | 'createdAt'>) => {
    const capsule: Capsule = {
      ...input,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
    };
    const next = [capsule, ...capsulesRef.current];
    capsulesRef.current = next;
    setCapsules(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return capsule;
  }, []);

  const value = useMemo(() => ({ capsules, loaded, addCapsule }), [capsules, loaded, addCapsule]);
  return <CapsulesContext.Provider value={value}>{children}</CapsulesContext.Provider>;
}

export function useCapsules() {
  const ctx = useContext(CapsulesContext);
  if (!ctx) throw new Error('useCapsules must be used inside CapsulesProvider');
  return ctx;
}

/** Re-renders every `intervalMs` so countdowns and lock states stay current. */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function isLocked(capsule: Capsule, now: number) {
  return new Date(capsule.opensAt).getTime() > now;
}

export function countdown(capsule: Capsule, now: number) {
  const ms = Math.max(0, new Date(capsule.opensAt).getTime() - now);
  return { days: Math.floor(ms / DAY), hours: Math.floor((ms % DAY) / HOUR) };
}

/** Whole days between two dates, counted on local calendar days. */
export function daysBetween(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / DAY);
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** 14/08/2026 */
export function formatShort(value: string | Date) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** 1º de julho de 2027 */
export function formatLong(value: string | Date) {
  const d = new Date(value);
  const day = d.getDate() === 1 ? '1º' : String(d.getDate());
  return `${day} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}
