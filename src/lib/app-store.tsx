import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DICTS, UTILITIES, type Lang, type TranslationKey, type UtilityKey } from "./i18n";

export type Record_ = {
  id: string;
  utility: UtilityKey;
  previous: number;
  current: number;
  used: number;
  price: number;
  total: number;
  date: string; // ISO
};

export type Theme = "light" | "dark" | "system";

type Settings = {
  lang: Lang | null;
  theme: Theme;
  currency: string;
  prices: Record<UtilityKey, number>;
};

const DEFAULT_SETTINGS: Settings = {
  lang: null,
  theme: "system",
  currency: "TMT",
  prices: { gas: 0.05, electric: 0.06, water: 0.03 },
};

const SETTINGS_KEY = "meterpay.settings.v1";
const RECORDS_KEY = "meterpay.records.v1";

type Ctx = {
  ready: boolean;
  settings: Settings;
  records: Record_[];
  t: (key: TranslationKey) => string;
  lang: Lang;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setCurrency: (c: string) => void;
  setPrice: (u: UtilityKey, price: number) => void;
  addRecord: (r: Omit<Record_, "id" | "date">) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
  lastReading: (u: UtilityKey) => number | null;
};

const AppContext = createContext<Ctx | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [records, setRecords] = useState<Record_[]>([]);

  useEffect(() => {
    const loaded = readJSON<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
    loaded.prices = { ...DEFAULT_SETTINGS.prices, ...(loaded.prices ?? {}) };
    setSettings(loaded);
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      setRecords(raw ? (JSON.parse(raw) as Record_[]) : []);
    } catch {
      setRecords([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }, [records, ready]);

  // Theme application
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const apply = () => {
      const dark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.theme, ready]);

  useEffect(() => {
    if (!ready || !settings.lang) return;
    document.documentElement.lang = settings.lang;
  }, [settings.lang, ready]);

  const lang: Lang = settings.lang ?? "tk";

  const t = useCallback((key: TranslationKey) => DICTS[lang][key], [lang]);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      settings,
      records,
      lang,
      t,
      setLang: (l) => setSettings((s) => ({ ...s, lang: l })),
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setCurrency: (currency) => setSettings((s) => ({ ...s, currency })),
      setPrice: (u, price) =>
        setSettings((s) => ({ ...s, prices: { ...s.prices, [u]: price } })),
      addRecord: (r) =>
        setRecords((list) => [
          { ...r, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString() },
          ...list,
        ]),
      deleteRecord: (id) => setRecords((list) => list.filter((r) => r.id !== id)),
      clearAll: () => setRecords([]),
      lastReading: (u) => {
        const found = records.find((r) => r.utility === u);
        return found ? found.current : null;
      },
    }),
    [ready, settings, records, lang, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export { UTILITIES };
