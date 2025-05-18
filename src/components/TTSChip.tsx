import React from "react";
import styled from "styled-components";

interface TTSChipProps {
  profileUrl?: string;
  icon?: React.ReactNode;
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
      <NameField>
        <Name>{name}</Name>
      </NameField>
    </ChipContainer>
  );
}

const ChipContainer = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  background-color: #f5f4fa;
  color: #333;
  border-radius: 50px;
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
  border-radius: 50%;
  background-color: #e0dcf8;
  flex-shrink: 0;
`;

const NameField = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
`;

const Name = styled.span`
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  padding: 8px;
`;
