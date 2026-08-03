import { create } from 'zustand';
import type { IAdminUser } from '@/features/admins';

export interface AuthStore {
  user: IAdminUser | null;
  isLoading: boolean;

  setUser: (user: IAdminUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ isLoading: loading }),
}));