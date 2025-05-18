import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaleContent } from "../types/tale";

export interface Character {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface TTSConfig {
  voiceIndex: number;
  rate: number;
  volume: number;
}

export interface FontConfig {
  fontName: string;
}

interface StoryState {
  selectedTale: TaleContent | null;
  selectedCharacter: Character | null;
  selectedCharacterImage: string | null;

  ttsConfig: TTSConfig;
  setTTSConfig: (config: Partial<TTSConfig>) => void;

  fontConfig: FontConfig;
  setFontConfig: (config: Partial<FontConfig>) => void;

  viewedTales: TaleContent[];

  setTale: (tale: TaleContent) => void;
  setCharacter: (char: Character) => void;
  setCharacterImage: (url: string) => void;
  addViewedTale: (tale: TaleContent) => void;

  reset: () => void;
}

export const useStoryStore = create(
  persist<StoryState>(
    (set) => ({
      selectedTale: null,
      selectedCharacter: null,
      selectedCharacterImage: null,

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
      setCharacter: (char) => set({ selectedCharacter: char }),
      setCharacterImage: (url) => set({ selectedCharacterImage: url }),
      addViewedTale: (tale) =>
        set((state) => ({
          viewedTales: [...state.viewedTales, tale],
        })),

      reset: () =>
        set({
          selectedTale: null,
          selectedCharacter: null,
          selectedCharacterImage: null,
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
