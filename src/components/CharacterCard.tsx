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
      <ImageContainer>
        <Avatar src={avatarUrl} alt={name} />
      </ImageContainer>

      <Info>
        <Name>{name}</Name>
        <Data>{data}</Data>
      </Info>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px; /* 전체 높이 고정 */
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;

const ImageContainer = styled.div`
  flex: 1 1 auto; // 남은 공간 차지
  position: relative;
  width: 100%;
`;

const Avatar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
