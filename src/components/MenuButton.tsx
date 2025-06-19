import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import { FaEllipsisV } from "react-icons/fa"; // 예시 아이콘

import FloatingMenu from "./FloatingMenu";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container ref={buttonRef}>
      <TriggerButton onClick={toggleMenu}>
        <FaEllipsisV />
      </TriggerButton>
      {open && <FloatingMenu />}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;
