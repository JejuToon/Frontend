import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

import Header from "../components/Header";
import { FaArrowLeft } from "react-icons/fa6";
import { useStoryStore } from "../stores/useStoryStore";
import CustomChip from "../components/CustomChip";
import { FontFaceStyle } from "../components/FontFaceStyle";
import TTSSettings from "../components/TTSSettings";

import { fontOptions } from "../constants/fonts";

import { useUserInfoStore } from "../stores/useUserInfoStore";

import { useTTSSetup } from "../hooks/useTTSSetup";

const fontScript1 = "이곳은 신들의 발자취가 깃든 제주,";
const fontScript2 = "바람 속에 전설이 머무는 섬입니다.";

interface TaleSetupProps {
  onClose: () => void;
}

export default function TaleSetup({ onClose }: TaleSetupProps) {
  const navigate = useNavigate();
  const { fontConfig, setTTSConfig, setFontConfig } = useStoryStore();
  const { setSkipTaleSetup } = useUserInfoStore();

  const { volume, rate, selectedTTSIndex } = useTTSSetup();

  const [skipNextTime, setSkipNextTime] = useState(false);
  const [selectedFontName, setSelectedFontName] = useState(fontConfig.fontName);

  // Escape 키 눌렀을 때 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleButtonClick = () => {
    setTTSConfig({
      voiceIndex: selectedTTSIndex,
      rate,
      volume,
    });
    setFontConfig({
      fontName: selectedFontName,
    });

    if (skipNextTime) {
      setSkipTaleSetup(true);
    }

    navigate("/tale/play");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 9999,
      }}
    >
      <Screen>
        <Header
          left={<FaArrowLeft onClick={onClose} />}
          center={<h2>설화 설정</h2>}
          right={null}
        />

        <Content>
          <Section>
            <TTSSettings type="detail" />
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
            <FontSelectContainer>
              {fontOptions.map((font, index) => (
                <CustomChip
                  key={index}
                  name={font.label}
                  selected={selectedFontName === font.name}
                  onClick={() => setSelectedFontName(font.name)}
                ></CustomChip>
              ))}
            </FontSelectContainer>

            {/* 모든 폰트 렌더: 보여지는 건 선택된 것만 */}
            <FontPreviewContainer>
              {fontOptions.map((font) => (
                <FontPreview
                  key={font.name}
                  $font={font}
                  $selected={selectedFontName === font.name}
                  style={{
                    display: selectedFontName === font.name ? "flex" : "none",
                  }}
                >
                  <div>{fontScript1}</div>
                  <div>{fontScript2}</div>
                </FontPreview>
              ))}
            </FontPreviewContainer>
          </Section>
        </Content>

        <StyledCheckboxLabel>
          <StyledCheckboxInput
            type="checkbox"
            checked={skipNextTime}
            onChange={(e) => setSkipNextTime(e.target.checked)}
          />
          <CustomCheckbox />
          <span>이 설정 유지하고 다시보지 않기</span>
        </StyledCheckboxLabel>

        <Footer>
          <NextButton onClick={handleButtonClick}>이야기 감상하기</NextButton>
        </Footer>
      </Screen>
    </motion.div>
  );
}

const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background};
  z-index: 9999;
`;

const Section = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
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

const FontSelectContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FontPreviewContainer = styled.div`
  margin-top: 8px;
  position: relative;
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

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  user-select: none;
`;

const StyledCheckboxInput = styled.input`
  display: none;
`;

const CustomCheckbox = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.background};

  ${StyledCheckboxInput}:checked + & {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};

    &::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 0px;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;
