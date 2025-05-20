import React, { memo, useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import CustomOverlay from "./CustomOverlay";
import CustomOverlayAbove from "./CustomOverlayAbove";
import NowLocation from "./NowLocation";
import { TaleContent } from "../types/tale";

interface MapRendererProps {
  allMarkers: TaleContent[];
  nearbyTales: TaleContent[];
  selectedMarker: TaleContent | null;
  selectedExtras: string[];
  selectedCategories: string[];
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onMarkerClick: (
    tale: TaleContent,
    mapRef: React.MutableRefObject<google.maps.Map | null>
  ) => void;
  showOverlay: boolean;
  currentLocation: { lat: number; lng: number } | null;
  onMapLoad: (map: google.maps.Map) => void;
  defaultCenter: { lat: number; lng: number };
}

const CATEGORY_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
const EXTRA_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
const DEFAULT_CENTER = { lat: 33.4996, lng: 126.5312 };

const MemoMarker = memo(Marker);

const MapRenderer: React.FC<MapRendererProps> = ({
  allMarkers,
  nearbyTales,
  selectedMarker,
  selectedExtras,
  selectedCategories,
  mapRef,
  onMarkerClick,
  showOverlay,
  currentLocation,
  onMapLoad,
  defaultCenter,
}) => {
  const mapOptions = useMemo(
    () => ({
      gestureHandling: "greedy",
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      cameraControl: false,
    }),
    []
  );

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const center = useMemo(() => defaultCenter, [defaultCenter]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onMapLoad}
      options={mapOptions}
    >
      {allMarkers.map((tale) => {
        const isNearbyMatched =
          selectedExtras.includes("근처") &&
          nearbyTales.some((t) => t.id === tale.id);
        const isCategoryMatched =
          selectedCategories.length > 0 &&
          tale.categories?.some((cat) => selectedCategories.includes(cat));

        const markerIcon = isNearbyMatched
          ? EXTRA_MARKER_ICON
          : isCategoryMatched
          ? CATEGORY_MARKER_ICON
          : CATEGORY_MARKER_ICON;

        return (
          <MemoMarker
            key={tale.id}
            position={{
              lat: tale.location[0]?.latitude ?? DEFAULT_CENTER.lat,
              lng: tale.location[0]?.longitude ?? DEFAULT_CENTER.lng,
            }}
            title={tale.title}
            icon={{
              url: markerIcon,
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => onMarkerClick(tale, mapRef)}
          />
        );
      })}

      {currentLocation && mapRef.current && (
        <CustomOverlay map={mapRef.current} position={currentLocation}>
          <NowLocation />
        </CustomOverlay>
      )}

      {selectedMarker && mapRef.current && showOverlay && (
        <CustomOverlayAbove
          map={mapRef.current}
          position={{
            lat: selectedMarker.location[0].latitude,
            lng: selectedMarker.location[0].longitude,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "8px 12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontSize: "14px",
              pointerEvents: "auto",
            }}
          >
            <strong>{selectedMarker.title}</strong>
          </div>
        </CustomOverlayAbove>
      )}
    </GoogleMap>
  );
};

export default memo(MapRenderer);
