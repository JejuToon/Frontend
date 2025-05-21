import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { IoLocationSharp } from "react-icons/io5";
import { TbPlayerPlayFilled } from "react-icons/tb";
import styled from "styled-components";

import { useMapLoader } from "../hooks/useMapLoader";

import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useStoryStore } from "../stores/useStoryStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";
import { useCategoryTalesStore } from "../stores/useCategoryTalesStore";
import { useNearbyTalesStore } from "../stores/useNearbyTalesStore";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";

import Chip from "../components/Chip";
import LocationBox from "../components/LocationBox";
import BottomSheet from "../components/BottomSheet";
import TaleCard from "../components/TaleCard";
import CustomButton from "../components/CustomButton";
import SearchOverlay from "../components/SearchOverlay";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import MapRenderer from "../components/MapRenderer";

import { TaleContent, TaleMarker } from "../types/tale";

const allCategories = ["개척담", "인물담", "연애담", "신앙담"];
const categoriesIcons = [FaPersonHiking, FaUser, FaHeart, FaCross];
const extraChips = ["근처", "맞춤 추천"];
const extrasIcons = [MdNearMe, RiSparkling2Fill];

// 데모용 접근 제어
import { useAccessControl } from "../components/AccessControlProvider";

export default function SearchScreen() {
  // 데모용 접근 제어
  const { openModal } = useAccessControl();

  const navigate = useNavigate();
  const location = useLocation();
  const fromHomeNearby = (location.state as any)?.fromHomeNearby;

  const DEFAULT_CENTER = useMemo(() => ({ lat: 33.4996, lng: 126.5312 }), []);

  const {
    selectedMarker,
    setSelectedMarker,
    sheetPos,
    setSheetPos,
    handleSheetToggle,
    onMarkerClick,
  } = useSelectedMarkerStore();

  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [keyword, setKeyword] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);

  // 바텀 시트 내부 스크롤 영역을 가리킬 ref
  const sheetScrollRef = useRef<HTMLDivElement>(null);

  const { isLoaded, loadError } = useMapLoader();
  const { setTaleId } = useStoryStore();
  const { allTales, allTalesLoading, fetchAllTalesData } = useAllTalesStore();
  const { talesByCategory, loadingByCategory, fetchTalesForCategory } =
    useCategoryTalesStore();
  const { nearbyTales, fetchNearbyTalesData } = useNearbyTalesStore();
  const { currentLocation, fetchCurrentLocation } = useCurrentLocationStore();

  const {
    selectedCategories,
    selectedExtras,
    toggleCategory,
    toggleExtra,
    toggleAllCategory,
    isAllCategorySelected,
    setIsAllCategorySelected,
    clearAllCategories,
    selectAllCategories,
  } = useFilterChipsStore();

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

  const allMarkers: TaleMarker[] = useMemo<TaleMarker[]>(() => {
    // 1) 모든 카테고리 배열을 평탄화(flat)한 뒤, id 기준으로 중복 제거
    const uniqueTales = Array.from(
      new Map(
        Object.values(talesByCategory)
          .flat()
          .map((tale) => [tale.id, tale] as [number, TaleContent])
      ).values()
    );

    // 2) 중복 없는 각 TaleContent 에 대해 location 개수만큼 Marker 생성
    return uniqueTales.flatMap((tale) =>
      tale.location.map((loc) => ({
        id: tale.id,
        title: tale.title,
        location: loc,
        categories: tale.categories,
        description: tale.description,
        score: tale.score,
        thumbnail: tale.thumbnail,
      }))
    );
  }, [talesByCategory]);

  useEffect(() => {
    // 마운트 시점에 모든 카테고리 정보 가져오기 (우선 첫번째 페이지만)
    allCategories.forEach((category) => {
      const existing = talesByCategory[category];
      // 이미 데이터가 있으면 스킵, 없으면 가져오기
      if (!existing || existing.length === 0) {
        fetchTalesForCategory(category, 0);
      }
    });

    if (fromHomeNearby && selectedExtras.includes("근처")) {
      setTimeout(() => setSheetPos("full"), 300);
    } else if (selectedMarker) {
      setTimeout(() => {
        setSheetPos("half");
        mapRef.current?.panTo({
          lat: selectedMarker.location.latitude - 0.2,
          lng: selectedMarker.location.longitude,
        });
        mapRef.current?.setZoom(9.7);
      }, 300);
    } else if (selectedCategories.length > 0) {
      setTimeout(() => setSheetPos("full"), 300);
    }
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      setTimeout(() => setSheetPos("half"), 1100);
    }
  }, [selectedMarker]);

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
      setIsAllCategorySelected(false);
    };
    fetchNearby();
  }, [selectedExtras, currentLocation]);

  const handleTaleClick = (id: number) => {
    setTaleId(id);
    navigate("/tale");
  };

  const handleCloseClick = () => {
    setSelectedMarker(null);
  };

  const handlePlayButton = () => {};

  const handleViewLocation = (t: TaleContent) => {
    const marker = allMarkers.find((m) => m.id === t.id);
    if (!marker) return;

    mapRef.current?.panTo({
      lat: t.location[0].latitude,
      lng: t.location[0].longitude,
    });

    setSelectedMarker(marker);
    setSheetPos("half");
  };

  if (loadError) return <div>Map load failed…</div>;
  if (!isLoaded || isLoading) return <Loader type="full" />;

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
            onFocus={() => setShowSearchOverlay(true)}
          />
        </SearchBox>
      </SearchHeader>

      {showSearchOverlay && (
        <SearchOverlay
          keyword={keyword}
          onKeywordChange={setKeyword}
          onClose={() => setShowSearchOverlay(false)}
        />
      )}

      <MapWrapper>
        <MapRenderer
          allMarkers={allMarkers}
          nearbyTales={nearbyTales}
          selectedMarker={selectedMarker}
          selectedExtras={selectedExtras}
          selectedCategories={selectedCategories}
          mapRef={mapRef}
          onMarkerClick={onMarkerClick}
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
          onToggle={() => toggleAllCategory()}
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
        {/* 바텀 시트 내부 최상단에 스크롤 가능한 wrapper */}
        <SheetScrollWrapper ref={sheetScrollRef}>
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
                description="이야기를 찾아보세요"
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
                  thumbnailUrl={selectedMarker.thumbnail ?? ""}
                  onClick={() => handleTaleClick(selectedMarker.id)}
                  onCloseClick={() => handleCloseClick()}
                >
                  <CustomButton
                    label="재생"
                    icon={<TbPlayerPlayFilled />}
                    size="small"
                    variant="filled"
                    onClick={() => console.log("tts설정 페이지 이동")}
                  />
                  <CustomButton
                    label="위치 보기"
                    icon={<IoLocationSharp />}
                    size="small"
                    variant="filled"
                    onClick={() => {
                      mapRef.current?.panTo({
                        lat: selectedMarker.location.latitude,
                        lng: selectedMarker.location.longitude,
                      });

                      sheetScrollRef.current?.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                      setSheetPos("half");
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
                      onClick={() => handleTaleClick(t.id)}
                    >
                      <CustomButton
                        label="재생"
                        icon={<TbPlayerPlayFilled />}
                        size="small"
                        variant="filled"
                        onClick={() => console.log("tts설정 페이지 이동")}
                      />
                      <CustomButton
                        label="위치 보기"
                        icon={<IoLocationSharp />}
                        size="small"
                        variant="filled"
                        onClick={() => handleViewLocation(t)}
                      />
                    </TaleCard>
                  ))}
                </TaleList>
              </Section>
            );
          })}

          {/* 근처 */}
          {selectedExtras.includes("근처") && (
            <>
              {!currentLocation ? (
                <EmptyState
                  icon={<MdOutlineWrongLocation />}
                  title="위치 정보를 가져올 수 없어요"
                  description="브라우저 또는 앱에서 위치 권한을 허용해 주세요"
                />
              ) : nearbyTales.length === 0 ? (
                <EmptyState
                  icon={<MdOutlineWrongLocation />}
                  title="근처에 설화가 없어요"
                  description="조금 더 이동해보거나 다른 카테고리를 선택해보세요."
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
                        onClick={() => handleTaleClick(t.id)}
                      >
                        <CustomButton
                          label="재생"
                          icon={<TbPlayerPlayFilled />}
                          size="small"
                          variant="filled"
                          onClick={() => console.log("tts설정 페이지 이동")}
                        />
                        <CustomButton
                          label="위치 보기"
                          icon={<IoLocationSharp />}
                          size="small"
                          variant="filled"
                          onClick={() => handleViewLocation(t)}
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
                onIconClick={() => {
                  // 데모용 접근 제어
                  openModal();
                }}
                onDescriptionClick={() => {
                  // 데모용 접근 제어
                  openModal();
                }}
              />
            </Section>
          )}
        </SheetScrollWrapper>
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
  background-color: ${({ theme }) => theme.inputBackground};
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

const SheetScrollWrapper = styled.div`
  overflow-y: auto;
  max-height: 100%;

  /* IE/Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;

  /* Chrome, Safari */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LocBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
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
