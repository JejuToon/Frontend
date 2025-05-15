import React from "react";
import styled from "styled-components";

interface TTSChipProps {
  profileUrl?: string;
  icon?: React.ReactNode; // 🔄 아이콘 지원 추가
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function TTSChip({
  profileUrl,
  icon,
  name,
  selected = false,
  onClick,
}: TTSChipProps) {
  const hasIcon = Boolean(icon);
  const hasProfile = Boolean(profileUrl);

  return (
    <ChipContainer $selected={selected} onClick={onClick}>
      {hasIcon && <IconWrapper>{icon}</IconWrapper>}
      {!hasIcon && hasProfile && <Profile src={profileUrl} alt="Profile" />}
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
  padding: 0 8px 0 0; // 오른쪽만 padding
  width: fit-content;
  max-width: 100%;
  min-height: 40px;
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
  margin-left: 0;
  margin-right: 8px;
  flex-shrink: 0;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #e0dcf8;
  flex-shrink: 0;
`;

const Name = styled.span`
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
`;
