import React from "react";
import Lottie from "lottie-react";
import nowLocationAnimation from "../assets/nowLocation.json";

export default function NowLocation() {
  return (
    <div style={{ width: 30, height: 30 }}>
      <Lottie
        animationData={nowLocationAnimation}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
