import { useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "visualization",
];

export function useMapLoader() {
  return useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });
}
