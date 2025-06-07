import React from "react";
import styled from "styled-components";

export default function LoginRequiredModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Overlay>
      <ModalBox>
        <Title>로그인이 필요한 기능입니다</Title>
        <Description>이 기능을 사용하려면 로그인해주세요.</Description>
        <ButtonRow>
          <CancelButton onClick={onClose}>닫기</CancelButton>
          <ConfirmButton onClick={onConfirm}>로그인하기</ConfirmButton>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  margin: 15% auto;
  max-width: 350px;
  border-radius: 12px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #555;
  margin-bottom: 1.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-weight: bold;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  background-color: #e4793f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
`;
