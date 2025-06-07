// stores/useUserInfoStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  hasCompletedRecommendForm: boolean;
  setHasCompletedRecommendForm: (value: boolean) => void;
  resetUserInfo: () => void;
}

export const useUserInfoStore = create(
  persist<UserInfoState>(
    (set) => ({
      hasCompletedRecommendForm: false,
      setHasCompletedRecommendForm: (value) =>
        set({ hasCompletedRecommendForm: value }),
      resetUserInfo: () => set({ hasCompletedRecommendForm: false }),
    }),
    {
      name: "user-info-storage",
    }
  )
);
