import { RefObject, useState, useCallback } from "react";

export function useCurrentLocation(mapRef: RefObject<google.maps.Map | null>) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const temp = { lat: 33.5072, lng: 126.4907 }; // 실제값 대체 가능
      setCurrentLocation(temp);
    });
  }, [mapRef]);

  return { currentLocation, locate };
}
