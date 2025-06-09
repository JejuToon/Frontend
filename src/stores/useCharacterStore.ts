import { ButtonHTMLAttributes } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Character = {
  taleId: number;
  title: string;
  imageUrl: string;
};

type CharacterStore = {
  characters: Character[];
  selectedCharacterId: number | null;
  addCharacter: (character: Character) => void;
  removeCharacter: (taleId: number) => void;
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
          (c) => c.taleId === character.taleId
        );
        if (!exists) {
          set((state) => ({
            characters: [...state.characters, character],
          }));
        }
      },
      removeCharacter: (taleId: number) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.taleId !== taleId),
        })),
      hasCharacter: (taleId) => {
        return get().characters.some((c) => c.taleId === taleId);
      },
      setSelectedCharacterId: (id) => {
        set({ selectedCharacterId: id });
      },
    }),
    {
      name: "character-storage", // localStorage key
    }
  )
);
