import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryStore {
  history: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addKeyword: (keyword: string) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        const newHistory = [
          trimmed,
          ...get().history.filter((k) => k !== trimmed),
        ];
        set({ history: newHistory.slice(0, 10) }); // 최대 10개 저장
      },
      removeKeyword: (keyword: string) => {
        set({ history: get().history.filter((k) => k !== keyword) });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "search-history-storage", // localStorage key
    }
  )
);
