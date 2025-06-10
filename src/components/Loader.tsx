import React from "react";
import Lottie from "lottie-react";
import styled, { css, keyframes } from "styled-components";
import loadingAnimation from "../assets/loading.json";

interface LoaderProps {
  type?: "full" | "inline";
  description?: string;
}

export default function Loader({ type = "full", description }: LoaderProps) {
  return (
    <Wrapper $type={type}>
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        style={{
          width: type === "inline" ? 60 : 120,
          height: type === "inline" ? 60 : 120,
        }}
      />
      {description && <Description>{description}</Description>}
    </Wrapper>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Wrapper = styled.div<{ $type: "full" | "inline" }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.$type === "full"
      ? css`
          position: fixed;
          inset: 0;
          background: ${props.theme.background};
          z-index: 9999;
          animation: ${fadeIn} 0.4s ease forwards;
        `
      : css`
          position: relative;
          background: transparent;
          transition: opacity 0.3s ease;
        `}
`;

const Description = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  white-space: pre-line;
`;
