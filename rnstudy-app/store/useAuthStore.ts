import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/axios';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  login: async (user: User) => {
    set({ isLoggedIn: true, user });
  },

  register: async (user: User) => {
    set({ isLoggedIn: true, user });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
      ]);
      set({ isLoggedIn: false, user: null });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  checkLoginStatus: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync('accessToken'),
        SecureStore.getItemAsync('refreshToken'),
      ]);

      if (accessToken && refreshToken) {
        const response = await api.get('/auth/me');
        set({ isLoggedIn: true, user: response.data });
      } else {
        set({ isLoggedIn: false, user: null });
      }
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
      set({ isLoggedIn: false, user: null });
    }
  },
}));
