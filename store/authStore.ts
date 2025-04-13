import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

type User = {
  username: string;
  email: string;
  role: string;
  id: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
};

const SECURE_TOKEN_KEY = 'secure_token';
const SECURE_USER_KEY = 'secure_user';

export const useAuthStore = create<AuthState>((set) => ({
  user:  null,
  token: null,
  isLoading: true,

  login: async ({ token, user }) => {
    await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SECURE_USER_KEY);
    set({ user: null, token: null });
    router.replace("/(auth)/login");
  },

  restoreToken: async () => {
    const token = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
    const userString = await SecureStore.getItemAsync(SECURE_USER_KEY);

    if (!token || !userString) {
      set({ token: null, user: null, isLoading: false });
      return;
    }

    const user: User = JSON.parse(userString);

    set({ token, user, isLoading: false });
  },
}));
