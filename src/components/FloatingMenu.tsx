import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaLink, FaRegTimesCircle } from "react-icons/fa";

export default function FloatingMenu() {
  return (
    <MenuContainer>
      <MenuItem>
        <FaFacebookF />
        <span>페이스북 공유</span>
      </MenuItem>
      <MenuItem>
        <FaLink />
        <span>링크 복사</span>
      </MenuItem>
      <MenuItem>
        <FaRegTimesCircle />
        <span>관심없어요</span>
      </MenuItem>
    </MenuContainer>
  );
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  width: 160px;
  background: #1c1c1e;
  color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 100;

  animation: ${fadeInUp} 0.2s ease-out;
`;
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: #333;
  }

  span {
    font-size: 14px;
  }
`;
