import React from "react";
import styled from "styled-components";
import { FaTimes, FaRegCompass } from "react-icons/fa"; // 예시 아이콘

interface TaleCardProps {
  id: number;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  onClick: () => void;
  onCloseClick?: () => void;
}

export default function TaleCard({
  id,
  title,
  description,
  thumbnailUrl,
  onClick,
  onCloseClick,
}: TaleCardProps) {
  return (
    <Section>
      {onCloseClick && (
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            onCloseClick();
          }}
        >
          <FaTimes />
        </CloseButton>
      )}

      <CardBody onClick={onClick}>
        <Thumbnail src={thumbnailUrl} alt={`Tale ${id}`} />
        <TextContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <IconField>
            <FaRegCompass />
            <span>위치 기반 설화</span>
          </IconField>
        </TextContainer>
      </CardBody>
    </Section>
  );
}

const Section = styled.div`
  position: relative;
  border-radius: 8px;
  background: #e2e8f0;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
  overflow: hidden;
`;

const CardBody = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 6px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const Thumbnail = styled.img`
  width: 25%;
  aspect-ratio: 1/1;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const TextContainer = styled.div`
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #222;
`;

const Description = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
`;

const IconField = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #777;
  gap: 6px;

  svg {
    font-size: 14px;
  }
`;
