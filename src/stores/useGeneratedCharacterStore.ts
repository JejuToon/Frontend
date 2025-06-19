import { create } from "zustand";

interface GeneratedState {
  characterId: number | null;
  isGenerating: boolean;
  setGenerating: (id: number) => void;
  setCharacterId: (id: number) => void;
  clear: () => void;
}

export const useGeneratedCharacterStore = create<GeneratedState>((set) => ({
  characterId: null,
  isGenerating: false,
  setCharacterId: (id) => set({ characterId: id }),
  setGenerating: (id) => set({ characterId: id, isGenerating: true }),
  clear: () => set({ characterId: null }),
}));
