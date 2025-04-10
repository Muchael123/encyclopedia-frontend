import { create } from 'zustand';

type UserState = {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),
}));