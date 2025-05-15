import React, { ReactNode } from "react";
import styled from "styled-components";

interface TabProps {
  isActive: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export default function Tab({ isActive, onClick, children }: TabProps) {
  return (
    <StyledTab $active={isActive} onClick={onClick}>
      {children}
    </StyledTab>
  );
}

const StyledTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#000" : "#666")};
  border-bottom-color: ${({ $active }) => ($active ? "#000" : "transparent")};
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;
