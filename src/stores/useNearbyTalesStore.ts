import { create } from "zustand";
import { fetchNearbyTales } from "../api/tale";
import { TaleContent } from "../types/tale";

interface NearbyTaleStore {
  nearbyTales: TaleContent[];
  nearbyTalesLoading: boolean;
  fetchNearbyTalesData: (lat: number, lng: number) => Promise<void>;
}

export const useNearbyTalesStore = create<NearbyTaleStore>((set) => ({
  nearbyTales: [],
  nearbyTalesLoading: false,

  fetchNearbyTalesData: async (lat, lng) => {
    set({ nearbyTalesLoading: true });
    try {
      console.log("근처 설화 목록 요청");
      const res = await fetchNearbyTales(lat, lng);
      set({ nearbyTales: res.contents });
    } catch (err) {
      console.error("근처 설화 목록 로딩 실패:", err);
    } finally {
      console.log("근처 설화 목록 로딩 완료");
      set({ nearbyTalesLoading: false });
    }
  },
}));
