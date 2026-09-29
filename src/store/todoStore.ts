import { create } from 'zustand';
import type { Todo, BucketItem, ImportantDate } from '@/types';
import { generateId, nextOccurrence } from '@/lib/utils';
import {
  fetchAll,
  insertRow,
  updateRow,
  deleteRow,
} from '@/lib/sync';

// ═══════════════════════════════════════════════════
// TODOS
// ═══════════════════════════════════════════════════
interface DbTodo {
  id: string;
  text: string;
  done: boolean;
  created_at: string;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  loadFromCloud: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,

  loadFromCloud: async () => {
    set({ loading: true });
    const rows = await fetchAll<DbTodo>('todos');
    set({
      todos: rows.map((r) => ({
        id: r.id,
        text: r.text,
        done: r.done,
        createdAt: new Date(r.created_at).getTime(),
      })),
      loading: false,
    });
  },

  addTodo: async (text) => {
    const tempId = generateId();
    set((s) => ({
      todos: [
        { id: tempId, text, done: false, createdAt: Date.now() },
        ...s.todos,
      ],
    }));
    const row = await insertRow<DbTodo>('todos', { text, done: false });
    if (row) {
      set((s) => ({
        todos: s.todos.map((t) =>
          t.id === tempId
            ? { ...t, id: row.id, createdAt: new Date(row.created_at).getTime() }
            : t
        ),
      }));
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    const newDone = !todo.done;
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: newDone } : t)),
    }));
    await updateRow('todos', id, { done: newDone });
  },

  removeTodo: async (id) => {
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
    await deleteRow('todos', id);
  },
}));

// ═══════════════════════════════════════════════════
// BUCKET LIST
// ═══════════════════════════════════════════════════
interface DbBucket {
  id: string;
  text: string;
  done: boolean;
  created_at: string;
}

interface BucketState {
  items: BucketItem[];
  loadFromCloud: () => Promise<void>;
  addItem: (text: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export const useBucketStore = create<BucketState>((set, get) => ({
  items: [],

  loadFromCloud: async () => {
    const rows = await fetchAll<DbBucket>('bucket_items');
    set({
      items: rows.map((r) => ({
        id: r.id,
        text: r.text,
        done: r.done,
        createdAt: new Date(r.created_at).getTime(),
      })),
    });
  },

  addItem: async (text) => {
    const tempId = generateId();
    set((s) => ({
      items: [
        { id: tempId, text, done: false, createdAt: Date.now() },
        ...s.items,
      ],
    }));
    const row = await insertRow<DbBucket>('bucket_items', { text, done: false });
    if (row) {
      set((s) => ({
        items: s.items.map((i) => (i.id === tempId ? { ...i, id: row.id } : i)),
      }));
    }
  },

  toggleItem: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const newDone = !item.done;
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, done: newDone } : i)),
    }));
    await updateRow('bucket_items', id, { done: newDone });
  },

  removeItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
    await deleteRow('bucket_items', id);
  },
}));

// ═══════════════════════════════════════════════════
// IMPORTANT DATES
// ═══════════════════════════════════════════════════
interface DbDate {
  id: string;
  title: string;
  date: string;
  created_at: string;
}

interface DateState {
  dates: ImportantDate[];
  loadFromCloud: () => Promise<void>;
  addDate: (title: string, date: string) => Promise<void>;
  removeDate: (id: string) => Promise<void>;
  sortedByUpcoming: () => ImportantDate[];
}

export const useDateStore = create<DateState>((set, get) => ({
  dates: [],

  loadFromCloud: async () => {
    const rows = await fetchAll<DbDate>('important_dates');
    set({
      dates: rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        createdAt: new Date(r.created_at).getTime(),
      })),
    });
  },

  addDate: async (title, date) => {
    const tempId = generateId();
    set((s) => ({
      dates: [
        ...s.dates,
        { id: tempId, title, date, createdAt: Date.now() },
      ],
    }));
    const row = await insertRow<DbDate>('important_dates', { title, date });
    if (row) {
      set((s) => ({
        dates: s.dates.map((d) => (d.id === tempId ? { ...d, id: row.id } : d)),
      }));
    }
  },

  removeDate: async (id) => {
    set((s) => ({ dates: s.dates.filter((d) => d.id !== id) }));
    await deleteRow('important_dates', id);
  },

  sortedByUpcoming: () =>
    [...get().dates].sort(
      (a, b) =>
        nextOccurrence(a.date).getTime() - nextOccurrence(b.date).getTime()
    ),
}));