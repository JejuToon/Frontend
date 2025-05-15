import React, { useState } from "react";
import styled, { css } from "styled-components";

type Position = "collapsed" | "half" | "full";

interface BottomSheetProps {
  position: Position;
  onToggle: () => void; // 클릭 시 상태 순환
  onChangePosition: (newPos: Position) => void; // 드래그 시 위치 지정
  children: React.ReactNode;
}

export default function BottomSheet({
  position,
  onToggle,
  onChangePosition,
  children,
}: BottomSheetProps) {
  const [startY, setStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const deltaY = e.touches[0].clientY - startY;

    if (Math.abs(deltaY) < 30) return;

    if (deltaY > 50 && position !== "collapsed") {
      onTogglePosition("down");
      setStartY(null);
    } else if (deltaY < -50 && position !== "full") {
      onTogglePosition("up");
      setStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  const onTogglePosition = (direction: "up" | "down") => {
    if (direction === "up") {
      if (position === "collapsed") onChangePosition("half");
      else if (position === "half") onChangePosition("full");
    } else {
      if (position === "full") onChangePosition("half");
      else if (position === "half") onChangePosition("collapsed");
    }
  };

  return (
    <SheetContainer $position={position}>
      <SheetHeader
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onToggle} // ✅ 클릭하면 순환 전환
      >
        <SheetHandle />
      </SheetHeader>
      <SheetContent>{children}</SheetContent>
    </SheetContainer>
  );
}

const SheetContainer = styled.div<{ $position: Position }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 60px;
  background: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  transition: height 0.3s ease;
  z-index: 10;
  display: flex;
  flex-direction: column;

  ${({ $position }) => {
    switch ($position) {
      case "collapsed":
        return css`
          height: 5%;
        `;
      case "half":
        return css`
          height: 27%;
        `;
      case "full":
        return css`
          height: 78%;
        `;
    }
  }}
`;

const SheetHeader = styled.div`
  flex: 0 0 auto;
  padding: 8px 8px;
  background: #fff;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SheetHandle = styled.div`
  width: 60px;
  height: 4px;
  background: #ccc;
  border-radius: 2px;
`;

const SheetContent = styled.div`
  overflow-y: auto;
  flex: 1;
`;
