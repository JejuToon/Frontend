import React from "react";
import styled from "styled-components";
import { FaLocationDot } from "react-icons/fa6";

interface LocationBoxProps {
  onClick?: () => void;
  label?: string;
}

export default function LocationBox({
  onClick,
  label = "현재 위치",
}: LocationBoxProps) {
  return (
    <Button onClick={onClick}>
      <FaLocationDot />
      <Label>{label}</Label>
    </Button>
  );
}

// styled-components
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Label = styled.span`
  font-size: 14px;
  white-space: nowrap;
`;
