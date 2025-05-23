import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa6";
import styled from "styled-components";

import { useStoryStore } from "../stores/useStoryStore";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";
import Chip from "../components/Chip";

import { TaleDetailResponse } from "../types/tale";
import { fetchTaleDetail } from "../api/tale";

// 데모용 접근 제어
import { useAccessControl } from "../components/AccessControlProvider";

export default function TaleDetailScreen() {
  // 데모용 접근 제어
  const { openModal } = useAccessControl();

  const navigate = useNavigate();
  const { setSelectedMarker, setSheetPos } = useSelectedMarkerStore();
  const { initializeCategory } = useFilterChipsStore();
  const { selectedTaleId } = useStoryStore();
  const [descExpanded, setDescExpanded] = useState(false);
  const [originExpanded, setOriginExpanded] = useState(false);

  const [taleDetail, setTaleDetail] = useState<TaleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTaleDetail = async () => {
      if (!selectedTaleId) return;
      try {
        setLoading(true);
        const detail = await fetchTaleDetail(selectedTaleId);
        setTaleDetail(detail);
      } catch (err) {
        setError("설화 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadTaleDetail();
  }, []);

  useEffect(() => {
    //console.log(`taleDetail: ${JSON.stringify(taleDetail)}`);
  }, [taleDetail]);

  // Demo용 접근제어 설문대할망 id
  const desiredId = 1;
  const handlePlayClick = () => {
    //Demo용 접근제어
    if (taleDetail?.id !== desiredId) {
      openModal();
      return;
    }

    navigate("/tale/setup");
  };

  const handleCategoryClick = (categoryKey: string) => {
    initializeCategory([categoryKey]);
    setSelectedMarker(null);
    setSheetPos("collapsed");
    navigate("/search");
  };

  return (
    <Screen>
      <Header>
        <Icon onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </Icon>
      </Header>
      <CardSection>
        <BlurSection $imageUrl={taleDetail?.thumbnail ?? ""} />
        <WhiteSection />
        <CardImage src={taleDetail?.thumbnail} alt="cover" />
        <PlayButtonOverlay onClick={handlePlayClick}>
          <FaPlay />
        </PlayButtonOverlay>
      </CardSection>
      <ContentArea>
        <ContentSection>
          <TaleTitle>{taleDetail?.title}</TaleTitle>
          <TaleDescription>{taleDetail?.description}</TaleDescription>
          <ButtonWrapper>
            <PlayButton onClick={handlePlayClick}>설화 보러 가기</PlayButton>
          </ButtonWrapper>
        </ContentSection>

        <ContentSection>
          <TaleTitle>요약</TaleTitle>
          <TaleDescription $expanded={descExpanded}>
            {taleDetail?.summary ?? "내용 없음"}
          </TaleDescription>

          <MoreButton onClick={() => setDescExpanded(!descExpanded)}>
            {descExpanded ? "접기" : "더보기"}
          </MoreButton>
        </ContentSection>

        <ContentSection>
          <TaleTitle>카테고리</TaleTitle>
          <ChipContainer>
            {taleDetail?.categories?.map((cat) => (
              <Chip
                key={cat}
                selected={false}
                onToggle={() => handleCategoryClick(cat)}
              >
                {cat}
              </Chip>
            ))}
          </ChipContainer>
        </ContentSection>

        <Divider />

        <ContentSection>
          <TaleTitle>원본</TaleTitle>
          <TaleDescription $expanded={originExpanded}>
            {"원본 설화 내용..."}
          </TaleDescription>

          <MoreButton onClick={() => setOriginExpanded(!originExpanded)}>
            {originExpanded ? "접기" : "더보기"}
          </MoreButton>
        </ContentSection>
      </ContentArea>
    </Screen>
  );
}

const Screen = styled.main`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 60px;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 65px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  z-index: 10;
`;

const Icon = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.textSecondary || "#555"};
  display: flex;
`;

const CardSection = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
  overflow: hidden;
`;

const BlurSection = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$imageUrl",
})<{ $imageUrl: string }>`
  height: 70%;
  background: url(${(props) => props.$imageUrl}) no-repeat center / cover;
  filter: blur(20px);
`;

const WhiteSection = styled.div`
  position: absolute;
  bottom: 0;
  height: 30%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
`;

const CardImage = styled.img`
  position: absolute;
  top: 55%;
  left: 50%;
  width: 80%;
  max-width: 500px;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const PlayButtonOverlay = styled.button`
  position: absolute;
  bottom: 20%;
  right: 15%;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary || "#4b5563"};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 5;
  font-size: 16px;
  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
`;

const ButtonWrapper = styled.div`
  padding: 16px 0px;
`;

const PlayButton = styled.button`
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.primary || "#4b5563"};
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 22px;
  cursor: pointer;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);

  &:active {
    opacity: 0.8;
  }
`;

const ContentArea = styled.div`
  padding: 0px 16px;
`;

const ContentSection = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const TaleTitle = styled.div`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.text || "#222"};
`;

const TaleDescription = styled.div<{ $expanded?: boolean }>`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textSecondary || "#555"};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$expanded ? "unset" : 3)};
  -webkit-box-orient: vertical;
`;

const MoreButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#e2e2e2"};
  background-color: ${({ theme }) => theme.background};
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary || "#868686"};
  text-align: center;
`;

const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 0px;
  z-index: 5;
  overflow-x: auto;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border || "#e0e0e0"};
  margin: 8px 0;
`;
