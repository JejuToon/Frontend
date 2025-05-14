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

// styled-components
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
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
