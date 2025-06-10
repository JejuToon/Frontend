import React from "react";
import styled from "styled-components";

export interface TabItem<T extends string = string> {
  label: string;
  value: T;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  active: T;
  onChange: (value: T) => void;
}

export default function Tabs<T extends string>({
  items,
  active,
  onChange,
}: TabsProps<T>) {
  const activeIndex = items.findIndex((item) => item.value === active);

  return (
    <TabsContainer>
      {items.map((item) => (
        <TabButton
          key={item.value}
          $active={active === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </TabButton>
      ))}
      <ActiveBar $index={activeIndex} $count={items.length} />
    </TabsContainer>
  );
}

const TabsContainer = styled.div`
  display: flex;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin: 0 16px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.text : theme.textSecondary};
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
`;

const ActiveBar = styled.div<{
  $index: number;
  $count: number;
}>`
  position: absolute;
  bottom: 0;
  height: 2px;
  width: ${({ $count }) => 100 / $count}%;
  background: ${({ theme }) => theme.text};
  transition: transform 0.3s ease;
  transform: translateX(${({ $index }) => $index * 100}%);
  z-index: 0;
`;
