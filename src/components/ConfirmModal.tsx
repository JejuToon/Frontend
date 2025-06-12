// components/ConfirmModal.tsx
import React from "react";
import styled from "styled-components";

interface ConfirmModalProps {
  mainTitle: string;
  subTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  mainTitle,
  subTitle,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Overlay>
      <ModalContainer>
        <Title>{mainTitle}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}

        <ButtonGroup>
          <CancelButton onClick={onClose}>닫기</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 24px;
  border-radius: 12px;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text || "#333"};
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSecondary || "#777"};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) =>
    theme.mode === "dark" ? "#3e3e3e" : "#ffffff"};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
