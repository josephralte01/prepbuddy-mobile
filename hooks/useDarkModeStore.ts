// hooks/useDarkModeStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DarkModeState {
  isDark: boolean;
  toggleDark: () => void;
  loadPreference: () => void;
}

export const useDarkModeStore = create<DarkModeState>((set) => ({
  isDark: false,

  toggleDark: async () => {
    set((state) => {
      const next = !state.isDark;
      AsyncStorage.setItem('theme', next ? 'dark' : 'light');
      return { isDark: next };
    });
  },

  loadPreference: async () => {
    const saved = await AsyncStorage.getItem('theme');
    set({ isDark: saved === 'dark' });
  }
}));
