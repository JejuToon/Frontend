import React from "react";
import styled from "styled-components";
import {
  IoVolumeMute,
  IoVolumeHigh,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";
import TTSChip from "./TTSChip";
import { TTSInfo } from "../constants/ttsInfo";

export interface TTSSettingsProps {
  volume: number;
  rate: number;
  selectedVoiceIndex: number;
  onVolumeChange: (v: number) => void;
  onRateChange: (r: number) => void;
  onVoiceSelect: (idx: number) => void;
}

export default function TTSSettings({
  volume,
  rate,
  selectedVoiceIndex,
  onVolumeChange,
  onRateChange,
  onVoiceSelect,
}: TTSSettingsProps) {
  return (
    <>
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
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
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
          onChange={(e) => onRateChange(parseFloat(e.target.value))}
        />
        <IconWrapper>
          <IoPlayForward />
        </IconWrapper>
      </SliderContainer>

      <TTSSelectContainer>
        {TTSInfo.map((tts, index) => (
          <TTSChip
            key={index}
            profileUrl={tts.profileUrl}
            name={tts.label}
            selected={selectedVoiceIndex === index}
            onClick={() => onVoiceSelect(index)}
          />
        ))}
      </TTSSelectContainer>
    </>
  );
}

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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
