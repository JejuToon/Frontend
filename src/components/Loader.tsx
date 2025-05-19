import React from "react";
import Lottie from "lottie-react";
import styled, { css } from "styled-components";
import loadingAnimation from "../assets/loading.json";

interface LoaderProps {
  type?: "full" | "inline";
}

export default function Loader({ type = "full" }: LoaderProps) {
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
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $type: "full" | "inline" }>`
  ${(props) =>
    props.$type === "full"
      ? css`
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.7);
          z-index: 9999;
        `
      : css`
          position: relative;
          background: transparent;
        `}
  display: flex;
  justify-content: center;
  align-items: center;
`;
