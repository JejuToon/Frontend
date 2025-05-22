import React from "react";
import styled from "styled-components";

interface CharacterCardProps {
  name: string;
  data?: string;
  avatarUrl: string;
}

export default function CharacterCard({
  name,
  data,
  avatarUrl,
}: CharacterCardProps) {
  return (
    <Card>
      <ImageBox>
        <Avatar src={avatarUrl} alt={name} />
      </ImageBox>
      <Info>
        <Name>{name}</Name>
        {data && <Data>{data}</Data>}
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

const Data = styled.div`
  font-size: 12px;
  color: #888;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
