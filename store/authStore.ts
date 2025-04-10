
import { create } from 'zustand';
import { saveToken, getToken, deleteToken } from '@/utils/secureStore';

type User = {
  email: string;
  id: string;
  role: string;
  username: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async ({ token, user }) => {
    await saveToken(token);
    set({ token, user });
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, token: null });
  },

  restoreToken: async () => {
    const token = await getToken();

    if (!token) {
      set({ token: null, user: null, isLoading: false });
      return;
    }
    set({
      token,
      user: null,
      isLoading: false,
    });
  },
}));
