import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface LoveNoteRow {
  id: string;
  from_user: string;
  to_user?: string;
  content: string;
  is_seen: boolean;
  created_at: string;
  from_name?: string | null;
  to_name?: string | null;
}

interface StoreState {
  received: LoveNoteRow[];
  sent: LoveNoteRow[];
  unseenCount: number;
  loading: boolean;
  loaded: boolean;

  loadAll: () => Promise<void>;
  send: (content: string) => Promise<{ ok: boolean; message: string }>;
  markSeen: (id: string) => Promise<void>;
  markAllSeen: () => Promise<void>;
  refreshUnseen: () => Promise<void>;
}

export const useLoveNotesStore = create<StoreState>((set, get) => ({
  received: [],
  sent: [],
  unseenCount: 0,
  loading: false,
  loaded: false,

  loadAll: async () => {
    set({ loading: true });
    try {
      const [recv, sent, cnt] = await Promise.all([
        supabase.rpc('get_my_love_notes', { limit_count: 50 }),
        supabase.rpc('get_sent_love_notes', { limit_count: 50 }),
        supabase.rpc('unseen_notes_count'),
      ]);

      const recvData = recv.data as { ok: boolean; notes: LoveNoteRow[] };
      const sentData = sent.data as { ok: boolean; notes: LoveNoteRow[] };

      set({
        received: recvData?.notes ?? [],
        sent: sentData?.notes ?? [],
        unseenCount: typeof cnt.data === 'number' ? cnt.data : 0,
        loading: false,
        loaded: true,
      });
    } catch (e) {
      console.error('[loveNotes] loadAll error:', e);
      set({ loading: false, loaded: true });
    }
  },

  send: async (content) => {
    const clean = content.trim();
    if (!clean) return { ok: false, message: 'စာ ထည့်ပါ' };
    if (clean.length > 500) return { ok: false, message: '၅၀၀ လုံး အောက်သာ' };

    try {
      const { data, error } = await supabase.rpc('send_love_note', {
        note_content: clean,
      });
      if (error) {
        console.error('[loveNotes] send error:', error);
        return { ok: false, message: error.message };
      }
      const res = data as { ok: boolean; message: string };
      if (res?.ok) {
        // Refresh sent list
        await get().loadAll();
      }
      return { ok: !!res?.ok, message: res?.message ?? '—' };
    } catch (e) {
      console.error('[loveNotes] send exception:', e);
      return {
        ok: false,
        message: e instanceof Error ? e.message : 'Error',
      };
    }
  },

  markSeen: async (id) => {
    try {
      await supabase.rpc('mark_love_note_seen', { note_id: id });
      set((s) => ({
        received: s.received.map((n) =>
          n.id === id ? { ...n, is_seen: true } : n
        ),
        unseenCount: Math.max(0, s.unseenCount - 1),
      }));
    } catch (e) {
      console.error('[loveNotes] markSeen error:', e);
    }
  },

  markAllSeen: async () => {
    const unseen = get().received.filter((n) => !n.is_seen);
    for (const n of unseen) {
      await supabase.rpc('mark_love_note_seen', { note_id: n.id });
    }
    set((s) => ({
      received: s.received.map((n) => ({ ...n, is_seen: true })),
      unseenCount: 0,
    }));
  },

  refreshUnseen: async () => {
    const { data } = await supabase.rpc('unseen_notes_count');
    set({ unseenCount: typeof data === 'number' ? data : 0 });
  },
}));
