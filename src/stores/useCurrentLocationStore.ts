// stores/useCurrentLocationStore.ts
import { create } from "zustand";

interface CurrentLocation {
  lat: number;
  lng: number;
}

interface CurrentLocationStore {
  currentLocation: CurrentLocation | null;
  fetchCurrentLocation: (mapRef: google.maps.Map | null) => void;
}

export const useCurrentLocationStore = create<CurrentLocationStore>((set) => ({
  currentLocation: null,
  fetchCurrentLocation: (mapRef) => {
    if (!navigator.geolocation || !mapRef) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location = { lat: 33.5072, lng: 126.4907 }; // 실제 위치는 coords.latitude, coords.longitude 사용 가능
      mapRef.panTo(location);
      set({ currentLocation: location });
    });
  },
}));
