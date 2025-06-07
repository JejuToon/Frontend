import { create } from "zustand";
import { fetchTalesByCategory } from "../api/tale";
import { TaleListResponse, TaleContent } from "../types/tale";

interface CategoryTalesStore {
  talesByCategory: Record<string, TaleContent[]>;
  loadingByCategory: Record<string, boolean>;
  totalPagesByCategory: Record<string, number>;
  currentPageByCategory: Record<string, number>;
  fetchTalesForCategory: (category: string, page: number) => Promise<void>;
}

export const useCategoryTalesStore = create<CategoryTalesStore>((set, get) => ({
  talesByCategory: {},
  loadingByCategory: {},
  totalPagesByCategory: {},
  currentPageByCategory: {},

  fetchTalesForCategory: async (category, page) => {
    const { talesByCategory, loadingByCategory } = get();

    // 이미 로딩 중이면 요청 생략
    if (loadingByCategory[category]) {
      //console.log(`${category} 이미 불러오는 중...`);
      return;
    }

    set((state) => ({
      loadingByCategory: { ...state.loadingByCategory, [category]: true },
    }));

    try {
      //console.log(`${category} 설화 목록 요청`);
      const response: TaleListResponse = await fetchTalesByCategory(
        category,
        page
      );

      const isFirstPage = page === 0;
      const existingTales = get().talesByCategory[category] || [];

      set((state) => ({
        talesByCategory: {
          ...state.talesByCategory,
          [category]: isFirstPage
            ? response.contents
            : [...existingTales, ...response.contents],
        },
        totalPagesByCategory: {
          ...state.totalPagesByCategory,
          [category]: response.meta.totalPage,
        },
        currentPageByCategory: {
          ...state.currentPageByCategory,
          [category]: page,
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
