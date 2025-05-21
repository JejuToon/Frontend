import React from "react";
import styled from "styled-components";
import { FaTimes, FaRegCompass } from "react-icons/fa"; // 예시 아이콘
import CustomButton from "./CustomButton";
import { colors } from "../constants/colors";

interface TaleCardProps {
  id: number;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  onClick: () => void;
  onCloseClick?: () => void;
  children?: React.ReactNode;
}

export default function TaleCard({
  id,
  title,
  description,
  thumbnailUrl,
  onClick,
  onCloseClick,
  children,
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
        <Content>
          <TextContainer>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </TextContainer>

          {children && (
            <ChildrenContainer
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {children}
            </ChildrenContainer>
          )}
        </Content>
      </CardBody>
    </Section>
  );
}

const Section = styled.div`
  position: relative;
  border-radius: 8px;
  height: 120px;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
  overflow: hidden;
`;

const CardBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding: 6px;
  cursor: pointer;
  flex-direction: row;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const Thumbnail = styled.img`
  aspect-ratio: 1/1;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const Content = styled.div`
  flex: 1;
  justify-content: space-between;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  min-height: 100px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.text || "#222"};
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textSecondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChildrenContainer = styled.div`
  position: absolute;
  right: 4px;
  bottom: 6px;
  gap: 8px;
  display: flex;

  flex-direction: row;
  justify-content: flex-end;
  padding-right: 4px;
`;
