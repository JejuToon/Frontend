import React from "react";
import styled, { css } from "styled-components";

type Position = "collapsed" | "half" | "full";

interface BottomSheetProps {
  position: Position;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({
  position,
  onToggle,
  children,
}: BottomSheetProps) {
  return (
    <SheetContainer $position={position}>
      <SheetHeader onClick={onToggle}>
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
