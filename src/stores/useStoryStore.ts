import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaleContent } from "../types/tale";

export interface TTSConfig {
  voiceIndex: number;
  rate: number;
  volume: number;
}

export interface FontConfig {
  fontName: string;
}

interface StoryState {
  selectedTaleId: number | null;
  selectedTale: TaleContent | null;

  ttsConfig: TTSConfig;
  setTTSConfig: (config: Partial<TTSConfig>) => void;

  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;

  fontConfig: FontConfig;
  setFontConfig: (config: Partial<FontConfig>) => void;

  viewedTales: TaleContent[];

  setTale: (tale: TaleContent) => void;
  setTaleId: (id: number) => void;
  addViewedTale: (tale: TaleContent) => void;

  reset: () => void;
}

export const useStoryStore = create(
  persist<StoryState>(
    (set) => ({
      selectedTale: null,
      selectedCharacter: null,
      selectedTaleId: null,

      ttsConfig: {
        voiceIndex: 0,
        rate: 1,
        volume: 0.66,
      },
      setTTSConfig: (config) =>
        set((state) => ({
          ttsConfig: {
            ...state.ttsConfig,
            ...config,
          },
        })),

      ttsEnabled: true,
      setTtsEnabled: (enabled) => set({ ttsEnabled: enabled }),

      fontConfig: {
        fontName: "default",
      },
      setFontConfig: (config) =>
        set((state) => ({
          fontConfig: {
            ...state.fontConfig,
            ...config,
          },
        })),

      viewedTales: [],

      setTale: (tale) => set({ selectedTale: tale }),
      setTaleId: (id) => set({ selectedTaleId: id }),
      addViewedTale: (tale) =>
        set((state) => ({
          viewedTales: [...state.viewedTales, tale],
        })),

      reset: () =>
        set({
          selectedTale: null,
          ttsConfig: {
            voiceIndex: 0,
            rate: 1,
            volume: 0.66,
          },
          fontConfig: {
            fontName: "default",
          },
          viewedTales: [],
        }),
    }),
    {
      name: "story-storage",
    }
  )
);
