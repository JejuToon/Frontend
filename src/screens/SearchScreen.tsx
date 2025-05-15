import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useMapLoader } from "../hooks/useMapLoader";
import { useSelectedMarker } from "../hooks/useSelectedMarker";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useCategoryFilter } from "../hooks/useCategoryFilter";
import Chip from "../components/Chip";
import LocationBox from "../components/LocationBox";
import BottomSheet from "../components/BottomSheet";
import TaleCard from "../components/TaleCard";
import styled from "styled-components";
import tales from "../mocks/taleInfo";
import { FaBars } from "react-icons/fa6";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

// 예시 좌표 데이터
const nearbyTales = tales.slice(0, 2);
const ALL_MARKERS = tales;

const DEFAULT_CENTER = { lat: 33.4996, lng: 126.5312 };

interface MarkerData {
  id: number;
  position: { lat: number; lng: number };
  category?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

const allCategories = ["전체", "개척담", "인물담", "연애담", "신앙담"];
const extraChips = ["근처", "맞춤 추천"];

export default function SearchScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const initMarker = (location.state as any)?.selectedMarker as
    | MarkerData
    | undefined;
  const initialCategory = (location.state as any)?.selectedCategory as
    | string
    | undefined;

  const { isLoaded, loadError } = useMapLoader();
  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(DEFAULT_CENTER);
  }, []);

  const { currentLocation, locate } = useCurrentLocation(mapRef);
  const { selectedMarker, setSelectedMarker, sheetPos, setSheetPos } =
    useSelectedMarker(initMarker);
  const { selectedCats, toggleCategory, filteredMarkers } =
    useCategoryFilter(initialCategory);

  const [selectedExtraChips, setSelectedExtraChips] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (initMarker) {
      setSelectedMarker(initMarker);

      if (initMarker.category) {
        toggleCategory(initMarker.category);
      }

      setTimeout(() => {
        mapRef.current?.panTo({ lat: 33.3126, lng: 126.5312 });
        mapRef.current?.setZoom(9.7);
        setSheetPos("half");
      }, 300);
    }

    if (initialCategory) {
      setTimeout(() => {
        setSheetPos("full");
      }, 300);
    }
  }, [initMarker, initialCategory]);

  useEffect(() => {
    console.log(111);
  }, [selectedMarker]);

  const toggleExtraChip = (chip: string) => {
    setSelectedExtraChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleTaleClick = (tale: MarkerData) => {
    navigate("/character", { state: { tale, from: "search" } });
  };

  // 마커 클릭시 해당 마커를 선택하고 바텀시트 "half" 열기
  const onMarkerClick = (m: MarkerData) => {
    if (selectedMarker?.id === m.id) {
      mapRef.current?.panTo(m.position);
      mapRef.current?.setZoom(14);
    } else {
      setSelectedMarker(m);
      setSheetPos("half");
    }
  };

  const handleSheetToggle = () => {
    if (sheetPos === "collapsed") setSheetPos("half");
    else if (sheetPos === "half") setSheetPos("full");
    else setSheetPos("collapsed");
  };

  const handleCloseClick = () => {
    setSelectedMarker(null);
    console.log("닫기 버튼 클릭");
  };

  // 카테고리별 필터링
  const talesByCategory = (category: string) =>
    ALL_MARKERS.filter((t) => t.category === category);

  if (loadError) return <div>Map load failed…</div>;
  if (!isLoaded) return <Loader />;

  return (
    <Screen>
      <SearchHeader>
        <SearchBox>
          <Icon>
            <FaBars />
          </Icon>
          <SearchInput
            type="text"
            placeholder="설화 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </SearchBox>
      </SearchHeader>

      <MapWrapper>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={DEFAULT_CENTER}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
        >
          {filteredMarkers.map((m) => (
            <Marker
              key={m.id}
              position={m.position}
              title={m.title}
              onClick={() => onMarkerClick(m)}
              animation={
                selectedMarker?.id === m.id
                  ? window.google.maps.Animation.BOUNCE
                  : undefined
              }
            />
          ))}

          {selectedMarker &&
            !filteredMarkers.find((m) => m.id === selectedMarker.id) && (
              <Marker
                position={selectedMarker.position}
                title={selectedMarker.title}
                onClick={() => onMarkerClick(selectedMarker)}
                animation={
                  selectedMarker?.id === selectedMarker.id
                    ? window.google.maps.Animation.BOUNCE
                    : undefined
                }
              />
            )}

          {currentLocation && (
            <Marker
              position={currentLocation}
              title="내 위치"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
        </GoogleMap>
      </MapWrapper>

      <ChipContainer>
        {allCategories.map((cat) => (
          <Chip
            key={cat}
            selected={selectedCats.includes(cat)}
            onToggle={() => toggleCategory(cat)}
          >
            {cat}
          </Chip>
        ))}

        {extraChips.map((chip) => (
          <Chip
            key={chip}
            selected={selectedExtraChips.includes(chip)}
            onToggle={() => toggleExtraChip(chip)}
          >
            {chip}
          </Chip>
        ))}
      </ChipContainer>

      <BottomSheet position={sheetPos} onToggle={handleSheetToggle}>
        <LocBoxWrapper>
          <LocationBox onClick={locate} />
        </LocBoxWrapper>

        {sheetPos !== "collapsed" &&
          !selectedMarker &&
          selectedCats.length === 0 &&
          !selectedCats.includes("전체") &&
          selectedExtraChips.length === 0 && (
            <EmptyState
              imageUrl="/assets/empty_icon.png"
              title="선택된 설화가 없습니다"
              description="지도를 클릭하거나 카테고리를 선택해보세요."
              navigateOnDescriptionClick={false}
            />
          )}

        {sheetPos !== "collapsed" && selectedMarker && (
          <CardSection>
            <TaleList>
              <TaleCard
                id={selectedMarker.id}
                title={selectedMarker.title ?? `설화 ${selectedMarker.id}`}
                description={selectedMarker.description ?? ""}
                thumbnailUrl={selectedMarker.thumbnailUrl ?? ""}
                onClick={() => handleTaleClick(selectedMarker)}
                onCloseClick={() => handleCloseClick()}
              />
            </TaleList>
          </CardSection>
        )}

        {selectedCats
          .filter((cat) => cat !== "전체")
          .map((cat) => (
            <Section key={cat}>
              <SectionHeader>
                <h3>{cat}</h3>
              </SectionHeader>
              <TaleList>
                {talesByCategory(cat).map((t) => (
                  <TaleCard
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={t.description}
                    thumbnailUrl={t.thumbnailUrl}
                    onClick={() => handleTaleClick(t)}
                  />
                ))}
              </TaleList>
            </Section>
          ))}

        {selectedExtraChips.includes("근처") && (
          <Section>
            <SectionHeader>
              <h3>현재 위치와 가까운 설화</h3>
            </SectionHeader>
            <TaleList>
              {nearbyTales.map((t) => (
                <TaleCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  description={t.description}
                  thumbnailUrl={t.thumbnailUrl}
                  onClick={() => handleTaleClick(t)}
                />
              ))}
            </TaleList>
          </Section>
        )}

        {selectedExtraChips.includes("맞춤 추천") && (
          <Section>
            <SectionHeader>
              <h3>추천 설화</h3>
            </SectionHeader>
            <TaleList>
              {tales.slice(2, 5).map((t) => (
                <TaleCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  description={t.description}
                  thumbnailUrl={t.thumbnailUrl}
                  onClick={() => handleTaleClick(t)}
                />
              ))}
            </TaleList>
          </Section>
        )}
      </BottomSheet>
    </Screen>
  );
}

// styled-components
const Screen = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f3eefc;
  padding: 12px 16px;
  margin: 20px;
  border-radius: 999px;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: #444;
  font-size: 16px;
  outline: none;
`;

const Icon = styled.div`
  font-size: 18px;
  color: #555;
  display: flex;
`;

const MapWrapper = styled.div`
  position: absolute;
  top: 0px;
  bottom: 60px; /* Bottom tab height */
  left: 0;
  right: 0;
  z-index: 1;
`;

const ChipContainer = styled.div`
  position: absolute;
  top: 78px; /* header + 8px */
  left: 0;
  right: 0;
  display: flex;
  gap: 8px;
  padding: 0 16px;
  z-index: 5;
  overflow-x: auto;
  white-space: nowrap;
`;

const LocBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

const CardSection = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 10px;
  margin-bottom: 10px;

  h3 {
    font-weight: 500;
  }
`;

const TaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
`;
