import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoLocationSharp } from "react-icons/io5";

import { useUserInfoStore } from "../stores/useUserInfoStore";
import { useCurrentLocationStore } from "../stores/useCurrentLocationStore";
import { reverseGeocode } from "../utils/reverseGeocode";

interface LocationBoxProps {
  onClick?: () => void;
}

export default function LocationBox({ onClick }: LocationBoxProps) {
  const { currentLocation, fetchCurrentLocation } = useCurrentLocationStore();
  const { addressLabel, addressLabelCoords, setAddressLabel } =
    useUserInfoStore();
  const [resolvedLabel, setResolvedLabel] =
    useState("위치 정보를 불러오는 중...");

  useEffect(() => {
    fetchCurrentLocation(null);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentLocation) {
        setResolvedLabel("위치 정보 없음");
        return;
      }

      const isSameLocation =
        addressLabel &&
        addressLabelCoords &&
        Math.abs(currentLocation.lat - addressLabelCoords.lat) < 0.0001 &&
        Math.abs(currentLocation.lng - addressLabelCoords.lng) < 0.0001;

      if (isSameLocation) {
        setResolvedLabel(addressLabel);
        return;
      }

      const result = await reverseGeocode(
        currentLocation.lat,
        currentLocation.lng
      );
      if (result) {
        setResolvedLabel(result);
        setAddressLabel(result, currentLocation);
      } else {
        setResolvedLabel("위치 정보 없음");
      }
    };

    fetchAddress();
  }, [currentLocation]);

  const handleClick = () => {
    fetchCurrentLocation(null); // 클릭 시 위치 갱신
    onClick?.();
  };

  return (
    <Button onClick={handleClick}>
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
  border: 1px solid ${({ theme }) => theme.buttonBackground};
  border-radius: 20px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const Label = styled.span`
  font-size: 14px;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};
`;
