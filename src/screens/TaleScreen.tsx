import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronUp } from "react-icons/io5";
import styled, { keyframes } from "styled-components";

import { useTalePlay } from "../hooks/useTalePlay";

import { useStoryStore } from "../stores/useStoryStore";

import TalePlayBottomNav from "../components/TalePlayBottomNav";
import Loader from "../components/Loader";
import { FontFaceStyle } from "../components/FontFaceStyle";

import { fontOptions } from "../constants/fonts";

import seolmun from "../mocks/scriptInfo";

const seolmunCharacter = {
  taleId: 1,
  title: "설문대할망",
  imageUrl: "/assets/images/ar-char1.png",
};

export default function TaleScreen() {
  const navigate = useNavigate();

  const { selectedTaleDetail, ttsEnabled } = useStoryStore();

  const [isTaleScreenLoading, setIsTaleScreenLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const {
    audio,
    toggleAudio,
    replay,
    totalPageNum,
    playManually,
    pageKey,
    pageNum,
    currentPage,
    hasChoices,
    fontConfig,
    showControlBar,
    setShowControlBar,
    showCompleteModal,
    setShowCompleteModal,
    rating,
    setRating,
    handleNext,
    handlePrev,
    handleChoice,
    handleGoToLibrary,
    handleCompleteTale,
  } = useTalePlay({
    talePages: seolmun,
    totalPageNum: 8,
    isParentLoading: isTaleScreenLoading,
  });

  const font = fontOptions.find((f) => f.name === fontConfig.fontName);

  // 스와이프 감지
  const [showNav, setShowNav] = useState(true);
  const pointerStart = useRef({ x: 0, y: 0 });
  const SWIPE_THRESHOLD = 50;

  const [pageTransition, setPageTransition] = useState<string | null>(null);

  useEffect(() => {
    // 로딩 테스트
    const timeout = setTimeout(() => {
      setIsTaleScreenLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // showNav가 true가 될 때마다 타이머 재설정
  useEffect(() => {
    if (!showNav || showControlBar) return;
    const timer = setTimeout(() => setShowNav(false), 5000); // 5초 후 숨김
    return () => clearTimeout(timer);
  }, [showNav, showControlBar]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (showControlBar) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx > 0 && pageNum > 0) handlePrev();
      else if (dx < 0 && pageNum < totalPageNum && !hasChoices) handleNext();
    } else if (dy < -SWIPE_THRESHOLD) {
      setShowNav(true);
    }
  };

  if (isTaleScreenLoading) return <Loader />;

  return (
    <Screen
      $isVisible={isVisible}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <SwipeCapture />
      <ImageContainer
        $transition={pageTransition}
        onAnimationEnd={() => setPageTransition(null)}
      >
        <StoryImage
          key={currentPage.imageUrl}
          src={currentPage.imageUrl}
          alt="이야기 이미지"
        />
      </ImageContainer>

      {font && <FontFaceStyle font={font} />}
      <TextSection>
        <TextContainer $font={font}>{currentPage.text}</TextContainer>

        {/* 선택지가 있을 경우 선택지 버튼 렌더*/}
        {currentPage.choices && (
          <SelectContainer>
            {currentPage.choices.map((c, idx) => (
              <ChoiceButton key={idx} onClick={() => handleChoice(c.next)}>
                {c.text}
              </ChoiceButton>
            ))}
          </SelectContainer>
        )}

        <TalePlayBottomNav
          pageNum={pageNum}
          totalPageNum={totalPageNum}
          hasChoices={hasChoices}
          showNav={showNav}
          onShowNav={() => setShowNav(true)}
          onPrev={handlePrev}
          onNext={handleNext}
          onComplete={() => setShowCompleteModal(true)}
          showControlBar={showControlBar}
          onToggleControlBar={() => setShowControlBar(!showControlBar)}
          ttsEnabled={ttsEnabled}
          audio={audio}
          onToggleAudio={toggleAudio}
          onReplay={replay}
          title={selectedTaleDetail?.title || "설화"}
          onGoBack={() => navigate(-1)}
          onGoHome={() => navigate("/")}
        />

        {/* 숨겨졌을 때 감지용 투명 스와이프 영역 */}
        {!showNav && (
          <UpButton onClick={() => setShowNav(true)}>
            <IoChevronUp size={24} />
          </UpButton>
        )}
      </TextSection>

      {showCompleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>이 설화는 어땠나요?</h2>

            <Section>
              <strong>설화 만족도</strong>
              <StarRating>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setRating(n)}
                    $active={n <= rating}
                  >
                    ★
                  </Star>
                ))}
              </StarRating>
            </Section>

            <Section></Section>
            <ButtonContainer>
              <CloseButton
                onClick={() => {
                  handleCompleteTale();
                  navigate("/home");
                }}
              >
                홈으로
              </CloseButton>

              <LibButton
                onClick={() => {
                  handleCompleteTale();
                  navigate("/lib");
                }}
              >
                내 설화 보러가기
              </LibButton>
              <ARButton
                onClick={() => {
                  handleCompleteTale();
                  navigate("/camera");
                }}
              >
                캐릭터와 사진 찍기
              </ARButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Screen>
  );
}

const Screen = styled.main<{ $isVisible: boolean }>`
  touch-action: none;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 1;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.6s ease;
  background: ${({ theme }) => theme.taleBackground};
  color: ${({ theme }) => theme.taleText};

  @media (orientation: landscape) {
    flex-direction: row; /* 가로 모드: 좌우 나란히 */
  }
`;

const slideLeft = keyframes`
  from { transform: translateX(100%); opacity: 0.5; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideRight = keyframes`
  from { transform: translateX(-100%); opacity: 0.5; }
  to { transform: translateX(0); opacity: 1; }
`;

const ImageContainer = styled.div<{ $transition: string | null }>`
  aspect-ratio: 1/1;
  position: relative;
  width: 100%;
  overflow: hidden;
  animation: ${({ $transition }) =>
      $transition === "left"
        ? slideLeft
        : $transition === "right"
        ? slideRight
        : "none"}
    0.6s ease;

  @media (orientation: landscape) {
    width: 50%;
    height: auto;
    aspect-ratio: auto;
  }
`;

const StoryImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const SwipeCapture = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1; /* NavButtons(…) 보다 낮은 레벨 */
  touch-action: none; /* 터치 드래그가 브라우저 스크롤로 빠지지 않도록 */
  pointer-events: none; /* 클릭 / 터치 이벤트를 뒤로 통과시킴 */
`;

const TextSection = styled.div`
  position: relative;
  flex: 1 1 auto;
  background: ${({ theme }) => theme.taleBackground};
  padding: 20px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: flex-start;
  align-items: flex-start;

  @media (orientation: landscape) {
    width: 50%;
    padding: 20px 16px; /* 여백 조정 */
  }
`;

const TextContainer = styled.div<{ $font?: any }>`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.taleBackground};
  border-radius: 12px;

  font-family: ${({ $font }) =>
    $font ? `${$font.name}, ${$font.style}` : "system-ui, sans-serif"};
  line-height: 1.5;
  word-break: keep-all;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  padding: 0 12px;
`;

const ChoiceButton = styled.button`
  padding: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const UpButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center; // 수직 중앙
  justify-content: center; // 수평 중앙
  z-index: 100;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  text-align: center;
`;

const Section = styled.div`
  margin: 16px 0;

  ul {
    list-style: none; //
    padding: 0;
    margin: 8px 0;
  }

  li {
    margin-bottom: 6px;
  }
`;

const StarRating = styled.div`
  font-size: 24px;
`;

const Star = styled.span<{ $active: boolean }>`
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#ffc107" : "#ddd")};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background: #aaa;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #888;
  }
`;

const ARButton = styled(CloseButton)`
  background: #ff8a3d;
  &:hover {
    background: #ff8a3d;
  }
`;

const LibButton = styled(CloseButton)`
  background: #ff8a3d;
  &:hover {
    background: #ff8a3d;
  }
`;
