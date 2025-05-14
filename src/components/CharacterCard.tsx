import React from "react";
import styled from "styled-components";

interface CharacterCardProps {
  name: string;
  data: string;
  avatarUrl: string;
}

export default function CharacterCard({
  name,
  data,
  avatarUrl,
}: CharacterCardProps) {
  return (
    <Card>
      <Avatar src={avatarUrl} alt={name} />
      <Info>
        <Name>{name}</Name>
        <Data>{data}</Data>
      </Info>
    </Card>
  );
}

// styled-components
const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;

const Avatar = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 8px;
  background: #fff;
  border-top: 1px solid #eee;
`;

const Name = styled.p`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Data = styled.p`
  color: #666;
  font-size: 14px;
`;
