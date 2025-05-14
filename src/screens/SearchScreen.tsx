import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Chip from "../components/Chip";
import LocationBox from "../components/LocationBox";
import BottomSheet from "../components/BottomSheet";
import TaleCard from "../components/TaleCard";
import styled from "styled-components";
import tales from "../mocks/taleInfo";
import { FaBars } from "react-icons/fa6";
import Loader from "../components/Loader";

// 예시 좌표 데이터
const nearbyTales = tales.slice(0, 2);
const ALL_MARKERS = tales;

const DEFAULT_CENTER = { lat: 33.4996, lng: 126.5312 };

const jejuBounds = {
  north: 35.25,
  south: 32.4,
  east: 122.7,
  west: 124.3,
};

interface MarkerData {
  id: number;
  position: { lat: number; lng: number };
  category?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

const LIBRARIES: ("places" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "visualization",
];

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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });
  /*
  places - 장소 검색 및 자동완성
  geometry - 거리 계산, 경계 내 포함 여부
  visualization = 히트맵, 클러스터링, 데이터 시각화
  */

  // 선택된 카테고리들
  const [selectedCats, setSelectedCats] = useState<string[]>(
    initialCategory ? [initialCategory] : ["전체"]
  );
  // 바텀시트 상태
  const [sheetPos, setSheetPos] = useState<"collapsed" | "half" | "full">(
    "collapsed"
  );
  // 선택된 마커 정보
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(
    initMarker ?? null
  );
  // 현재 위치 좌표
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(DEFAULT_CENTER);
  }, []);

  useEffect(() => {
    if (initMarker) {
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
  }, [initMarker]);

  // 현재 위치(currentLocation)로 이동
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude: lat, longitude: lng } = coords;

      //임시 현재 좌표 설정
      const temp = { lat: 33.5072, lng: 126.4907 };
    });
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) => {
      let next = [...prev];

      if (cat === "전체") {
        // 전체를 토글할 때 모든 카테고리 활성화 또는 비활성화
        const allExceptAll = allCategories.filter((c) => c !== "전체");
        const isAllSelected = allExceptAll.every((c) => prev.includes(c));
        return isAllSelected ? [] : ["전체", ...allExceptAll];
      } else {
        // 전체를 제외한 카테고리 토글 처리
        const withoutAll = prev.filter((c) => c !== "전체");
        if (withoutAll.includes(cat)) {
          next = withoutAll.filter((c) => c !== cat);
        } else {
          next = [...withoutAll, cat];
        }

        const allExceptAll = allCategories.filter((c) => c !== "전체");
        const isAllNowSelected = allExceptAll.every((c) => next.includes(c));

        return isAllNowSelected ? ["전체", ...allExceptAll] : next;
      }
    });
  };

  const toggleExtraChip = (chip: string) => {
    if (chip === "근처") {
      // 거리순 정렬 로직 (예: currentLocation 기준으로 sorted tales)
      console.log("근처 적용");
    } else if (chip === "맞춤 추천") {
      console.log("사용자 맞춤 추천 적용");
    }
  };

  const handleTaleClick = (tale: MarkerData) => {
    navigate("/character", { state: { tale, from: "search" } });
  };

  // 선택된 카테코리에 해당하는 마커만 필터링
  const filteredMarkers = ALL_MARKERS.filter(
    (m) => selectedCats.includes("전체") || selectedCats.includes(m.category!)
  );

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

  const showDefaultSections =
    selectedCats.includes("전체") || selectedCats.length === 0;

  // 카테고리별 필터링
  const talesByCategory = (category: string) =>
    ALL_MARKERS.filter((t) => t.category === category);

  if (loadError) return <div>Map load failed…</div>;
  if (!isLoaded) return <Loader />;

  return (
    <Screen>
      <Header left={<h1>탐색</h1>} center={null} right={null} />
      <SearchHeader>
        <SearchBox>
          <Icon>
            <FaBars />
          </Icon>
          <SearchInput type="text" placeholder="검색" />
        </SearchBox>
      </SearchHeader>

      <MapWrapper>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={DEFAULT_CENTER}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            restriction: {
              latLngBounds: jejuBounds,
              strictBounds: true,
            },
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

          {currentLocation && (
            <Marker
              position={currentLocation}
              title="내 위치"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new google.maps.Size(40, 40), // 크기 조절(optional)
                anchor: new google.maps.Point(20, 20),
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
            selected={false} // 필요 시 별도 상태로 관리 가능
            onToggle={() => toggleExtraChip(chip)}
          >
            {chip}
          </Chip>
        ))}
      </ChipContainer>

      <BottomSheet position={sheetPos} onToggle={handleSheetToggle}>
        <LocBoxWrapper>
          <LocationBox onClick={handleLocate} />
        </LocBoxWrapper>

        {sheetPos !== "collapsed" && selectedMarker && (
          <CardSection>
            <TaleList>
              <TaleCard
                id={selectedMarker.id}
                title={selectedMarker.title ?? `설화 ${selectedMarker.id}`}
                description={selectedMarker.description ?? ""}
                thumbnailUrl={selectedMarker.thumbnailUrl ?? ""}
                onClick={() => handleTaleClick(selectedMarker)}
              />
            </TaleList>
          </CardSection>
        )}
        {showDefaultSections ? (
          <>
            <Section>
              <SectionHeader>
                <h3>현재 위치와 가까운 설화</h3>
                <SeeAllBtn onClick={() => navigate("/search")}>&gt;</SeeAllBtn>
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

            <Section>
              <SectionHeader>
                <h3>추천 설화</h3>
                <SeeAllBtn onClick={() => console.log("클릭")}>&gt;</SeeAllBtn>
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
          </>
        ) : (
          <>
            {selectedCats.map((cat) => (
              <Section key={cat}>
                <SectionHeader>
                  <h2>{cat}</h2>
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
          </>
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
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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

const SeeAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;
