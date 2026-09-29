import { create } from 'zustand';
import type { PeriodRecord } from '@/types';
import { PERIOD_CYCLE_DAYS, WATER_GOAL } from '@/lib/constants';
import { generateId, todayISO, daysBetween } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  fetchAll,
  insertRow,
  deleteRow,
  getCurrentUserId,
} from '@/lib/sync';

// ═══════════════════════════════════════════════════
// PERIODS
// ═══════════════════════════════════════════════════
interface DbPeriod {
  id: string;
  start_date: string;
  note: string | null;
  created_at: string;
}

interface PeriodState {
  records: PeriodRecord[];
  loadFromCloud: () => Promise<void>;
  markToday: () => Promise<void>;
  removeRecord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  lastStart: () => string | null;
  nextStart: () => string | null;
  daysUntilNext: () => number | null;
}

export const usePeriodStore = create<PeriodState>((set, get) => ({
  records: [],

  loadFromCloud: async () => {
    const rows = await fetchAll<DbPeriod>('periods', {
      column: 'start_date',
      ascending: false,
    });
    set({
      records: rows.map((r) => ({
        id: r.id,
        startDate: r.start_date,
        note: r.note ?? undefined,
        createdAt: new Date(r.created_at).getTime(),
      })),
    });
  },

  markToday: async () => {
    const today = todayISO();
    if (get().records.some((r) => r.startDate === today)) return;
    const tempId = generateId();
    set((s) => ({
      records: [
        { id: tempId, startDate: today, createdAt: Date.now() },
        ...s.records,
      ],
    }));
    const row = await insertRow<DbPeriod>('periods', { start_date: today });
    if (row) {
      set((s) => ({
        records: s.records.map((r) =>
          r.id === tempId ? { ...r, id: row.id } : r
        ),
      }));
    }
  },

  removeRecord: async (id) => {
    set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
    await deleteRow('periods', id);
  },

  clearAll: async () => {
    const ids = get().records.map((r) => r.id);
    set({ records: [] });
    for (const id of ids) {
      await deleteRow('periods', id);
    }
  },

  lastStart: () => {
    const recs = get().records;
    if (recs.length === 0) return null;
    return [...recs].sort((a, b) =>
      b.startDate.localeCompare(a.startDate)
    )[0].startDate;
  },

  nextStart: () => {
    const last = get().lastStart();
    if (!last) return null;
    const d = new Date(last);
    d.setDate(d.getDate() + PERIOD_CYCLE_DAYS);
    return d.toISOString().slice(0, 10);
  },

  daysUntilNext: () => {
    const next = get().nextStart();
    if (!next) return null;
    return daysBetween(new Date(), new Date(next));
  },
}));

// ═══════════════════════════════════════════════════
// WATER
// ═══════════════════════════════════════════════════
interface WaterStoreState {
  date: string;
  count: number;
  loaded: boolean;
  loadFromCloud: () => Promise<void>;
  toggleCup: (n: number) => Promise<void>;
  autoResetIfNewDay: () => Promise<void>;
}

export const useWaterStore = create<WaterStoreState>((set, get) => ({
  date: todayISO(),
  count: 0,
  loaded: false,

  loadFromCloud: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    const today = todayISO();

    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', today)
      .maybeSingle();

    if (error) {
      console.error('[water] load error:', error);
      set({ loaded: true });
      return;
    }

    set({
      date: today,
      count: data?.count ?? 0,
      loaded: true,
    });
  },

  toggleCup: async (n) => {
    const cur = get().count;
    const newCount = cur === n ? n - 1 : n;
    const finalCount = Math.max(0, Math.min(WATER_GOAL, newCount));

    set({ count: finalCount });

    const userId = await getCurrentUserId();
    if (!userId) return;
    const today = todayISO();

    await supabase.from('water_logs').upsert(
      {
        user_id: userId,
        log_date: today,
        count: finalCount,
      },
      { onConflict: 'user_id,log_date' }
    );
  },

  autoResetIfNewDay: async () => {
    const today = todayISO();
    if (get().date !== today) {
      set({ date: today, count: 0 });
    }
    await get().loadFromCloud();
  },
}));