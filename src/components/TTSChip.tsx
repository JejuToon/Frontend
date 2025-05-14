import React from "react";
import styled from "styled-components";

interface TTSChipProps {
  profileUrl?: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function TTSChip({
  profileUrl,
  name,
  selected = false,
  onClick,
}: TTSChipProps) {
  const hasProfile = Boolean(profileUrl);

  return (
    <ChipContainer
      $selected={selected}
      $hasProfile={hasProfile}
      onClick={onClick}
    >
      {hasProfile && <Profile src={profileUrl} alt="Profile" />}
      <Name>{name}</Name>
    </ChipContainer>
  );
}

const ChipContainer = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  background-color: #f5f4fa;
  color: #333;
  border-radius: 50px;
  margin-bottom:
  padding: 0;
  width: fit-content;
  max-width: 100%;
  min-height: 40px;
  padding-left: ${({ $hasProfile }) => ($hasProfile ? "0" : "8px")};
  box-sizing: border-box;
  border: 2px solid
    ${({ $selected }) => ($selected ? "#7f3dff" : "transparent")};
  cursor: pointer;
  transition: border 0.2s ease;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
`;

const Name = styled.span`
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  margin-right: 8px;
`;
