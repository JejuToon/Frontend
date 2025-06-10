import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaleContent } from "../types/tale"; // 실제 경로에 맞게 조정

type Character = {
  characterId: number;
  tale: TaleContent;
  imageUrl: string;
};

type CharacterStore = {
  characters: Character[];
  selectedCharacterId: number | null;
  addCharacter: (character: Character) => void;
  removeCharacter: (characterId: number) => void;
  hasCharacter: (taleId: number) => boolean;
  setSelectedCharacterId: (id: number | null) => void;
};

export const useCharacterStore = create(
  persist<CharacterStore>(
    (set, get) => ({
      characters: [],
      selectedCharacterId: null,

      addCharacter: (character) => {
        const exists = get().characters.some(
          (c) => c.tale.id === character.tale.id
        );
        if (!exists) {
          set((state) => ({
            characters: [...state.characters, character],
          }));
        }
      },

      removeCharacter: (characterId: number) =>
        set((state) => ({
          characters: state.characters.filter(
            (c) => c.characterId !== characterId
          ),
        })),

      hasCharacter: (taleId: number) =>
        get().characters.some((c) => c.tale.id === taleId),

      setSelectedCharacterId: (id) => {
        set({ selectedCharacterId: id });
      },
    }),
    {
      name: "character-storage",
    }
  )
);
