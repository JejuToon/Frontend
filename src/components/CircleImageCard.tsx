import React from "react";
import styled from "styled-components";

interface CircleImageCardProps {
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CircleImageCard({
  imageUrl,
  isSelected,
  onClick,
}: CircleImageCardProps) {
  return (
    <Card onClick={onClick} selected={isSelected}>
      <Image src={imageUrl} alt="TTS 캐릭터" />
    </Card>
  );
}

const Card = styled.div<{ selected: boolean }>`
  border: 3px solid ${({ selected }) => (selected ? "#7f3dff" : "transparent")};
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: border 0.2s;
  display: inline-block;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;
