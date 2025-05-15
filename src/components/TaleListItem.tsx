import React from "react";
import styled from "styled-components";

interface TaleCardProps {
  id: number;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  onClick: () => void;
  onClose?: () => void;
}

export default function TaleCard({
  id,
  title,
  description,
  thumbnailUrl,
  onClick,
  onClose,
}: TaleCardProps) {
  return (
    <Section onClick={onClick}>
      <Thumbnail src={thumbnailUrl} alt={`Tale ${id}`} />
      <TextContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextContainer>
    </Section>
  );
}

// styled-components
const Section = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 6px;
  cursor: pointer;
  list-style: none;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
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
