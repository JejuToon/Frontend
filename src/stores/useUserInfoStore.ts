import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  hasCompletedRecommendForm: boolean;
  skipTaleSetup: boolean;
  setHasCompletedRecommendForm: (value: boolean) => void;
  setSkipTaleSetup: (value: boolean) => void;
  resetHasCompletedRecommendForm: () => void;
  resetSkipTaleSetup: () => void;
  resetUserInfo: () => void;
}

export const useUserInfoStore = create(
  persist<UserInfoState>(
    (set) => ({
      hasCompletedRecommendForm: false,
      skipTaleSetup: false,

      setHasCompletedRecommendForm: (value) =>
        set({ hasCompletedRecommendForm: value }),

      setSkipTaleSetup: (value) => set({ skipTaleSetup: value }),

      resetHasCompletedRecommendForm: () =>
        set({ hasCompletedRecommendForm: false }),

      resetSkipTaleSetup: () => set({ skipTaleSetup: false }),

      resetUserInfo: () =>
        set({
          hasCompletedRecommendForm: false,
          skipTaleSetup: false,
        }),
    }),
    {
      name: "user-info-storage",
    }
  )
);
