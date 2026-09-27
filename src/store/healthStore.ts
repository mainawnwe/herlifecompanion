import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PeriodRecord, WaterState } from '@/types';
import { LS_KEYS, PERIOD_CYCLE_DAYS } from '@/lib/constants';
import { generateId, todayISO, daysBetween } from '@/lib/utils';

// ============================================================
// Period Tracker Store
// ============================================================
interface PeriodState {
  records: PeriodRecord[];
  markToday: () => void;
  removeRecord: (id: string) => void;
  clearAll: () => void;

  /** နောက်ဆုံးရာသီစတင်ရက် */
  lastStart: () => string | null;
  /** နောက်ရာသီလာမယ့်ရက် (YYYY-MM-DD) */
  nextStart: () => string | null;
  /** နောက်ရာသီအထိ ကျန်ရက် (အနုတ်ဆိုရင် ကျော်နေပြီ) */
  daysUntilNext: () => number | null;
}

export const usePeriodStore = create<PeriodState>()(
  persist(
    (set, get) => ({
      records: [],

      markToday: () => {
        const today = todayISO();
        // တူတူနေ့ ထပ်မထည့်အောင်
        if (get().records.some((r) => r.startDate === today)) return;
        set((s) => ({
          records: [
            {
              id: generateId(),
              startDate: today,
              createdAt: Date.now(),
            },
            ...s.records,
          ],
        }));
      },

      removeRecord: (id) =>
        set((s) => ({ records: s.records.filter((r) => r.id !== id) })),

      clearAll: () => set({ records: [] }),

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
    }),
    {
      name: LS_KEYS.periods,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// Water Tracker Store
// ============================================================
interface WaterStoreState extends WaterState {
  setCup: (n: number) => void;
  toggleCup: (n: number) => void;
  reset: () => void;
  autoResetIfNewDay: () => void;
}

export const useWaterStore = create<WaterStoreState>()(
  persist(
    (set, get) => ({
      date: todayISO(),
      count: 0,

      setCup: (n) => set({ count: Math.max(0, Math.min(8, n)) }),

      toggleCup: (n) => {
        const cur = get().count;
        set({ count: cur === n ? n - 1 : n });
      },

      reset: () => set({ date: todayISO(), count: 0 }),

      autoResetIfNewDay: () => {
        if (get().date !== todayISO()) {
          set({ date: todayISO(), count: 0 });
        }
      },
    }),
    {
      name: LS_KEYS.water,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
