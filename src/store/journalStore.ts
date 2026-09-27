import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { JournalEntry, MoodValue } from '@/types';
import { LS_KEYS, MOODS } from '@/lib/constants';
import { generateId, todayISO } from '@/lib/utils';

interface JournalState {
  entries: JournalEntry[];
  addEntry: (text: string, mood: MoodValue) => void;
  removeEntry: (id: string) => void;
  getTodayEntry: () => JournalEntry | undefined;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (text, moodVal) => {
        const mood = MOODS.find((m) => m.val === moodVal) ?? MOODS[2];
        const entry: JournalEntry = {
          id: generateId(),
          date: todayISO(),
          mood: moodVal,
          moodEmo: mood.emo,
          moodLabel: mood.label,
          text,
          createdAt: Date.now(),
        };
        set((s) => ({ entries: [entry, ...s.entries] }));
      },

      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      getTodayEntry: () => {
        const today = todayISO();
        return get().entries.find((e) => e.date === today);
      },
    }),
    {
      name: LS_KEYS.journal,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
