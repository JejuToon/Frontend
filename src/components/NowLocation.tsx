import React from "react";
import Lottie from "lottie-react";
import styled from "styled-components";
import nowLocationAnimation from "../assets/nowLocation.json";

export default function NowLocation() {
  return (
    <Lottie
      animationData={nowLocationAnimation}
      loop
      autoplay
      style={{ width: 120, height: 120 }}
    />
  );
}
