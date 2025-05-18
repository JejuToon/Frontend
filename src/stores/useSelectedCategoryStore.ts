import { create } from "zustand";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];

interface CategoryStore {
  selectedCats: string[];
  toggleCategory: (cat: string) => void;
  initializeCategory: (cat?: string | string[]) => void;
  isAllSelected: () => boolean;
}

export const useSelectedCategoryStore = create<CategoryStore>((set, get) => ({
  selectedCats: [],

  toggleCategory: (cat) => {
    const current = get().selectedCats;
    const alreadySelected = current.includes(cat);
    let newCats: string[];

    if (alreadySelected) {
      newCats = current.filter((c) => c !== cat);
    } else {
      newCats = [...current, cat];
    }

    set({ selectedCats: newCats });
  },

  initializeCategory: (cat?: string | string[]) => {
    if (!cat) return;
    const newCats = Array.isArray(cat) ? cat : [cat];
    set({ selectedCats: newCats });
  },

  isAllSelected: () => {
    const current = get().selectedCats;
    return allCategories.every((c) => current.includes(c));
  },
}));
