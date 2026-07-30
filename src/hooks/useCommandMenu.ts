'use client';

import { create } from 'zustand';

interface CommandMenuStore {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggle: () => void;
}

const useCommandMenuStore = create<CommandMenuStore>((set) => ({
  open: false,
  openMenu: () => set({ open: true }),
  closeMenu: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open })),
}));

export function useCommandMenu() {
  const { open, openMenu, closeMenu, toggle } = useCommandMenuStore();
  return { open: openMenu, close: closeMenu, toggle, isOpen: open };
}

export { useCommandMenuStore };
