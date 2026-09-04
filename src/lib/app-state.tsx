"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SAVED_KEY = "hi_saved_devs";
const RECENT_KEY = "hi_recently_viewed";
const RECENT_MAX = 6;
const COMPARE_MAX = 4;

interface AppStateContextValue {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  liked: Set<string>;
  toggleLiked: (id: string) => void;

  savedOnly: boolean;
  setSavedOnly: (v: boolean) => void;

  recentIds: string[];
  addRecent: (id: string) => void;
  clearRecent: () => void;

  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (v: boolean) => void;

  regionFilter: string;
  setRegionFilter: (v: string) => void;
  zoneFilter: number | "all";
  setZoneFilter: (v: number | "all") => void;

  devModalId: string | null;
  openDevModal: (id: string) => void;
  closeDevModal: () => void;

  pageDevId: string | null;
  openDevPage: (id: string) => void;
  closeDevPage: () => void;

  riSubmitted: boolean;
  setRiSubmitted: (v: boolean) => void;
  riDefaultRegion: string | null;
  startPriority: (region: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [regionFilter, setRegionFilterState] = useState("all");
  const [zoneFilter, setZoneFilter] = useState<number | "all">("all");
  const [devModalId, setDevModalId] = useState<string | null>(null);
  const [pageDevId, setPageDevId] = useState<string | null>(null);
  const [riSubmitted, setRiSubmitted] = useState(false);
  const [riDefaultRegion, setRiDefaultRegion] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount so SSR/client markup matches on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiked(new Set(readStorage<string[]>(SAVED_KEY, [])));
    setRecentIds(readStorage<string[]>(RECENT_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(SAVED_KEY, Array.from(liked));
  }, [liked, hydrated]);

  useEffect(() => {
    if (hydrated) writeStorage(RECENT_KEY, recentIds);
  }, [recentIds, hydrated]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || devModalId || pageDevId || compareOpen ? "hidden" : "";
  }, [menuOpen, devModalId, pageDevId, compareOpen]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      menuOpen,
      setMenuOpen,
      liked,
      toggleLiked: (id) =>
        setLiked((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      savedOnly,
      setSavedOnly,
      recentIds,
      addRecent: (id) =>
        setRecentIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_MAX)),
      clearRecent: () => setRecentIds([]),
      compareIds,
      toggleCompare: (id) =>
        setCompareIds((prev) => {
          if (prev.includes(id)) return prev.filter((x) => x !== id);
          if (prev.length >= COMPARE_MAX) return prev;
          return [...prev, id];
        }),
      removeCompare: (id) => setCompareIds((prev) => prev.filter((x) => x !== id)),
      clearCompare: () => setCompareIds([]),
      compareOpen,
      setCompareOpen,
      regionFilter,
      setRegionFilter: (v) => {
        setRegionFilterState(v);
        setZoneFilter("all");
      },
      zoneFilter,
      setZoneFilter,
      devModalId,
      openDevModal: (id) => setDevModalId(id),
      closeDevModal: () => setDevModalId(null),
      pageDevId,
      openDevPage: (id) => {
        setPageDevId(id);
        setDevModalId(null);
        setRecentIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_MAX));
      },
      closeDevPage: () => setPageDevId(null),
      riSubmitted,
      setRiSubmitted,
      riDefaultRegion,
      startPriority: (region) => {
        setRiDefaultRegion(region);
        setDevModalId(null);
        setPageDevId(null);
        const el = document.getElementById("hi-register");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    }),
    [menuOpen, liked, savedOnly, recentIds, compareIds, compareOpen, regionFilter, zoneFilter, devModalId, pageDevId, riSubmitted, riDefaultRegion]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
