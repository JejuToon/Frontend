import { create } from "zustand";
import { TaleContent } from "../types/tale";

export type SheetPos = "collapsed" | "half" | "full";

interface SelectedMarkerStore {
  selectedMarker: TaleContent | null;
  sheetPos: SheetPos;

  setSelectedMarker: (marker: TaleContent | null) => void;
  setSheetPos: (pos: SheetPos) => void;
  initialize: (marker: TaleContent | null) => void;
  handleSheetToggle: () => void;
  onMarkerClick: (
    tale: TaleContent,
    mapRef: React.RefObject<google.maps.Map | null>
  ) => void;
}

export const useSelectedMarkerStore = create<SelectedMarkerStore>(
  (set, get) => ({
    selectedMarker: null,
    sheetPos: "collapsed",

    setSelectedMarker: (marker) => set({ selectedMarker: marker }),
    setSheetPos: (pos) => set({ sheetPos: pos }),
    handleSheetToggle: () => {
      const { sheetPos, setSheetPos } = get();
      if (sheetPos === "collapsed") setSheetPos("half");
      else if (sheetPos === "half") setSheetPos("full");
      else setSheetPos("collapsed");
    },

    onMarkerClick: (tale, mapRef) => {
      const { selectedMarker, setSelectedMarker, setSheetPos } = get();
      if (selectedMarker?.id === tale.id) {
        mapRef.current?.panTo({
          lat: tale.location[0].latitude,
          lng: tale.location[0].longitude,
        });
        mapRef.current?.setZoom(14);
      } else {
        setSelectedMarker(tale);
        setSheetPos("half");
      }
    },

    initialize: (marker) => {
      set({ selectedMarker: marker });
      if (marker) {
        setTimeout(() => {
          set({ sheetPos: "half" });
        }, 300);
      }
    },
  })
);
