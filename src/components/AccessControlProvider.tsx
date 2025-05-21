// src/components/AccessControlProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import styled from "styled-components";

interface AccessControlContextValue {
  openModal: () => void;
  closeModal: () => void;
}

const AccessControlContext = createContext<AccessControlContextValue | null>(
  null
);

export const AccessControlProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AccessControlContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <Overlay onClick={closeModal}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            <h2>접근 제한</h2>
            <p>이 기능은 현재 사용할 수 없습니다.</p>
            <Button onClick={closeModal}>닫기</Button>
          </ModalWrapper>
        </Overlay>
      )}
    </AccessControlContext.Provider>
  );
};

export function useAccessControl() {
  const ctx = useContext(AccessControlContext);
  if (!ctx) {
    throw new Error(
      "useAccessControl must be used within AccessControlProvider"
    );
  }
  return ctx;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalWrapper = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  color: ${({ theme }) => theme.text};
  padding: 24px;
  border-radius: 8px;
  max-width: 90%;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.primary || "#4b5563"};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
