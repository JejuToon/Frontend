import React from "react";
import styled, { keyframes } from "styled-components";
import { FaArrowLeft } from "react-icons/fa";

interface OriginTaleProps {
  text: string;
  onClose: () => void;
}

export default function OriginTale({ text, onClose }: OriginTaleProps) {
  return (
    <Overlay>
      <Card>
        <CloseButton onClick={onClose}>
          <FaArrowLeft size={18} />
        </CloseButton>
        <Content>{text}</Content>
      </Card>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.25s ease-out;
`;

const Card = styled.div`
  position: fixed;
  inset: 0;
  padding: 64px 24px 24px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  overflow-y: auto;
  animation: ${fadeIn} 0.25s ease-out;

  @media (max-width: 480px) {
    padding: 48px 16px 16px;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  left: 16px;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Content = styled.pre`
  white-space: pre-wrap;
  word-break: keep-all;
  font-family: inherit;
  line-height: 1.8;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;
