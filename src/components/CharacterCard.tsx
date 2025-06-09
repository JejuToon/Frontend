import { ViewTransitionBuilder } from "framer-motion";
import React from "react";
import styled from "styled-components";

interface CharacterCardProps {
  name: string;
  avatarUrl: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  onClickIcon?: () => void;
}

export default function CharacterCard({
  name,
  avatarUrl,
  onClick,
  icon,
  onClickIcon,
}: CharacterCardProps) {
  return (
    <Card onClick={onClick}>
      <ImageBox>
        <Avatar src={avatarUrl} alt={name} />
        {icon && (
          <IconWrapper
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭과 분리
              onClickIcon?.();
            }}
          >
            {icon}
          </IconWrapper>
        )}
      </ImageBox>
      <Info>
        <Name>{name}</Name>
      </Info>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`;

const ImageBox = styled.div`
  flex: 1 1 auto;
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Avatar = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;

  svg {
    font-size: 16px;
    color: #333;
  }
`;

const Info = styled.div`
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
