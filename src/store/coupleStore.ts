import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/sync';
import type { Profile } from './profileStore';

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
    set({ loading: true });
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        set({ partner: null, loading: false });
        return;
      }

      // ကိုယ့် profile ကို ရယူ
      const { data: me } = await supabase
        .from('profiles')
        .select('paired_with')
        .eq('id', userId)
        .maybeSingle();

      if (!me?.paired_with) {
        set({ partner: null, loading: false });
        return;
      }

      // Partner profile ကို ရယူ
      const { data: partner } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', me.paired_with)
        .maybeSingle();

      set({ partner: partner ?? null, loading: false });
    } catch (e) {
      console.error('[couple] load error:', e);
      set({ loading: false, error: 'Load error' });
    }
  },

  pairWithCode: async (code) => {
    set({ loading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      if (!userId) return { ok: false, message: 'Login လိုအပ်ပါ' };

      const cleanCode = code.trim().toUpperCase();
      if (cleanCode.length !== 6) {
        set({ loading: false });
        return { ok: false, message: 'Code က ၆ လုံး ဖြစ်ရမယ်' };
      }

      // Code နဲ့ partner ကို ရှာ
      const { data: target } = await supabase
        .from('profiles')
        .select('*')
        .eq('pair_code', cleanCode)
        .maybeSingle();

      if (!target) {
        set({ loading: false });
        return { ok: false, message: 'Code မှားနေတယ် (သို့) မရှိဘူး' };
      }

      if (target.id === userId) {
        set({ loading: false });
        return { ok: false, message: 'ကိုယ့် Code ကိုယ် ထည့်လို့ မရဘူး' };
      }

      if (target.paired_with && target.paired_with !== userId) {
        set({ loading: false });
        return { ok: false, message: 'ဒီ Code က တခြားသူနဲ့ ချိတ်ပြီးသား' };
      }

      // နှစ်ဖက် ချိတ်
      const { error: e1 } = await supabase
        .from('profiles')
        .update({ paired_with: target.id })
        .eq('id', userId);

      if (e1) {
        set({ loading: false });
        return { ok: false, message: 'ချိတ်လို့ မရပါ: ' + e1.message };
      }

      const { error: e2 } = await supabase
        .from('profiles')
        .update({ paired_with: userId })
        .eq('id', target.id);

      if (e2) {
        // rollback
        await supabase
          .from('profiles')
          .update({ paired_with: null })
          .eq('id', userId);
        set({ loading: false });
        return { ok: false, message: 'ချိတ်လို့ မရပါ: ' + e2.message };
      }

      set({ partner: target, loading: false });
      return { ok: true, message: 'ချိတ်ဆက်ပြီးပါပြီ 💙' };
    } catch (e) {
      console.error('[couple] pair error:', e);
      set({ loading: false });
      return { ok: false, message: 'Error — ပြန်စမ်းပါ' };
    }
  },

  unpair: async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const { data: me } = await supabase
      .from('profiles')
      .select('paired_with')
      .eq('id', userId)
      .maybeSingle();

    if (me?.paired_with) {
      await supabase
        .from('profiles')
        .update({ paired_with: null })
        .eq('id', me.paired_with);
    }

    await supabase
      .from('profiles')
      .update({ paired_with: null })
      .eq('id', userId);

    set({ partner: null });
  },
}));
