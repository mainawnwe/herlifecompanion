import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  birthday: string | null;
  partner_name: string | null;
  pair_code: string | null;
  paired_with: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  loadProfile: () => Promise<void>;
  saveProfile: (data: {
    display_name: string;
    birthday: string;
    partner_name: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void;
}

function generatePairCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  loadProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        set({ profile: null, loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userRes.user.id)
        .maybeSingle();

      if (error) {
        console.error('[loadProfile] select error:', error);
        throw error;
      }

      // Row မရှိသေးရင် auto-create
      if (!data) {
        console.log('[loadProfile] no row, creating...');
        const { data: newProfile, error: createErr } = await supabase
          .from('profiles')
          .upsert(
            {
              id: userRes.user.id,
              email: userRes.user.email,
              pair_code: generatePairCode(),
            },
            { onConflict: 'id' }
          )
          .select()
          .single();

        if (createErr) {
          console.error('[loadProfile] create error:', createErr);
          throw createErr;
        }
        set({ profile: newProfile, loading: false });
        return;
      }

      set({ profile: data, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Load error';
      console.error('[ProfileStore] load error:', e);
      set({ error: msg, loading: false });
    }
  },

   saveProfile: async (input) => {
    set({ loading: true, error: null });
    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error('[saveProfile] auth error:', userErr);
        throw new Error(`Auth: ${userErr.message}`);
      }
      if (!userRes.user) throw new Error('Not authenticated — please sign in again');

      console.log('[saveProfile] user id:', userRes.user.id);

      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userRes.user.id,
            email: userRes.user.email,
            display_name: input.display_name,
            birthday: input.birthday,
            partner_name: input.partner_name,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        console.error('[saveProfile] upsert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`${error.message} (${error.code})`);
      }

      console.log('[saveProfile] success:', data);
      set({ profile: data, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save error';
      console.error('[ProfileStore] save error:', e);
      set({ error: msg, loading: false });
      throw e;
    }
  },
  refresh: async () => {
    await get().loadProfile();
  },

  clear: () => set({ profile: null, loading: false, error: null }),
}));