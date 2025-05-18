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

    // 테스트용 위치
    const location = DEFAULT_CENTER;
    set({ currentLocation: location });
    return "ok";

    // 권한 확인 (권한 API가 지원되는 경우에만)
    try {
      if ("permissions" in navigator && navigator.permissions.query) {
        const result = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (result.state === "denied") {
          return "denied";
        }
      }
    } catch {
      // 권한 API 미지원 → 무시하고 진행
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const location = { lat: coords.latitude, lng: coords.longitude };

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
