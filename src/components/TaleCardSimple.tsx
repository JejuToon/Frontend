import React from "react";
import styled from "styled-components";

interface TaleCardSimpleProps {
  title: string;
  subtitle?: string;
  thumbnailUrl: string;
  onClick?: () => void;
}

export default function TaleCardSimple({
  title,
  thumbnailUrl,
  onClick,
}: TaleCardSimpleProps) {
  return (
    <Card onClick={onClick}>
      <ImageBox>
        <Image src={thumbnailUrl} alt={title} />
      </ImageBox>
      <TextBox>
        <Title>{title}</Title>
      </TextBox>
    </Card>
  );
}

// styled-components 정의
const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-top: 4px;
  box-shadow: 0px 5px 10px rgba(50, 50, 50, 0.1);
  margin-bottom: 3px;

  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextBox = styled.div`
  padding: 4px;
  text-align: center;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
