import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoLocationSharp } from "react-icons/io5";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { reverseGeocode } from "../utils/reverseGeocode";

interface LocationBoxProps {
  onClick?: () => void;
  label?: string; // 외부에서 직접 label을 주면 우선 사용
}

export default function LocationBox({ onClick, label }: LocationBoxProps) {
  const { currentLocation } = useCurrentLocationStore();
  const [resolvedLabel, setResolvedLabel] = useState("위치 정보 없음");

  useEffect(() => {
    const fetchAddress = async () => {
      if (label) {
        setResolvedLabel(label); // 외부에서 전달된 label이 있으면 그걸 사용
        return;
      }

      if (!currentLocation) {
        setResolvedLabel("위치 정보 없음");
        return;
      }

      const result = await reverseGeocode(
        currentLocation.lat,
        currentLocation.lng
      );
      if (result) {
        setResolvedLabel(result);
      } else {
        setResolvedLabel("위치 정보 없음");
      }
    };

    fetchAddress();
  }, [currentLocation, label]);

  return (
    <Button onClick={onClick}>
      <IoLocationSharp />

      <Label>{resolvedLabel}</Label>
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => "#ff8a3d"};
  border-radius: 20px;
  background: ${({ theme }) => "#ff8a3d"};
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

const Label = styled.span`
  font-size: 14px;
  white-space: nowrap;
  color: ${({ theme }) => "theme.text"};
`;
