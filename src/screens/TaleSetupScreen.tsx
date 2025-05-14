import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../components/Header";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import TTSPreviewCard from "../components/TTSPreviewCard";
import TTSChip from "../components/TTSChip";

import { fontOptions } from "../constants/fonts";

const sampleScript =
  "이곳은 신들의 발자취가 깃든 제주, 바람 속에 전설이 머무는 섬입니다.";
const fontScript1 = "이곳은 신들의 발자취가 깃든 제주,";
const fontScript2 = "바람 속에 전설이 머무는 섬입니다.";

export default function TaleSetupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const tale = location.state?.tale;
  const from = location.state?.from;
  console.log(tale);

  const [volume, setVolume] = useState(0.5);
  const [rate, setRate] = useState(1);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(
    null
  );
  const [selectedTTSIndex, setSelectedTTSIndex] = useState<number | null>(0);
  const [selectedFontName, setSelectedFontName] = useState(fontOptions[0].name);

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

  console.log(from);
  const handleButtonClick = () => {
    if (tale) {
      navigate("/tale", {
        state: {
          tale,
          from: from,
          ttsConfig: {
            volume,
            rate,
          },
          selectedTTSIndex,
          selectedFontName,
        },
      });
    }
  };

  return (
    <Screen>
      <Header
        left={<FaArrowLeft onClick={() => navigate(-1)} />}
        center={<h1>설화 설정</h1>}
        right={null}
      />

      <Content>
        <Wrapper></Wrapper>
        <h2>TTS 설정</h2>

        <Section>
          <Label>미리 듣기</Label>
          <TTSContainer>
            <TTSPreviewCard
              profileUrl="/assets/images/watsonImage.png"
              message={sampleScript}
              audioUrl="/assets/audios/watsonSample.wav"
              volume={volume}
              rate={rate}
              onPlayRequest={(audio) =>
                handlePlayRequest(audio, "/assets/audios/watsonSample.wav")
              }
              isPlaying={
                currentlyPlayingUrl === "/assets/audios/watsonSample.wav"
              }
            ></TTSPreviewCard>
            <TTSPreviewCard
              profileUrl="/assets/images/marieImage.png"
              message={sampleScript}
              audioUrl="/assets/audios/marieSample.wav"
              volume={volume}
              rate={rate}
              onPlayRequest={(audio) =>
                handlePlayRequest(audio, "/assets/audios/marieSample.wav")
              }
              isPlaying={
                currentlyPlayingUrl === "/assets/audios/marieSample.wav"
              }
            ></TTSPreviewCard>
          </TTSContainer>
        </Section>

        <Section>
          <Label>음량</Label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <Label>속도</Label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </Section>

        <Section>
          <Label>TTS 선택</Label>
          <TTSSelectContainer>
            <TTSChip
              key={0}
              profileUrl="/assets/images/watsonImage.png"
              name={"왓슨"}
              selected={selectedTTSIndex === 0}
              onClick={() => setSelectedTTSIndex(0)}
            />
            <TTSChip
              key={1}
              profileUrl="/assets/images/marieImage.png"
              name={"마리"}
              selected={selectedTTSIndex === 1}
              onClick={() => setSelectedTTSIndex(1)}
            />
          </TTSSelectContainer>
        </Section>

        <h2>글 설정</h2>
        <Section>
          <Label>폰트 선택</Label>
          <TTSSelectContainer>
            {fontOptions.map((font, index) => (
              <TTSChip
                key={index}
                name={font.label}
                selected={selectedFontName === font.name}
                onClick={() => setSelectedFontName(font.name)}
              />
            ))}
          </TTSSelectContainer>
          {fontOptions.map((font) => {
            if (font.name !== selectedFontName) return null;

            return (
              <React.Fragment key={font.name}>
                <FontFace font={font} />
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
`;

const Wrapper = styled.div``;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TTSContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TTSSelectContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Footer = styled.footer`
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const NextButton = styled.button`
  width: 70%;
  height: 44px;
  background: #7f3dff;

  color: white;
  font-weight: bold;
  border: none;
  border-radius: 22px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const FontFace = createGlobalStyle<{ font: any }>`
  @font-face {
    font-family: ${(props) => props.font.name};
    src: url(${(props) => props.font.fontFile}) format('truetype');
    font-weight: normal;
    font-style: normal;
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
