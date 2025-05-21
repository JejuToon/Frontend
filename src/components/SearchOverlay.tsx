import React, { useRef, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa6";

interface SearchOverlayProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onClose: () => void;
}

// 데모용 접근 제어
import { useAccessControl } from "../components/AccessControlProvider";

export default function SearchOverlay({
  keyword,
  onKeywordChange,
  onClose,
}: SearchOverlayProps) {
  // 데모용 접근 제어
  const { openModal } = useAccessControl();

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  // 마운트 직후 애니메이션 시작
  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  // 자동 포커스
  useEffect(() => {
    if (open) inputRef.current?.focus();
    openModal();
  }, [open]);

  // 닫기 핸들러 (포커스 해제 포함)
  const handleClose = useCallback(() => {
    // Overlay 입력창 blur
    inputRef.current?.blur();
    // 포커스된 모든 요소에서 blur
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  }, [onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <Overlay open={open}>
      <SearchHeader>
        <SearchBox>
          <CloseBtn>
            <FaChevronLeft onClick={handleClose} />
          </CloseBtn>
          <SearchInput
            type="text"
            placeholder="설화 검색"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
          />
        </SearchBox>
      </SearchHeader>
      <Results>{/* TODO: 검색 결과 렌더링 */}</Results>
    </Overlay>
  );
}

// --- styled-components ---

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.background}dd;
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  /* 애니메이션 */
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: scale(${({ open }) => (open ? 1 : 0.95)});
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

const SearchHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 10;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.inputBackground || "#f3eefc"};
  padding: 12px 16px;
  margin: 20px;
  border-radius: 999px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary || "#555"};
`;

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;
