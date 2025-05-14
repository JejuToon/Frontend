import React, { ReactNode } from "react";
import "../styles/Tab.css";

interface TabProps {
  /** 활성화 여부 */
  isActive: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 탭 레이블(내용) */
  children: ReactNode;
}

export default function Tab({ isActive, onClick, children }: TabProps) {
  return (
    <button
      type="button"
      className={isActive ? "tab tab--active" : "tab"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
