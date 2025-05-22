import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdFlipCameraIos } from "react-icons/md";
import { CgGhostCharacter } from "react-icons/cg";
import { FaUserAstronaut, FaRobot, FaUserNinja, FaUserSecret, FaUserTie } from "react-icons/fa";
import { GiFairyWand, GiPirateCaptain, GiAlienStare, GiSamuraiHelmet } from "react-icons/gi";

const characters = [
  CgGhostCharacter,
  FaUserAstronaut,
  FaRobot,
  FaUserNinja,
  FaUserSecret,
  FaUserTie,
  GiFairyWand,
  GiPirateCaptain,
  GiAlienStare,
  GiSamuraiHelmet,
];

export default function CameraScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const characterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const startCamera = async (mode: "environment" | "user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
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
    console.log("캡처 버튼 클릭됨");
  };

  const handleCharacterClick = (index: number) => {
    const node = characterRefs.current[index];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Container>
      <VideoWrapper>
        <Video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          flipped={facingMode === "user"}
        />

        <CharacterMenuContainer>
          <SelectionIndicator />
          <CharacterMenu>
            <Spacer />
            {characters.map((Icon, index) => (
              <CharacterItem
                key={index}
                ref={(el) => { characterRefs.current[index] = el; }}
                onClick={() => handleCharacterClick(index)}
              >
                <Icon size={72} />
              </CharacterItem>
            ))}
            <Spacer />
          </CharacterMenu>
        </CharacterMenuContainer>

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

const Video = styled.video<{ flipped: boolean }>`
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  border-radius: 24px;
  object-fit: cover;
  transform: ${({ flipped }) => (flipped ? "scaleX(-1)" : "none")};
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

const CharacterMenuContainer = styled.div`
  position: absolute;
  top: 80px;
  bottom: 80px;
  left: 24px;
  width: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
`;

const CharacterMenu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  align-items: center;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CharacterItem = styled.div`
  width: 80px;
  height: 80px;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  cursor: pointer;
`;

const Spacer = styled.div`
  height: calc((100% - 80px) / 2);
  flex: 0 0 auto;
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 88px;
  height: 88px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 20;
`;
