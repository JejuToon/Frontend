import React from "react";
import styled, { css } from "styled-components";

export interface ItemCardProps {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ItemCard({
  title,
  description,
  imageUrl,
  isSelected = false,
  onClick,
}: ItemCardProps) {
  return (
    <Card $selected={isSelected} onClick={onClick}>
      {imageUrl && <Image src={imageUrl} alt={title} />}
      <Body>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </Body>
    </Card>
  );
}

// styled-components
const Card = styled.div<{ $selected: boolean }>`
  width: 100%;
  max-width: 160px;
  background: #f5f4fa;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: transform 0.2s ease, border-color 0.2s ease;
  position: relative;

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: #027ec2;
    `}

  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const Body = styled.div`
  padding: 8px;
  text-align: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #555;
`;
