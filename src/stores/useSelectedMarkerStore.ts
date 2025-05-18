import { create } from "zustand";
import { TaleContent } from "../types/tale";

export type SheetPos = "collapsed" | "half" | "full";

interface SelectedMarkerStore {
  selectedMarker: TaleContent | null;
  sheetPos: SheetPos;

  setSelectedMarker: (marker: TaleContent | null) => void;
  setSheetPos: (pos: SheetPos) => void;
  initialize: (marker: TaleContent | null) => void;
}

export const useSelectedMarkerStore = create<SelectedMarkerStore>((set) => ({
  selectedMarker: null,
  sheetPos: "collapsed",

  setSelectedMarker: (marker) => set({ selectedMarker: marker }),
  setSheetPos: (pos) => set({ sheetPos: pos }),

  initialize: (marker) => {
    set({ selectedMarker: marker });
    if (marker) {
      setTimeout(() => {
        set({ sheetPos: "half" });
      }, 300);
    }
  },
}));
