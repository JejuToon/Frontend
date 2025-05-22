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
  addCharacter: (character: Character) => void;
  hasCharacter: (taleId: number) => boolean;
};

export const useCharacterStore = create(
  persist<CharacterStore>(
    (set, get) => ({
      characters: [],
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
      hasCharacter: (taleId) => {
        return get().characters.some((c) => c.taleId === taleId);
      },
    }),
    {
      name: "character-store", // localStorage key
    }
  )
);
