import { create } from "zustand";
import { fetchAllTales } from "../api/tale";
import { TaleContent } from "../types/tale";

interface AllTalesStore {
  allTales: TaleContent[];
  allTalesLoading: boolean;
  allTalesPage: number;
  allTalesTotalPages: number;
  fetchAllTalesData: (page: number) => Promise<void>;
}

export const useAllTalesStore = create<AllTalesStore>((set) => ({
  allTales: [],
  allTalesLoading: false,
  allTalesPage: 0,
  allTalesTotalPages: 1,

  fetchAllTalesData: async (page: number) => {
    set({ allTalesLoading: true });
    try {
      console.log("전체 설화 목록 요청");
      const res = await fetchAllTales(page);
      set({
        allTales: res.contents,
        allTalesPage: page,
        allTalesTotalPages: res.meta.totalPage,
      });
    } catch (err) {
      console.error("전체 설화 목록 로딩 실패:", err);
    } finally {
      console.log("전체 설화 목록 로딩 완료");
      set({ allTalesLoading: false });
    }
  },
}));
