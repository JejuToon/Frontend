import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  skipTaleSetup: boolean;
  addressLabel: string | null;
  addressLabelCoords: { lat: number; lng: number } | null;
  setSkipTaleSetup: (value: boolean) => void;
  setAddressLabel: (
    label: string,
    coords: { lat: number; lng: number }
  ) => void;
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

      setSkipTaleSetup: (value) => set({ skipTaleSetup: value }),

      setAddressLabel: (label, coords) =>
        set({ addressLabel: label, addressLabelCoords: coords }),

      resetSkipTaleSetup: () => set({ skipTaleSetup: false }),

      resetUserInfo: () =>
        set({
          skipTaleSetup: false,
        }),
    }),
    {
      name: "user-info-storage",
    }
  )
);
