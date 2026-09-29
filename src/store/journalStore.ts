import { create } from 'zustand';
import type { JournalEntry, MoodValue } from '@/types';
import { MOODS } from '@/lib/constants';
import { generateId, todayISO } from '@/lib/utils';
import { fetchAll, insertRow, deleteRow } from '@/lib/sync';

interface DbJournal {
  id: string;
  user_id: string;
  entry_date: string;
  mood: number;
  mood_emo: string;
  mood_label: string;
  text: string;
  created_at: string;
}

function toLocal(row: DbJournal): JournalEntry {
  return {
    id: row.id,
    date: row.entry_date,
    mood: row.mood as MoodValue,
    moodEmo: row.mood_emo,
    moodLabel: row.mood_label,
    text: row.text,
    createdAt: new Date(row.created_at).getTime(),
  };
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  loaded: boolean;

  loadFromCloud: () => Promise<void>;
  addEntry: (text: string, mood: MoodValue) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getTodayEntry: () => JournalEntry | undefined;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  loaded: false,

  loadFromCloud: async () => {
    set({ loading: true });
    const rows = await fetchAll<DbJournal>('journals', {
      column: 'created_at',
      ascending: false,
    });
    set({ entries: rows.map(toLocal), loading: false, loaded: true });
  },

  addEntry: async (text, moodVal) => {
    const mood = MOODS.find((m) => m.val === moodVal) ?? MOODS[2];
    const tempId = generateId();

    const optimistic: JournalEntry = {
      id: tempId,
      date: todayISO(),
      mood: moodVal,
      moodEmo: mood.emo,
      moodLabel: mood.label,
      text,
      createdAt: Date.now(),
    };
    set((s) => ({ entries: [optimistic, ...s.entries] }));

    const row = await insertRow<DbJournal>('journals', {
      entry_date: todayISO(),
      mood: moodVal,
      mood_emo: mood.emo,
      mood_label: mood.label,
      text,
    });

    if (row) {
      set((s) => ({
        entries: s.entries.map((e) => (e.id === tempId ? toLocal(row) : e)),
      }));
    }
  },

  removeEntry: async (id) => {
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
    await deleteRow('journals', id);
  },

  getTodayEntry: () => {
    const today = todayISO();
    return get().entries.find((e) => e.date === today);
  },
}));