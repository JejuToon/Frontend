import { create } from "zustand";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const allExtraChips = ["근처", "맞춤 추천"];

interface FilterStore {
  selectedCategories: string[];
  selectedExtras: string[];

  toggleCategory: (cat: string) => void;
  toggleExtra: (extra: string) => void;
  initializeCategory: (cat?: string | string[]) => void;
  setExtras: (extras: string[]) => void;
  clearFilters: () => void;
  isAllCategorySelected: () => boolean;
  selectAllCategories: () => void;
  clearAllCategories: () => void;
  clearAllExtras: () => void;
}

export const useFilterChipsStore = create<FilterStore>((set, get) => ({
  selectedCategories: [],
  selectedExtras: [],

  toggleCategory: (cat) => {
    const { selectedCategories } = get();
    const alreadySelected = selectedCategories.includes(cat);

    const newCategories = alreadySelected
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];

    set({
      selectedCategories: newCategories,
      selectedExtras: [], // Extra는 모두 해제
    });
  },

  toggleExtra: (extra) => {
    const { selectedExtras } = get();
    const alreadySelected = selectedExtras.includes(extra);

    const newExtras = alreadySelected
      ? selectedExtras.filter((e) => e !== extra)
      : [...selectedExtras, extra];

    set({
      selectedExtras: newExtras,
      selectedCategories: [], // 카테고리는 모두 해제
    });
  },

  initializeCategory: (cat) => {
    if (!cat) {
      set({ selectedCategories: [], selectedExtras: [] });
      return;
    }

    const newCats = (Array.isArray(cat) ? cat : [cat]).filter(
      (c): c is string => typeof c === "string"
    );

    set({ selectedCategories: newCats, selectedExtras: [] });
  },

  setExtras: (extras) => {
    set({ selectedExtras: extras, selectedCategories: [] });
  },

  clearFilters: () => {
    set({ selectedCategories: [], selectedExtras: [] });
  },

  isAllCategorySelected: () => {
    const { selectedCategories } = get();
    return allCategories.every((c) => selectedCategories.includes(c));
  },

  selectAllCategories: () => set({ selectedCategories: allCategories }),
  clearAllCategories: () => set({ selectedCategories: [] }),
  clearAllExtras: () => set({ selectedExtras: [] }),
}));
