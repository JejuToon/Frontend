import React, { useState } from "react";
import { colors } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { useStoryStore } from "../stores/useStoryStore";
import TTSPreviewCard from "../components/TTSPreviewCard";
import TTSChip from "../components/TTSChip";
import { FontFaceStyle } from "../components/FontFaceStyle";
import TTSSettings from "../components/TTSSettings";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

import { fontOptions } from "../constants/fonts";
import { TTSInfo } from "../constants/ttsInfo";

const sampleScript = "제주도에는 약 1만 8천여 개의 설화가 전해져 내려오고 있어";
const fontScript1 = "이곳은 신들의 발자취가 깃든 제주,";
const fontScript2 = "바람 속에 전설이 머무는 섬입니다.";

export default function TaleSetupScreen() {
  const navigate = useNavigate();
  const { ttsConfig, fontConfig, setTTSConfig, setFontConfig } =
    useStoryStore();

  const { ttsEnabled, setTtsEnabled } = useStoryStore();
  const [ttsExpanded, setTtsExpanded] = useState(ttsEnabled);
  const [volume, setVolume] = useState(ttsConfig.volume);
  const [rate, setRate] = useState(ttsConfig.rate);

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(
    null
  );
  const [selectedTTSIndex, setSelectedTTSIndex] = useState(
    ttsConfig.voiceIndex
  );
  const [selectedFontName, setSelectedFontName] = useState(fontConfig.fontName);

  const handlePlayRequest = (audio: HTMLAudioElement, audioUrl: string) => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (currentAudio === audio && !audio.paused) {
      audio.pause();
      setCurrentlyPlayingUrl(null);
      return;
    }

    audio.play();
    setCurrentAudio(audio);
    setCurrentlyPlayingUrl(audioUrl);

    audio.onended = () => {
      setCurrentlyPlayingUrl(null);
    };
  };

  const handleButtonClick = () => {
    setTTSConfig({
      voiceIndex: selectedTTSIndex,
      rate,
      volume,
    });
    setFontConfig({
      fontName: selectedFontName,
    });

    navigate("/tale/play");
  };

  const handleToggleTts = () => {
    if (ttsEnabled) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlayingUrl(null);
      }

      setTtsExpanded(false);
      setTtsEnabled(false);
    } else {
      setTtsEnabled(true);
      setTtsExpanded(true);
    }
  };

  return (
    <Screen>
      <HeaderWrapper>
        <Header
          left={<FaArrowLeft onClick={() => navigate(-1)} />}
          center={<h1>설화 설정</h1>}
          right={null}
        />
      </HeaderWrapper>

      <Content>
        <Section>
          <ToggleContainerWrapper>
            <ToggleContainer>
              <ToggleLabel>
                TTS
                <ToggleSwitch checked={ttsEnabled} onChange={handleToggleTts} />
              </ToggleLabel>
              <IconToggle onClick={() => setTtsExpanded(!ttsExpanded)}>
                {ttsExpanded ? <IoChevronUp /> : <IoChevronDown />}
              </IconToggle>
            </ToggleContainer>
          </ToggleContainerWrapper>

          <Collapsible open={ttsExpanded}>
            <TTSSettings
              volume={volume}
              rate={rate}
              selectedVoiceIndex={selectedTTSIndex}
              onVolumeChange={setVolume}
              onRateChange={setRate}
              onVoiceSelect={setSelectedTTSIndex}
            />

            <TTSContainer>
              {TTSInfo.map((tts, index) => (
                <TTSPreviewCard
                  key={index}
                  profileUrl={tts.profileUrl}
                  message={sampleScript}
                  audioUrl={tts.audioUrl}
                  volume={volume}
                  rate={rate}
                  onPlayRequest={(audio) =>
                    handlePlayRequest(audio, tts.audioUrl)
                  }
                  isPlaying={currentlyPlayingUrl === tts.audioUrl}
                />
              ))}
            </TTSContainer>
          </Collapsible>
        </Section>

        {/* 보이지 않게 렌더링만 시켜서 폰트파일을 미리 가져오게 하는 영역 */}
        <div
          style={{
            position: "absolute",
            left: -9999,
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          {fontOptions.map((font) => (
            <React.Fragment key={font.name}>
              <FontFaceStyle font={font} />
            </React.Fragment>
          ))}
        </div>

        <Section>
          <Label>폰트 선택</Label>
          <TTSSelectContainer>
            {fontOptions.map((font, index) => (
              <TTSChip
                key={index}
                name={font.label}
                selected={selectedFontName === font.name}
                onClick={() => setSelectedFontName(font.name)}
              ></TTSChip>
            ))}
          </TTSSelectContainer>

          <FontPreview
            $font={fontOptions.find((f) => f.name === selectedFontName)!}
            $selected
          >
            <div>{fontScript1}</div>
            <div>{fontScript2}</div>
          </FontPreview>
        </Section>
      </Content>
      <Footer>
        <NextButton onClick={handleButtonClick}>이야기 감상하기</NextButton>
      </Footer>
    </Screen>
  );
}

const Screen = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background};
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.cardBackground || "white"};
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const Collapsible = styled.div<{ open: boolean }>`
  overflow: hidden;
  max-height: ${({ open }) => (open ? "800px" : "0")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const ToggleContainerWrapper = styled.div``;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconToggle = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const ToggleLabel = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ToggleSwitch = styled.input.attrs({ type: "checkbox" })`
  width: 40px;
  height: 20px;
  appearance: none;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  outline: none;
  cursor: pointer;
  &:checked {
    background: ${({ theme }) => theme.primary};
  }
  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    transform: ${({ checked }) => (checked ? "translateX(20px)" : "none")};
  }
`;

const Section = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-bottom: 10px solid ${({ theme }) => theme.border || "#eee"};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  flex-direction: column;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const TTSContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

const TTSSelectContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Footer = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bottomTabsBackground};
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.border || "#eee"};
`;

const NextButton = styled.button`
  width: 70%;
  height: 44px;
  background: ${({ theme }) => theme.primary || "#4b5563"};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 22px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const FontPreview = styled.div<{ $font: any; $selected: boolean }>`
  font-family: ${({ $font }) => $font.name}, ${({ $font }) => $font.style};
  font-size: 18px;
  padding: 8px 12px;
  border: 2px solid ${({ theme }) => theme.border || "#ccc"};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  height: 100px;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
`;
