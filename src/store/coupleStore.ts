import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Profile } from './profileStore';

interface PairResult {
  ok: boolean;
  message: string;
  partner_id?: string;
  partner_name?: string;
}

interface CoupleState {
  partner: Profile | null;
  loading: boolean;
  error: string | null;

  loadPartner: () => Promise<void>;
  pairWithCode: (code: string) => Promise<{ ok: boolean; message: string }>;
  unpair: () => Promise<void>;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  partner: null,
  loading: false,
  error: null,

  loadPartner: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_my_partner');
      if (error) {
        console.error('[couple] loadPartner error:', error);
        set({ loading: false, error: error.message });
        return;
      }
      // RPC returns json: { ok, partner }
      const payload = data as { ok: boolean; partner: Profile | null };
      set({ partner: payload?.partner ?? null, loading: false });
    } catch (e) {
      console.error('[couple] loadPartner exception:', e);
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Load error',
      });
    }
  },

  pairWithCode: async (code) => {
    set({ loading: true, error: null });
    try {
      const clean = code.trim().toUpperCase();
      if (clean.length !== 6) {
        set({ loading: false });
        return { ok: false, message: 'Code ၆ လုံး ဖြစ်ရမယ်' };
      }

      const { data, error } = await supabase.rpc('pair_with_code', {
        code: clean,
      });

      if (error) {
        console.error('[couple] pairWithCode error:', error);
        set({ loading: false });
        return { ok: false, message: error.message };
      }

      const res = data as PairResult;
      if (!res?.ok) {
        set({ loading: false });
        return { ok: false, message: res?.message ?? 'ချိတ်လို့ မရပါ' };
      }

      // Partner profile ပြန် Load
      const { data: pData } = await supabase.rpc('get_my_partner');
      const payload = pData as { ok: boolean; partner: Profile | null };
      set({ partner: payload?.partner ?? null, loading: false });

      return { ok: true, message: res.message };
    } catch (e) {
      console.error('[couple] pairWithCode exception:', e);
      set({ loading: false });
      return {
        ok: false,
        message: e instanceof Error ? e.message : 'Error — ပြန်စမ်းပါ',
      };
    }
  },

  unpair: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.rpc('unpair_couple');
      if (error) {
        console.error('[couple] unpair error:', error);
        set({ loading: false });
        return;
      }
      set({ partner: null, loading: false });
    } catch (e) {
      console.error('[couple] unpair exception:', e);
      set({ loading: false });
    }
  },
}));