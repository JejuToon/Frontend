import { create } from "zustand";
import { fetchHomeContent } from "../api/home"; // 예시 API
import { TaleContent } from "../types/tale";

interface HomeStore {
  carouselTales: TaleContent[];
  defaultRecommendedTales: TaleContent[];
  isHomeDataLoaded: boolean;
  fetchHomeDataOnce: () => Promise<void>;
  forceRefreshHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeStore>((set, get) => ({
  carouselTales: [],
  defaultRecommendedTales: [],
  isHomeDataLoaded: false,

  fetchHomeDataOnce: async () => {
    if (get().isHomeDataLoaded) return;
    const { carousel, defaultRecommend } = await fetchHomeContent();
    set({
      carouselTales: carousel,
      defaultRecommendedTales: defaultRecommend,
      isHomeDataLoaded: true,
    });
  },

  forceRefreshHomeData: async () => {
    const { carousel, defaultRecommend } = await fetchHomeContent();
    set({
      carouselTales: carousel,
      defaultRecommendedTales: defaultRecommend,
      isHomeDataLoaded: true,
    });
  },
}));
