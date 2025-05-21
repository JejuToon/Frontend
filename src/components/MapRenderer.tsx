import React, { useState, memo, useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import CustomOverlay from "./CustomOverlay";
import CustomOverlayAbove from "./CustomOverlayAbove";
import NowLocation from "./NowLocation";
import { useTheme } from "styled-components";
import type { TaleContent, TaleMarker } from "../types/tale";

interface MapRendererProps {
  allMarkers: TaleMarker[];
  nearbyTales: TaleContent[];
  selectedMarker: TaleMarker | null;
  selectedExtras: string[]; // ["근처"] or ["맞춤 추천"] or []
  selectedCategories: string[]; // 카테고리 배열 or []
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onMarkerClick: (
    marker: TaleMarker,
    mapRef: React.MutableRefObject<google.maps.Map | null>
  ) => void;
  currentLocation: { lat: number; lng: number } | null;
  onMapLoad: (map: google.maps.Map) => void;
  defaultCenter: { lat: number; lng: number };
}

const CATEGORY_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
const EXTRA_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";

const MapRenderer: React.FC<MapRendererProps> = ({
  allMarkers,
  nearbyTales,
  selectedMarker,
  selectedExtras,
  selectedCategories,
  mapRef,
  onMarkerClick,
  currentLocation,
  onMapLoad,
  defaultCenter,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const theme = useTheme();
  const containerStyle = { width: "100%", height: "100%" };

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    onMapLoad(map);
    setMapLoaded(true);
  };

  // 1) 카테고리 필터링된 마커
  const categoryFiltered = useMemo(
    () =>
      selectedCategories.length > 0
        ? allMarkers.filter((m) =>
            m.categories.some((cat) => selectedCategories.includes(cat))
          )
        : [],
    [allMarkers, selectedCategories]
  );

  // 2) nearbyTales → TaleMarker 배열로 변환
  const nearbyMarkers = useMemo<TaleMarker[]>(
    () =>
      selectedExtras.includes("근처")
        ? nearbyTales.flatMap((tale) =>
            tale.location.map((loc) => ({
              id: tale.id,
              title: tale.title,
              location: loc,
              categories: tale.categories,
              description: tale.description,
              score: tale.score,
              thumbnail: tale.thumbnail,
            }))
          )
        : [],
    [nearbyTales, selectedExtras]
  );

  // 3) 실제 렌더링할 마커 & 아이콘 선택
  const { markersToShow, useExtraIcon } = useMemo(() => {
    if (selectedExtras.length > 0) {
      // "근처" 혹은 "맞춤 추천" 모드
      return {
        markersToShow: nearbyMarkers, // "맞춤 추천"도 아직 구현이 없다면 []으로
        useExtraIcon: true, // orange-dot
      };
    }
    if (selectedCategories.length > 0) {
      // 카테고리 모드
      return {
        markersToShow: categoryFiltered,
        useExtraIcon: false, // purple-dot
      };
    }
    // 아무것도 선택 안 됐으면 표시 없음
    return { markersToShow: [] as TaleMarker[], useExtraIcon: false };
  }, [selectedExtras, selectedCategories, nearbyMarkers, categoryFiltered]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={handleLoad}
      options={{
        gestureHandling: "greedy",
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        cameraControl: false,
      }}
    >
      {markersToShow.map((m) => {
        const key = `${m.id}-${m.location.latitude}-${m.location.longitude}`;
        const isSelected =
          selectedMarker !== null &&
          selectedMarker.id === m.id &&
          selectedMarker.location.latitude === m.location.latitude &&
          selectedMarker.location.longitude === m.location.longitude;

        // 선택된 마커면 icon을 지정하지 않아 기본 아이콘 사용
        const icon = isSelected
          ? undefined
          : {
              url: useExtraIcon ? EXTRA_MARKER_ICON : CATEGORY_MARKER_ICON,
              scaledSize: new google.maps.Size(32, 32),
            };

        return (
          <Marker
            key={key}
            position={{
              lat: m.location.latitude,
              lng: m.location.longitude,
            }}
            title={m.title}
            icon={icon}
            zIndex={isSelected ? 999 : undefined}
            onClick={() => onMarkerClick(m, mapRef)}
          />
        );
      })}

      {currentLocation && mapRef.current && (
        <CustomOverlay map={mapRef.current} position={currentLocation}>
          <NowLocation />
        </CustomOverlay>
      )}

      {selectedMarker && mapRef.current && (
        <CustomOverlayAbove
          map={mapRef.current}
          position={{
            lat: selectedMarker.location.latitude,
            lng: selectedMarker.location.longitude,
          }}
        >
          <div
            style={{
              backgroundColor: theme.cardBackground,
              color: theme.text,
              border: `1px solid ${theme.border ?? "#ccc"}`,
              borderRadius: "10px",
              padding: "8px 12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontSize: "14px",
              pointerEvents: "auto",
            }}
          >
            {selectedMarker.title}
          </div>
        </CustomOverlayAbove>
      )}
    </GoogleMap>
  );
};

export default memo(MapRenderer);
