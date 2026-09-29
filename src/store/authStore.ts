import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  recoveryMode: boolean;

  init: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  sendResetLink: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;

  /** Sign-in ရှိပြီးသား user အတွက် လက်ရှိ Password စစ်ပြီး အသစ်သတ်မှတ် */
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ error: string | null }>;

  exitRecovery: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,
  recoveryMode: false,

  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      initialized: true,
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        set({ session, user: session?.user ?? null, recoveryMode: true });
      } else {
        set({ session, user: session?.user ?? null });
      }
    });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      set({ loading: false });
      if (error) return { error: error.message };
      if (data.user && !data.user.identities?.length) {
        return { error: 'ဒီ Email က ရှိပြီးသား — Sign In လုပ်ပါ' };
      }
      return { error: null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Signup failed' };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      set({ loading: false });
      if (error) {
        if (error.message.toLowerCase().includes('invalid')) {
          return { error: 'Email (သို့) Password မှားနေတယ်' };
        }
        return { error: error.message };
      }
      if (data.session) set({ session: data.session, user: data.session.user });
      return { error: null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Sign in failed' };
    }
  },

  sendResetLink: async (email) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      set({ loading: false });
      return { error: error?.message ?? null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Reset failed' };
    }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      set({ loading: false });
      if (error) return { error: error.message };
      set({ recoveryMode: false });
      return { error: null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Update failed' };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true });
    try {
      // 1) လက်ရှိ user email ရယူ
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user?.email) {
        set({ loading: false });
        return { error: 'User ကို ရှာမတွေ့ပါ' };
      }
      const email = userData.user.email;

      // 2) လက်ရှိ Password မှန်/မှား စစ် — signIn ပြန်
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signErr) {
        set({ loading: false });
        return { error: 'လက်ရှိ Password မှားနေတယ်' };
      }

      // 3) Password အသစ် သတ်မှတ်
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });
      set({ loading: false });
      if (updateErr) return { error: updateErr.message };

      return { error: null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Change failed' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, recoveryMode: false });
  },

  exitRecovery: () => set({ recoveryMode: false }),
}));