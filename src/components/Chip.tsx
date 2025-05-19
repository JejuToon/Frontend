import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

interface ChipProps {
  children: ReactNode;
  selected: boolean;
  onToggle?: () => void;
  variant?: "category" | "extra";
}

export default function Chip({
  children,
  selected,
  onToggle,
  variant = "category",
}: ChipProps) {
  return (
    <ChipButton $selected={selected} $variant={variant} onClick={onToggle}>
      {children}
    </ChipButton>
  );
}

const ChipButton = styled.button<{
  $selected: boolean;
  $variant: "category" | "extra";
}>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;
  white-space: nowrap;
  margin: 0 2px;
  transition: all 0.2s ease;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;

  ${({ $selected, $variant }) =>
    $variant === "category"
      ? css`
          background: ${$selected ? "#7f3dff" : "#f2ecff"};
          color: ${$selected ? "white" : "black"};
          border-color: ${$selected ? "#7f3dff" : "#ccc"};
        `
      : css`
          background: ${$selected ? "#ff8a3d" : "#fff4e6"};
          color: ${$selected ? "white" : "#ff8a3d"};
          border-color: ${$selected ? "#ff8a3d" : "#ffd3ae"};
        `}
`;
