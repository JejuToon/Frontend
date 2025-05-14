import React from "react";
import Lottie from "lottie-react";
import styled from "styled-components";
import loadingAnimation from "../assets/loading.json";

export default function Loader() {
  return (
    <Overlay>
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        style={{ width: 120, height: 120 }}
      />
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
