import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Todo, BucketItem, ImportantDate } from '@/types';
import { LS_KEYS } from '@/lib/constants';
import { generateId, nextOccurrence } from '@/lib/utils';

// ============================================================
// To-Do Store
// ============================================================
interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearDone: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((s) => ({
          todos: [
            { id: generateId(), text, done: false, createdAt: Date.now() },
            ...s.todos,
          ],
        })),
      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          ),
        })),
      removeTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
      clearDone: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
    }),
    {
      name: LS_KEYS.todos,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// Bucket List Store
// ============================================================
interface BucketState {
  items: BucketItem[];
  addItem: (text: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useBucketStore = create<BucketState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (text) =>
        set((s) => ({
          items: [
            { id: generateId(), text, done: false, createdAt: Date.now() },
            ...s.items,
          ],
        })),
      toggleItem: (id) =>
        set((s) => ({
          items: s.items.map((b) =>
            b.id === id ? { ...b, done: !b.done } : b
          ),
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((b) => b.id !== id) })),
    }),
    {
      name: LS_KEYS.bucket,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================
// Important Dates Store
// ============================================================
interface DateState {
  dates: ImportantDate[];
  addDate: (title: string, date: string) => void;
  removeDate: (id: string) => void;
  /** ရက်အနီးဆုံးအလိုက် စီထားတဲ့ list */
  sortedByUpcoming: () => ImportantDate[];
}

export const useDateStore = create<DateState>()(
  persist(
    (set, get) => ({
      dates: [],
      addDate: (title, date) =>
        set((s) => ({
          dates: [
            ...s.dates,
            { id: generateId(), title, date, createdAt: Date.now() },
          ],
        })),
      removeDate: (id) =>
        set((s) => ({ dates: s.dates.filter((d) => d.id !== id) })),
      sortedByUpcoming: () =>
        [...get().dates].sort(
          (a, b) =>
            nextOccurrence(a.date).getTime() -
            nextOccurrence(b.date).getTime()
        ),
    }),
    {
      name: LS_KEYS.dates,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
