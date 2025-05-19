import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { colors } from "../constants/colors";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useMapLoader } from "../hooks/useMapLoader";

import CustomOverlayAbove from "../components/CustomOverlayAbove";
import CustomOverlay from "../components/CustomOverlay";

import Chip from "../components/Chip";
import LocationBox from "../components/LocationBox";
import BottomSheet from "../components/BottomSheet";
import TaleCard from "../components/TaleCard";
import CustomButton from "../components/CustomButton";
import styled from "styled-components";
import tales from "../mocks/taleInfo";
import {
  FaBars,
  FaScroll,
  FaPersonHiking,
  FaUser,
  FaHeart,
  FaCross,
} from "react-icons/fa6";
import { MdOutlineWrongLocation } from "react-icons/md";
import { RiSparkling2Fill } from "react-icons/ri";
import { MdNearMe } from "react-icons/md";
import { TbMapPin, TbPlayerPlayFilled } from "react-icons/tb";
import Loader from "../components/Loader";
import NowLocation from "../components/NowLocation";
import EmptyState from "../components/EmptyState";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useStoryStore } from "../stores/useStoryStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";
import { useCategoryTalesStore } from "../stores/useCategoryTalesStore";
import { useNearbyTalesStore } from "../stores/useNearbyTalesStore";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";

import { TaleContent } from "../types/tale";

const CATEGORY_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";

const EXTRA_MARKER_ICON =
  "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";

const CURRENT_LOCATION_ICON =
  "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

const DEFAULT_CENTER = { lat: 33.4996, lng: 126.5312 };

const notFoundImg = "/assets/images/seolmun.png";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const categoriesIcons = [FaPersonHiking, FaUser, FaHeart, FaCross];
const extraChips = ["근처", "맞춤 추천"];
const extrasIcons = [MdNearMe, RiSparkling2Fill];

export default function SearchScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromHomeNearby = (location.state as any)?.fromHomeNearby;

  const { setTale } = useStoryStore();

  const { isLoaded, loadError } = useMapLoader();
  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(DEFAULT_CENTER);
  }, []);

  const { allTales, allTalesLoading, fetchAllTalesData } = useAllTalesStore();
  const { talesByCategory, loadingByCategory, fetchTalesForCategory } =
    useCategoryTalesStore();
  const { nearbyTales, fetchNearbyTalesData } = useNearbyTalesStore();
  const { currentLocation, fetchCurrentLocation } = useCurrentLocationStore();
  const {
    selectedMarker,
    setSelectedMarker,
    sheetPos,
    setSheetPos,
    handleSheetToggle,
    onMarkerClick,
  } = useSelectedMarkerStore();

  const {
    selectedCategories,
    selectedExtras,
    toggleCategory,
    toggleExtra,
    isAllCategorySelected,
    clearAllCategories, // ["개척담", ...] -> []
    selectAllCategories, // ["개척담", ... ] -> allCategories
  } = useFilterChipsStore();

  // 로딩 상태 계산
  const isLoading = useMemo(() => {
    if (isAllCategorySelected()) return allTalesLoading;

    return selectedCategories.some((cat) => loadingByCategory[cat] === true);
  }, [
    isAllCategorySelected,
    selectedCategories,
    allTalesLoading,
    loadingByCategory,
  ]);

  // 선택된 마커 말풍선 오버레이
  const [showOverlay, setShowOverlay] = useState(false);

  // 검색어 상태 저장
  const [keyword, setKeyword] = useState("");

  // "전체" 활성화 상태 여부
  const [isAllSelected, setIsAllSelected] = useState(isAllCategorySelected);

  useEffect(() => {
    // 홈에서 근처 설화 ">" 아이콘 클릭
    if (fromHomeNearby && selectedExtras.includes("근처")) {
      setTimeout(() => {
        setSheetPos("full");
      }, 300);
    }
    // 홈에서 설화를 선택하여 넘어올 경우
    if (selectedMarker) {
      setTimeout(() => {
        setSheetPos("half");
        mapRef.current?.panTo({
          lat: selectedMarker.location[0].latitude - 0.2,
          lng: selectedMarker.location[0].longitude,
        });
        mapRef.current?.setZoom(9.7);
      }, 300);
      // 홈에서 카테고리를 선택하여 넘어올 경우
    } else if (selectedCategories.length > 0) {
      setTimeout(() => {
        setSheetPos("full");
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (isAllSelected && allTales.length === 0) {
      fetchAllTalesData(0);
    }
  }, [isAllSelected]);

  useEffect(() => {
    if (selectedMarker) {
      setShowOverlay(true);
      setTimeout(() => {
        setSheetPos("half");
      }, 1100);
    }
  }, [selectedMarker]);

  useEffect(() => {
    const shouldFetchAll = isAllCategorySelected();

    if (shouldFetchAll && allTales.length === 0) {
      fetchAllTalesData(0);
    } else {
      selectedCategories.forEach((cat) => {
        const alreadyFetched = talesByCategory[cat]?.length > 0;
        if (!alreadyFetched) {
          fetchTalesForCategory(cat, 0);
        }
      });
    }
  }, [selectedCategories]);

  useEffect(() => {
    const handleNearbyFetch = async () => {
      if (!selectedExtras.includes("근처")) return;
      if (!currentLocation) await fetchCurrentLocation(mapRef.current);
      const { lat, lng } =
        useCurrentLocationStore.getState().currentLocation || {};
      if (lat && lng) {
        fetchNearbyTalesData(lat, lng);
        setTimeout(() => {
          setSheetPos("full");
        }, 300);
      }
    };
    handleNearbyFetch();
  }, [selectedExtras, currentLocation]);

  const handleTaleClick = (tale: TaleContent) => {
    setTale(tale);
    navigate("/tale");
  };

  const handleCloseClick = () => {
    setShowOverlay(false);
    setSelectedMarker(null);
  };

  const filteredMarkers: TaleContent[] = useMemo(() => {
    const rawList = isAllCategorySelected()
      ? allTales
      : selectedCategories.flatMap((cat) => talesByCategory[cat] || []);

    const uniqueMap = new Map<number, TaleContent>();
    for (const tale of rawList) {
      if (!uniqueMap.has(tale.id)) {
        uniqueMap.set(tale.id, tale);
      }
    }
    return Array.from(uniqueMap.values());
  }, [selectedCategories, allTales, talesByCategory]);

  const allMarkers: TaleContent[] = useMemo(() => {
    const combined = selectedExtras.includes("근처")
      ? [...filteredMarkers, ...nearbyTales]
      : [...filteredMarkers];

    const uniqueMap = new Map<number, TaleContent>();
    for (const tale of combined) {
      uniqueMap.set(tale.id, tale);
    }
    return Array.from(uniqueMap.values());
  }, [filteredMarkers, nearbyTales, selectedExtras]);

  if (loadError) return <div>Map load failed…</div>;
  if (!isLoaded || isLoading) return <Loader type="inline" />;

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
            gestureHandling: "greedy",
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            cameraControl: false,
          }}
        >
          {/* 활성화된 마커 표시*/}
          {allMarkers.map((tale) => {
            const isNearbyMatched =
              selectedExtras.includes("근처") &&
              nearbyTales.some((t) => t.id === tale.id);
            const isCategoryMatched =
              selectedCategories.length > 0 &&
              tale.categories?.some((cat) => selectedCategories.includes(cat));
            const isSelected = selectedMarker?.id === tale.id;

            // 우선순위: selectedExtras > selectedCategories > 기본
            const markerIcon = isNearbyMatched
              ? EXTRA_MARKER_ICON
              : isCategoryMatched
              ? CATEGORY_MARKER_ICON
              : CATEGORY_MARKER_ICON; // 기본값

            return (
              <Marker
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

          {/* 내 위치 마커 표시 */}
          {currentLocation && mapRef.current && (
            <CustomOverlay map={mapRef.current} position={currentLocation}>
              <NowLocation />
            </CustomOverlay>
          )}

          {/* 선택된 마커 표시 */}
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
      </MapWrapper>

      <ChipContainer>
        {extraChips.map((cat, index) => {
          const Icon = extrasIcons[index];

          return (
            <Chip
              key={cat}
              selected={selectedExtras.includes(cat)}
              onToggle={() => toggleExtra(cat)}
              variant="extra"
            >
              <ChipContent>
                <Icon style={{ marginRight: 2 }} />

                {cat}
              </ChipContent>
            </Chip>
          );
        })}

        <Chip
          selected={isAllCategorySelected()}
          onToggle={() => {
            const next = !isAllCategorySelected();
            setIsAllSelected(next);
            next ? selectAllCategories() : clearAllCategories();
          }}
        >
          <ChipContent>
            <FaScroll style={{ marginRight: 2 }} />
            전체
          </ChipContent>
        </Chip>

        {allCategories.map((cat, index) => {
          const Icon = categoriesIcons[index];

          return (
            <Chip
              key={cat}
              selected={selectedCategories.includes(cat)}
              onToggle={() => toggleCategory(cat)}
              variant="category"
            >
              <ChipContent>
                <Icon style={{ marginRight: 2 }} />

                {cat}
              </ChipContent>
            </Chip>
          );
        })}
      </ChipContainer>

      <BottomSheet
        position={sheetPos}
        onToggle={handleSheetToggle}
        onChangePosition={setSheetPos}
      >
        <LocBoxWrapper>
          <LocationBox onClick={() => fetchCurrentLocation(mapRef.current)} />
        </LocBoxWrapper>

        {sheetPos !== "collapsed" &&
          !selectedMarker &&
          selectedCategories.length === 0 &&
          !selectedCategories.includes("전체") &&
          selectedExtras.length === 0 && (
            <EmptyState
              imageUrl="/assets/empty_icon.png"
              title="선택된 설화가 없습니다"
              description="지도를 클릭하거나 카테고리를 선택해보세요."
              navigateOnDescriptionClick={false}
            />
          )}

        {/*선택된 설화 바텀시트의 가장 위쪽에 표시 */}
        {sheetPos !== "collapsed" && selectedMarker && (
          <CardSection>
            <TaleList>
              <TaleCard
                id={selectedMarker.id}
                title={selectedMarker.title ?? `설화 ${selectedMarker.id}`}
                description={selectedMarker.description ?? "설명 없음"}
                thumbnailUrl={selectedMarker.thumbnail ?? notFoundImg}
                onClick={() => handleTaleClick(selectedMarker)}
                onCloseClick={() => handleCloseClick()}
              >
                <CustomButton
                  label="재생"
                  icon={<TbPlayerPlayFilled />}
                  size="small"
                  variant="outlined"
                  onClick={() => console.log("tts설정 페이지 이동")}
                />
                <CustomButton
                  label="위치 보기"
                  icon={<TbMapPin />}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowOverlay(true);
                    setSheetPos("half");
                    console.log("테스트");
                  }}
                />
              </TaleCard>
            </TaleList>
          </CardSection>
        )}

        {selectedCategories.map((cat) => {
          const talesInCategory = talesByCategory[cat] || [];

          if (talesInCategory.length === 0) return null;

          return (
            <Section key={cat}>
              <SectionHeader>
                <h3>{cat}</h3>
              </SectionHeader>
              <TaleList>
                {talesInCategory.map((t) => (
                  <TaleCard
                    key={`${cat}-${t.id}`}
                    id={t.id}
                    title={t.title}
                    description={t.description}
                    thumbnailUrl={t.thumbnail}
                    onClick={() => handleTaleClick(t)}
                  >
                    <CustomButton
                      label="재생"
                      icon={<TbPlayerPlayFilled />}
                      size="small"
                      variant="outlined"
                      onClick={() => console.log("tts설정 페이지 이동")}
                    />
                    <CustomButton
                      label="위치 보기"
                      icon={<TbMapPin />}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedMarker(t);
                        setShowOverlay(true);
                        setSheetPos("half");
                        console.log("테스트");
                      }}
                    />
                  </TaleCard>
                ))}
              </TaleList>
            </Section>
          );
        })}

        {selectedExtras.includes("근처") && (
          <>
            {!currentLocation ? (
              <EmptyState
                icon={<MdOutlineWrongLocation />}
                title="위치 정보를 가져올 수 없어요"
                description="브라우저 또는 앱에서 위치 권한을 허용해 주세요"
                navigateOnDescriptionClick={false}
              />
            ) : nearbyTales.length === 0 ? (
              <EmptyState
                imageUrl="/assets/empty_nearby.png"
                title="근처에 설화가 없어요"
                description="조금 더 이동해보거나 다른 카테고리를 선택해보세요."
                navigateOnDescriptionClick={false}
              />
            ) : (
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
                      thumbnailUrl={t.thumbnail}
                      onClick={() => handleTaleClick(t)}
                    >
                      <CustomButton
                        label="재생"
                        icon={<TbPlayerPlayFilled />}
                        size="small"
                        variant="outlined"
                        onClick={() => console.log("tts설정 페이지 이동")}
                      />
                      <CustomButton
                        label="위치 보기"
                        icon={<TbMapPin />}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedMarker(t);
                          setShowOverlay(true);
                          setSheetPos("half");
                        }}
                      />
                    </TaleCard>
                  ))}
                </TaleList>
              </Section>
            )}
          </>
        )}

        {selectedExtras.includes("맞춤 추천") && (
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
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
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
  top: 70px;
  left: 0;
  right: 0;
  display: flex;
  gap: 8px;
  padding: 4px 16px;
  z-index: 5;
  overflow-x: auto;
  white-space: nowrap;
`;

const ChipContent = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LocBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

const CardSection = styled.div`
  margin-top: 15px;
  margin-bottom: 20px;
`;

const Section = styled.section`
  border-bottom: 10px solid ${colors.BEIGE_300};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0 16px;
  h3 {
    font-weight: 500;
  }
`;

const TaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px;
`;
