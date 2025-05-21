import React, { useState, useEffect } from "react";
import { colors } from "../constants/colors";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaGear,
  FaRotate,
  FaPause,
} from "react-icons/fa6";
import { TbHome } from "react-icons/tb";

import { fontOptions } from "../constants/fonts";
import scripts from "../mocks/scriptInfo";
import Loader from "../components/Loader";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useChoiceHandler } from "../hooks/useChoiceHandler";
import { useStoryStore } from "../stores/useStoryStore";
import { FontFaceStyle } from "../components/FontFaceStyle";
import TTSSettings from "../components/TTSSettings";
import { parseAudioPath } from "../utils/parseAudioPath";

const talePagesInfo = scripts[0];

interface Choice {
  text: string;
  next: number;
}

export default function TaleScreen() {
  const { ttsConfig, selectedTale, fontConfig, ttsEnabled } = useStoryStore();

  const navigate = useNavigate();
  const tale = selectedTale;
  const font = fontOptions.find((f) => f.name === fontConfig.fontName);

  // 로딩 테스트
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const [page, setPage] = useState(0);
  const talePages = talePagesInfo;
  const currentPage = talePages[page];

  const [volume, setVolume] = useState(ttsConfig.volume);
  const [rate, setRate] = useState(ttsConfig.rate);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(
    ttsConfig.voiceIndex
  );

  const audioUrl = parseAudioPath(
    selectedTale?.title || "",
    selectedVoiceIndex,
    page + 1
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

  const { showChoiceModal, setShowChoiceModal, handleChoice } =
    useChoiceHandler(setPage);

  // 로딩 테스트
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const current = talePages[page];

  const hasChoices = current.choices && current.choices.length > 0;
  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < talePages.length - 1 && setPage(page + 1);

  const handleGoToLibrary = () => {
    const storedTale = localStorage.getItem("myTales");
    const parsedTale = storedTale ? JSON.parse(storedTale) : [];
    parsedTale.push(tale);
    localStorage.setItem("myTales", JSON.stringify(parsedTale));

    setShowCompleteModal(false);
    navigate("/lib");
  };

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

  // 로딩 테스트
  if (isLoading) return <Loader />;

  return (
    <Screen $isVisible={isVisible}>
      <ImageContainer>
        <Image src={current.imageUrl} alt="이야기 이미지" />
      </ImageContainer>

      {font && <FontFaceStyle font={font} />}
      <TextSection>
        <TextContainer $font={font}>{current.text}</TextContainer>

        {hasChoices && (
          <ChoiceTriggerButton onClick={() => setShowChoiceModal(true)}>
            선택하기
          </ChoiceTriggerButton>
        )}

        {showChoiceModal && (
          <ModalOverlay>
            <ModalContent>
              <h2>어떤 선택을 하시겠어요?</h2>
              <SelectContainer>
                {current.choices!.map((c, idx) => (
                  <ChoiceButton key={idx} onClick={() => handleChoice(c)}>
                    {c.text}
                  </ChoiceButton>
                ))}
              </SelectContainer>
              <CloseButton onClick={() => setShowChoiceModal(false)}>
                닫기
              </CloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
        <NavWrapper>
          <NavButtons>
            <IconButton onClick={() => setShowControlBar(!showControlBar)}>
              <FaGear />
            </IconButton>

            <PageIndicator>
              {page + 1} / {talePages.length}
            </PageIndicator>

            <ButtonGroupRight>
              <NavButton onClick={handlePrev} disabled={page === 0}>
                이전
              </NavButton>

              {page === talePages.length - 1 ? (
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

              <CenterGroup>
                <IconButton onClick={toggleAudio}>
                  {audio && !audio.paused ? <FaPause /> : <FaPlay />}
                </IconButton>
              </CenterGroup>

              <RightGroup>
                <IconButton onClick={replay}>
                  <FaRotate />
                </IconButton>
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
                  setShowCompleteModal(false);
                  navigate("/search");
                }}
              >
                홈으로
              </CloseButton>

              <LibButton onClick={handleGoToLibrary}>
                내 설화 보러가기
              </LibButton>
              <ARButton
                onClick={() => {
                  navigate("/camera");
                }}
              >
                AR로 보기
              </ARButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Screen>
  );
}

const Screen = styled.main<{ $isVisible: boolean }>`
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
  bottom: 53px;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid ${({ theme }) => theme.border};

  z-index: 52;

  @media (orientation: landscape) {
    width: 50%;
    right: 0;
    left: auto;
  }
`;

const Group = styled.div`
  display: flex;
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
`;

const ImageContainer = styled.div`
  aspect-ratio: 1/1;
  position: relative;
  width: 100%;
  overflow: hidden;

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

const TextSection = styled.div`
  flex: 1 1 auto;
  background: ${({ theme }) => theme.surface};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;

  @media (orientation: landscape) {
    width: 50%;
    padding: 20px 16px; /* 여백 조정 */
  }
`;

const TextContainer = styled.div<{ $font?: any }>`
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-family: ${({ $font }) =>
    $font ? `${$font.name}, ${$font.style}` : "system-ui, sans-serif"};
  line-height: 1.75;
  word-break: keep-all;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 480px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const ChoiceButton = styled.button`
  padding: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const NavWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;

  @media (orientation: landscape) {
    width: 50%;
    height: auto;
    aspect-ratio: auto;
  }
`;

const NavButtons = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: ${({ theme }) => theme.background};
  border-top: 1px solid ${({ theme }) => theme.border};
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
  transform: translateX(-50%);
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
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
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
  background: #7f3dff;
  &:hover {
    background: #6a2eea;
  }
`;

const LibButton = styled(CloseButton)`
  background: #7f3dff;
  &:hover {
    background: #6a2eea;
  }
`;

const ChoiceTriggerButton = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;
