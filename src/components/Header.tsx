import React, { ReactNode } from "react";
import styled from "styled-components";

interface HeaderProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export default function Header({
  left = null,
  center = null,
  right = null,
}: HeaderProps) {
  return (
    <HeaderContainer>
      <SlotLeft>{left}</SlotLeft>
      <SlotCenter>{center}</SlotCenter>
      <SlotRight>{right}</SlotRight>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px; //헤더 높이
  padding: 0 16px;

  background: ${({ theme }) => theme.bottomTabsBackground};
  color: ${({ theme }) => theme.text};
  transition: background 0.3s, color 0.3s, border 0.3s;
`;

const SlotLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlotCenter = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
`;

const SlotRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
