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
    const { talesByCategory, loadingByCategory } = get();

    // 이미 로딩 중이면 요청 생략
    if (loadingByCategory[category]) {
      console.log(`${category}는 이미 불러오는 중...`);
      return;
    }

    set((state) => ({
      loadingByCategory: { ...state.loadingByCategory, [category]: true },
    }));

    try {
      console.log(`${category} 설화 목록 요청`);
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
      console.log(`${category} 설화 목록 로딩 완료`);
      set((state) => ({
        loadingByCategory: { ...state.loadingByCategory, [category]: false },
      }));
    }
    console.log("이전 카테고리:", talesByCategory);
    console.log("이전 로딩상태:", loadingByCategory);
    console.log("최신 카테고리:", get().talesByCategory);
    console.log("최신 로딩상태:", get().loadingByCategory);
  },
}));
