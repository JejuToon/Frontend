import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  hasCompletedRecommendForm: boolean;
  skipTaleSetup: boolean;
  addressLabel: string | null;
  addressLabelCoords: { lat: number; lng: number } | null;
  setHasCompletedRecommendForm: (value: boolean) => void;
  setSkipTaleSetup: (value: boolean) => void;
  setAddressLabel: (
    label: string,
    coords: { lat: number; lng: number }
  ) => void;
  resetHasCompletedRecommendForm: () => void;
  resetSkipTaleSetup: () => void;
  resetUserInfo: () => void;
}

export const useUserInfoStore = create(
  persist<UserInfoState>(
    (set) => ({
      hasCompletedRecommendForm: false,
      skipTaleSetup: false,
      addressLabel: null,
      addressLabelCoords: null,

      setHasCompletedRecommendForm: (value) =>
        set({ hasCompletedRecommendForm: value }),

      setSkipTaleSetup: (value) => set({ skipTaleSetup: value }),

      setAddressLabel: (label, coords) =>
        set({ addressLabel: label, addressLabelCoords: coords }),

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
