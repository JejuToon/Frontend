import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import LocationBox from "../components/LocationBox";
import tales from "../mocks/taleInfo";
import { FaPlus } from "react-icons/fa6";
import Loader from "../components/Loader";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useSelectedCategoryStore } from "../stores/useSelectedCategoryStore";
import { useExtraChipsStore } from "../stores/useExtraChipsStore";

import EmblaCarousel from "../components/EmblaCarousel";
import EmblaCarouselDragFree from "../components/EmblaCarouselDragFree";
import { EmblaOptionsType } from "embla-carousel";
import "../styles/embla.css";
import "../styles/emblaDrag.css";
const OPTIONS: EmblaOptionsType = { loop: true };
const carouselTales = tales.slice(0, 5);

import { TaleContent } from "../types/tale";

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

const nearbyTales: TaleContent[] = tales.slice(0, 4);
const recommendedTales: TaleContent[] = tales.slice(3, 7);

export default function HomeScreen() {
  // 로딩 테스트
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // 로딩 테스트
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      // 본문이 보여질 때 약간 딜레이 후 페이드 인
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const navigate = useNavigate();
  const { setSelectedMarker, setSheetPos } = useSelectedMarkerStore();
  const { initializeCategory } = useSelectedCategoryStore();
  const { setExtraChips } = useExtraChipsStore();

  const nextButtonRef = useRef<(() => void) | null>(null);
  const isReady = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (nextButtonRef.current && isReady.current) {
        nextButtonRef.current();
      }
    }, 4000); // 4초마다 실행
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const nearbyButtonClick = () => {
    setExtraChips(["근처"]);
    initializeCategory([]);
    setSheetPos("collapsed");
    navigate("/search");
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

  // 로딩 테스트
  if (isLoading) return <Loader />;

  return (
    <Container $isVisible={isVisible}>
      <Wrapper>
        <Header
          left={<h1>홈</h1>}
          center={null}
          right={<LocationBox onClick={() => console.log("위치 갱신")} />}
        />
      </Wrapper>

      <MainSection>
        <EmblaCarousel
          slides={carouselTales}
          options={OPTIONS}
          onNextRef={(fn) => {
            nextButtonRef.current = fn;
            isReady.current = true;
          }}
          onUserInteraction={startAutoScroll} //사용자 조작시 타이머 재시작
          onSlideClick={(t) => handleTaleClick(t)}
        />
      </MainSection>

      <Section>
        <SectionHeader>
          <h3>현재 위치와 가까운 설화</h3>
          <SeeAllBtn onClick={() => nearbyButtonClick()}>&gt;</SeeAllBtn>
        </SectionHeader>
        <EmblaCarouselDragFree
          slides={nearbyTales}
          options={{ dragFree: true, containScroll: "trimSnaps" }}
          onTaleClick={(t) => handleTaleClick(t)}
        ></EmblaCarouselDragFree>
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
        ></EmblaCarouselDragFree>
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
    </Container>
  );
}

const Container = styled.div<{ $isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.6s ease;
  overflow-y: auto;
  padding-bottom: 60px; // 바텀탭 높이
`;

const Wrapper = styled.div`
  z-index: 10;
`;

const MainSection = styled.div`
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
  margin-bottom: 15px;
  margin-top: 15px;

  h3 {
    font-weight: 500;
  }
`;

const SeeAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
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
