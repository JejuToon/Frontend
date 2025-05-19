// components/ButtonContainer.tsx
import React from "react";
import styled, { css } from "styled-components";
import { colors } from "../constants/colors";

interface CustomButtonProps {
  label: string;
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "standard" | "filled" | "outlined";
  disabled?: boolean;
  onClick?: () => void;
}

export default function CustomButton({
  label,
  icon,
  size = "large",
  variant = "filled",
  disabled,
  onClick,
  ...props
}: CustomButtonProps) {
  return (
    <StyledButton
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <IconWrapper size={size}>{icon}</IconWrapper>}
      {label}
    </StyledButton>
  );
}

const sizeStyles = {
  small: css`
    padding: 4px;
    height: 30px;
    font-weight: 400;
  `,
  medium: css`
    height: 38px;
    padding: 0 12px;
    align-self: center;
  `,
  large: css`
    width: 100%;
    height: 44px;
  `,
};

const variantStyles = {
  filled: css`
    background-color: ${colors.ORANGE_300};
    color: ${colors.WHITE};
    border: none;
  `,
  standard: css`
    background: none;
    color: ${colors.ORANGE_300};
    border: none;
  `,
  outlined: css`
    background-color: ${colors.WHITE};
    color: ${colors.ORANGE_300};
    border: 1px solid ${colors.ORANGE_300};
  `,
};

const StyledButton = styled.button<{
  size: "small" | "medium" | "large";
  variant: "standard" | "filled" | "outlined";
}>`
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;

  ${({ size }) => sizeStyles[size]}
  ${({ variant }) => variantStyles[variant]}

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: ${colors.GRAY_300};
    color: ${colors.WHITE};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const IconWrapper = styled.span<{ size: "small" | "medium" | "large" }>`
  display: flex;
  align-items: center;
  margin-right: 2px;

  svg {
    ${({ size }) => {
      switch (size) {
        case "small":
          return "font-size: 16px;";
        case "medium":
          return "font-size: 18px;";
        case "large":
        default:
          return "font-size: 20px;";
      }
    }}
  }
`;
