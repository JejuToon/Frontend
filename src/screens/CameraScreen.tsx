import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdFlipCameraIos } from "react-icons/md";

export default function CameraScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const startCamera = async (mode: "environment" | "user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: mode } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("카메라 접근 실패: " + (err as Error).message);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleCapture = () => {
    // 추후 캡처 기능 구현 예정
    console.log("캡처 버튼 클릭됨");
  };

  return (
    <Container>
      <VideoWrapper>
        <Video ref={videoRef} autoPlay playsInline muted />
        <CaptureButton onClick={handleCapture} />
        <SwitchButton onClick={toggleCamera}>
          <MdFlipCameraIos size={24} />
        </SwitchButton>
      </VideoWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: black;
  padding-bottom: 60px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Video = styled.video`
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  border-radius: 24px;
  object-fit: cover;
`;

const CaptureButton = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background-color: #e0e0e0;
  border: 4px solid white;
  border-radius: 50%;
  z-index: 10;
  cursor: pointer;
`;

const SwitchButton = styled.div`
  position: absolute;
  bottom: 38px;
  right: 40px;
  width: 46px;
  height: 46px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  cursor: pointer;

  svg {
    font-size: 22px;
    color: black;
  }
`;
