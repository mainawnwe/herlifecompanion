import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types';
import { LS_KEYS } from '@/lib/constants';

interface ProfileState {
  profile: Profile | null;
  isReady: boolean;

  setProfile: (p: Omit<Profile, 'createdAt'>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isReady: false,

      setProfile: (p) =>
        set({
          profile: { ...p, createdAt: new Date().toISOString() },
          isReady: true,
        }),

      updateProfile: (patch) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...patch } : null,
        })),

      clearProfile: () => set({ profile: null, isReady: false }),
    }),
    {
      name: LS_KEYS.profile,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isReady = true;
      },
    }
  )
);
