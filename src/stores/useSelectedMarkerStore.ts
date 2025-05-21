import { create } from "zustand";
import { TaleMarker } from "../types/tale";

export type SheetPos = "collapsed" | "half" | "full";

interface SelectedMarkerStore {
  selectedMarker: TaleMarker | null;
  sheetPos: SheetPos;

  setSelectedMarker: (marker: TaleMarker | null) => void;
  setSheetPos: (pos: SheetPos) => void;
  initialize: (marker: TaleMarker | null) => void;
  handleSheetToggle: () => void;
  onMarkerClick: (
    marker: TaleMarker,
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

    onMarkerClick: (marker, mapRef) => {
      const { selectedMarker, setSelectedMarker, setSheetPos } = get();
      if (selectedMarker?.id === marker.id) {
        mapRef.current?.panTo({
          lat: marker.location.latitude,
          lng: marker.location.longitude,
        });
        mapRef.current?.setZoom(14);
      } else {
        setSelectedMarker(marker);
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
