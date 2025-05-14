import React from "react";
import styled from "styled-components";

interface ImageCardProps {
  image?: string; // 이미지 URL
  icon?: React.ReactNode; // React 아이콘 등
  label: string;
  onClick?: () => void;
}

export default function ImageCard({
  image,
  icon,
  label,
  onClick,
}: ImageCardProps) {
  return (
    <Card onClick={onClick}>
      {image && <Image src={image} alt={label} />}
      {icon && !image && <IconWrapper>{icon}</IconWrapper>}
      <Label>{label}</Label>
    </Card>
  );
}

// styled-components
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f5f4fa;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Image = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const Label = styled.div`
  font-size: 16px;
  color: #333;
  text-align: center;
`;
