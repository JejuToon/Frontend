// src/stores/useThemeStore.ts
import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

// 브라우저 기본 설정 테마 사용
const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  if (saved) return saved;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return { mode: newMode };
    }),
  setMode: (mode) => {
    localStorage.setItem("theme", mode);
    set({ mode });
  },
}));
