import React, { useState } from "react";
import styled from "styled-components";
import {
  IoVolumeMute,
  IoVolumeHigh,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";
import CustomChip from "./CustomChip";
import TTSPreviewCard from "./TTSPreviewCard";
import { TTSInfo } from "../constants/ttsInfo";

import { useTTSSetup } from "../hooks/useTTSSetup";

export interface TTSSettingsProps {
  type?: "simple" | "detail";
  expanded?: boolean;
}

export default function TTSSettings({
  type = "simple",
  expanded = true,
}: TTSSettingsProps) {
  const {
    ttsEnabled,
    volume,
    rate,
    selectedTTSIndex,
    sampleScript,
    currentlyPlayingUrl,
    handlePlayRequest,
    handleToggleTts,
    setVolume,
    setRate,
    setSelectedTTSIndex,
  } = useTTSSetup();

  const [settingExpanded, setSettingExpanded] = useState(expanded);

  return (
    <>
      <ToggleContainer onClick={() => setSettingExpanded(!settingExpanded)}>
        <ToggleLabel>TTS</ToggleLabel>
        <ToggleSwitch checked={ttsEnabled} onChange={handleToggleTts} />
      </ToggleContainer>

      <Collapsible open={settingExpanded}>
        <SliderContainer>
          <SliderLabel>음량</SliderLabel>
          <IconWrapper>
            <IoVolumeMute />
          </IconWrapper>
          <SliderInput
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <IconWrapper>
            <IoVolumeHigh />
          </IconWrapper>
        </SliderContainer>

        <SliderContainer>
          <SliderLabel>속도</SliderLabel>
          <IconWrapper>
            <IoPlayBack />
          </IconWrapper>
          <SliderInput
            min={0.5}
            max={2.0}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
          <IconWrapper>
            <IoPlayForward />
          </IconWrapper>
        </SliderContainer>

        <TTSSelectContainer>
          {TTSInfo.map((tts, index) => (
            <CustomChip
              key={index}
              profileUrl={tts.profileUrl}
              name={tts.label}
              selected={selectedTTSIndex === index}
              onClick={() => setSelectedTTSIndex(index)}
            />
          ))}
        </TTSSelectContainer>

        {type === "detail" && (
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
                  handlePlayRequest?.(audio, tts.audioUrl)
                }
                isPlaying={currentlyPlayingUrl === tts.audioUrl}
              />
            ))}
          </TTSContainer>
        )}
      </Collapsible>
    </>
  );
}

const Collapsible = styled.div<{ open: boolean }>`
  overflow: hidden;
  max-height: ${({ open }) => (open ? "800px" : "0")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleLabel = styled.div`
  font-weight: 600;
  font-size: 20px;
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

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

const SliderLabel = styled.span`
  width: 48px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const IconWrapper = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

const SliderInput = styled.input.attrs({ type: "range" })`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.border};
  appearance: none;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    border: 2px solid white;
    margin-top: 0px; /* 중앙 정렬 */
  }
`;

const TTSSelectContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px;
`;

const TTSContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;
