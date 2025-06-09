import { create } from "zustand";

interface CurrentLocation {
  lat: number;
  lng: number;
}

interface CurrentLocationStore {
  currentLocation: CurrentLocation | null;
  fetchCurrentLocation: (
    mapRef: google.maps.Map | null
  ) => Promise<"ok" | "denied" | "error">;
}

const DEFAULT_CENTER = { lat: 33.5072, lng: 126.4907 };

export const useCurrentLocationStore = create<CurrentLocationStore>((set) => ({
  currentLocation: null,

  async fetchCurrentLocation(mapRef) {
    if (!navigator.geolocation) return "error";

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          //const location = { lat: coords.latitude, lng: coords.longitude };

          // 테스트용 위치
          const location = DEFAULT_CENTER;
          //const location = { lat: 33.4333, lng: 126.6666 };
          // 상태 업데이트
          set({ currentLocation: location });
          // 지도 이동
          if (mapRef) {
            mapRef.panTo(location);
          }

          resolve("ok");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) resolve("denied");
          else resolve("error");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    });
  },
}));
