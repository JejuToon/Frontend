import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaleContent } from "../types/tale";
import {
  UserPreferenceWeights,
  OnboardingInput,
} from "../types/recommendation";

interface RecommendationState {
  loading: boolean;
  weights: UserPreferenceWeights | null;
  recommendedTales: TaleContent[];
  onboardingInput: OnboardingInput | null;

  setLoading: (v: boolean) => void;
  setWeights: (w: UserPreferenceWeights) => void;
  setRecommendedTales: (t: TaleContent[]) => void;
  setOnboardingInput: (input: OnboardingInput) => void;
  clearRecommendations: () => void;
  clearOnboardingInput: () => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      loading: false,
      weights: null,
      recommendedTales: [],
      onboardingInput: null,

      setLoading: (v) => set({ loading: v }),
      setWeights: (w) => set({ weights: w }),
      setRecommendedTales: (t) => set({ recommendedTales: t }),
      setOnboardingInput: (input) => set({ onboardingInput: input }),
      clearRecommendations: () =>
        set({ weights: null, recommendedTales: [], onboardingInput: null }),
      clearOnboardingInput: () => set({ onboardingInput: null }),
    }),

    {
      name: "recommendation-storage", // localStorage key
      partialize: (state) => ({
        weights: state.weights,
        recommendedTales: state.recommendedTales,
        onboardingInput: state.onboardingInput,
      }),
    }
  )
);
