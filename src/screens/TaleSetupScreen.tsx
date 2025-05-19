import React, { useState } from "react";
import { colors } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../components/Header";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { useStoryStore } from "../stores/useStoryStore";
import TTSPreviewCard from "../components/TTSPreviewCard";
import TTSChip from "../components/TTSChip";
import { FontFaceStyle } from "../components/FontFaceStyle";
import {
  IoVolumeMute,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeHigh,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";

import { fontOptions } from "../constants/fonts";
import { TTSInfo } from "../constants/ttsInfo";

const sampleScript = "제주도에는 약 1만 8천여 개의 설화가 전해져 내려오고 있어";
const fontScript1 = "이곳은 신들의 발자취가 깃든 제주,";
const fontScript2 = "바람 속에 전설이 머무는 섬입니다.";

const volumeLevels = [0, 0.33, 0.66, 1];

export default function TaleSetupScreen() {
  const navigate = useNavigate();
  const { ttsConfig, fontConfig, setTTSConfig, setFontConfig } =
    useStoryStore();

  const [volumeLevel, setVolumeLevel] = useState(() =>
    volumeLevels.indexOf(ttsConfig.volume)
  );
  const volume = volumeLevels[volumeLevel];
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
      setCurrentlyPlayingUrl(null); // 재생 끝나면 상태 초기화 → 버튼 복구
    };
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

  const handleDecreaseRate = () => {
    setRate((prev) => Math.max(0.5, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleIncreaseRate = () => {
    setRate((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleButtonClick = () => {
    setTTSConfig({
      voiceIndex: selectedTTSIndex,
      rate,
      volume: volumeLevels[volumeLevel],
    });
    setFontConfig({
      fontName: selectedFontName,
    });

    navigate("/tale/play");
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
          <Label>미리 듣기</Label>
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

            <Label>TTS 선택</Label>
            <TTSSelectContainer>
              {TTSInfo.map((tts, index) => (
                <TTSChip
                  key={index}
                  profileUrl={tts.profileUrl}
                  name={tts.label}
                  selected={selectedTTSIndex === index}
                  onClick={() => setSelectedTTSIndex(index)}
                />
              ))}
            </TTSSelectContainer>
          </TTSContainer>
        </Section>

        <Section>
          <Label>음량</Label>
          <TTSSelectContainer>
            <TTSChip
              key={0}
              icon={<IoVolumeMute />}
              name={"음소거"}
              selected={volumeLevel === 0}
              onClick={() => setVolumeLevel(0)}
            />
            <TTSChip
              key={1}
              icon={<IoVolumeLow />}
              name={"1단계"}
              selected={volumeLevel === 1}
              onClick={() => setVolumeLevel(1)}
            />
            <TTSChip
              key={2}
              icon={<IoVolumeMedium />}
              name={"2단계"}
              selected={volumeLevel === 2}
              onClick={() => setVolumeLevel(2)}
            />
            <TTSChip
              key={3}
              icon={<IoVolumeHigh />}
              name={"3단계"}
              selected={volumeLevel === 3}
              onClick={() => setVolumeLevel(3)}
            />
          </TTSSelectContainer>

          <Label>속도</Label>
          <RateControl>
            <IconButton>
              <IoPlayBack onClick={handleDecreaseRate} />
            </IconButton>
            <RateValue>{rate.toFixed(1)}</RateValue>
            <IconButton>
              <IoPlayForward onClick={handleIncreaseRate} />
            </IconButton>
          </RateControl>
        </Section>

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

          {fontOptions.map((font) => {
            if (font.name !== selectedFontName) return null;

            return (
              <React.Fragment key={font.name}>
                <FontFaceStyle font={font} />
                <FontPreview
                  $font={font}
                  $selected={selectedFontName === font.name}
                >
                  <div>{fontScript1}</div>
                  <div>{fontScript2}</div>
                </FontPreview>
              </React.Fragment>
            );
          })}
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
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #eee;
`;

const Section = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-bottom: 10px solid ${colors.BEIGE_300};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
`;

const TTSContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TTSSelectContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const RateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const RateValue = styled.span`
  font-size: 16px;
  width: 40px;
  text-align: center;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Footer = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 10px 0;
  border-top: 1px solid #eee;
`;

const NextButton = styled.button`
  width: 70%;
  height: 44px;
  background: #4b5563;

  color: white;
  font-weight: bold;
  border: none;
  border-radius: 22px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const FontPreview = styled.div<{ $font: any; $selected: boolean }>`
  font-family: ${({ $font }) => $font.name}, ${({ $font }) => $font.style};
  font-size: 18px;
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  height: 100px;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;
