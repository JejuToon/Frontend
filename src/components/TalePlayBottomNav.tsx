import React from "react";
import styled from "styled-components";
import {
  FaPause,
  FaPlay,
  FaArrowLeft,
  FaRotate,
  FaGear,
} from "react-icons/fa6";
import { TbHome } from "react-icons/tb";
import { IoChevronUp } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";
import TTSSettings from "./TTSSettings";

interface TalePlayBottomNavProps {
  pageNum: number;
  totalPageNum: number;
  hasChoices: boolean;
  showNav: boolean;
  onShowNav: () => void;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;

  showControlBar: boolean;
  onToggleControlBar: () => void;

  ttsEnabled: boolean;
  audio: HTMLAudioElement | null;
  onToggleAudio: () => void;
  onReplay: () => void;

  title: string;
  onGoBack: () => void;
  onGoHome: () => void;
}

export default function TalePlayBottomNav({
  pageNum,
  totalPageNum,
  hasChoices,
  showNav,
  onShowNav,
  onPrev,
  onNext,
  onComplete,

  showControlBar,
  onToggleControlBar,

  ttsEnabled,
  audio,
  onToggleAudio,
  onReplay,

  title,
  onGoBack,
  onGoHome,
}: TalePlayBottomNavProps) {
  return (
    <>
      {/* 아래쪽 Nav */}
      <NavWrapper
        style={{
          transform: showNav ? "translateY(0)" : "translateY(100%)",
          transition: "transform .3s",
        }}
      >
        <NavButtons>
          <IconButton onClick={onToggleControlBar}>
            <FaGear />
          </IconButton>

          <PageIndicator>
            {pageNum} / {totalPageNum}
          </PageIndicator>

          <ButtonGroupRight>
            <NavButton onClick={onPrev} disabled={pageNum === 0}>
              이전
            </NavButton>

            {pageNum >= totalPageNum ? (
              <NavButton onClick={onComplete}>완료</NavButton>
            ) : (
              <NavButton onClick={onNext} disabled={hasChoices}>
                다음
              </NavButton>
            )}
          </ButtonGroupRight>
        </NavButtons>
      </NavWrapper>

      {!showNav && (
        <UpButton onClick={onShowNav}>
          <IoChevronUp size={24} />
        </UpButton>
      )}

      {/* 상단 ControlBar */}
      {showControlBar && (
        <ControlBarWrapper onClick={onToggleControlBar}>
          <ControlBar onClick={(e) => e.stopPropagation()}>
            <Group>
              <LeftGroup>
                <IconButton onClick={onGoBack}>
                  <FaArrowLeft />
                </IconButton>
                <IconButton onClick={onGoHome}>
                  <TbHome />
                </IconButton>
                <TitleText>{title}</TitleText>
              </LeftGroup>

              {ttsEnabled && (
                <CenterGroup>
                  <IconButton onClick={onToggleAudio}>
                    {audio && !audio.paused ? <FaPause /> : <FaPlay />}
                  </IconButton>
                  <IconButton onClick={onReplay}>
                    <FaRotate />
                  </IconButton>
                </CenterGroup>
              )}

              <RightGroup>
                <ThemeToggle variant="small" />
              </RightGroup>
            </Group>

            <TTSSettings type="simple" expanded={ttsEnabled} />
          </ControlBar>
        </ControlBarWrapper>
      )}
    </>
  );
}

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
    transform: translateX(-50%);
  }
`;

const NavButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 16px;
  background: ${({ theme }) => theme.bottomTabsBackground};
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

const ButtonGroupRight = styled.div`
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
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
  background: ${({ theme }) => theme.bottomTabsBackground};
  padding: 12px 16px 0px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 52;

  @media (orientation: landscape) {
    width: 50%;
    right: 0;
    left: auto;
  }
`;

const Group = styled.div`
  display: flex;
  justify-content: space-between;
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

const TitleText = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;
