import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineWrongLocation } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import styled from "styled-components";

import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";
import { useNearbyTalesStore } from "../stores/useNearbyTalesStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";

import Header from "../components/Header";
import LocationBox from "../components/LocationBox";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import EmblaCarousel from "../components/EmblaCarousel";
import EmblaCarouselDragFree from "../components/EmblaCarouselDragFree";
import { EmblaOptionsType } from "embla-carousel";
import "../styles/embla.css";
import "../styles/emblaDrag.css";
const OPTIONS: EmblaOptionsType = { loop: true };

import type { TaleContent } from "../types/tale";

import { getRandomSlice } from "../utils/shuffleArray";

const categories = [
  {
    key: "개척담",
    label: "개척담",
    imageUrl: "assets/images/category/category1.png",
  },
  {
    key: "인물담",
    label: "인물담",
    imageUrl: "assets/images/category/category2.png",
  },
  {
    key: "연애담",
    label: "연애담",
    imageUrl: "assets/images/category/category3.png",
  },
  {
    key: "신앙담",
    label: "신앙담",
    imageUrl: "assets/images/category/category4.png",
  },
];

// 데모용 접근 제어
import { useAccessControl } from "../components/AccessControlProvider";

export default function HomeScreen() {
  // 데모용 접근 제어
  const { openModal } = useAccessControl();

  const navigate = useNavigate();

  const { currentLocation, fetchCurrentLocation } = useCurrentLocationStore();
  const { nearbyTales, nearbyTalesLoading, fetchNearbyTalesData } =
    useNearbyTalesStore();
  const { allTales, fetchAllTalesData } = useAllTalesStore();
  const { setSelectedMarker, setSheetPos } = useSelectedMarkerStore();
  const { initializeCategory, setExtras } = useFilterChipsStore();

  // 상단 캐러셀 상태
  const nextButtonRef = useRef<(() => void) | null>(null);
  const isReady = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [carouselTales, setCarouselTales] = useState<TaleContent[]>([]);
  const [recommendedTales, setrecommendTales] = useState<TaleContent[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // 로딩 테스트
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);

    startAutoScroll(); // 상단 캐러셀 스크롤 시작
    fetchAllTalesData(0); // 전체 설화 목록 가져오기 (여기서는 1페이지만)

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // 마운트 이후 설화 목록을 가져오면 랜덤으로 추출하여 상단 캐러셀에 삽입
    if (allTales.length >= 5) {
      const shuffled = [...allTales].sort(() => Math.random() - 0.5);
      setCarouselTales(shuffled.slice(0, 5));
    }

    // 가져온 설화 목록 중 랜덤으로 꺼내 추천 설화의 기본설화값으로 삽입
    setrecommendTales(getRandomSlice(allTales, 4));
  }, [allTales]);

  useEffect(() => {
    // 현재 위치가 설정되면, 근처 위치 설화 받아 오기
    if (currentLocation) {
      fetchNearbyTalesData(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (nextButtonRef.current && isReady.current) {
        nextButtonRef.current();
      }
    }, 4000);
  };

  const nearbyButtonClick = () => {
    setExtras(["근처"]);
    initializeCategory([]);
    setSheetPos("collapsed");
    navigate("/search", { state: { fromHomeNearby: true } });
  };

  const handleTaleClick = (tale: TaleContent) => {
    const marker = {
      id: tale.id,
      title: tale.title,
      location: {
        latitude: tale.location[0].latitude,
        longitude: tale.location[0].longitude,
      },
      categories: tale.categories,
      description: tale.description,
      score: tale.score,
      thumbnail: tale.thumbnail,
    };
    setSelectedMarker(marker);
    setSheetPos("collapsed");
    initializeCategory(tale.categories);
    navigate("/search");
  };

  const handleCategoryClick = (categoryKey: string) => {
    initializeCategory([categoryKey]);
    setSelectedMarker(null);
    setSheetPos("collapsed");
    navigate("/search");
  };

  if (isLoading) return <Loader />;

  return (
    <Container $isVisible={isVisible}>
      <Header
        left={
          <ImgWrapper>
            <ImgIcon src={"/icons/icon.png"} alt={"탐라담"} />
            <Img src={"/icons/title-icon.png"} alt={"탐라담"} />
          </ImgWrapper>
        }
        center={null}
        right={
          <LocationBox
            onClick={async () => {
              const status = await fetchCurrentLocation(null);
              if (status === "denied") {
                setShowLocationModal(true);
              }
            }}
          />
        }
      />

      <EmblaCarousel
        slides={carouselTales}
        options={OPTIONS}
        onNextRef={(fn) => {
          nextButtonRef.current = fn;
          isReady.current = true;
        }}
        onUserInteraction={startAutoScroll}
        onSlideClick={(t) => handleTaleClick(t)}
      />

      <Section>
        <SectionHeader>
          <h3>추천 설화</h3>
          <FaPlus
            title="맞춤형 설화 추천 받기"
            onClick={() => {
              // 데모용 접근 제어
              openModal();
            }}
          />
        </SectionHeader>
        <EmblaCarouselDragFree
          slides={recommendedTales}
          options={{ dragFree: true, containScroll: "trimSnaps" }}
          onTaleClick={(t) => handleTaleClick(t)}
        />
      </Section>

      <Section>
        <SectionHeader>
          <h3>현재 위치와 가까운 설화</h3>
          <SeeAllBtn onClick={nearbyButtonClick}>&gt;</SeeAllBtn>
        </SectionHeader>
        {nearbyTalesLoading ? (
          <Loader type="inline" />
        ) : nearbyTales.length > 0 ? (
          <EmblaCarouselDragFree
            slides={nearbyTales}
            options={{ dragFree: true, containScroll: "trimSnaps" }}
            onTaleClick={(t) => handleTaleClick(t)}
          />
        ) : (
          <EmptyState
            icon={<MdOutlineWrongLocation />}
            title="주변 설화를 찾을 수 없어요"
            description="위치 권한을 허용하면, 근처에 어떤 설화가 있는지 볼 수 있어요"
            onIconClick={() => fetchCurrentLocation(null)}
          />
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h3>카테고리</h3>
        </SectionHeader>
        <CategoryGrid>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.key}
              style={{ backgroundImage: `url(${cat.imageUrl})` }}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <CategoryLabel>{cat.label}</CategoryLabel>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>

      {showLocationModal && (
        <ModalOverlay onClick={() => setShowLocationModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalText>
              위치 권한이 차단되어 있어 설화를 추천할 수 없습니다.
            </ModalText>
            <ModalText>
              브라우저 설정에서 위치 권한을 <strong>허용</strong>해 주세요.
            </ModalText>
            <CloseButton onClick={() => setShowLocationModal(false)}>
              확인
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div<{ $isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.6s ease;
  padding-bottom: 60px;
  background-color: ${({ theme }) => theme.background};
`;

const ImgWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
`;

const ImgIcon = styled.img`
  height: 40px;
  width: 40px;
`;

const Img = styled.img`
  height: 24px;
  width: auto;
  object-fit: contain;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  white-space:nowrap 
  color: ${({ theme }) => theme.text};
`;

const ModalText = styled.div`
  display: block;
  text-align: center;
  white-space: normal; /* 기본 줄바꿈 허용 */
  word-break: keep-all; /* 단어 단위로만 줄바꿈 */
  overflow-wrap: normal; /* 긴 단어 강제 줄바꿈 해제 */
  margin-bottom: 8px;
`;

const CloseButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary || "#4b5563"};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Section = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  h3 {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

const SeeAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
`;

const CategoryCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  border-radius: 12px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;

const CategoryLabel = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  color: white;
  text-align: center;
  font-weight: bold;
`;
