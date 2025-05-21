import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface EmptyStateProps {
  icon?: React.ReactNode;
  imageUrl?: string;
  title: string;
  description: string;
  onIconClick?: () => void;
  onTitleClick?: () => void;
  onDescriptionClick?: () => void;
}

export default function EmptyState({
  icon,
  imageUrl,
  title,
  description,
  onIconClick,
  onTitleClick,
  onDescriptionClick,
}: EmptyStateProps) {
  return (
    <Container>
      {imageUrl && <Image src={imageUrl} alt="empty" />}
      {icon && (
        <IconWrapper onClick={onIconClick} $clickable={!!onIconClick}>
          {icon}
        </IconWrapper>
      )}
      <Title onClick={onTitleClick} $clickable={!!onTitleClick}>
        {title}
      </Title>
      <Description
        onClick={onDescriptionClick}
        $clickable={!!onDescriptionClick}
      >
        {description}
      </Description>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  padding: 16px;
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

const IconWrapper = styled.div<{ $clickable: boolean }>`
  font-size: 60px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
  ${({ $clickable }) => $clickable && "cursor: pointer;"}

  &:hover {
    color: ${({ theme, $clickable }) =>
      $clickable ? theme.iconHover || "#aaa" : theme.iconSecondary};
  }
`;

const Title = styled.div<{ $clickable: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary || "#444"};
  margin-bottom: 8px;
  white-space: nowrap;
  ${({ $clickable }) =>
    $clickable && "cursor: pointer; text-decoration: underline;"}

  &:hover {
    color: ${({ theme, $clickable }) =>
      $clickable ? theme.linkHover || "#0056b3" : theme.textPrimary};
  }
`;

const Description = styled.div<{ $clickable: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary || "#999"};
  ${({ $clickable }) =>
    $clickable && "text-decoration: underline; cursor: pointer;"}
  white-space: nowrap;

  &:hover {
    color: ${({ theme, $clickable }) =>
      $clickable
        ? theme.linkHover || "#0056b3"
        : theme.textSecondary || "#999"};
  }
`;
