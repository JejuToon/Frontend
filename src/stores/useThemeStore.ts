// src/stores/useThemeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

/*
// 브라우저 기본 설정 테마 사용
const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  if (saved) return saved;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};
*/

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "dark", // getInitalTheme();
      toggleTheme: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        set({ mode: newMode });
      },
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme", // localStorage 키
    }
  )
);
