// stores/useCategoryTalesStore.ts
import { create } from "zustand";
import { fetchTalesByCategory } from "../api/tale";
import { TaleListResponse, TaleContent } from "../types/tale";

interface CategoryTalesStore {
  talesByCategory: Record<string, TaleContent[]>;
  loadingByCategory: Record<string, boolean>;
  fetchTalesForCategory: (category: string, page: number) => Promise<void>;
}

export const useCategoryTalesStore = create<CategoryTalesStore>((set, get) => ({
  talesByCategory: {},
  loadingByCategory: {},

  fetchTalesForCategory: async (category, page) => {
    set((state) => ({
      loadingByCategory: { ...state.loadingByCategory, [category]: true },
    }));

    try {
      const response: TaleListResponse = await fetchTalesByCategory(
        category,
        page
      );

      set((state) => ({
        talesByCategory: {
          ...state.talesByCategory,
          [category]:
            page === 0
              ? response.contents
              : [
                  ...(state.talesByCategory[category] || []),
                  ...response.contents,
                ],
        },
      }));
    } catch (err) {
      console.error(`카테고리(${category}) 설화 목록 로딩 실패:`, err);
    } finally {
      set((state) => ({
        loadingByCategory: { ...state.loadingByCategory, [category]: false },
      }));
    }
  },
}));
