import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaGear,
  FaRotate,
  FaPause,
} from "react-icons/fa6";
import { TbHome } from "react-icons/tb";
import { IoChevronUp } from "react-icons/io5";
import styled, { keyframes } from "styled-components";

import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useStoryStore } from "../stores/useStoryStore";
import { useCharacterStore } from "../stores/useCharacterStore";

import ThemeToggle from "../components/ThemeToggle";
import Loader from "../components/Loader";
import { FontFaceStyle } from "../components/FontFaceStyle";
import TTSSettings from "../components/TTSSettings";

import { fontOptions } from "../constants/fonts";

import seolmun from "../mocks/scriptInfo";

import { parseAudioPath } from "../utils/parseAudioPath";

const talePagesInfo = seolmun;
const totalPageNum = 8;
type PageKey = keyof typeof seolmun;
const seolmunCharacter = {
  taleId: 1,
  title: "설문대할망",
  imageUrl: "/assets/images/ar-char1.png",
};

export default function TaleScreen() {
  const { ttsConfig, selectedTaleDetail, fontConfig, ttsEnabled } =
    useStoryStore();

  const navigate = useNavigate();
  const tale = selectedTaleDetail;
  const font = fontOptions.find((f) => f.name === fontConfig.fontName);

  // 로딩 테스트
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // 스와이프 감지
  const [showNav, setShowNav] = useState(true);
  const pointerStart = useRef({ x: 0, y: 0 });
  const SWIPE_THRESHOLD = 50;

  // 현재 페이지 (정수)
  const [pageNum, setPageNum] = useState(0);
  const [pageKey, setPageKey] = useState<PageKey>("1");
  const [history, setHistory] = useState<PageKey[]>([]);

  const currentPage = seolmun[pageKey];
  const hasChoices = currentPage.choices && currentPage.choices.length > 0;

  const [volume, setVolume] = useState(ttsConfig.volume);
  const [rate, setRate] = useState(ttsConfig.rate);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(
    ttsConfig.voiceIndex
  );

  const audioUrl = parseAudioPath(
    selectedTaleDetail?.title || "",
    selectedVoiceIndex,
    pageKey
  );

  const { audio, isPlaying, toggleAudio, replay } = useAudioPlayer(
    audioUrl ? audioUrl : currentPage.audioUrl,
    volume,
    rate,
    isLoading,
    ttsEnabled
  );

  const [showControlBar, setShowControlBar] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rating, setRating] = useState(0); //별점

  const [pageTransition, setPageTransition] = useState<string | null>(null);

  // 로딩 테스트
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audio) {
      audio.playbackRate = rate;
    }
  }, [rate]);

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

  const handleNext = () => {
    if (currentPage.next && currentPage.next !== "end") {
      setHistory((prev) => [...prev, pageKey]);
      setPageKey(currentPage.next as PageKey);
      setPageNum(pageNum + 1);
    } else if (currentPage.next === "end") {
      setShowCompleteModal(true);
    }
  };

  const handleChoice = (nextKey: string) => {
    setHistory((prev) => [...prev, pageKey]);
    setPageKey(nextKey as PageKey);
    setPageNum(pageNum + 1);
  };

  const handlePrev = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const last = newHistory.pop();
      if (last) {
        setPageNum(pageNum - 1);
        setPageKey(last);
      }
      return newHistory;
    });
  };

  const handleGoToLibrary = () => {
    handleCompleteTale();

    navigate("/lib");
  };

  const handleCompleteTale = () => {
    const storedTale = localStorage.getItem("myTales");
    const parsedTale = storedTale ? JSON.parse(storedTale) : [];
    parsedTale.push(tale);
    localStorage.setItem("myTales", JSON.stringify(parsedTale));

    const taleId = selectedTaleDetail?.id;
    const { hasCharacter, addCharacter } = useCharacterStore.getState();

    if (!hasCharacter(taleId!)) {
      addCharacter(seolmunCharacter);
    }
    setShowCompleteModal(false);
  };

  // 로딩 테스트
  if (isLoading) return <Loader />;

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
        <Image src={currentPage.imageUrl} alt="이야기 이미지" />
      </ImageContainer>

      {font && <FontFaceStyle font={font} />}
      <TextSection>
        <TextContainer $font={font}>{currentPage.text}</TextContainer>

        {/* 직접 선택 버튼 노출 */}
        {currentPage.choices && (
          <SelectContainer>
            {currentPage.choices.map((c, idx) => (
              <ChoiceButton key={idx} onClick={() => handleChoice(c.next)}>
                {c.text}
              </ChoiceButton>
            ))}
          </SelectContainer>
        )}
        <NavWrapper
          style={{
            transform: showNav ? "translateY(0)" : "translateY(100%)",
            transition: "transform .3s",
          }}
        >
          <NavButtons>
            <IconButton onClick={() => setShowControlBar(!showControlBar)}>
              <FaGear />
            </IconButton>

            <PageIndicator>
              {pageNum + 1} / {totalPageNum}
            </PageIndicator>

            <ButtonGroupRight>
              <NavButton onClick={handlePrev} disabled={pageNum === 0}>
                이전
              </NavButton>

              {pageNum === totalPageNum ? (
                <NavButton onClick={() => setShowCompleteModal(true)}>
                  완료
                </NavButton>
              ) : (
                <NavButton onClick={handleNext} disabled={hasChoices}>
                  다음
                </NavButton>
              )}
            </ButtonGroupRight>
          </NavButtons>
        </NavWrapper>

        {/* 4) 숨겨졌을 때 감지용 투명 스와이프 영역 */}
        {!showNav && (
          <UpButton onClick={() => setShowNav(true)}>
            <IoChevronUp size={24} />
          </UpButton>
        )}
      </TextSection>

      {showControlBar && (
        <ControlBarWrapper onClick={() => setShowControlBar(false)}>
          <ControlBar onClick={(e) => e.stopPropagation()}>
            <Group>
              <LeftGroup>
                <IconButton onClick={() => navigate(-1)}>
                  <FaArrowLeft />
                </IconButton>
                <TitleText>{tale?.title || "설화"}</TitleText>
                <IconButton onClick={() => navigate("/")}>
                  <TbHome />
                </IconButton>
              </LeftGroup>

              {ttsEnabled && (
                <CenterGroup>
                  <IconButton onClick={toggleAudio}>
                    {audio && !audio.paused ? <FaPause /> : <FaPlay />}
                  </IconButton>
                  <IconButton onClick={replay}>
                    <FaRotate />
                  </IconButton>
                </CenterGroup>
              )}

              <RightGroup>
                <ThemeToggle variant="small" />
              </RightGroup>
            </Group>
            <Collapsible open={ttsEnabled}>
              <TTSSettings
                volume={volume}
                rate={rate}
                selectedVoiceIndex={selectedVoiceIndex}
                onVolumeChange={setVolume}
                onRateChange={setRate}
                onVoiceSelect={setSelectedVoiceIndex}
              />
            </Collapsible>
          </ControlBar>
        </ControlBarWrapper>
      )}

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

              <LibButton onClick={handleGoToLibrary}>
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

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SwipeCapture = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1; /* NavButtons(…) 보다 낮은 레벨 */
  touch-action: none; /* 터치 드래그가 브라우저 스크롤로 빠지지 않도록 */
  pointer-events: none; /* 클릭 / 터치 이벤트를 뒤로 통과시킴 */
`;

const ControlBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 53px;
  z-index: 51;
`;

const ControlBar = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.bottomTabsBackground};
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  z-index: 52;

  @media (orientation: landscape) {
    width: 50%;
    right: 0;
    left: auto;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CenterGroup = styled.div`
  display: flex;
  align-items: center;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Collapsible = styled.div<{ open: boolean }>`
  overflow: hidden;
  max-height: ${({ open }) => (open ? "800px" : "0")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const TitleText = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroupRight = styled.div`
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
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

const NavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 40px;

  @media (orientation: landscape) {
    width: 50%;
    left: 50%;
    height: auto;
    aspect-ratio: auto;
    right: 0;
    transform: translateX(-50%);
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

const NavButtons = styled.div`
  position: relative; 
  display: flex;
  width: 100%
  align-items: center;
  padding: 5px 16px;
  background: ${({ theme }) => theme.bottomTabsBackground};
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  color: ${({ theme }) => theme.text};

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const PageIndicator = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
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
