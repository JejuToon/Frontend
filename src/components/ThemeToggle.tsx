// src/components/ThemeToggle.tsx
import React from "react";
import { useThemeStore } from "../stores/useThemeStore";
import styled from "styled-components";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <ToggleButton onClick={toggleTheme}>
      현재 모드: {mode === "light" ? "🌞 Light" : "🌙 Dark"} → 전환
    </ToggleButton>
  );
}

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 1rem;
  font-size: 1rem;
  transition: background 0.3s;
`;
