import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdFlipCameraIos, MdBlock } from "react-icons/md";
import { CgGhostCharacter } from "react-icons/cg";
import {
  FaUserAstronaut,
  FaRobot,
  FaUserNinja,
  FaUserSecret,
  FaUserTie,
} from "react-icons/fa";
import {
  GiFairyWand,
  GiPirateCaptain,
  GiAlienStare,
  GiSamuraiHelmet,
} from "react-icons/gi";

const characters = [
  MdBlock,
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
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const characterMenuRef = useRef<HTMLDivElement | null>(null);
  const characterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const gestureRef = useRef<{ initialDistance: number; initialAngle: number } | null>(null);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async (mode: "environment" | "user") => {
    try {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
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
    setSelectedIndex(index);
    setCharacterPos({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
  };

  const handleScroll = () => {
    const container = characterMenuRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    let closest = 0;
    let minDist = Infinity;

    characterRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(elCenterY - centerY);
      if (dist < minDist) {
        minDist = dist;
        closest = idx;
      }
    });

    setSelectedIndex(closest);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !videoWrapperRef.current) return;
    const bounds = videoWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const clampedX = Math.max(0, Math.min(x, bounds.width));
    const clampedY = Math.max(0, Math.min(y, bounds.height));
    setCharacterPos({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = () => setDragging(false);

  const getDistance = (touches: TouchList) => {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  };

  const getAngle = (touches: TouchList) => {
    const [a, b] = [touches[0], touches[1]];
    return Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX) * (180 / Math.PI);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
  if (e.touches.length === 2) {
    const touches = e.touches as unknown as TouchList;
    gestureRef.current = {
      initialDistance: getDistance(touches),
      initialAngle: getAngle(touches),
    };
  }
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (e.touches.length === 2 && gestureRef.current) {
    e.preventDefault();
    const touches = e.touches as unknown as TouchList;
    const newDistance = getDistance(touches);
    const newAngle = getAngle(touches);

    const newScale = newDistance / gestureRef.current.initialDistance;
    const rotationDelta = newAngle - gestureRef.current.initialAngle;

    setScale(Math.max(0.5, Math.min(newScale, 3)));
    setRotation(rotationDelta);
  }
};


  const handleTouchEnd = () => {
    gestureRef.current = null;
  };

  const SelectedCharacter = selectedIndex > 0 ? characters[selectedIndex] : null;

  return (
    <Container>
      <VideoWrapper ref={videoWrapperRef}>
        <Video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          flipped={facingMode === "user"}
        />

        {SelectedCharacter && (
          <OverlayCharacter
            style={{
              left: characterPos.x || "50%",
              top: characterPos.y || "50%",
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SelectedCharacter size={120} />
          </OverlayCharacter>
        )}

        <CharacterMenuContainer>
          <SelectionIndicator />
          <CharacterMenu ref={characterMenuRef} onScroll={handleScroll}>
            <Spacer />
            {characters.map((Icon, index) => (
              <CharacterItem
                key={index}
                ref={(el) => {
                  characterRefs.current[index] = el;
                }}
                onClick={() => handleCharacterClick(index)}
                selected={selectedIndex === index}
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

// Styled Components

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

const OverlayCharacter = styled.div`
  position: absolute;
  z-index: 9;
  pointer-events: auto;
  opacity: 0.9;
  touch-action: none;
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
  gap: 36px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  align-items: center;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CharacterItem = styled.div<{ selected?: boolean }>`
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  transform: ${({ selected }) => (selected ? "scale(1.2)" : "scale(1)")};
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};
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
