import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { colors } from "../constants/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useMapLoader } from "../hooks/useMapLoader";

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
  FaBook,
} from "react-icons/fa6";
import { MdOutlineWrongLocation } from "react-icons/md";
import { RiSparkling2Fill } from "react-icons/ri";
import { MdNearMe } from "react-icons/md";
import { TbMapPin, TbPlayerPlayFilled } from "react-icons/tb";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useStoryStore } from "../stores/useStoryStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";
import { useCategoryTalesStore } from "../stores/useCategoryTalesStore";
import { useNearbyTalesStore } from "../stores/useNearbyTalesStore";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";

import { TaleContent } from "../types/tale";
import MapRenderer from "../components/MapRenderer";

const notFoundImg = "/assets/images/seolmun.png";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const categoriesIcons = [FaPersonHiking, FaUser, FaHeart, FaCross];
const extraChips = ["근처", "맞춤 추천"];
const extrasIcons = [MdNearMe, RiSparkling2Fill];

export default function SearchScreen() {
  const DEFAULT_CENTER = useMemo(() => ({ lat: 33.4996, lng: 126.5312 }), []);
  const navigate = useNavigate();
  const location = useLocation();
  const fromHomeNearby = (location.state as any)?.fromHomeNearby;
  const [showOverlay, setShowOverlay] = useState(false);
  const [keyword, setKeyword] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useMapLoader();
  const { setTale } = useStoryStore();
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

  const selectedCategories = useFilterChipsStore((s) => s.selectedCategories);
  const selectedExtras = useFilterChipsStore((s) => s.selectedExtras);
  const toggleCategory = useFilterChipsStore((s) => s.toggleCategory);
  const toggleExtra = useFilterChipsStore((s) => s.toggleExtra);
  const isAllCategorySelected = useFilterChipsStore(
    (s) => s.isAllCategorySelected
  );
  const setIsAllCategorySelected = useFilterChipsStore(
    (s) => s.setIsAllCategorySelected
  );
  const clearAllCategories = useFilterChipsStore((s) => s.clearAllCategories);
  const selectAllCategories = useFilterChipsStore((s) => s.selectAllCategories);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      map.panTo(DEFAULT_CENTER);
    },
    [DEFAULT_CENTER]
  );

  const isLoading = useMemo(() => {
    if (isAllCategorySelected) return allTalesLoading;
    return selectedCategories.some((cat) => loadingByCategory[cat] === true);
  }, [
    isAllCategorySelected,
    selectedCategories,
    allTalesLoading,
    loadingByCategory,
  ]);

  const filteredMarkers = useMemo(() => {
    const raw = isAllCategorySelected
      ? allTales
      : selectedCategories.flatMap((c) => talesByCategory[c] || []);
    const map = new Map<number, TaleContent>();
    raw.forEach((t) => map.set(t.id, t));
    return Array.from(map.values());
  }, [isAllCategorySelected, allTales, selectedCategories, talesByCategory]);

  const markerCache = useRef<Map<string, TaleContent[]>>(new Map());

  const allMarkers = useMemo(() => {
    const key = [
      selectedExtras.includes("근처") ? "nearby" : "onlyFiltered",
      filteredMarkers.map((m) => m.id).join("-"),
      nearbyTales.map((n) => n.id).join("-"),
    ].join("|");

    if (markerCache.current.has(key)) {
      return markerCache.current.get(key)!;
    }

    const raw = selectedExtras.includes("근처")
      ? [...filteredMarkers, ...nearbyTales]
      : filteredMarkers;

    const map = new Map<number, TaleContent>();
    raw.forEach((t) => map.set(t.id, t));
    const deduped = Array.from(map.values());

    markerCache.current.set(key, deduped);
    return deduped;
  }, [selectedExtras, filteredMarkers, nearbyTales]);

  useEffect(() => {
    if (fromHomeNearby && selectedExtras.includes("근처")) {
      setTimeout(() => setSheetPos("full"), 300);
    } else if (selectedMarker) {
      setTimeout(() => {
        setSheetPos("half");
        mapRef.current?.panTo({
          lat: selectedMarker.location[0].latitude - 0.2,
          lng: selectedMarker.location[0].longitude,
        });
        mapRef.current?.setZoom(9.7);
      }, 300);
    } else if (selectedCategories.length > 0) {
      setTimeout(() => setSheetPos("full"), 300);
    }
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      setShowOverlay(true);
      setTimeout(() => setSheetPos("half"), 1100);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (isAllCategorySelected && allTales.length === 0) {
      fetchAllTalesData(0);
    } else {
      selectedCategories.forEach((cat) => {
        const alreadyFetched = talesByCategory[cat]?.length > 0;
        if (!alreadyFetched) fetchTalesForCategory(cat, 0);
      });
    }
  }, [selectedCategories]);

  useEffect(() => {
    const fetchNearby = async () => {
      if (!selectedExtras.includes("근처")) return;
      if (!currentLocation) await fetchCurrentLocation(mapRef.current);
      const { lat, lng } =
        useCurrentLocationStore.getState().currentLocation || {};
      if (lat && lng) {
        fetchNearbyTalesData(lat, lng);
        setTimeout(() => setSheetPos("full"), 300);
      }
    };
    fetchNearby();
  }, [selectedExtras, currentLocation]);

  const handleTaleClick = (t: TaleContent) => {
    setTale(t);
    navigate("/tale");
  };

  const handleCloseClick = () => {
    setShowOverlay(false);
    setSelectedMarker(null);
  };

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
        <MapRenderer
          allMarkers={allMarkers}
          nearbyTales={nearbyTales}
          selectedMarker={selectedMarker}
          selectedExtras={selectedExtras}
          selectedCategories={selectedCategories}
          mapRef={mapRef}
          onMarkerClick={onMarkerClick}
          showOverlay={showOverlay}
          currentLocation={currentLocation}
          onMapLoad={onMapLoad}
          defaultCenter={DEFAULT_CENTER}
        />
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
          selected={isAllCategorySelected}
          onToggle={() => {
            const next = !isAllCategorySelected;
            setIsAllCategorySelected(!isAllCategorySelected);
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
              icon={<FaBook />}
              title="선택된 설화가 없습니다"
              description="아무 이야기나 들어 보실래요?"
              navigateOnDescriptionClick={false}
            />
          )}

        {/*선택된 설화 바텀시트의 가장 위쪽에 표시 */}
        {sheetPos !== "collapsed" && selectedMarker && (
          <Section>
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
          </Section>
        )}

        {selectedCategories.map((cat) => {
          const talesInCategory = talesByCategory[cat] || [];

          if (talesInCategory.length === 0) return null;

          return (
            <Section key={cat}>
              <SectionHeader>
                <span>{cat}</span>
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
                  <span>현재 위치와 가까운 설화</span>
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
            <SectionHeader></SectionHeader>
            <EmptyState
              icon={<RiSparkling2Fill />}
              title="맞춤형 추천 정보가 없어요"
              description="맞춤형 추천 받기"
              navigateOnDescriptionClick={false}
            />
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
  background-color: ${({ theme }) => theme.background};
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
  background-color: ${({ theme }) => theme.inputBackground || "#f3eefc"};
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
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;
`;

const Icon = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.textSecondary || "#555"};
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
  overflow-y: hidden;
  white-space: nowrap;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
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
  padding: 16px;
  border-bottom: 8px solid ${({ theme }) => theme.border || "#f3e7c5"};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

const TaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
