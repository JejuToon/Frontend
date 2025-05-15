import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface EmptyStateProps {
  icon?: React.ReactNode;
  imageUrl?: string;
  title: string;
  description: string;
  linkUrl?: string;
  navigateOnDescriptionClick?: boolean;
}

export default function EmptyState({
  icon,
  imageUrl,
  title,
  description,
  linkUrl,
  navigateOnDescriptionClick = false,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleIconClick = () => {
    if (linkUrl) navigate(linkUrl);
  };

  const handleDescriptionClick = () => {
    if (navigateOnDescriptionClick && linkUrl) {
      navigate(linkUrl);
    }
  };

  return (
    <Container>
      {imageUrl && <Image src={imageUrl} alt="empty" />}
      {icon && <IconWrapper onClick={handleIconClick}>{icon}</IconWrapper>}
      <Title>{title}</Title>
      <Description
        onClick={handleDescriptionClick}
        $isLink={navigateOnDescriptionClick && !!linkUrl}
      >
        {description}
      </Description>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  flex: 1;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  max-width: 90%;
  margin: 0 auto;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  font-size: 60px;
  color: #d3d3d3;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  white-space: nowrap;
`;

const Description = styled.div<{ $isLink: boolean }>`
  font-size: 14px;
  color: #999;
  text-decoration: ${({ $isLink }) => ($isLink ? "underline" : "none")};
  cursor: ${({ $isLink }) => ($isLink ? "pointer" : "default")};
  white-space: nowrap;

  &:hover {
    color: ${({ $isLink }) => ($isLink ? "#0056b3" : "#999")};
  }
`;
