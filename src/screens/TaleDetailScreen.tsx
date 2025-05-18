import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa6";
import Chip from "../components/Chip";
import { useStoryStore } from "../stores/useStoryStore";
import { useSelectedMarkerStore } from "../stores/useSelectedMarkerStore";
import { useFilterChipsStore } from "../stores/useFilterChipsStore";
import { TaleDetailResponse } from "../types/tale";
import { fetchTaleDetail } from "../api/tale";

export default function TaleDetailScreen() {
  const navigate = useNavigate();
  const { setSelectedMarker, setSheetPos } = useSelectedMarkerStore();
  const { initializeCategory } = useFilterChipsStore();
  const { selectedTale } = useStoryStore();
  const [descExpanded, setDescExpanded] = useState(false);
  const [originExpanded, setOriginExpanded] = useState(false);

  const [taleDetail, setTaleDetail] = useState<TaleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo용 접근 제어
  const [showModal, setShowModal] = useState(false);
  const desiredId = 1; //설문대할망 id로 설정

  useEffect(() => {
    const loadTaleDetail = async () => {
      if (!selectedTale?.id) return;
      try {
        setLoading(true);
        const detail = await fetchTaleDetail(selectedTale.id);
        setTaleDetail(detail);
      } catch (err) {
        setError("설화 정보를 불러오는 데 실패했습니다.");
      } finally {
        console.log("설화 정보 불러오기 성공");
        console.log(taleDetail);
        setLoading(false);
      }
    };

    loadTaleDetail();
  }, [selectedTale]);

  const handlePlayClick = () => {
    //Demo용 접근제어
    if (taleDetail?.id !== desiredId) {
      setShowModal(true);
      return;
    }

    navigate("/tale/character");
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

      {/* Demo용 접근 제어 */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <p>현재 선택된 설화는 접근할 수 없습니다.</p>
            <CloseButton onClick={() => setShowModal(false)}>확인</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Screen>
  );
}

// Demo용 접근제어
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

// Demo용 접근제어
const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
`;

// Demo용 접근제어
const CloseButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Screen = styled.main`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 60px;
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
  color: #555;
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
  height: 80%;
  background: url(${(props) => props.$imageUrl}) no-repeat center / cover;
  filter: blur(20px);
`;

const WhiteSection = styled.div`
  position: absolute;
  bottom: 0;
  height: 20%;
  width: 100%;
  background-color: white;
`;

const CardImage = styled.img`
  position: absolute;
  top: 55%;
  left: 50%;
  width: 65%;
  max-width: 300px;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const PlayButtonOverlay = styled.button`
  position: absolute;
  bottom: 7%;
  right: 20%;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4b5563;
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
  background: #4b5563;
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
  color: #222;
`;

const TaleDescription = styled.div<{ $expanded?: boolean }>`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #555;

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
  border-bottom: 1px solid #e2e2e2;
  background-color: #ffffff;
  font-size: 13px;
  color: #868686;
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
  background-color: #e0e0e0;
  margin: 8px 0;
`;
