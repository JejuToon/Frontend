import { create } from "zustand";
import { fetchAllTalesPage, fetchAllTales } from "../api/tale";
import { TaleContent } from "../types/tale";

interface AllTalesStore {
  allTales: TaleContent[];
  allTalesLoading: boolean;
  allTalesPage: number;
  allTalesTotalPages: number;

  fetchAllTalesData: () => Promise<void>; // 전체 페이지 누적 로딩
  fetchAllTalesPageData: (page: number) => Promise<void>; // 특정 페이지 누적 추가
  fetchAllTalesPageOnly: (page: number) => Promise<void>; // 특정 페이지 덮어쓰기
  setAllTales: (tales: TaleContent[]) => void;
}

export const useAllTalesStore = create<AllTalesStore>((set) => ({
  allTales: [],
  allTalesLoading: false,
  allTalesPage: 0,
  allTalesTotalPages: 1,

  // 전체 페이지 로딩 (fetchAllTales 내부에서 순회)
  fetchAllTalesData: async () => {
    set({ allTalesLoading: true });
    try {
      const allTales = await fetchAllTales(); // 내부에서 페이지 순회함
      set({
        allTales,
        allTalesPage: -1, // 의미 없음
        allTalesTotalPages: -1,
      });
    } catch (err) {
      console.error("전체 설화 목록 로딩 실패:", err);
    } finally {
      set({ allTalesLoading: false });
    }
  },

  // 단일 페이지 누적 추가
  fetchAllTalesPageData: async (page: number) => {
    set({ allTalesLoading: true });
    try {
      const res = await fetchAllTalesPage(page);
      set((state) => ({
        allTales: [...state.allTales, ...res.contents],
        allTalesPage: page,
        allTalesTotalPages: res.meta.totalPage,
      }));
    } catch (err) {
      console.error("단일 페이지(누적) 로딩 실패:", err);
    } finally {
      set({ allTalesLoading: false });
    }
  },

  // 단일 페이지 덮어쓰기
  fetchAllTalesPageOnly: async (page: number) => {
    set({ allTalesLoading: true });
    try {
      const res = await fetchAllTalesPage(page);
      set({
        allTales: res.contents,
        allTalesPage: page,
        allTalesTotalPages: res.meta.totalPage,
      });
    } catch (err) {
      console.error("단일 페이지(덮어쓰기) 로딩 실패:", err);
    } finally {
      set({ allTalesLoading: false });
    }
  },

  // 수동 설정
  setAllTales: (tales: TaleContent[]) => set({ allTales: tales }),
}));
