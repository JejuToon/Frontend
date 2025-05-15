import React from "react";
import Tab from "./Tab";
import styled from "styled-components";

export interface TabItem {
  /** 탭에 표시할 이름 */
  label: string;
  /** 내부 식별자 */
  value: string;
}

interface TabsProps {
  /** 탭 항목 리스트 */
  items: TabItem[];
  /** 현재 선택된 탭의 value */
  current: string;
  /** 탭이 변경될 때 호출됨 */
  onChange: (value: string) => void;
}

export default function Tabs({ items, current, onChange }: TabsProps) {
  return (
    <Nav>
      {items.map((item) => (
        <Tab
          key={item.value}
          isActive={item.value === current}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Tab>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin: 0 16px;
`;
