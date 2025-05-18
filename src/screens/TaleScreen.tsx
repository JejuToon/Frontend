import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaGear,
  FaRotate,
  FaPause,
} from "react-icons/fa6";
import {
  IoVolumeMute,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeHigh,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";
import { fontOptions } from "../constants/fonts";
import scripts from "../mocks/scriptInfo";
import Loader from "../components/Loader";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useChoiceHandler } from "../hooks/useChoiceHandler";
import { useStoryStore } from "../stores/useStoryStore";
import { FontFaceStyle } from "../components/FontFaceStyle";
import { parseAudioPath } from "../utils/parseAudioPath";

const talePagesInfo = scripts[0];

interface Choice {
  text: string;
  next: number;
}

const volumeLevels = [0, 0.33, 0.66, 1];

export default function TaleScreen() {
  const { ttsConfig, selectedTale, fontConfig, selectedCharacterImage } =
    useStoryStore();

  const navigate = useNavigate();
  const tale = selectedTale;
  const font = fontOptions.find((f) => f.name === fontConfig.fontName);

  const [volumeLevel, setVolumeLevel] = useState(() => {
    const idx = volumeLevels.findIndex((v) => v === ttsConfig.volume);
    return idx === -1 ? 2 : idx;
  });
  const volume = volumeLevels[volumeLevel];

  // 로딩 테스트
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const [page, setPage] = useState(0);
  const talePages = talePagesInfo;
  const currentPage = talePages[page];
  const audioUrl = parseAudioPath(
    selectedTale?.title || "",
    ttsConfig.voiceIndex,
    page + 1
  );

  const [showControlBar, setShowControlBar] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rate, setRate] = useState(ttsConfig.rate);
  const [rating, setRating] = useState(0); //별점

  const { audio, isPlaying, toggleAudio, replay } = useAudioPlayer(
    audioUrl ? audioUrl : currentPage.audioUrl,
    volume,
    rate,
    isLoading
  );

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

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < talePages.length - 1) setPage(page + 1);
  };

  const handleVolumeIconClick = () => {
    setVolumeLevel((prev) => (prev + 1) % volumeLevels.length);
  };

  const renderVolumeIcon = () => {
    switch (volumeLevel) {
      case 0:
        return <IoVolumeMute />;
      case 1:
        return <IoVolumeLow />;
      case 2:
        return <IoVolumeMedium />;
      case 3:
      default:
        return <IoVolumeHigh />;
    }
  };

  const handleComplete = () => {
    setShowCompleteModal(false);
    navigate("/search");
  };

  const handleGoToLibrary = () => {
    const storedTale = localStorage.getItem("myTales");
    const parsedTale = storedTale ? JSON.parse(storedTale) : [];
    parsedTale.push(tale);
    localStorage.setItem("myTales", JSON.stringify(parsedTale));

    const storedCharacter = localStorage.getItem("myCharacters");
    const parsedCharacter = storedCharacter ? JSON.parse(storedCharacter) : [];
    parsedCharacter.push({
      name: selectedTale?.title,
      data: "testSaved",
      avatarUrl: selectedCharacterImage,
    });
    localStorage.setItem("myCharacters", JSON.stringify(parsedCharacter));

    setShowCompleteModal(false);
    navigate("/lib");
  };

  const handleDecreaseRate = () => {
    setRate((prev) => Math.max(0.5, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleIncreaseRate = () => {
    setRate((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10));
  };

  useEffect(() => {
    if (audio) {
      audio.volume = volumeLevels[volumeLevel];
    }
  }, [volumeLevel]);

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

        {hasChoices && current.choiceIndex == null && (
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
      </TextSection>

      {showControlBar && (
        <ControlBarWrapper onClick={() => setShowControlBar(false)}>
          <ControlBar onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </IconButton>
            <TitleText>{tale?.title || "설화"}</TitleText>

            <IconButton>
              <FaRotate onClick={replay} />
            </IconButton>
            <IconButton>
              {audio && !audio.paused ? (
                <FaPause onClick={toggleAudio} />
              ) : (
                <FaPlay onClick={toggleAudio} />
              )}
            </IconButton>
            <IconButton onClick={handleVolumeIconClick}>
              {renderVolumeIcon()}
            </IconButton>
            <RateControl>
              <IconButton>
                <IoPlayBack onClick={handleDecreaseRate} />
              </IconButton>
              <RateValue>{rate.toFixed(1)}</RateValue>
              <IconButton>
                <IoPlayForward onClick={handleIncreaseRate} />
              </IconButton>
            </RateControl>
          </ControlBar>
        </ControlBarWrapper>
      )}

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

      {showCompleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>이 이야기는 어땠나요?</h2>

            <Section>
              <strong>이야기 만족도</strong>
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

            <Section>
              <strong>근처 추천 장소</strong>
              <ul>
                <li>산방산 (0.8km)</li>
                <li>제주 오름 박물관 (1.2km)</li>
                <li>설문대할망 동상 (1.5km)</li>
              </ul>
            </Section>
            <ButtonContainer>
              <CloseButton onClick={handleComplete}>홈으로</CloseButton>
              <LibButton onClick={handleGoToLibrary}>
                내 설화 보러가기
              </LibButton>
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
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.6s ease;
  background: #fff;
`;
const ControlBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  z-index: 51;
`;

const ControlBar = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  z-index: 52;
`;

const RateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RateValue = styled.span`
  font-size: 16px;
  width: 40px;
  text-align: center;
`;

const TitleText = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const IconButton = styled.button`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  z-index: 1;
  align-items: center;
  justify-content: center;
  display: flex;
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
  background: #f5f0fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div<{ $font?: any }>`
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-family: ${({ $font }) =>
    $font ? `${$font.name}, ${$font.style}` : "system-ui, sans-serif"};

  line-height: 1.75;
  line-spacing: 0.02em;
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
  background: #7f3dff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #6c2ee8;
  }
`;

const NavButtons = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: #333;

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
  color: #666;
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
  background: white;
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

const LibButton = styled(CloseButton)`
  background: #7f3dff;

  &:hover {
    background: #6a2eea;
  }
`;

const ChoiceTriggerButton = styled.button`
  padding: 10px 16px;
  background: #7f3dff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #6a2eea;
  }
`;
