import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: async (user) => {
    set({ isLoggedIn: true, user });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ isLoggedIn: false, user: null });
  },
  checkLoginStatus: async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      set({ isLoggedIn: true });
    }
  },
}));
