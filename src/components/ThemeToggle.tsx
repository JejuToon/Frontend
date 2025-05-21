import React from "react";
import styled from "styled-components";
import { useThemeStore } from "../stores/useThemeStore";
import { FaMoon, FaSun } from "react-icons/fa";

type Variant = "small" | "medium" | "large";

const sizeMap = {
  small: { width: 60, height: 28, thumb: 20, padding: 4 },
  medium: { width: 80, height: 40, thumb: 32, padding: 4 },
  large: { width: 100, height: 50, thumb: 38, padding: 6 },
};

const iconSizeMap = {
  small: 10,
  medium: 14,
  large: 18,
};

interface ThemeToggleProps {
  variant?: Variant;
}

export default function ThemeToggle({ variant = "medium" }: ThemeToggleProps) {
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === "dark";
  const iconSize = iconSizeMap[variant];

  return (
    <ToggleWrapper onClick={toggleTheme}>
      <Track $isDark={isDark} $variant={variant}>
        <Thumb $isDark={isDark} $variant={variant}>
          {isDark ? (
            <FaMoon size={iconSize} color="#facc15" />
          ) : (
            <FaSun size={iconSize} color="#facc15" />
          )}
        </Thumb>
      </Track>
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Track = styled.div<{ $isDark: boolean; $variant: Variant }>`
  ${({ $variant }) => {
    const size = sizeMap[$variant];
    return `
      width: ${size.width}px;
      height: ${size.height}px;
      border-radius: 9999px;
      position: relative;
      transition: background-color 0.3s ease;
    `;
  }}
  background-color: ${({ $isDark }) => ($isDark ? "#60a5fa" : "#e7e4bb")};
`;

const Thumb = styled.div<{ $isDark: boolean; $variant: Variant }>`
  ${({ $variant, $isDark }) => {
    const size = sizeMap[$variant];
    const offset = size.padding;
    const move = size.width - size.thumb - offset * 2;

    return `
      width: ${size.thumb}px;
      height: ${size.thumb}px;
      top: ${offset}px;
      left: ${offset}px;
      transform: ${$isDark ? "translateX(0)" : `translateX(${move}px)`};
      border-radius: 50%;
      background-color: ${$isDark ? "#1f2937" : "#f0f0f0"};
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      transition: transform 0.3s ease, background-color 0.3s ease;
    `;
  }}
`;
