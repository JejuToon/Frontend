import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface TooltipProps {
  message: string;
  topOffset?: string; // 위치 조정 옵션
}

export default function TooltipOverlay({
  message,
  topOffset = "-60px", // 기본값
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  if (!showTooltip) return null;

  return (
    <BalloonContainer
      $topOffset={topOffset}
      onClick={() => setShowTooltip(false)}
    >
      <BalloonBox>{message}</BalloonBox>
      <BalloonTail />
    </BalloonContainer>
  );
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BalloonContainer = styled.div<{ $topOffset: string }>`
  position: absolute;
  top: ${({ $topOffset }) => $topOffset};
  left: 16px;
  max-width: 80%;
  z-index: 100;
  animation: ${fadeInUp} 0.3s ease;
  cursor: pointer;
`;

const BalloonBox = styled.div`
  background: #fff9e6;
  color: #3e3e3e;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const BalloonTail = styled.div`
  position: absolute;
  top: 100%;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #fff9e6;
`;
