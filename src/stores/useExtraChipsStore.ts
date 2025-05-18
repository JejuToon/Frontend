import { create } from "zustand";

interface ExtraChipsState {
  selectedExtraChips: string[];

  toggleExtraChip: (chip: string) => void;
  setExtraChips: (chips: string[]) => void;
  clearExtraChips: () => void;
}

export const useExtraChipsStore = create<ExtraChipsState>((set) => ({
  selectedExtraChips: [],

  toggleExtraChip: (chip: string) =>
    set((state) => ({
      selectedExtraChips: state.selectedExtraChips.includes(chip)
        ? state.selectedExtraChips.filter((c) => c !== chip)
        : [...state.selectedExtraChips, chip],
    })),

  setExtraChips: (chips: string[]) => set({ selectedExtraChips: chips }),

  clearExtraChips: () => set({ selectedExtraChips: [] }),
}));
