import React, { ReactNode } from "react";
import styled from "styled-components";

interface ChipProps {
  children: ReactNode;
  selected: boolean;
  onToggle: () => void;
}

export default function Chip({ children, selected, onToggle }: ChipProps) {
  return (
    <ChipButton $selected={selected} onClick={onToggle}>
      {children}
    </ChipButton>
  );
}

// styled-components
const ChipButton = styled.button<{ $selected: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${({ $selected }) => ($selected ? "#7f3dff" : "#ccc")};
  background: ${({ $selected }) => ($selected ? "#7f3dff" : "#f2ecff")};
  color: ${({ $selected }) => ($selected ? "white" : "black")};
  cursor: pointer;
  white-space: nowrap;
  margin: 0 4px;
  transition: all 0.2s ease;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;
