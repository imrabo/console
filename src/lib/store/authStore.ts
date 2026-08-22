import { create } from 'zustand';
import type { UserType } from '@/features/users';

export interface AuthStore {
  user: UserType | null;
  isLoading: boolean;

  setUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ isLoading: loading }),
}));