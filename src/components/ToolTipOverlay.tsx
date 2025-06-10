import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

type TailDirection = "bottom" | "top" | "left" | "right";

interface TooltipProps {
  message: string;
  containerTopOffset?: string;
  containerLeftOffset?: string;
  containerTransform?: string;
  tailDirection?: TailDirection;
  tailTopOffset?: string; // 꼬리 top 위치 추가
  tailLeftOffset?: string; // 꼬리 left 위치 추가
  tailTransform?: string; // 꼬리 transform 추가 (기존에 있었지만 명시적으로)
  duration?: number;
}

export default function TooltipOverlay({
  message,
  containerTopOffset = "-60px",
  containerLeftOffset = "50%",
  containerTransform = "translateX(-50%)",
  tailDirection = "bottom",
  tailTopOffset, // 이제 이 값들을 직접 사용합니다.
  tailLeftOffset, // 이제 이 값들을 직접 사용합니다.
  tailTransform, // 이제 이 값들을 직접 사용합니다.
  duration = 5000,
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  // 꼬리 위치 조정을 위한 기본값 설정 및 필요에 따라 오버라이드
  // 이제 getTailPositionProps 함수는 더 이상 필요하지 않습니다.
  const defaultTailProps = (() => {
    let props: {
      $tailTop?: string;
      $tailBottom?: string;
      $tailLeft?: string;
      $tailRight?: string;
      $tailTransform?: string;
    } = {};

    switch (tailDirection) {
      case "bottom":
        props.$tailTop = "100%";
        props.$tailLeft = "50%";
        props.$tailTransform = "translateX(-50%)";
        break;
      case "top":
        props.$tailBottom = "100%";
        props.$tailLeft = "50%";
        props.$tailTransform = "translateX(-50%)";
        break;
      case "left":
        props.$tailRight = "100%";
        props.$tailTop = "50%";
        props.$tailTransform = "translateY(-50%)";
        break;
      case "right":
        props.$tailLeft = "100%";
        props.$tailTop = "50%";
        props.$tailTransform = "translateY(-50%)";
        break;
      default:
        break;
    }
    // Prop으로 전달된 값이 있다면 기본값을 덮어씁니다.
    if (tailTopOffset !== undefined) props.$tailTop = tailTopOffset;
    if (tailLeftOffset !== undefined) props.$tailLeft = tailLeftOffset;
    if (tailTransform !== undefined) props.$tailTransform = tailTransform;

    return props;
  })();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!showTooltip) return null;

  return (
    <BalloonContainer
      $containerTopOffset={containerTopOffset}
      $containerLeftOffset={containerLeftOffset}
      $containerTransform={containerTransform}
      onClick={() => setShowTooltip(false)}
    >
      <BalloonBox>
        <Text>{message}</Text>
      </BalloonBox>
      <BalloonTail $tailDirection={tailDirection} {...defaultTailProps} />
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

const BalloonContainer = styled.div<{
  $containerTopOffset: string;
  $containerLeftOffset: string;
  $containerTransform: string;
}>`
  position: absolute;
  top: ${({ $containerTopOffset }) => $containerTopOffset};
  left: ${({ $containerLeftOffset }) => $containerLeftOffset};
  transform: ${({ $containerTransform }) => $containerTransform};
  max-width: 80%;
  z-index: 100;
  animation: ${fadeInUp} 0.3s ease;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BalloonBox = styled.div`
  background: ${({ theme }) => theme.bottomTabsBackground};
  color: ${({ theme }) => theme.textPrimary};
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: row;
`;

const Text = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BalloonTail = styled.div<{
  $tailDirection: TailDirection;
  $tailTop?: string;
  $tailBottom?: string;
  $tailLeft?: string;
  $tailRight?: string;
  $tailTransform?: string;
}>`
  position: absolute;
  width: 0;
  height: 0;
  ${({ $tailTop }) => $tailTop && `top: ${$tailTop};`}
  ${({ $tailBottom }) => $tailBottom && `bottom: ${$tailBottom};`}
  ${({ $tailLeft }) => $tailLeft && `left: ${$tailLeft};`}
  ${({ $tailRight }) => $tailRight && `right: ${$tailRight};`}
  ${({ $tailTransform }) => $tailTransform && `transform: ${$tailTransform};`}

  ${({ $tailDirection }) => {
    switch ($tailDirection) {
      case "bottom":
        return css`
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid ${({ theme }) => theme.bottomTabsBackground};
        `;
      case "top":
        return css`
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 10px solid ${({ theme }) => theme.bottomTabsBackground};
        `;
      case "left":
        return css`
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 10px solid ${({ theme }) => theme.bottomTabsBackground};
        `;
      case "right":
        return css`
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 10px solid ${({ theme }) => theme.bottomTabsBackground};
        `;
      default:
        return css``;
    }
  }}
`;
