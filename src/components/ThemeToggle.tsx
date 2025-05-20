import React from "react";
import styled from "styled-components";
import { useThemeStore } from "../stores/useThemeStore";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <ToggleWrapper onClick={toggleTheme}>
      <Track $isDark={isDark}>
        <Thumb $isDark={isDark}>
          {isDark ? <FaMoon color="#facc15" /> : <FaSun color="#facc15" />}
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

const Track = styled.div<{ $isDark: boolean }>`
  width: 80px;
  height: 40px;
  border-radius: 9999px;
  background-color: ${({ $isDark }) => ($isDark ? "#60a5fa" : "#e7e4bb")};
  position: relative;
  transition: background-color 0.3s ease;
`;

const Thumb = styled.div<{ $isDark: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $isDark }) => ($isDark ? "#1f2937" : "#f0f0f0")};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 4px;
  left: 4px;
  transform: ${({ $isDark }) =>
    $isDark ? "translateX(0)" : "translateX(36px)"};
  transition: transform 0.3s ease, background-color 0.3s ease;
`;
