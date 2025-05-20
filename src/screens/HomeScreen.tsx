import { colors } from "../constants/colors";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import LocationBox from "../components/LocationBox";

import { MdOutlineWrongLocation } from "react-icons/md";
import { FaPlus, FaPlay } from "react-icons/fa6";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";
import { useNearbyTalesStore } from "../stores/useNearbyTalesStore";
import { useAllTalesStore } from "../stores/useAllTalesStore";

import EmblaCarousel from "../components/EmblaCarousel";
import EmblaCarouselDragFree from "../components/EmblaCarouselDragFree";
import { EmblaOptionsType } from "embla-carousel";
import "../styles/embla.css";
import "../styles/emblaDrag.css";
const OPTIONS: EmblaOptionsType = { loop: true };

import type { TaleContent } from "../types/tale";
import tales from "../mocks/taleInfo";

const category1 = "assets/images/category/category1.png";
const category2 = "assets/images/category/category2.png";
const category3 = "assets/images/category/category3.png";
const category4 = "assets/images/category/category4.png";

const categories = [
  { key: "개척담", label: "개척담", imageUrl: category1 },
  { key: "인물담", label: "인물담", imageUrl: category2 },
  { key: "연애담", label: "연애담", imageUrl: category3 },
  { key: "신앙담", label: "신앙담", imageUrl: category4 },
];

const recommendedTales: TaleContent[] = tales.slice(3, 7);

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [carouselTales, setCarouselTales] = useState<TaleContent[]>([]);

  const { currentLocation, fetchCurrentLocation } = useCurrentLocationStore();
  const { nearbyTales, fetchNearbyTalesData } = useNearbyTalesStore();
  const { allTales, fetchAllTalesData } = useAllTalesStore();

  const navigate = useNavigate();
  const { setSelectedMarker, setSheetPos } = useSelectedMarkerStore();
  const { initializeCategory, setExtras } = useFilterChipsStore();

  const nextButtonRef = useRef<(() => void) | null>(null);
  const isReady = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);

    fetchAllTalesData(0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyTalesData(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (allTales.length >= 5) {
      const shuffled = [...allTales].sort(() => Math.random() - 0.5);
      setCarouselTales(shuffled.slice(0, 5));
    }
  }, [allTales]);

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (nextButtonRef.current && isReady.current) {
        nextButtonRef.current();
      }
    }, 4000);
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const nearbyButtonClick = () => {
    setExtras(["근처"]);
    initializeCategory([]);
    setSheetPos("collapsed");
    navigate("/search", { state: { fromHomeNearby: true } });
  };

  const handleTaleClick = (tale: TaleContent) => {
    setSelectedMarker(tale);
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
        left={<h1>홈</h1>}
        center={null}
        right={
          <LocationBox
            onClick={async () => {
              const status = await fetchCurrentLocation(null); // 또는 mapRef 있으면 전달
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
          <h3>현재 위치와 가까운 설화</h3>
          <SeeAllBtn onClick={nearbyButtonClick}>&gt;</SeeAllBtn>
        </SectionHeader>
        {nearbyTales.length > 0 ? (
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
          />
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h3>추천 설화</h3>
          <FaPlus
            title="맞춤형 설화 추천 받기"
            onClick={() => console.log("추천 폼으로 이동")}
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
            <p>위치 권한이 차단되어 있어 설화를 추천할 수 없습니다.</p>
            <p>
              브라우저 설정에서 위치 권한을 <strong>허용</strong>해 주세요.
            </p>
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
  background-color: ${({ theme }) => theme.cardBackground || "white"};
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  color: ${({ theme }) => theme.text};
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

const Section = styled.section`
  border-bottom: 8px solid ${({ theme }) => theme.border || "#f3e7c5"};
`;

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
  background: rgba(0, 0, 0, 0.3);
`;
